# Athira Landing Page - Google Sheets Integration Setup Guide

This guide will walk you through setting up the complete integration between your React landing page and Google Sheets.

## 🎯 Overview

The landing page collects user registrations and saves them directly to Google Sheets using Google Apps Script as a backend API.

## 📋 Prerequisites

- Google account
- Node.js installed
- Basic knowledge of Google Sheets and Google Apps Script

## 🚀 Step-by-Step Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Athira Waitlist"
4. In the first row, add these headers:
   - A1: `First Name`
   - B1: `Last Name`
   - C1: `Email`
   - D1: `Description`
   - E1: `Timestamp`

### Step 2: Get Google Sheet ID

1. Look at your Google Sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
2. Copy the SHEET_ID_HERE part (it's a long string of characters)
3. Save this ID - you'll need it in Step 3

### Step 3: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default `myFunction()` code
4. Copy and paste the entire contents of `google-apps-script-example.js` from this project
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID from Step 2
6. Save the project (Ctrl/Cmd + S)
7. Give your project a name like "Athira Waitlist API"

### Step 4: Deploy Google Apps Script

1. In the Apps Script editor, click "Deploy" → "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Fill in the settings:
   - **Description**: "Athira Waitlist API"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. **Important**: Copy the web app URL that appears (it looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)
6. Click "Done"

### Step 5: Test Google Apps Script (Optional)

1. In the Apps Script editor, click on the "testSubmission" function
2. Click the "Run" button (▷)
3. Check your Google Sheet - you should see a test entry with John Doe's information
4. If it works, delete the test row from your sheet

### Step 6: Update React App Configuration

1. Open the file `src/config/googleAppsScript.js` in your React project
2. Replace `YOUR_SCRIPT_ID_HERE` with your actual web app URL from Step 4
3. Save the file

### Step 7: Install and Run React App

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Step 8: Test the Integration

1. Open your browser to `http://localhost:3000`
2. Click "Register Interest"
3. Fill out the form with test data
4. Submit the form
5. Check your Google Sheet - you should see the new registration!

## 🔧 Troubleshooting

### Common Issues:

**❌ "Script function not found" error**
- Make sure you deployed the Apps Script as a web app, not just saved it

**❌ CORS errors in browser**
- Ensure your Apps Script deployment has "Who has access" set to "Anyone"
- Make sure you're using the correct web app URL (ends with `/exec`)

**❌ Form submits but no data in Google Sheet**
- Check the Google Apps Script logs: Go to Apps Script → Executions tab
- Verify the SPREADSHEET_ID in your Apps Script code
- Make sure the sheet name matches (default is "Sheet1")

**❌ "Access denied" errors**
- Re-deploy your Apps Script with "Execute as: Me"
- Make sure you authorized the script when first running it

### Testing the API Directly:

You can test your Google Apps Script directly using curl:

```bash
curl -X POST "YOUR_WEB_APP_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","description":"Testing the API"}'
```

## 📊 Data Structure

Each form submission creates a new row in your Google Sheet with:
- **First Name**: User's first name
- **Last Name**: User's last name  
- **Email**: User's email address
- **Description**: Optional learning description
- **Timestamp**: When the form was submitted

## 🔒 Security Notes

- The Google Apps Script runs with your permissions
- Anyone can submit to your form (which is intended for a public waitlist)
- Consider adding rate limiting if needed
- Email addresses are not automatically validated server-side beyond basic format checking

## 🎉 You're Done!

Your Athira landing page is now fully integrated with Google Sheets! Every form submission will be automatically saved to your spreadsheet.

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify each step was completed correctly
3. Check the browser console and Google Apps Script execution logs for error messages
