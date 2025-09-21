# Google Apps Script Setup Guide

## Current Status
⚠️ **The registration form is currently using a mock/demo mode** because the Google Apps Script URL is not properly configured. The form will still work and show success messages, but data won't be saved to Google Sheets.

## How to Fix the "Failed to fetch" Error

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet called "Athira Waitlist"
3. Add these headers in row 1:
   - A1: `First Name`
   - B1: `Last Name`
   - C1: `Email`
   - D1: `Description`
   - E1: `Timestamp`
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `google-apps-script-example.js` in this project
4. Update the `SPREADSHEET_ID` variable with your sheet ID from Step 1
5. Save the project (Ctrl+S)

### Step 3: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Fill in the deployment settings:
   - **Description**: "Athira Waitlist API"
   - **Execute as**: "Me (your email)"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. **Important**: Copy the Web app URL that appears (it should end with `/exec`)

### Step 4: Update the React App
1. Open `src/config/googleAppsScript.js`
2. Replace the `WEB_APP_URL` with your actual web app URL from Step 3
3. Save the file

### Step 5: Test the Form
1. Restart your React development server (`npm start`)
2. Fill out the registration form
3. Check your Google Sheet - new submissions should appear as rows

## Troubleshooting

### "Failed to fetch" Error
- Make sure you're using the **web app URL** (ends with `/exec`), not the library URL
- Ensure the Google Apps Script is deployed with "Anyone" access
- Check that your Google Sheet ID is correct

### "Script function not found" Error
- Make sure you saved the Google Apps Script code
- Verify the function name is `doPost` (case-sensitive)

### Data Not Appearing in Sheet
- Check the Google Apps Script execution logs for errors
- Verify the sheet name matches the `SHEET_NAME` variable
- Make sure the spreadsheet ID is correct

### CORS Errors
- Google Apps Script handles CORS automatically when deployed as a web app
- If you still see CORS errors, try redeploying the script

## Current Configuration
The app is currently configured to work in demo mode when the Google Apps Script URL is not properly set up. This means:
- ✅ Form validation works
- ✅ Success/error messages appear
- ✅ User experience is maintained
- ❌ Data is not actually saved to Google Sheets

Once you follow the setup steps above, real data submission will be enabled automatically.
