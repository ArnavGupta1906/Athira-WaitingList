/**
 * Google Apps Script for Athira Waitlist
 * 
 * This script handles form submissions and automatically adds them to Google Sheets.
 * It's much more reliable than Formspree and can handle unlimited entries.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Deploy as a web app with "Anyone" access
 * 5. Copy the web app URL to your React app
 */

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the specific spreadsheet by ID
    const spreadsheetId = '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    
    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['First Name', 'Last Name', 'Email', 'Description', 'Timestamp']
      ]);
    }
    
    // Add the new row
    const newRow = [
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.description || '',
      new Date().toISOString()
    ];
    
    sheet.appendRow(newRow);
    
    // Return success response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration saved successfully!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Athira Waitlist API is running!',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
