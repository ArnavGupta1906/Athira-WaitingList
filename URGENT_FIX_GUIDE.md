# 🚨 URGENT: Fix Google Sheets Integration - Step by Step

## 🎯 The Problem
Your form submissions are **NOT being saved** because the Google Apps Script URL is wrong. You're using a library URL instead of a web app URL.

## 🔧 IMMEDIATE FIX (15 minutes)

### Step 1: Create New Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Delete ALL existing code
4. Copy and paste this code:

```javascript
// YOUR GOOGLE SHEET ID - Replace with your actual sheet ID
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
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
```

### Step 2: Update Your Google Sheet ID
1. Open your Google Sheet
2. Copy the ID from the URL (the long string between `/d/` and `/edit`)
3. Replace `1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw` in the script with your actual sheet ID

### Step 3: Deploy as Web App
1. Click **"Deploy"** > **"New deployment"**
2. Choose **"Web app"** as the type
3. Set **Execute as**: "Me"
4. Set **Who has access**: "Anyone"
5. Click **"Deploy"**
6. **COPY THE WEB APP URL** (it should end with `/exec`)

### Step 4: Update Your React App
1. Open `src/config/googleAppsScript.js`
2. Replace the `WEB_APP_URL` with your new web app URL
3. Save the file

### Step 5: Test the Fix
1. Run `npm start`
2. Fill out the form
3. Check your Google Sheet - data should appear
4. Check browser console for detailed logs

## 🔍 How to Check if It's Working

### Browser Console Logs
Open browser developer tools (F12) and look for:
- ✅ `SUCCESS! Data saved to Google Sheets`
- ❌ Any error messages

### Google Sheet
- New rows should appear with each submission
- Check the timestamp column for recent entries

### Google Apps Script Logs
1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click "Executions" to see logs

## 🆘 If Still Not Working

### Check These Common Issues:
1. **Wrong Sheet ID**: Make sure the sheet ID in the script matches your actual sheet
2. **Sheet Permissions**: Make sure the script has access to the sheet
3. **URL Format**: The web app URL should end with `/exec`, not `/library/`
4. **CORS Issues**: Try testing from the same domain first

### Debug Steps:
1. Test the Google Apps Script URL directly in browser
2. Check browser network tab for failed requests
3. Look at Google Apps Script execution logs
4. Verify the sheet has the correct headers

## 📊 Data Recovery Options

### Option 1: Check Browser Console Logs
- Ask users to check their browser console
- Look for submission logs with data
- Screenshot or copy the logged data

### Option 2: Use the Backup System
- The new backup system will capture future submissions
- Check the "Data Recovery Tool" button on your website
- Export any backup data that was captured

### Option 3: Re-contact Users
- Send follow-up emails asking for re-registration
- Post on social media about the technical issue
- Add a website banner about the issue

## 🚀 Prevention for Future

1. **Test thoroughly** before major campaigns
2. **Monitor Google Apps Script logs** regularly
3. **Use the backup system** for critical data
4. **Set up email notifications** for each submission

---

**Next Steps:**
1. Fix the Google Apps Script immediately (Steps 1-5 above)
2. Test the integration thoroughly
3. Check for any backup data using the recovery tool
4. Consider re-contacting users if needed
