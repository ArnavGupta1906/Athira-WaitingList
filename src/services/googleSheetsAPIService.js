/**
 * Google Sheets API v4 Integration - Direct API approach
 * 
 * This uses the Google Sheets API directly instead of Apps Script.
 * More reliable but requires API key setup.
 */

// Configuration
const SPREADSHEET_ID = '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw';
const SHEET_NAME = 'Sheet1';
const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

// Google Sheets API endpoint
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export const submitToGoogleSheetsAPI = async (registrationData) => {
  console.log('🚀 Submitting via Google Sheets API...');
  console.log('📊 Data:', registrationData);
  
  if (!API_KEY) {
    console.error('❌ Google Sheets API key not configured');
    return { 
      success: false, 
      error: 'Google Sheets API not configured. Please set REACT_APP_GOOGLE_SHEETS_API_KEY' 
    };
  }
  
  try {
    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [
      registrationData.firstName,
      registrationData.lastName,
      registrationData.email,
      registrationData.description || '',
      timestamp
    ];

    console.log('📤 Sending row data:', rowData);

    // Append to the sheet
    const response = await fetch(
      `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      }
    );

    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Data added to Google Sheets');
      console.log('📄 API Response:', result);
      return { success: true, message: 'Registration saved successfully!' };
    } else {
      const error = await response.json();
      console.error('❌ Google Sheets API error:', error);
      throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

  } catch (error) {
    console.error('💥 Google Sheets API submission error:', error);
    return { 
      success: false, 
      error: `Failed to save registration: ${error.message}`
    };
  }
};

// Helper function to ensure headers exist (requires read/write permissions)
export const ensureSheetHeaders = async () => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  const headers = ['First Name', 'Last Name', 'Email', 'Description', 'Timestamp'];
  
  try {
    // Get current values in row 1
    const response = await fetch(
      `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:E1?key=${API_KEY}`
    );
    
    if (response.ok) {
      const result = await response.json();
      const existingValues = result.values?.[0] || [];
      
      // Check if headers are missing or empty
      const needsHeaders = existingValues.length === 0 || 
                          existingValues.every(cell => !cell || cell.trim() === '');
      
      if (needsHeaders) {
        console.log('📝 Adding headers to sheet...');
        const updateResponse = await fetch(
          `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:E1?valueInputOption=RAW&key=${API_KEY}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: [headers]
            })
          }
        );
        
        if (updateResponse.ok) {
          console.log('✅ Headers added successfully');
        } else {
          console.warn('⚠️ Could not add headers (permission issue?)');
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not check/set headers:', error.message);
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
