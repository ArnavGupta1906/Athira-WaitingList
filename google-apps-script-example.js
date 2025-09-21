/**
 * Google Apps Script Code for Athira Waitlist
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Update the SPREADSHEET_ID with your Google Sheet ID
 * 5. Deploy as a web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the web app URL and paste it in src/config/googleAppsScript.js
 * 
 * GOOGLE SHEET SETUP:
 * Create a Google Sheet called "Athira Waitlist" with these headers in row 1:
 * A1: First Name
 * B1: Last Name  
 * C1: Email
 * D1: Description
 * E1: Timestamp
 */

// Replace this with your actual Google Sheet ID
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'
const SHEET_NAME = 'Sheet1' // or whatever your sheet is named

/**
 * Handle POST requests from the React app
 */
function doPost(e) {
  try {
    // Handle both JSON and FormData submissions
    let data
    
    if (e.postData.type === 'application/json') {
      // JSON submission
      data = JSON.parse(e.postData.contents)
    } else {
      // FormData submission
      const formData = e.postData.contents
      if (e.parameter && e.parameter.data) {
        data = JSON.parse(e.parameter.data)
      } else {
        data = JSON.parse(formData)
      }
    }
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields: firstName, lastName, or email'
        }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const sheet = spreadsheet.getSheetByName(SHEET_NAME)
    
    // Prepare the row data
    const timestamp = new Date()
    const rowData = [
      data.firstName,
      data.lastName, 
      data.email,
      data.description || '', // Optional field
      timestamp
    ]
    
    // Add the data to the sheet
    sheet.appendRow(rowData)
    
    // Log the submission for debugging
    console.log('New registration:', data)
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration saved successfully',
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    console.error('Error processing registration:', error)
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Athira Waitlist API is running',
      timestamp: new Date().toISOString(),
      usage: 'Send POST requests with JSON payload containing firstName, lastName, email, and optional description'
    }))
    .setMimeType(ContentService.MimeType.JSON)
}

/**
 * Test function to verify the script works
 * Run this function in the Apps Script editor to test
 */
function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        description: 'Interested in AI and machine learning'
      })
    }
  }
  
  const result = doPost(testData)
  console.log('Test result:', result.getContent())
}
