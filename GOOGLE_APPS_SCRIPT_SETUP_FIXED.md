# Google Apps Script Setup Guide - FIXED VERSION

This guide will help you properly set up Google Apps Script to handle form submissions from your React landing page.

## 🚨 Current Issue Fixed

The error "Cannot read properties of undefined (reading 'type')" has been fixed by:
1. ✅ Updated the frontend to send JSON requests instead of FormData
2. ✅ Updated the Google Apps Script to handle JSON requests properly
3. ✅ Improved error handling and logging

## 📋 Step-by-Step Setup

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet called "Athira Waitlist"
3. Set up the headers in row 1:
   - A1: `First Name`
   - B1: `Last Name`
   - C1: `Email`
   - D1: `Description`
   - E1: `Timestamp`
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `google-apps-script-example.js` in your project
4. **IMPORTANT**: Update line 24 in the script:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_ACTUAL_SPREADSHEET_ID_HERE'
   ```
   Replace `YOUR_ACTUAL_SPREADSHEET_ID_HERE` with the ID you copied in Step 1.

### Step 3: Deploy as Web App
1. In the Apps Script editor, click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following options:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. **Copy the web app URL** (it should look like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### Step 4: Update Your React App
1. Open `src/config/googleAppsScript.js`
2. Replace the URL on line 22 with your actual web app URL:
   ```javascript
   WEB_APP_URL: process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL || 'YOUR_ACTUAL_WEB_APP_URL_HERE',
   ```

### Step 5: Test the Integration
1. Start your React app: `npm start`
2. Fill out the registration form
3. Check the browser console for detailed logs
4. Check your Google Sheet to see if the data was saved

## 🔧 Troubleshooting

### If you still get errors:

1. **Check the Google Apps Script logs**:
   - Go to your Apps Script project
   - Click "Executions" in the left sidebar
   - Look for any error messages

2. **Verify the web app URL**:
   - Make sure it ends with `/exec`
   - Make sure it doesn't contain `/library/`

3. **Check browser console**:
   - Open Developer Tools (F12)
   - Look for detailed error messages in the Console tab

4. **Test the Google Apps Script directly**:
   - In the Apps Script editor, run the `testSubmission()` function
   - Check if it successfully adds data to your sheet

## 📊 Expected Behavior

When everything is working correctly:
1. ✅ Form submission shows loading spinner
2. ✅ Console shows detailed logs of the submission process
3. ✅ Success message appears after submission
4. ✅ Data appears in your Google Sheet
5. ✅ No error messages in console

## 🚀 Production Deployment

For production deployment:
1. Set the environment variable `REACT_APP_GOOGLE_APPS_SCRIPT_URL` in your deployment platform (Vercel, Netlify, etc.)
2. Make sure the Google Apps Script web app is deployed with "Anyone" access
3. Test the production URL to ensure it works

## 📝 Code Changes Made

### Frontend Changes (`src/services/googleSheetsService.js`):
- ✅ Changed from FormData to JSON requests
- ✅ Added proper Content-Type header
- ✅ Improved error handling for specific error types
- ✅ Better logging and debugging information

### Google Apps Script Changes (`google-apps-script-example.js`):
- ✅ Added null checks for `e.postData`
- ✅ Better error handling for malformed requests
- ✅ Improved JSON parsing with fallbacks

## 🎯 Next Steps

1. Follow the setup guide above
2. Test the integration
3. If you encounter any issues, check the browser console for detailed error messages
4. The error messages now provide more specific guidance on what went wrong

## 📞 Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Verify your Google Apps Script is properly deployed
3. Ensure the spreadsheet ID is correct
4. Make sure the web app URL is properly configured
