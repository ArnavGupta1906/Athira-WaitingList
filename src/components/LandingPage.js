import React, { useState } from 'react'
import { submitToGoogleSheets, validateForm as validateFormData } from '../services/googleSheetsService'

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
    
    // Validate form using the service function
    const validationErrors = validateFormData(formData)
    setErrors(validationErrors)
    
    // If there are validation errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await submitToGoogleSheets(formData)
      
      if (result.success) {
        setShowWelcome(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          description: ''
        })
      } else {
        setSubmitError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToForm = () => {
    setShowWelcome(false)
  }

  // Show welcome page after successful registration
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
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
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 flex flex-col">
      {/* Main Content - Registration Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {/* Logo Section */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-yellow-400/20 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  {/* Athira Logo - Stylized A with gradient lines */}
                  <div className="w-16 h-16 mx-auto mb-2 relative">
                    {/* Multi-line gradient A logo */}
                    <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
                      {/* Left leg of A */}
                      <path d="M12 50 L20 20 L28 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 50 L22 20 L30 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 50 L24 20 L32 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Right leg of A */}
                      <path d="M52 50 L44 20 L36 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M48 50 L42 20 L34 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M44 50 L40 20 L32 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      {/* Top of A - curved meeting point */}
                      <path d="M32 20 Q36 12 40 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M32 20 Q34 12 36 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M32 20 Q35 12 38 20" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="25%" stopColor="#EC4899" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="75%" stopColor="#F97316" />
                          <stop offset="100%" stopColor="#EAB308" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400 font-medium tracking-wider">ATHIRA</div>
                </div>
              </div>
            </div>

            {/* Brand Name and Slogan */}
            <div className="mb-12">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4">
                Athira
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 font-light italic">
                Because "due tomorrow" means "help tonight"
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
                AI-powered microtutoring that adapts to your pace, 
                helping you master concepts through intelligent learning sessions.
              </p>
              
              <p className="text-lg text-gray-400">
                Ready to transform your learning experience? Register your interest below!
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 bg-white/10 text-white placeholder-gray-400 ${
                        errors.firstName ? 'border-red-400 bg-red-500/20' : 'border-white/30'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 bg-white/10 text-white placeholder-gray-400 ${
                        errors.lastName ? 'border-red-400 bg-red-500/20' : 'border-white/30'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 bg-white/10 text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-400 bg-red-500/20' : 'border-white/30'
                  }`}
                  placeholder="john.doe@example.com"
                />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                  Tell us about your learning
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 resize-none bg-white/10 text-white placeholder-gray-400"
                  placeholder="What subjects are you interested in? What are your learning goals?"
                />
                <p className="mt-1 text-sm text-gray-400">Optional - Help us understand your learning needs</p>
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
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-yellow-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
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
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Athira. Revolutionizing education through AI.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
