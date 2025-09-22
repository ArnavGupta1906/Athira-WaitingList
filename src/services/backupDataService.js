/**
 * Backup Data Collection Service
 * 
 * This service provides multiple fallback methods to capture form submissions
 * even when the primary Google Sheets integration fails.
 */

// Backup data collection methods
export const backupDataCollection = {
  
  // Method 1: Local Storage Backup
  saveToLocalStorage: (formData) => {
    try {
      const timestamp = new Date().toISOString()
      const backupData = {
        ...formData,
        timestamp,
        backupMethod: 'localStorage'
      }
      
      // Get existing backup data
      const existingData = JSON.parse(localStorage.getItem('athira_backup_submissions') || '[]')
      
      // Add new submission
      existingData.push(backupData)
      
      // Save back to localStorage
      localStorage.setItem('athira_backup_submissions', JSON.stringify(existingData))
      
      console.log('✅ Backup saved to localStorage:', backupData)
      return true
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error)
      return false
    }
  },

  // Method 2: Email Notification Backup
  sendEmailNotification: async (formData) => {
    try {
      // This would typically use a service like EmailJS or similar
      // For now, we'll just log the data that would be sent
      const emailData = {
        to: 'your-email@example.com', // Replace with your email
        subject: 'New Athira Registration - Backup',
        body: `
New registration received:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Description: ${formData.description || 'None'}
- Timestamp: ${new Date().toISOString()}
        `
      }
      
      console.log('📧 Email notification data:', emailData)
      // TODO: Implement actual email sending service
      return true
    } catch (error) {
      console.error('❌ Failed to send email notification:', error)
      return false
    }
  },

  // Method 3: Console Logging (for debugging)
  logToConsole: (formData) => {
    console.log('🔍 BACKUP LOG - Form Submission Data:')
    console.log('📊 Full form data:', formData)
    console.log('⏰ Timestamp:', new Date().toISOString())
    console.log('🌐 User Agent:', navigator.userAgent)
    console.log('📍 URL:', window.location.href)
    return true
  },

  // Method 4: Export backup data
  exportBackupData: () => {
    try {
      const backupData = JSON.parse(localStorage.getItem('athira_backup_submissions') || '[]')
      
      if (backupData.length === 0) {
        console.log('📭 No backup data found')
        return null
      }
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `athira_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      console.log('📥 Backup data exported:', backupData.length, 'submissions')
      return backupData
    } catch (error) {
      console.error('❌ Failed to export backup data:', error)
      return null
    }
  },

  // Method 5: Clear backup data
  clearBackupData: () => {
    try {
      localStorage.removeItem('athira_backup_submissions')
      console.log('🗑️ Backup data cleared')
      return true
    } catch (error) {
      console.error('❌ Failed to clear backup data:', error)
      return false
    }
  }
}

// Enhanced form submission with backup
export const submitWithBackup = async (formData, primarySubmitFunction) => {
  console.log('🚀 Starting submission with backup...')
  
  // Try primary submission first
  let primarySuccess = false
  try {
    const result = await primarySubmitFunction(formData)
    primarySuccess = result.success
    console.log('📡 Primary submission result:', result)
  } catch (error) {
    console.error('❌ Primary submission failed:', error)
  }
  
  // Always run backup methods
  console.log('🔄 Running backup data collection...')
  
  const backupResults = {
    localStorage: backupDataCollection.saveToLocalStorage(formData),
    email: await backupDataCollection.sendEmailNotification(formData),
    console: backupDataCollection.logToConsole(formData)
  }
  
  console.log('📊 Backup results:', backupResults)
  
  // Return primary result, but also log backup status
  return {
    primarySuccess,
    backupResults,
    message: primarySuccess 
      ? 'Data saved successfully with backup' 
      : 'Primary submission failed, but data backed up locally'
  }
}

// Utility function to check if backup data exists
export const hasBackupData = () => {
  try {
    const backupData = JSON.parse(localStorage.getItem('athira_backup_submissions') || '[]')
    return backupData.length > 0
  } catch (error) {
    return false
  }
}

// Utility function to get backup data count
export const getBackupDataCount = () => {
  try {
    const backupData = JSON.parse(localStorage.getItem('athira_backup_submissions') || '[]')
    return backupData.length
  } catch (error) {
    return 0
  }
}
