/**
 * FIXED Google Apps Script for Form Submissions
 * This version has better error handling for the test functions
 */

// ============================================
// CONFIGURATION - YOU MUST CHANGE THIS!
// ============================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // <-- REPLACE THIS WITH YOUR ACTUAL ID!
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Main POST handler - receives form data
 */
function doPost(e) {
  // Check if e exists
  if (!e) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'No event object received'
    })).setMimeType(ContentService.MimeType.JSON);
  }

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
    
    // Save to spreadsheet
    const result = saveToSheet(data);
    
    if (result.success) {
      return output.setContent(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        timestamp: new Date().toISOString(),
        rowNumber: result.rowNumber
      }));
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('ERROR in doPost:', error);
    console.error('Error stack:', error.stack);
    
    return output.setContent(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }));
  }
}

/**
 * GET handler - test if script is deployed correctly
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
    timestamp: new Date().toISOString()
  };
  
  return output.setContent(JSON.stringify(response));
}

/**
 * Helper function to save data to sheet
 */
function saveToSheet(data) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');
    
    // Get the sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.getSheets()[0];
      console.log('Using first sheet as fallback:', sheet.getName());
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
    sheet.appendRow(rowData);
    const newRowNumber = sheet.getLastRow();
    console.log('Row appended successfully! Row number:', newRowNumber);
    
    return {
      success: true,
      rowNumber: newRowNumber
    };
    
  } catch (error) {
    console.error('Failed to save to sheet:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================
// TEST FUNCTIONS - RUN THESE!
// ============================================

/**
 * TEST FUNCTION 1: Test the entire setup
 * RUN THIS FUNCTION FIRST!
 */
function testSetup() {
  console.log('=================================');
  console.log('TESTING YOUR CONFIGURATION');
  console.log('=================================');
  console.log('Spreadsheet ID:', SPREADSHEET_ID);
  console.log('Sheet Name:', SHEET_NAME);
  
  // Step 1: Check if ID is configured
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.error('❌ ERROR: You must replace YOUR_SPREADSHEET_ID_HERE with your actual Spreadsheet ID');
    console.error('Get it from your Google Sheet URL:');
    console.error('https://docs.google.com/spreadsheets/d/YOUR_ID_IS_HERE/edit');
    return;
  }
  
  // Step 2: Try to open spreadsheet
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ SUCCESS: Spreadsheet found!');
    console.log('Spreadsheet name:', spreadsheet.getName());
    
    // Step 3: Try to get sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (sheet) {
      console.log('✅ SUCCESS: Sheet "' + SHEET_NAME + '" found!');
    } else {
      console.log('⚠️ WARNING: Sheet "' + SHEET_NAME + '" not found, using first sheet');
      sheet = spreadsheet.getSheets()[0];
      console.log('Using sheet:', sheet.getName());
    }
    
    console.log('Current number of rows:', sheet.getLastRow());
    
    // Step 4: Test adding data
    console.log('\n=================================');
    console.log('TESTING DATA SUBMISSION');
    console.log('=================================');
    
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      description: 'This is a test entry from testSetup()'
    };
    
    console.log('Attempting to save test data:', testData);
    
    const result = saveToSheet(testData);
    
    if (result.success) {
      console.log('✅ SUCCESS: Test data saved to row ' + result.rowNumber);
      console.log('\n🎉 EVERYTHING IS WORKING!');
      console.log('Check your Google Sheet - you should see the test entry.');
    } else {
      console.log('❌ ERROR: Failed to save test data');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ ERROR: Cannot access spreadsheet');
    console.error('Error message:', error.message);
    console.error('\nPOSSIBLE CAUSES:');
    console.error('1. Spreadsheet ID is incorrect');
    console.error('2. You don\'t have access to the spreadsheet');
    console.error('3. The spreadsheet was deleted');
    console.error('\nYour Spreadsheet ID:', SPREADSHEET_ID);
    console.error('Make sure this ID is from YOUR Google Sheet URL');
  }
}

/**
 * TEST FUNCTION 2: Simple manual test
 * This directly adds a row without any complex logic
 */
function simpleTest() {
  console.log('Running simple test...');
  
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.error('❌ Replace YOUR_SPREADSHEET_ID_HERE first!');
    return;
  }
  
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    
    // Add headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['FirstName', 'LastName', 'Email', 'Description', 'Timestamp']);
    }
    
    // Add test row
    sheet.appendRow([
      'Simple',
      'Test',
      'simple@test.com',
      'Added by simpleTest()',
      new Date().toISOString()
    ]);
    
    console.log('✅ SUCCESS! Row added. Total rows:', sheet.getLastRow());
    console.log('Check your Google Sheet!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

/**
 * TEST FUNCTION 3: Check sheet configuration
 */
function checkSheet() {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.error('❌ Replace YOUR_SPREADSHEET_ID_HERE first!');
    return;
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet Name:', spreadsheet.getName());
    console.log('Spreadsheet URL:', spreadsheet.getUrl());
    
    const sheets = spreadsheet.getSheets();
    console.log('\nAll sheets in this spreadsheet:');
    sheets.forEach((sheet, index) => {
      console.log(index + 1 + '. "' + sheet.getName() + '" - Rows: ' + sheet.getLastRow());
    });
    
    // Check first row (headers) of first sheet
    if (sheets[0].getLastRow() > 0) {
      const headers = sheets[0].getRange(1, 1, 1, sheets[0].getLastColumn()).getValues()[0];
      console.log('\nHeaders in first sheet:', headers);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}