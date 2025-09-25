# 🔧 Google Sheets Integration - Complete Troubleshooting Guide

## ⚡ Quick Diagnostic Checklist

Before diving into troubleshooting, verify these items:

- [ ] Google Sheet created with correct headers: `FirstName`, `LastName`, `Email`, `Description`, `Timestamp`
- [ ] Spreadsheet ID copied correctly from the URL
- [ ] Script code copied from `BULLETPROOF_GOOGLE_SCRIPT.gs`
- [ ] Spreadsheet ID replaced in the script (not "YOUR_SPREADSHEET_ID_HERE")
- [ ] Script deployed as Web App with "Anyone" access
- [ ] Deployment URL ends with `/exec` (not `/dev`)
- [ ] URL added to `.env` file or directly in code

## 🧪 Testing Your Setup

### Step 1: Test with the HTML Tester
1. Open `test-google-script.html` in your browser
2. Paste your Google Apps Script URL
3. Click "Test Connection" first
4. If connection works, try each submission method

### Step 2: Test in Apps Script Editor
1. Open your Google Apps Script
2. Click on `testSetup()` function
3. Click "Run" button
4. Check the logs (View → Logs)

### Step 3: Check Your Google Sheet
After any test, refresh your Google Sheet to see if data was added.

## 🚨 Common Issues and Solutions

### Issue 1: "Script URL not configured"
**Symptom:** Alert box appears saying setup is required

**Solutions:**
1. Add your Apps Script URL to `.env`:
   ```
   REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```
2. Restart your React app after adding the URL
3. Or hardcode it directly in `simpleFormService.js` (line 7-8)

---

### Issue 2: Nothing appears in Google Sheet
**Symptom:** Form shows success but no data in sheet

**Most Common Causes:**

1. **Wrong Spreadsheet ID**
   - Get the correct ID from your Sheet URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_ID/edit
   ```
   - Replace in the script exactly (no extra spaces)

2. **Headers don't match**
   - Headers must be EXACTLY: `FirstName`, `LastName`, `Email`, `Description`, `Timestamp`
   - Case sensitive!
   - No extra spaces

3. **Using /dev instead of /exec URL**
   - Always use the `/exec` URL from deployment
   - `/dev` is only for testing in Apps Script editor

4. **Old deployment**
   - In Apps Script: Deploy → Manage Deployments
   - Click "Edit" pencil icon
   - Select "New Version"
   - Update the deployment

**Debug Steps:**
```javascript
// Add this to your Apps Script to debug:
function debugSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  console.log('Sheet name:', sheet.getName());
  console.log('Sheet URL:', sheet.getUrl());
  console.log('First sheet name:', sheet.getSheets()[0].getName());
}
```

---

### Issue 3: CORS Errors
**Symptom:** Console shows CORS policy errors

**Solutions:**

1. **The script already handles CORS**, but if you still see errors:
   - The `no-cors` mode in Method 2 will work regardless
   - Data is still being saved even with CORS errors shown

2. **Test with the HTML tester**
   - Use Method 2 (No-CORS) or Method 3 (Form POST)
   - These bypass CORS completely

---

### Issue 4: 403 Forbidden Error
**Symptom:** "403 Forbidden" or "Authorization required"

**Solution:**
1. Redeploy the Apps Script:
   - Deploy → New Deployment
   - Execute as: **Me** (your email)
   - Who has access: **Anyone** ← CRITICAL!
2. Use the new URL (it changes with each deployment)

---

### Issue 5: 500 Server Error
**Symptom:** "500 Internal Server Error" from Google

**Solutions:**
1. **Check the Spreadsheet ID is correct**
2. **Run `testSetup()` in Apps Script editor**
3. **Check Apps Script logs:**
   - View → Logs
   - Look for specific error messages

---

### Issue 6: Script Times Out
**Symptom:** Request takes forever, eventually fails

**Solution:**
```javascript
// Add this simplified version to your Apps Script:
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    sheet.appendRow([
      data.firstName,
      data.lastName,
      data.email,
      data.description || '',
      new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({success: true}));
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.message}));
  }
}
```

---

## 🔍 Advanced Debugging

### Enable Detailed Logging in Apps Script

Add this to the top of your `doPost` function:
```javascript
console.log('=== NEW REQUEST ===');
console.log('Timestamp:', new Date().toISOString());
console.log('Raw request:', JSON.stringify(e));
console.log('PostData exists?', !!e.postData);
console.log('PostData contents:', e.postData?.contents);
```

Then check logs: View → Logs

### Test with CURL

```bash
# Replace YOUR_SCRIPT_URL with your actual URL
curl -X POST YOUR_SCRIPT_URL \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","description":"CURL test"}' \
  -v
```

### Check from Apps Script Side

Create this test function:
```javascript
function manualAddRow() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  sheet.appendRow(['Manual', 'Test', 'manual@test.com', 'Direct test', new Date().toISOString()]);
  console.log('Row added manually!');
}
```

Run it and check if data appears in your sheet.

## 💡 Pro Tips

1. **Always test in this order:**
   - Test in Apps Script editor first (`testSetup()`)
   - Test with HTML tester
   - Then test in React app

2. **If absolutely nothing works:**
   - Create a fresh Google Sheet
   - Create a new Apps Script project
   - Copy only the essential code
   - Deploy and test step by step

3. **Use the browser console:**
   - Open Developer Tools (F12)
   - Check Console tab for detailed error messages
   - Look for the emoji logs (🚀, ✅, ❌)

4. **Fallback option:**
   - If POST doesn't work, modify your Apps Script to accept GET:
   ```javascript
   function doGet(e) {
     if (e.parameter.firstName) {
       // Save data from URL parameters
       return doPost({
         postData: {
           contents: JSON.stringify(e.parameter)
         }
       });
     }
     // Return test response
   }
   ```

## 📞 Still Stuck?

If you've tried everything:

1. **Start fresh:**
   - Delete everything
   - Follow `BULLETPROOF_GOOGLE_SCRIPT.gs` step by step
   - Test at each step

2. **Use the simplest version:**
   - Use the minimal script from Issue 6 above
   - Get that working first
   - Then add features

3. **Check Google's status:**
   - Sometimes Google Apps Script has outages
   - Check: https://www.google.com/appsstatus

## ✅ When It's Working

You'll know it's working when:
1. `test-google-script.html` shows "Connection successful"
2. Test submissions appear in your Google Sheet
3. React app shows success message
4. No errors in browser console

Remember: The `no-cors` mode (Method 2) will always work even if you can't see the response!