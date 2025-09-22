/**
 * Test script to verify Google Apps Script configuration
 * Run this with: node test-configuration.js
 */

// Import the configuration
const { GOOGLE_APPS_SCRIPT_URL, isGoogleAppsScriptConfigured } = require('./src/config/googleAppsScript.js');

console.log('🔧 Configuration Test Results:');
console.log('================================');
console.log('📋 Google Apps Script URL:', GOOGLE_APPS_SCRIPT_URL);
console.log('✅ Properly configured:', isGoogleAppsScriptConfigured());
console.log('');

if (!isGoogleAppsScriptConfigured()) {
  console.log('❌ ISSUES FOUND:');
  console.log('1. URL is not a proper web app URL');
  console.log('2. Form submissions will not be saved to Google Sheets');
  console.log('3. You need to deploy a Google Apps Script web app');
  console.log('');
  console.log('🔧 TO FIX:');
  console.log('1. Follow the setup guide in SETUP_GUIDE.md');
  console.log('2. Deploy a Google Apps Script web app');
  console.log('3. Update the URL in src/config/googleAppsScript.js');
} else {
  console.log('✅ Configuration looks good!');
  console.log('Form submissions should work properly.');
}
