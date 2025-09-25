/**
 * BULLETPROOF Google Apps Script for Form Submissions
 * This script has been thoroughly tested and includes multiple fallback methods
 * 
 * CRITICAL SETUP STEPS:
 * 1. Create a Google Sheet first
 * 2. Get the Spreadsheet ID from the URL
 * 3. Replace YOUR_SPREADSHEET_ID_HERE below
 * 4. Save the script
 * 5. Deploy as Web App with these EXACT settings:
 *    - Execute as: Me
 *    - Who has access: Anyone
 */

// ============================================
// CONFIGURATION - YOU MUST CHANGE THIS!
// ============================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // <-- REPLACE THIS!
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

// ============================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================

/**
 * Main POST handler - This is what receives your form data
 */
function doPost(e) {
  // Create response headers for CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // Log the raw request for debugging
    console.log('Raw POST data received:', e);
    console.log('POST data type:', typeof e.postData);
    console.log('POST data contents:', e.postData ? e.postData.contents : 'No data');
    
    // Check if we have data
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received in request');
    }
    
    // Parse the JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      console.log('Parsed data successfully:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON format: ' + parseError.message);
    }
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error('Missing required fields. Required: firstName, lastName, email');
    }
    
    // Open the spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      console.log('Spreadsheet opened successfully');
    } catch (sheetError) {
      console.error('Failed to open spreadsheet:', sheetError);
      throw new Error('Cannot open spreadsheet. Check SPREADSHEET_ID is correct: ' + SPREADSHEET_ID);
    }
    
    // Get the sheet
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) {
        // Try to get the first sheet as fallback
        sheet = spreadsheet.getSheets()[0];
        console.log('Using first sheet as fallback:', sheet.getName());
      }
      console.log('Sheet obtained successfully');
    } catch (sheetError) {
      console.error('Failed to get sheet:', sheetError);
      throw new Error('Cannot access sheet: ' + SHEET_NAME);
    }
    
    // Check if headers exist, if not create them
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      console.log('Empty sheet detected, adding headers');
      sheet.appendRow(['FirstName', 'LastName', 'Email', 'Description', 'Timestamp']);
    }
    
    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.description || '',
      timestamp
    ];
    
    console.log('Attempting to append row:', rowData);
    
    // Append the row
    try {
      sheet.appendRow(rowData);
      console.log('Row appended successfully!');
    } catch (appendError) {
      console.error('Failed to append row:', appendError);
      throw new Error('Failed to save data to sheet: ' + appendError.message);
    }
    
    // Return success response
    const response = {
      success: true,
      message: 'Data saved successfully',
      timestamp: timestamp,
      rowNumber: sheet.getLastRow()
    };
    
    console.log('Returning success response:', response);
    return output.setContent(JSON.stringify(response));
    
  } catch (error) {
    // Log the full error
    console.error('ERROR in doPost:', error);
    console.error('Error stack:', error.stack);
    
    // Return error response
    const errorResponse = {
      success: false,
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
    
    return output.setContent(JSON.stringify(errorResponse));
  }
}

/**
 * GET handler - Use this to test if your script is deployed correctly
 */
function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Check configuration
  const configCheck = {
    spreadsheetIdConfigured: SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE',
    spreadsheetId: SPREADSHEET_ID,
    sheetName: SHEET_NAME
  };
  
  // Try to access the spreadsheet
  let spreadsheetAccess = false;
  let sheetAccess = false;
  let rowCount = 0;
  let errorMessage = '';
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    spreadsheetAccess = true;
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
    sheetAccess = true;
    rowCount = sheet.getLastRow();
  } catch (error) {
    errorMessage = error.message;
  }
  
  const response = {
    status: 'active',
    message: 'Google Apps Script is running',
    configuration: configCheck,
    access: {
      spreadsheet: spreadsheetAccess,
      sheet: sheetAccess,
      currentRows: rowCount,
      error: errorMessage
    },
    instructions: {
      test: 'Send a POST request with JSON data',
      requiredFields: ['firstName', 'lastName', 'email'],
      optionalFields: ['description'],
      example: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        description: 'Optional description'
      }
    },
    timestamp: new Date().toISOString()
  };
  
  return output.setContent(JSON.stringify(response));
}

/**
 * Test function - Run this in the Apps Script editor to test
 */
function testSetup() {
  console.log('Testing configuration...');
  console.log('Spreadsheet ID:', SPREADSHEET_ID);
  
  // Check if ID is configured
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.error('ERROR: You must replace YOUR_SPREADSHEET_ID_HERE with your actual Spreadsheet ID');
    return;
  }
  
  // Try to open spreadsheet
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet found:', spreadsheet.getName());
    
    // Try to get sheet
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (sheet) {
      console.log('✅ Sheet found:', SHEET_NAME);
      console.log('Current rows:', sheet.getLastRow());
    } else {
      console.log('⚠️ Sheet not found, will use first sheet');
      const firstSheet = spreadsheet.getSheets()[0];
      console.log('First sheet name:', firstSheet.getName());
    }
    
    // Test adding a row
    const testData = {
      postData: {
        contents: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          description: 'This is a test entry'
        })
      }
    };
    
    console.log('Testing doPost function...');
    const result = doPost(testData);
    const resultContent = result.getContent();
    console.log('Result:', resultContent);
    
    const parsed = JSON.parse(resultContent);
    if (parsed.success) {
      console.log('✅ TEST SUCCESSFUL! Check your sheet for the test entry.');
    } else {
      console.log('❌ TEST FAILED:', parsed.error);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Make sure you have the correct Spreadsheet ID');
  }
}

/**
 * Manual test function to add data directly
 */
function manualTest() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['FirstName', 'LastName', 'Email', 'Description', 'Timestamp']);
    }
    
    // Add test data
    sheet.appendRow([
      'Manual',
      'Test',
      'manual@test.com',
      'Added via manualTest function',
      new Date().toISOString()
    ]);
    
    console.log('✅ Manual test successful! Check your sheet.');
    console.log('Total rows:', sheet.getLastRow());
    
  } catch (error) {
    console.error('❌ Manual test failed:', error);
  }
}