// apps-script/SheetWebhook.gs
// Finalized Google Apps Script to receive POSTs and append to the specified Sheet.
// Spreadsheet ID (from user): 1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw
const SPREADSHEET_ID = '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw';
const SHEET_NAME = 'Sheet1';
const HEADERS = ['First Name', 'Last Name', 'Email', 'Description', 'Timestamp'];

// Helper function to create CORS-enabled responses
function createCorsResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function ensureSheetAndHeaders(sheet) {
  // If the sheet is missing a header row, create it.
  const firstRowRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const firstRowValues = firstRowRange.getValues()[0];
  const isHeaderEmpty = firstRowValues.every(cell => cell === '' || cell === null);
  if (isHeaderEmpty) {
    firstRowRange.setValues([HEADERS]);
  }
}

function doPost(e) {
  try {
    // Log for debugging in Executions
    console.log('doPost invoked. raw postData:', e && e.postData ? e.postData.contents : null);

    if (!e || !e.postData || !e.postData.contents) {
      return createCorsResponse({ success: false, error: 'No post data provided' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      console.log('JSON parse error:', parseErr);
      return createCorsResponse({ success: false, error: 'Invalid JSON' });
    }

    // Normalize keys: accept common variants just in case the frontend used different casing
    var firstName = data.firstName || data.first_name || data.firstname || '';
    var lastName  = data.lastName  || data.last_name  || data.lastname  || '';
    var email     = data.email || data.Email || '';
    var description = data.description || data.desc || data.message || '';

    if (!firstName || !lastName || !email) {
      return createCorsResponse({ success: false, error: 'Missing required fields: firstName/lastName/email' });
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      // If the expected sheet tab is missing, create it and write headers
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    } else {
      ensureSheetAndHeaders(sheet);
    }

    // Append the row in the same order as HEADERS
    sheet.appendRow([firstName, lastName, email, description || '', new Date()]);

    return createCorsResponse({ success: true, message: 'Saved' });
  } catch (err) {
    console.log('doPost error:', err);
    return createCorsResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  // Health-check endpoint
  return createCorsResponse({ success: true, message: 'Sheet webhook running', timestamp: (new Date()).toISOString() });
}

function doOptions(e) {
  // Handle CORS preflight requests
  return createCorsResponse({ message: 'CORS preflight response' });
}
