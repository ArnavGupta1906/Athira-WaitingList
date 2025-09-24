/**
 * Google Sheets Integration - Reliable & Unlimited
 * 
 * This service uses Google Apps Script to directly write to Google Sheets.
 * Much more reliable than Formspree and can handle unlimited entries.
 */

// Google Apps Script web app URL - you need to deploy the script and get the URL
const GOOGLE_APPS_SCRIPT_URL = process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export const submitToGoogleSheets = async (registrationData) => {
  console.log('🚀 Submitting to Google Sheets via Apps Script...');
  console.log('📊 Data:', registrationData);
  
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        description: registrationData.description,
        timestamp: new Date().toISOString()
      })
    });

    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Data submitted to Google Sheets');
      return { success: true, message: 'Registration saved successfully!' };
    } else {
      const error = await response.text();
      console.error('❌ Google Apps Script error:', error);
      throw new Error(`Submission failed: ${response.status}`);
    }

  } catch (error) {
    console.error('💥 Google Sheets submission error:', error);
    return { 
      success: false, 
      error: `Failed to save registration: ${error.message}`
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
