/**
 * WORKING Google Apps Script for SnapTutor Form Submissions
 * This version includes comprehensive logging to help identify issues
 *
 * SETUP INSTRUCTIONS:
 * 1. Replace YOUR_SPREADSHEET_ID_HERE below with your actual Spreadsheet ID
 * 2. Save this script
 * 3. Run testSetup() to verify everything works
 * 4. Deploy as Web App with: Execute as "Me", Access "Anyone"
 */

// ============================================
// CONFIGURATION - REPLACE THIS!
// ============================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // <-- PUT YOUR SPREADSHEET ID HERE!
const SHEET_NAME = 'Sheet1';

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Handles POST requests from your React form
 */
function doPost(e) {
  console.log('🚀 doPost function called');
  console.log('📅 Timestamp:', new Date().toISOString());

  // Log everything about the request
  console.log('📦 Raw event object:', JSON.stringify(e, null, 2));

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Check if event exists
    if (!e) {
      console.log('❌ No event object received');
      return output.setContent(JSON.stringify({
        success: false,
        error: 'No event object received',
        debug: 'doPost was called but no event parameter'
      }));
    }

    // Log POST data details
    console.log('📨 POST data exists:', !!e.postData);
    console.log('📨 POST data contents:', e.postData ? e.postData.contents : 'null');
    console.log('📨 POST data type:', e.postData ? e.postData.type : 'null');
    console.log('📨 POST data length:', e.postData && e.postData.contents ? e.postData.contents.length : 0);

    // Check for POST data
    if (!e.postData || !e.postData.contents) {
      console.log('❌ No POST data received');
      return output.setContent(JSON.stringify({
        success: false,
        error: 'No POST data received',
        debug: 'Request received but no postData.contents',
        received: {
          hasPostData: !!e.postData,
          postDataType: typeof e.postData,
          hasContents: !!(e.postData && e.postData.contents)
        }
      }));
    }

    // Parse JSON data
    let formData;
    try {
      formData = JSON.parse(e.postData.contents);
      console.log('✅ JSON parsed successfully:', JSON.stringify(formData, null, 2));
    } catch (parseError) {
      console.log('❌ JSON parse failed:', parseError.message);
      console.log('Raw contents:', e.postData.contents);
      return output.setContent(JSON.stringify({
        success: false,
        error: 'Invalid JSON format: ' + parseError.message,
        debug: 'Could not parse POST data as JSON',
        rawData: e.postData.contents.substring(0, 200)
      }));
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    const missingFields = [];

    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return output.setContent(JSON.stringify({
        success: false,
        error: 'Missing required fields: ' + missingFields.join(', '),
        debug: 'Form validation failed',
        receivedData: formData
      }));
    }

    console.log('✅ Form validation passed');

    // Save to Google Sheets
    const saveResult = saveToGoogleSheet(formData);

    if (saveResult.success) {
      console.log('🎉 Form submission successful!');
      return output.setContent(JSON.stringify({
        success: true,
        message: 'Form submitted successfully!',
        timestamp: new Date().toISOString(),
        rowNumber: saveResult.rowNumber,
        debug: 'Data saved to Google Sheets'
      }));
    } else {
      console.log('❌ Failed to save to Google Sheets:', saveResult.error);
      return output.setContent(JSON.stringify({
        success: false,
        error: 'Failed to save data: ' + saveResult.error,
        debug: 'Google Sheets operation failed'
      }));
    }

  } catch (error) {
    console.log('💥 Unexpected error in doPost:', error.message);
    console.log('Error stack:', error.stack);

    return output.setContent(JSON.stringify({
      success: false,
      error: 'Server error: ' + error.message,
      debug: 'Unexpected error in doPost function',
      timestamp: new Date().toISOString()
    }));
  }
}

/**
 * Handles GET requests - use this to test if your script is working
 */
function doGet(e) {
  console.log('🧪 doGet function called');
  console.log('📅 Timestamp:', new Date().toISOString());

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  // Test configuration
  const configStatus = testConfiguration();

  const response = {
    status: 'Google Apps Script is running',
    timestamp: new Date().toISOString(),
    configuration: configStatus,
    endpoints: {
      'GET': 'This endpoint - returns status information',
      'POST': 'Submit form data with JSON body'
    },
    testInstructions: {
      step1: 'Run testSetup() function in Apps Script editor',
      step2: 'Check execution logs for detailed results',
      step3: 'Verify test data appears in your Google Sheet'
    }
  };

  console.log('📊 Status response:', JSON.stringify(response, null, 2));

  return output.setContent(JSON.stringify(response, null, 2));
}

/**
 * Saves form data to Google Sheets
 */
function saveToGoogleSheet(data) {
  console.log('💾 Attempting to save data to Google Sheets...');

  try {
    // Test configuration first
    const configTest = testConfiguration();
    if (!configTest.configured) {
      console.log('❌ Configuration test failed');
      return {
        success: false,
        error: 'Script not configured properly. Check SPREADSHEET_ID.'
      };
    }

    // Open spreadsheet
    console.log('📂 Opening spreadsheet:', SPREADSHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet opened:', spreadsheet.getName());

    // Get sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.getSheets()[0];
      console.log('⚠️ Using first sheet as fallback:', sheet.getName());
    } else {
      console.log('✅ Using sheet:', SHEET_NAME);
    }

    // Add headers if needed
    const lastRow = sheet.getLastRow();
    console.log('📊 Current rows in sheet:', lastRow);

    if (lastRow === 0) {
      console.log('📝 Adding headers to empty sheet');
      sheet.appendRow(['FirstName', 'LastName', 'Email', 'Description', 'Timestamp']);
    }

    // Prepare data
    const timestamp = new Date().toISOString();
    const rowData = [
      (data.firstName || '').toString().trim(),
      (data.lastName || '').toString().trim(),
      (data.email || '').toString().trim(),
      (data.description || '').toString().trim(),
      timestamp
    ];

    console.log('📝 Row data to append:', rowData);

    // Append data
    sheet.appendRow(rowData);
    const newLastRow = sheet.getLastRow();

    console.log('✅ Data appended successfully! New row:', newLastRow);

    return {
      success: true,
      rowNumber: newLastRow,
      timestamp: timestamp
    };

  } catch (error) {
    console.log('💥 Error saving to Google Sheets:', error.message);
    console.log('Error stack:', error.stack);

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Tests the script configuration
 */
function testConfiguration() {
  const isConfigured = SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE';

  let canAccess = false;
  let spreadsheetName = '';
  let sheetName = '';
  let rowCount = 0;
  let errorMsg = '';

  if (isConfigured) {
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      canAccess = true;
      spreadsheetName = spreadsheet.getName();

      const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
      sheetName = sheet.getName();
      rowCount = sheet.getLastRow();

    } catch (error) {
      errorMsg = error.message;
    }
  }

  return {
    configured: isConfigured,
    spreadsheetId: SPREADSHEET_ID,
    canAccessSpreadsheet: canAccess,
    spreadsheetName: spreadsheetName,
    targetSheetName: SHEET_NAME,
    actualSheetName: sheetName,
    currentRowCount: rowCount,
    error: errorMsg
  };
}

// ============================================
// TEST FUNCTIONS - RUN THESE!
// ============================================

/**
 * Main test function - RUN THIS FIRST!
 */
function testSetup() {
  console.log('🧪 ========================================');
  console.log('🧪 TESTING GOOGLE APPS SCRIPT SETUP');
  console.log('🧪 ========================================');

  // Step 1: Check configuration
  console.log('1️⃣ Testing configuration...');
  const config = testConfiguration();
  console.log('Configuration result:', JSON.stringify(config, null, 2));

  if (!config.configured) {
    console.log('❌ SETUP ERROR: Replace YOUR_SPREADSHEET_ID_HERE with your actual Spreadsheet ID');
    console.log('Get it from your Google Sheet URL: https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit');
    return;
  }

  if (!config.canAccessSpreadsheet) {
    console.log('❌ ACCESS ERROR: Cannot access spreadsheet');
    console.log('Error:', config.error);
    console.log('Check that the Spreadsheet ID is correct and you have access');
    return;
  }

  console.log('✅ Configuration looks good!');
  console.log('Spreadsheet:', config.spreadsheetName);
  console.log('Sheet:', config.actualSheetName);
  console.log('Current rows:', config.currentRowCount);

  // Step 2: Test data saving
  console.log('\n2️⃣ Testing data saving...');
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@snaptutor.com',
    description: 'This is a test submission from testSetup() function'
  };

  console.log('Test data:', JSON.stringify(testData, null, 2));

  const saveResult = saveToGoogleSheet(testData);
  console.log('Save result:', JSON.stringify(saveResult, null, 2));

  if (saveResult.success) {
    console.log('✅ DATA SAVE SUCCESSFUL!');
    console.log('Row number:', saveResult.rowNumber);
    console.log('Check your Google Sheet - you should see the test entry');
  } else {
    console.log('❌ DATA SAVE FAILED:', saveResult.error);
  }

  // Step 3: Test doPost simulation
  console.log('\n3️⃣ Testing doPost function...');
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
      type: 'application/json'
    }
  };

  const postResult = doPost(mockEvent);
  const responseText = postResult.getContent();
  console.log('doPost response:', responseText);

  try {
    const response = JSON.parse(responseText);
    if (response.success) {
      console.log('✅ doPost SUCCESSFUL!');
    } else {
      console.log('❌ doPost FAILED:', response.error);
    }
  } catch (e) {
    console.log('⚠️ Could not parse doPost response');
  }

  console.log('\n🎉 ========================================');
  console.log('🎉 TEST COMPLETE!');
  console.log('🎉 ========================================');
  console.log('Next steps:');
  console.log('1. Deploy this script as a Web App');
  console.log('2. Copy the Web App URL');
  console.log('3. Update your .env file with the URL');
  console.log('4. Test your React form');
}

/**
 * Simple test - just adds a row directly
 */
function simpleTest() {
  console.log('🔧 Running simple test...');

  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    console.log('❌ Please replace YOUR_SPREADSHEET_ID_HERE first');
    return;
  }

  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['FirstName', 'LastName', 'Email', 'Description', 'Timestamp']);
    }

    sheet.appendRow([
      'Simple',
      'Test',
      'simple@test.com',
      'Direct row insertion test',
      new Date().toISOString()
    ]);

    console.log('✅ Simple test successful!');
    console.log('Total rows:', sheet.getLastRow());
    console.log('Check your Google Sheet!');

  } catch (error) {
    console.log('❌ Simple test failed:', error.message);
  }
}