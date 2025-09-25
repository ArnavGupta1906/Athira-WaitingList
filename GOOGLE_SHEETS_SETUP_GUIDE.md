# Google Sheets Direct Integration Setup Guide

## Overview
This solution uses Google Apps Script to create a custom API endpoint that receives form submissions and saves them directly to Google Sheets. No third-party services, no CORS issues, completely self-contained.

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Athira Registration Waitlist" (or your preferred name)
4. In the first row, add these headers exactly as shown:
   - Cell A1: `FirstName`
   - Cell B1: `LastName`
   - Cell C1: `Email`
   - Cell D1: `Description`
   - Cell E1: `Timestamp`
5. Note the Spreadsheet ID from the URL (it's the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste this complete script:

```javascript
// Configuration - Replace with your actual Spreadsheet ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

// CORS configuration for production
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // In production, replace * with your domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Main function to handle POST requests
function doPost(e) {
  try {
    console.log('Received POST request:', e.postData.contents);
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return createResponse(false, 'Missing required fields', 400);
    }
    
    // Open the spreadsheet and get the sheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('Sheet not found:', SHEET_NAME);
      return createResponse(false, 'Configuration error: Sheet not found', 500);
    }
    
    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [
      data.firstName,
      data.lastName,
      data.email,
      data.description || '', // Optional field
      timestamp
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Log success
    console.log('Successfully added row:', rowData);
    
    // Return success response
    return createResponse(true, 'Registration saved successfully', 200, {
      timestamp: timestamp,
      email: data.email
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return createResponse(false, `Server error: ${error.toString()}`, 500);
  }
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

// Handle GET requests (for testing)
function doGet(e) {
  const testResponse = {
    status: 'active',
    message: 'Athira Registration API is running',
    version: '1.0.0',
    endpoint: 'POST to this URL with JSON data',
    requiredFields: ['firstName', 'lastName', 'email'],
    optionalFields: ['description']
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(testResponse))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

// Helper function to create JSON responses
function createResponse(success, message, statusCode, data = null) {
  const response = {
    success: success,
    message: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

// Test function for debugging (run this in the Apps Script editor)
function testPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        description: 'Testing the API'
      })
    }
  };
  
  const result = doPost(testData);
  console.log('Test result:', result.getContent());
}
```

4. **IMPORTANT**: Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID from Step 1
5. Save the script (Ctrl+S or Cmd+S)
6. Name your project "Athira Registration API" (or your preferred name)

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New Deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Athira Registration API v1" (or your preferred description)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (required for public form access)
4. Click **Deploy**
5. You'll see an authorization prompt:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to Athira Registration API (unsafe)**
   - Click **Allow**
6. **IMPORTANT**: Copy the Web app URL that appears
   - It will look like: `https://script.google.com/macros/s/AKfycbw.../exec`
   - Save this URL - you'll need it for the React app

## Step 4: Test Your API

Before integrating with React, test your API:

1. Visit your Web app URL in a browser
   - You should see a JSON response showing the API is active
2. Test with curl or Postman:
```bash
curl -X POST YOUR_WEB_APP_URL \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","description":"Testing"}'
```
3. Check your Google Sheet - you should see the test data

## Step 5: Update React Application

The `simpleFormService.js` file has been updated to use your Google Apps Script API. Simply add your Web app URL to the environment variables.

### Option A: Using Environment Variables (Recommended)
1. Create/update `.env` file in your project root:
```
REACT_APP_GOOGLE_SCRIPT_URL=YOUR_WEB_APP_URL_HERE
```

### Option B: Direct URL (Quick Testing)
Update the URL directly in `src/services/simpleFormService.js`:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
```

## Step 6: Deploy and Test

1. Start your React app:
```bash
npm start
```
2. Fill out the registration form
3. Submit and verify:
   - Success message appears in the UI
   - Data appears in your Google Sheet

## Troubleshooting

### If submissions aren't working:

1. **Check the Apps Script URL**: Make sure you're using the `/exec` URL, not `/dev`
2. **Verify Spreadsheet ID**: Ensure the ID in your Apps Script matches your sheet
3. **Check Sheet Name**: Default is 'Sheet1' - update if yours is different
4. **Review Permissions**: The Web app must be set to "Anyone" for access
5. **Check Browser Console**: Look for error messages in Developer Tools
6. **Test the API Directly**: Use the curl command to test outside of React

### Common Issues:

- **403 Forbidden**: Re-deploy with "Anyone" access
- **404 Not Found**: Check you're using the correct URL
- **500 Server Error**: Check the Spreadsheet ID and Sheet name in Apps Script
- **No data in sheet**: Verify column headers match exactly (case-sensitive)

## Security Notes

1. **API Key Security**: The Google Apps Script URL is public but:
   - It only accepts specific data format
   - It only writes to your sheet (no reading)
   - You can add rate limiting in the script
   - You can restrict domains in CORS headers

2. **Data Validation**: The script validates required fields
3. **Error Handling**: All errors are logged and returned safely

## Production Checklist

- [ ] Replace `*` in CORS headers with your actual domain
- [ ] Add rate limiting if needed
- [ ] Set up Google Sheets backup/archiving
- [ ] Monitor Apps Script quotas (free tier is very generous)
- [ ] Consider adding email notifications for new registrations

## Advantages of This Solution

✅ **No CORS Issues**: Google Apps Script handles CORS properly
✅ **No Third-Party Services**: Direct Google Sheets integration
✅ **Free**: Uses Google's free tier (very generous limits)
✅ **Reliable**: Google's infrastructure
✅ **Fast**: Direct API calls, no middleware
✅ **Secure**: Built-in Google authentication
✅ **Maintainable**: Simple code, easy to modify
✅ **Scalable**: Handles thousands of submissions

## Support

If you encounter issues:
1. Check the Apps Script logs: View → Logs in the Apps Script editor
2. Verify all IDs and URLs are correct
3. Test the API endpoint directly before testing in React
4. Ensure your Google Sheet has the correct column headers