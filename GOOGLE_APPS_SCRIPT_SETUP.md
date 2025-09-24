# Google Apps Script Setup for Athira Waitlist

## 🎯 Overview
This setup uses Google Apps Script to directly save form submissions to your Google Sheet. It's reliable, unlimited, and requires no third-party services.

## 📋 Prerequisites
- Google account
- Access to the Google Sheet: https://docs.google.com/spreadsheets/d/1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw/edit?usp=sharing

## 🚀 Setup Steps

### Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project (Ctrl+S or Cmd+S)

### Step 2: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. **Copy the web app URL** - you'll need this for your React app

### Step 3: Update React App
1. Open your `.env` file
2. Replace `YOUR_SCRIPT_ID` with the actual script ID from your web app URL
3. The URL should look like: `https://script.google.com/macros/s/ACTUAL_SCRIPT_ID/exec`

### Step 4: Test the Integration
1. Start your React app: `npm start`
2. Fill out the form with test data
3. Submit the form
4. Check your Google Sheet for the new row

## 📊 Data Structure
The script will create these columns in your Google Sheet:
- First Name
- Last Name  
- Email
- Description
- Timestamp

## 🔧 Troubleshooting

### If submissions don't appear in the sheet:
1. Check that the script is deployed as a web app
2. Verify the web app URL is correct in your `.env` file
3. Make sure "Anyone" has access to the web app
4. Check the Google Apps Script execution logs for errors

### If you get CORS errors:
- The Google Apps Script handles CORS automatically
- Make sure you're using the correct web app URL (not the script editor URL)

## ✅ Success Indicators
- Form submissions appear in your Google Sheet
- No CORS errors in browser console
- Success message shows after form submission
