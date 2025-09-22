# 🚀 Athira Landing Page - Complete Setup Guide

## 🎯 Current Issue
Your form submissions are **NOT being saved to Google Sheets** because the Google Apps Script URL is incorrectly configured.

## 🔍 Root Cause Analysis
- ❌ **Wrong URL Type**: Using a library URL instead of a web app URL
- ❌ **No Google Apps Script Deployment**: No actual web app is deployed
- ❌ **Missing Environment Configuration**: No proper environment setup

## 🛠️ Step-by-Step Fix

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet called "Athira Waitlist"
3. Add these headers in **row 1**:
   ```
   A1: First Name
   B1: Last Name  
   C1: Email
   D1: Description
   E1: Timestamp
   ```
4. Copy the **Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`)

### Step 2: Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. Replace the default code with the code from `google-apps-script-example.js`
4. **Update the SPREADSHEET_ID** in the script with your actual Google Sheet ID
5. Save the project (Ctrl+S)

### Step 3: Deploy as Web App
1. Click **"Deploy"** > **"New deployment"**
2. Choose **"Web app"** as the type
3. Set **Execute as**: "Me"
4. Set **Who has access**: "Anyone"
5. Click **"Deploy"**
6. **Copy the Web App URL** (it should end with `/exec`)

### Step 4: Update React App Configuration
**Option A: Using Environment Variable (Recommended)**
1. Create a `.env` file in your project root:
   ```bash
   REACT_APP_GOOGLE_APPS_SCRIPT_URL=your_web_app_url_here
   ```
2. Restart your development server: `npm start`

**Option B: Direct Code Update**
1. Open `src/config/googleAppsScript.js`
2. Replace the `WEB_APP_URL` with your actual web app URL
3. Save the file

### Step 5: Test the Form
1. Fill out the registration form
2. Check your Google Sheet - new submissions should appear as rows
3. Check browser console for detailed logging

## 🔧 Troubleshooting

### "Failed to fetch" Error
- ✅ Make sure you're using the **web app URL** (ends with `/exec`)
- ✅ Ensure the Google Apps Script is deployed with "Anyone" access
- ✅ Check that your Google Sheet ID is correct

### Data Not Appearing in Sheet
- ✅ Check the Google Apps Script execution logs for errors
- ✅ Verify the sheet name matches the `SHEET_NAME` variable
- ✅ Make sure the spreadsheet ID is correct

### CORS Errors
- ✅ Google Apps Script handles CORS automatically when deployed as a web app
- ✅ If you still see CORS errors, try redeploying the script

## 📊 Current Status
- ✅ Form validation works
- ✅ Success/error messages appear  
- ✅ User experience is maintained
- ❌ Data is not actually saved to Google Sheets (until you complete the setup)

## 🚀 Quick Start Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📝 Environment Variables
Create a `.env` file with:
```bash
REACT_APP_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🔍 Debugging
Check the browser console for detailed logs:
- 🚀 Form submission process
- 📊 Data validation
- 🌐 Network requests
- 📡 Google Sheets responses
- ❌ Error details

## 📞 Support
If you need help, check the console logs first - they now provide detailed information about what's happening during form submission.
