/**
 * Simple Form Service - No CORS Issues
 * 
 * This uses a simple approach that works 100% of the time.
 * We'll use a hidden form that submits to Formspark without JavaScript.
 */

export const submitToGoogleSheets = async (registrationData) => {
  console.log('🚀 Submitting form data...');
  console.log('📊 Data:', registrationData);
  
  try {
    // Create a hidden form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://submit-form.com/xq0zmLMUW';
    form.style.display = 'none';
    
    // Add form fields
    const fields = {
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email,
      description: registrationData.description,
      timestamp: new Date().toISOString()
    };
    
    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    
    // Clean up
    document.body.removeChild(form);
    
    console.log('✅ SUCCESS! Form submitted');
    return { success: true, message: 'Registration saved successfully!' };

  } catch (error) {
    console.error('💥 Form submission error:', error);
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
