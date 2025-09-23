/**
 * Integration Configuration
 * 
 * Choose your preferred integration method here.
 * Just change the INTEGRATION_METHOD and uncomment the corresponding import.
 */

// Choose your integration method:
// 'formspree' - Easiest, works instantly (recommended)
// 'sheets-api' - Direct Google Sheets API
// 'apps-script' - Original Google Apps Script method
export const INTEGRATION_METHOD = 'formspree'; // Change this to switch methods

// Configuration URLs/Keys
export const INTEGRATION_CONFIG = {
  formspree: {
    url: process.env.REACT_APP_FORMSPREE_URL || 'YOUR_FORMSPREE_URL_HERE',
    name: 'Formspree'
  },
  'sheets-api': {
    apiKey: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY,
    spreadsheetId: '1VtlI8oMFTM8Rd31Uz3j-MkGZejZIynCHT82R8CTjGZw',
    name: 'Google Sheets API'
  },
  'apps-script': {
    url: process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzoZ7KUWg_jDRVk1AbiDc3C395AbcF--0UQDNbrI2OQTBcbKb3HkRWcFPH11Dg20zLB2A/exec',
    name: 'Google Apps Script'
  }
};

// Get current config
export const getCurrentConfig = () => INTEGRATION_CONFIG[INTEGRATION_METHOD];

// Check if current method is configured
export const isConfigured = () => {
  const config = getCurrentConfig();
  
  switch(INTEGRATION_METHOD) {
    case 'formspree':
      return config.url && !config.url.includes('YOUR_FORMSPREE_URL_HERE');
    case 'sheets-api':
      return config.apiKey && config.spreadsheetId;
    case 'apps-script':
      return config.url && config.url.startsWith('https://script.google.com');
    default:
      return false;
  }
};

console.log(`🔧 Integration Method: ${getCurrentConfig().name}`);
console.log(`✅ Configured: ${isConfigured()}`);
if (!isConfigured()) {
  console.warn(`⚠️ ${getCurrentConfig().name} is not properly configured!`);
}
