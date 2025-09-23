/**
 * Formspree Integration - Super Simple & Reliable
 * 
 * This is much easier than Google Apps Script and works instantly.
 * Formspree can automatically forward submissions to Google Sheets.
 */

// Your Formspree form URL
const FORMSPREE_URL = process.env.REACT_APP_FORMSPREE_URL || 'https://formspree.io/f/myzngqlz';

export const submitToFormspree = async (registrationData) => {
  console.log('🚀 Submitting to Formspree...');
  console.log('📊 Data:', registrationData);
  
  try {
    const response = await fetch(FORMSPREE_URL, {
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
      console.log('✅ SUCCESS! Data submitted via Formspree');
      return { success: true, message: 'Registration saved successfully!' };
    } else {
      const error = await response.text();
      console.error('❌ Formspree error:', error);
      throw new Error(`Submission failed: ${response.status}`);
    }

  } catch (error) {
    console.error('💥 Formspree submission error:', error);
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
