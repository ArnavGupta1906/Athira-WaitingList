# 🚨 URGENT: Data Recovery Solution for Lost Form Submissions

## 📊 Current Situation
- **200 flyers distributed** with QR codes
- **Form submissions are failing** - data not reaching Google Sheets
- **Root cause**: Google Apps Script URL is incorrectly configured (library URL instead of web app URL)

## 🔍 Why Data is Lost
Your current configuration uses a **library URL** (`https://script.google.com/macros/library/...`) instead of a **web app URL** (`https://script.google.com/macros/s/.../exec`). This means:
- Form submissions appear to work (users see success message)
- But data never reaches Google Sheets
- No server-side logging of failed submissions

## 🛠️ IMMEDIATE SOLUTIONS

### Option 1: Check Browser Console Logs (Most Likely to Work)
Since your form shows success messages, the data might be in browser console logs:

1. **Ask users to check their browser console:**
   - Open browser developer tools (F12)
   - Go to Console tab
   - Look for submission logs with data
   - Screenshot or copy the logged data

2. **Check your own browser console:**
   - Test the form yourself
   - Look for detailed logs showing the submission data
   - The logs should contain the actual form data that was submitted

### Option 2: Implement Fallback Data Collection (Recommended)
Create a backup system to capture future submissions:

1. **Add local storage backup**
2. **Add email notifications**
3. **Add database logging**

### Option 3: Check Vercel/Deployment Logs
If deployed on Vercel:
1. Go to your Vercel dashboard
2. Check function logs for any error messages
3. Look for failed API calls to Google Apps Script

## 🚀 QUICK FIX: Proper Google Apps Script Setup

### Step 1: Create New Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace all code with this:

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

### Step 2: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Choose "Web app" as type
3. Set "Execute as": "Me"
4. Set "Who has access": "Anyone"
5. Click "Deploy"
6. **Copy the web app URL** (should end with `/exec`)

### Step 3: Update Your React App
Replace the URL in `src/config/googleAppsScript.js`:

```javascript
export const GOOGLE_APPS_SCRIPT_URL = 'YOUR_NEW_WEB_APP_URL_HERE'
```

## 📋 Data Recovery Checklist

- [ ] Check browser console logs for submission data
- [ ] Ask users to check their browser console
- [ ] Check Vercel/deployment logs
- [ ] Set up proper Google Apps Script
- [ ] Test the fixed integration
- [ ] Consider implementing backup data collection

## 🆘 Emergency Contact Strategy

If you can't recover the data:
1. **Re-contact users**: Send follow-up emails asking them to re-register
2. **Social media**: Post about the technical issue and ask for re-registration
3. **Website notice**: Add a banner about the issue and ask for re-registration

## 🔧 Prevention for Future

1. **Add backup logging** to your form
2. **Set up email notifications** for each submission
3. **Monitor Google Apps Script logs** regularly
4. **Test the integration** before major campaigns

---

**Next Steps:**
1. First, try to recover data from browser console logs
2. Fix the Google Apps Script integration immediately
3. Implement backup data collection system
4. Test thoroughly before next campaign
