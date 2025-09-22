// Google Apps Script Configuration
// 
// ⚠️  IMPORTANT: The current URL is a library URL and will not work for form submissions.
// 
// 🔧 TO FIX THE "Failed to fetch" ERROR:
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
// ✅ Correct URL format: https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
// ❌ Current URL is: https://script.google.com/macros/library/... (LIBRARY URL - WRONG!)

export const GOOGLE_APPS_SCRIPT_CONFIG = {
  // 🔧 REPLACE THIS wnpith your actual Google Apps Script Web App URL from deployment
  // This should be a URL that ends with /exec, not /library/...
  WEB_APP_URL: process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbz2jKRAGh2VUfSVRrTZla-nOI5KTD-5T2VCn5qn5Mui4ta9s-lk2Ucy6x8JytMgKhlf/exec',
  
  // Optional: Add other configuration options
  TIMEOUT: 10000, // 10 seconds timeout
  RETRY_ATTEMPTS: 3,
}

// Export the URL for easy access
export const GOOGLE_APPS_SCRIPT_URL = GOOGLE_APPS_SCRIPT_CONFIG.WEB_APP_URL

// Helper function to check if URL is properly configured
export const isGoogleAppsScriptConfigured = () => {
  const url = GOOGLE_APPS_SCRIPT_URL
  return url && 
         !url.includes('library') && 
         url.includes('script.google.com/macros/s/') && 
         url.endsWith('/exec')
}

// Log configuration status
console.log('🔧 Google Apps Script Configuration:')
console.log('📋 URL:', GOOGLE_APPS_SCRIPT_URL)
console.log('✅ Properly configured:', isGoogleAppsScriptConfigured())
console.log('🔍 URL Analysis:')
console.log('  - Contains /library/:', GOOGLE_APPS_SCRIPT_URL.includes('library'))
console.log('  - Contains /macros/s/:', GOOGLE_APPS_SCRIPT_URL.includes('script.google.com/macros/s/'))
console.log('  - Ends with /exec:', GOOGLE_APPS_SCRIPT_URL.endsWith('/exec'))
if (!isGoogleAppsScriptConfigured()) {
  console.warn('⚠️  Google Apps Script is NOT properly configured!')
  console.warn('📖 Please follow the setup guide to deploy a proper web app.')
}
