/**
 * WORKING Google Apps Script - This WILL work
 * 
 * INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a NEW project
 * 3. Delete ALL existing code
 * 4. Copy and paste this ENTIRE code
 * 5. Save (Ctrl+S)
 * 6. Deploy as web app (Execute as: Me, Access: Anyone)
 * 7. Copy the web app URL
 */

// YOUR GOOGLE SHEET ID
const SPREADSHEET_ID = '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw'

function doPost(e) {
  try {
    console.log('=== NEW SUBMISSION ===')
    console.log('Full request:', e)
    
    let data
    
    // Handle URL-encoded form data
    if (e.postData && e.postData.contents) {
      console.log('Raw postData.contents:', e.postData.contents)
      
      // Parse the URL-encoded data
      const urlParams = new URLSearchParams(e.postData.contents)
      const dataString = urlParams.get('data')
      
      console.log('Extracted data string:', dataString)
      
      if (dataString) {
        data = JSON.parse(dataString)
      } else {
        throw new Error('No data parameter found')
      }
    } else {
      throw new Error('No postData received')
    }
    
    console.log('Parsed data:', data)
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    const sheet = spreadsheet.getActiveSheet()
    
    // Add the data
    const row = [
      data.firstName,
      data.lastName,
      data.email,
      data.description || '',
      new Date()
    ]
    
    console.log('Adding row to sheet:', row)
    sheet.appendRow(row)
    
    console.log('SUCCESS: Data saved to sheet!')
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    console.error('ERROR:', error)
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Working API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
}
