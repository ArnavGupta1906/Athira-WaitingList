# Complete Google Sheets Integration Setup Guide

## Problem Identified
Your form data isn't reaching Google Sheets because the Google Apps Script hasn't been properly configured and deployed. Here's the complete fix:

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "SnapTutor Waitlist"
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1abc123def456ghi789jkl/edit
                                    ^^^^^^^^^^^^^^^^^^^^
                                    This is your ID
   ```

## Step 2: Set Up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the FIXED script from `FIXED_GOOGLE_SCRIPT.gs`
5. **CRITICAL**: Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID on line 9

## Step 3: Deploy the Script
1. Click "Deploy" → "New deployment"
2. Click the gear icon next to "Type"
3. Select "Web app"
4. Set these EXACT settings:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click "Deploy"
6. **Grant permissions** when prompted (this is normal and required)
7. Copy the Web App URL (it looks like: `https://script.google.com/macros/s/ABC123.../exec`)

## Step 4: Test the Script (IMPORTANT!)
1. In the Apps Script editor, click "Select function" dropdown
2. Choose `testSetup`
3. Click "Run"
4. Check the execution log - you should see "SUCCESS" messages
5. Check your Google Sheet - it should have a test entry

## Step 5: Update Your React App
1. Open your `.env` file
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual Web App URL:
   ```
   REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec
   ```
3. Save the file
4. Restart your React app: `npm start`

## Step 6: Test End-to-End
1. Fill out your form
2. Submit it
3. Check your Google Sheet - the data should appear

## Troubleshooting

### If you see "Execution started" and "Execution completed" with no other logs:
- Your script is running but has no console.log output
- This usually means the script isn't receiving POST data
- Check that your Web App URL is correct in the `.env` file

### If you get permission errors:
- Make sure you deployed with "Execute as: Me" and "Who has access: Anyone"
- Try redeploying the script

### If the sheet stays empty:
1. Run the `testSetup()` function in Apps Script
2. Check the execution logs for error messages
3. Make sure the Spreadsheet ID is correct

### If you still have issues:
1. Run `simpleTest()` function in Apps Script
2. This will directly add a row to test if basic functionality works

## Quick Test Commands for Apps Script

Run these functions one by one in the Apps Script editor:

1. `testSetup()` - Tests everything
2. `simpleTest()` - Simple row addition
3. `checkSheet()` - Validates sheet configuration

The logs will tell you exactly what's wrong.