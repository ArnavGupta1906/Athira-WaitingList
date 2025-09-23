// apps-script/SheetWebhook.gs
// Finalized Google Apps Script to receive POSTs and append to the specified Sheet.
// Spreadsheet ID (from user): 1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw
const SPREADSHEET_ID = '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw';
const SHEET_NAME = 'Sheet1';
const HEADERS = ['First Name', 'Last Name', 'Email', 'Description', 'Timestamp'];

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
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'No post data provided' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      console.log('JSON parse error:', parseErr);
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Invalid JSON' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Normalize keys: accept common variants just in case the frontend used different casing
    var firstName = data.firstName || data.first_name || data.firstname || '';
    var lastName  = data.lastName  || data.last_name  || data.lastname  || '';
    var email     = data.email || data.Email || '';
    var description = data.description || data.desc || data.message || '';

    if (!firstName || !lastName || !email) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Missing required fields: firstName/lastName/email' }))
        .setMimeType(ContentService.MimeType.JSON);
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

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Saved' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.log('doPost error:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Health-check endpoint
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Sheet webhook running', timestamp: (new Date()).toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}
