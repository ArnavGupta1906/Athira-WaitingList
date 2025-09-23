/**
 * Clean and Simple Google Sheets Service
 * Final consolidated version for reliable waitlist integration
 */

import { GOOGLE_APPS_SCRIPT_URL } from '../config/googleAppsScript'

export const submitToGoogleSheets = async (registrationData) => {
  console.log('🚀 Starting Google Sheets submission...')
  console.log('📊 Data:', registrationData)
  
  try {
    // Prepare the data payload
    const payload = {
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      email: registrationData.email.trim(),
      description: registrationData.description ? registrationData.description.trim() : '',
      timestamp: new Date().toISOString()
    }

    console.log('📤 Sending to:', GOOGLE_APPS_SCRIPT_URL)
    console.log('📤 Payload:', payload)

    // Make the request with JSON payload
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.text()
    console.log('📄 Raw response:', result)
    
    const parsedResult = JSON.parse(result)
    console.log('📄 Parsed response:', parsedResult)
    
    if (parsedResult.success) {
      console.log('✅ SUCCESS! Data saved to Google Sheets')
      return { success: true, message: parsedResult.message }
    } else {
      console.error('❌ Google Apps Script error:', parsedResult.error)
      throw new Error(parsedResult.error || 'Unknown server error')
    }

  } catch (error) {
    console.error('💥 Submission Error:', error)
    return { 
      success: false, 
      error: `Failed to save registration: ${error.message}`
    }
  }
}

// Keep the validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateForm = (formData) => {
  const errors = {}

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required'
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!validateEmail(formData.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  return errors
}