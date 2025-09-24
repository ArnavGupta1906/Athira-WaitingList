import React, { useState, useEffect } from 'react'
import { 
  backupDataCollection, 
  getBackupDataCount 
} from '../services/backupDataService'

const DataRecoveryTool = () => {
  const [backupData, setBackupData] = useState([])
  const [showTool, setShowTool] = useState(false)
  const [dataCount, setDataCount] = useState(0)

  useEffect(() => {
    // Check for backup data on component mount
    const count = getBackupDataCount()
    setDataCount(count)
    
    if (count > 0) {
      const data = JSON.parse(localStorage.getItem('athira_backup_submissions') || '[]')
      setBackupData(data)
    }
  }, [])

  const handleExportData = () => {
    const exported = backupDataCollection.exportBackupData()
    if (exported) {
      alert(`✅ Exported ${exported.length} submissions to JSON file!`)
    } else {
      alert('❌ No backup data found to export')
    }
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all backup data? This cannot be undone.')) {
      backupDataCollection.clearBackupData()
      setBackupData([])
      setDataCount(0)
      alert('🗑️ Backup data cleared')
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!showTool) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {dataCount > 0 && (
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
            ⚠️ {dataCount} backup submissions found!
          </div>
        )}
        <button
          onClick={() => setShowTool(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          🔧 Data Recovery Tool
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🔧 Data Recovery Tool</h2>
          <button
            onClick={() => setShowTool(false)}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {dataCount === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-4">
                📭 No backup data found
              </div>
              <p className="text-gray-600">
                This means either no submissions were made, or the backup system wasn't active.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <strong>✅ Found {dataCount} backup submissions!</strong>
                  <p className="text-sm mt-1">
                    These are form submissions that were backed up locally when the Google Sheets integration failed.
                  </p>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleExportData}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    📥 Export to JSON
                  </button>
                  <button
                    onClick={handleClearData}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    🗑️ Clear Backup Data
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Backup Submissions:</h3>
                {backupData.map((submission, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong>Name:</strong> {submission.firstName} {submission.lastName}
                      </div>
                      <div>
                        <strong>Email:</strong> {submission.email}
                      </div>
                      <div className="md:col-span-2">
                        <strong>Description:</strong> {submission.description || 'None'}
                      </div>
                      <div>
                        <strong>Submitted:</strong> {formatDate(submission.timestamp)}
                      </div>
                      <div>
                        <strong>Backup Method:</strong> {submission.backupMethod || 'Unknown'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            <strong>How to use this data:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Export the data using the "Export to JSON" button</li>
              <li>Open the JSON file in a text editor or spreadsheet application</li>
              <li>Manually add the data to your Google Sheet</li>
              <li>Or use the data to re-contact users for re-registration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataRecoveryTool
