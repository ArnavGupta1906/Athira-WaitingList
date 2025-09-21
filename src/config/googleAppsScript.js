// Google Apps Script Configuration
// 
// IMPORTANT: The current URL is a library URL and will not work for form submissions.
// 
// TO FIX THE "Failed to fetch" ERROR:
// 1. Go to https://script.google.com
// 2. Create a new Google Apps Script project
// 3. Add the Google Apps Script code (see google-apps-script-example.js in project root)
// 4. Deploy the script as a web app:
//    - Click "Deploy" > "New deployment"
//    - Choose "Web app" as the type
//    - Set execute as "Me" and access to "Anyone"
//    - Click "Deploy" and copy the web app URL
// 5. Replace the WEB_APP_URL below with your actual deployment URL
// 
// Correct URL format: https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
// Current URL is: https://script.google.com/macros/library/... (LIBRARY URL - WRONG!)

export const GOOGLE_APPS_SCRIPT_CONFIG = {
  // REPLACE THIS with your actual Google Apps Script Web App URL from deployment
  WEB_APP_URL: 'https://script.google.com/macros/library/d/1Wn1bFNJbODXI9-BMnQV3_UxJsLGSDMSOC5m0n_SaWNPwOS4cU1N-eIAx/3',
  
  // Optional: Add other configuration options
  TIMEOUT: 10000, // 10 seconds timeout
  RETRY_ATTEMPTS: 3,
}

// Export the URL for easy access
export const GOOGLE_APPS_SCRIPT_URL = GOOGLE_APPS_SCRIPT_CONFIG.WEB_APP_URL
