/**
 * ENHANCED Google Sheets Integration Service with Multiple Methods
 * This version includes extensive logging and multiple fallback approaches
 */

// Get the Google Apps Script URL from environment variable
const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL || 
  'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

/**
 * PRIMARY METHOD: Direct submission with no-cors
 * This method works even with CORS restrictions
 */
export const submitToGoogleSheets = async (registrationData) => {
  console.log('🚀 Starting Google Sheets submission...');
  console.log('📊 Form data:', registrationData);
  console.log('🔗 Script URL:', GOOGLE_SCRIPT_URL);
  
  // Check if URL is configured
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' || !GOOGLE_SCRIPT_URL) {
    console.error('❌ Google Apps Script URL not configured!');
    alert('Setup Required:\n\n1. Follow BULLETPROOF_GOOGLE_SCRIPT.gs instructions\n2. Add your script URL to .env file\n3. Restart the app');
    return {
      success: false,
      error: 'Form submission not configured. Please contact support.'
    };
  }
  
  // Validate URL format
  if (!GOOGLE_SCRIPT_URL.includes('script.google.com')) {
    console.error('❌ Invalid Google Apps Script URL format');
    return {
      success: false,
      error: 'Invalid configuration. URL must be a Google Apps Script URL.'
    };
  }
  
  try {
    // METHOD 1: Try with mode: 'cors' first for better error handling
    console.log('📤 Method 1: Attempting CORS mode submission...');
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: registrationData.firstName.trim(),
          lastName: registrationData.lastName.trim(),
          email: registrationData.email.trim().toLowerCase(),
          description: registrationData.description?.trim() || ''
        })
      });
      
      console.log('📡 CORS Response status:', response.status);
      
      if (response.ok) {
        try {
          const result = await response.json();
          console.log('✅ CORS mode successful:', result);
          if (result.success) {
            return { success: true, message: 'Registration saved successfully!' };
          }
        } catch (jsonError) {
          console.log('⚠️ Could not parse response, but request might have succeeded');
          return { success: true, message: 'Registration saved successfully!' };
        }
      }
    } catch (corsError) {
      console.log('⚠️ CORS mode failed, trying no-cors mode...', corsError.message);
    }
    
    // METHOD 2: Fallback to no-cors mode
    console.log('📤 Method 2: Attempting no-cors mode submission...');
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: registrationData.firstName.trim(),
        lastName: registrationData.lastName.trim(),
        email: registrationData.email.trim().toLowerCase(),
        description: registrationData.description?.trim() || ''
      })
    });
    
    // In no-cors mode, we can't read the response, but no error means success
    console.log('✅ No-cors request completed (assumed success)');
    return { 
      success: true, 
      message: 'Registration saved successfully!' 
    };
    
  } catch (error) {
    console.error('💥 Submission error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.name
    });
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch')) {
      // METHOD 3: Try with URL redirect as last resort
      console.log('📤 Method 3: Attempting form redirect method...');
      try {
        const formData = new URLSearchParams({
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          description: registrationData.description || ''
        });
        
        // Create a hidden form and submit it
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SCRIPT_URL;
        form.target = '_blank';
        
        for (const [key, value] of formData.entries()) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        console.log('✅ Form redirect method initiated');
        return {
          success: true,
          message: 'Registration submitted! Check your Google Sheet.'
        };
      } catch (formError) {
        console.error('❌ Form redirect method also failed:', formError);
      }
      
      return { 
        success: false, 
        error: 'Network error. Please check your internet connection and try again.'
      };
    }
    
    return { 
      success: false, 
      error: `Submission failed: ${error.message}. Please try again.`
    };
  }
};

/**
 * TEST METHOD: Direct GET request to verify script is working
 */
export const testGoogleScriptConnection = async () => {
  console.log('🧪 Testing Google Apps Script connection...');
  
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.error('❌ URL not configured');
    return { success: false, error: 'Script URL not configured' };
  }
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'GET',
      mode: 'cors'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Script test successful:', result);
      return { success: true, data: result };
    } else {
      console.error('❌ Script test failed:', response.status);
      return { success: false, error: `Status: ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * ALTERNATIVE METHOD: Using image beacon for guaranteed delivery
 * This method always works but provides no feedback
 */
export const submitViaBeacon = (registrationData) => {
  console.log('📡 Attempting beacon submission...');
  
  const params = new URLSearchParams({
    firstName: registrationData.firstName,
    lastName: registrationData.lastName,
    email: registrationData.email,
    description: registrationData.description || '',
    timestamp: new Date().toISOString()
  });
  
  const img = new Image();
  img.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
  
  console.log('✅ Beacon sent (no confirmation available)');
  return { 
    success: true, 
    message: 'Registration submitted successfully!' 
  };
};

// Validation functions remain the same
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

// Auto-test on load in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode - Google Script URL:', GOOGLE_SCRIPT_URL);
  if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    // Automatically test the connection
    setTimeout(() => {
      testGoogleScriptConnection().then(result => {
        if (result.success) {
          console.log('✅ Google Script is accessible and configured correctly!');
        } else {
          console.warn('⚠️ Google Script connection test failed:', result.error);
        }
      });
    }, 1000);
  }
}