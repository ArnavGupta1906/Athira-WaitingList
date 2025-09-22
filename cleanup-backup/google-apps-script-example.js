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
const SPREADSHEET_ID = '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw'
const SHEET_NAME = 'Sheet1' // or whatever your sheet is named

/**
 * Handle POST requests from the React app
 */
function doPost(e) {
  try {
    console.log('📥 Received POST request:', e)
    console.log('📥 Request type:', e.postData ? e.postData.type : 'no postData')
    console.log('📥 Request contents:', e.postData ? e.postData.contents : 'no contents')
    
    // Handle JSON submissions from React app
    let data
    
    if (e.postData && e.postData.type === 'application/json') {
      // JSON submission
      console.log('📄 Processing JSON submission')
      data = JSON.parse(e.postData.contents)
    } else if (e.postData && e.postData.contents) {
      // Try to parse as JSON if no type is specified
      console.log('📄 Processing raw data submission')
      try {
        data = JSON.parse(e.postData.contents)
      } catch (parseError) {
        console.error('Failed to parse postData.contents as JSON:', parseError)
        throw new Error('Invalid request format')
      }
    } else {
      console.error('❌ No data received in request')
      console.error('Request object:', e)
      throw new Error('No data received in request')
    }
    
    console.log('📊 Parsed data:', data)
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      console.error('❌ Missing required fields')
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields: firstName, lastName, or email'
        }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Get the spreadsheet
    console.log('📊 Opening spreadsheet:', SPREADSHEET_ID)
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
    
    console.log('📝 Adding row data:', rowData)
    
    // Add the data to the sheet
    sheet.appendRow(rowData)
    
    // Log the submission for debugging
    console.log('✅ New registration saved:', data)
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration saved successfully',
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    console.error('💥 Error processing registration:', error)
    
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
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
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
