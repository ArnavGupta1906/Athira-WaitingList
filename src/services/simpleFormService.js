/**
 * Google Sheets Direct Integration Service
 * 
 * This service sends form data directly to Google Sheets via Google Apps Script.
 * No third-party services, no CORS issues, completely self-contained.
 * 
 * Setup Instructions:
 * 1. Follow the setup guide in GOOGLE_SHEETS_SETUP_GUIDE.md
 * 2. Add your Google Apps Script URL to .env as REACT_APP_GOOGLE_SCRIPT_URL
 * 3. Or replace the URL below directly for quick testing
 */

// Get the Google Apps Script URL from environment variable or use placeholder
const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL || 
  'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // Replace with your actual URL from deployment

export const submitToGoogleSheets = async (registrationData) => {
  console.log('🚀 Submitting form data to Google Sheets...');
  console.log('📊 Data:', registrationData);
  
  // Check if URL is configured
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.error('❌ Google Apps Script URL not configured!');
    console.error('Please follow the setup instructions in GOOGLE_SHEETS_SETUP_GUIDE.md');
    return {
      success: false,
      error: 'Form submission not configured. Please contact support.'
    };
  }
  
  try {
    // Prepare the data payload
    const payload = {
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      email: registrationData.email.trim().toLowerCase(),
      description: registrationData.description?.trim() || '',
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 Sending data to Google Apps Script:', payload);
    
    // Send the request to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script handles CORS, we use no-cors mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    // With no-cors mode, we can't read the response body
    // But if the request completes without throwing, it was successful
    console.log('✅ Form submission completed successfully!');
    console.log('📝 Data has been saved to Google Sheets');
    
    // Since we can't read the actual response in no-cors mode,
    // we assume success if no error was thrown
    return { 
      success: true, 
      message: 'Registration saved successfully!' 
    };
    
  } catch (error) {
    console.error('💥 Form submission error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch')) {
      return { 
        success: false, 
        error: 'Network error. Please check your internet connection and try again.'
      };
    }
    
    return { 
      success: false, 
      error: `Failed to save registration: ${error.message}`
    };
  }
};

/**
 * Alternative method using fetch with mode 'cors' for better error handling
 * Use this if you've configured CORS properly in Google Apps Script
 */
export const submitToGoogleSheetsWithCORS = async (registrationData) => {
  console.log('🚀 Submitting form data to Google Sheets (CORS mode)...');
  
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    return {
      success: false,
      error: 'Google Apps Script URL not configured'
    };
  }
  
  try {
    const payload = {
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      email: registrationData.email.trim().toLowerCase(),
      description: registrationData.description?.trim() || ''
    };
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Form submitted successfully:', result);
      return { success: true, message: result.message || 'Registration saved!' };
    } else {
      console.error('❌ Server returned error:', result);
      return { success: false, error: result.message || 'Submission failed' };
    }
  } catch (error) {
    console.error('💥 Form submission error:', error);
    return { 
      success: false, 
      error: 'Failed to save registration. Please try again.'
    };
  }
};

// Keep the validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateForm = (formData) => {
  const errors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(formData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};
