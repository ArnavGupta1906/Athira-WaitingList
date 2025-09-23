import React, { useState } from 'react'
import { submitToFormspree as submitToGoogleSheets, validateForm as validateFormData } from '../services/formspreeService'

const LandingPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📝 Form submission started')
    console.log('📊 Form data:', formData)
    
    // Validate form using the service function
    const validationErrors = validateFormData(formData)
    setErrors(validationErrors)
    
    // If there are validation errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ Form validation failed:', validationErrors)
      return
    }

    console.log('✅ Form validation passed, submitting...')
    setIsSubmitting(true)
    setSubmitError('')

    try {
      console.log('🚀 Calling submitToGoogleSheets...')
      const result = await submitToGoogleSheets(formData)
      console.log('📡 Submission result:', result)
      
      if (result.success) {
        console.log('🎉 Submission successful! Showing welcome page.')
        setShowWelcome(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          description: ''
        })
      } else {
        console.error('❌ Submission failed:', result.error)
        setSubmitError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('💥 Submission error:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      console.log('🏁 Form submission process completed')
      setIsSubmitting(false)
    }
  }

  const handleBackToForm = () => {
    setShowWelcome(false)
  }

  // Show welcome page after successful registration
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#0C0E1A] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Welcome Message */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Welcome to
                <span className="block text-transparent bg-clip-text" style={{background: 'linear-gradient(90deg, #FF4C8B, #FF7C4C, #FFD84C)', WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>
                  Athira
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Thank you for registering your interest! We're excited to have you join our community of learners. 
                We'll be in touch soon with updates about your AI-powered learning journey.
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-4">Benefits</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-green-400 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-300">Personalized learning paths that adapt to your unique pace and learning style</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-green-400 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-300">Instant feedback and explanations to accelerate your understanding</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-green-400 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-300">24/7 AI tutoring support whenever you need help with your studies</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBackToForm}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200 border border-white/30"
            >
              ← Back to Home
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm" style={{color: '#AAB0C5'}}>
            <p>&copy; Athira, Inc. 2025</p>
            <a 
              href="/privacy-policy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
              style={{color: '#AAB0C5'}}
            >
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0E1A] flex flex-col">
      {/* Main Content - Registration Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {/* Logo Section */}
            <div className="mb-6">
              <div className="flex justify-center mb-3">
                <img 
                  src="/IconOnly.png" 
                  alt="Athira Logo" 
                  className="w-24 h-24"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 76, 139, 0.3)) drop-shadow(0 0 40px rgba(255, 124, 76, 0.2))'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              
              {/* Full Logo Image */}
              <div className="flex justify-center mb-4">
                <img 
                  src="/FullLogo.png" 
                  alt="Athira Full Logo" 
                  className="h-20 w-auto max-w-sm mx-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>

            {/* Main Headline and Tagline */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4" style={{color: '#F8D9E6'}}>
                Athira
              </h1>
              <p className="text-lg font-light italic" style={{color: '#C0C4D8'}}>
                Because "due tomorrow" means "help tonight"
              </p>
            </div>

          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400 ${
                        errors.firstName ? 'border-red-400 bg-red-500/20' : ''
                      }`}
                      style={{
                        backgroundColor: errors.firstName ? undefined : '#0C0E1A',
                        borderColor: errors.firstName ? undefined : '#C0C4D8'
                      }}
                      placeholder="First name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400 ${
                        errors.lastName ? 'border-red-400 bg-red-500/20' : ''
                      }`}
                      style={{
                        backgroundColor: errors.lastName ? undefined : '#0C0E1A',
                        borderColor: errors.lastName ? undefined : '#C0C4D8'
                      }}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-400 bg-red-500/20' : ''
                  }`}
                  style={{
                    backgroundColor: errors.email ? undefined : '#0C0E1A',
                    borderColor: errors.email ? undefined : '#C0C4D8'
                  }}
                  placeholder="Email address"
                />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Goals (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 resize-none text-white placeholder-gray-400"
                  style={{
                    backgroundColor: '#0C0E1A',
                    borderColor: '#C0C4D8'
                  }}
                  placeholder="Goals (optional)"
                />
                </div>

                {/* Display submission error if any */}
                {submitError && (
                  <div className="bg-red-500/20 border border-red-400 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-200">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-3 px-6 rounded-lg font-semibold focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{background: 'linear-gradient(90deg, #FF4C8B, #FF7C4C, #FFD84C)'}}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Register Interest'
                  )}
                </button>
              </form>
              
              {/* Privacy Notice */}
              <p className="mt-6 text-sm text-center" style={{color: '#AAB0C5'}}>
                We'll use your email to send updates about Athira and related news. You may unsubscribe at any time via the link in our emails.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm" style={{color: '#AAB0C5'}}>
          <p>&copy; Athira, Inc. 2025</p>
          <a 
            href="/privacy-policy.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
            style={{color: '#AAB0C5'}}
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
