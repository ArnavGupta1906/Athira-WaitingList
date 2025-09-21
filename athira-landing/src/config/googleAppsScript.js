// Google Apps Script Configuration
// 
// INSTRUCTIONS:
// 1. Deploy your Google Apps Script as a web app
// 2. Copy the web app URL from the deployment
// 3. Replace the placeholder URL below with your actual Google Apps Script web app URL
// 
// Example URL format: https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec

export const GOOGLE_APPS_SCRIPT_CONFIG = {
  // Replace this with your actual Google Apps Script Web App URL
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbw8-owJqmo7-uFHF9WeREvqG19G7UcnL1r4Xkh0dDKh4IAjld8F5gqV-n8NMlKur8gR/exec',
  
  // Optional: Add other configuration options
  TIMEOUT: 10000, // 10 seconds timeout
  RETRY_ATTEMPTS: 3,
}

// Export the URL for easy access
export const GOOGLE_APPS_SCRIPT_URL = GOOGLE_APPS_SCRIPT_CONFIG.WEB_APP_URL
