import React, { useState } from 'react'
import { submitToGoogleSheets, validateForm as validateFormData } from '../services/simpleFormService'

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
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
        backgroundImage: 'url(/hero%20-%20bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center w-full">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <img 
                src="/icon-success.png" 
                alt="Success Icon" 
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* You're in! Header */}
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
              You're in!
            </h1>
            
            <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto">
              You're all set! Thank you for joining our community of learners.<br />
              We're excited to have you on board for your AI-powered learning journey.
            </p>

            {/* Feature Cards Container */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl mb-12 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Personalized Learning Card */}
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Personalized Learning
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    AI-curated paths that adapt to you, unique pace and learning style
                  </p>
                </div>

                {/* Instant Feedback Card */}
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Instant Feedback
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Real time explanations to accelerate your understanding
                  </p>
                </div>

                {/* 24/7 AI Support Card */}
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    24/7 AI Support
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Always available tutoring whenever you need help
                  </p>
                </div>
              </div>
            </div>

            {/* Updates Text */}
            <p className="text-white/90 text-sm mb-8 max-w-2xl mx-auto">
              We'll send you updates about Athira's launch and exclusive early access opportunities.
            </p>

            {/* Back to Home Button */}
            <button
              onClick={handleBackToForm}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer Section with Large Athira Branding */}
        <footer className="relative z-10 pb-8 pt-16" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(37, 99, 235, 0.3) 50%, rgba(29, 78, 216, 0.5) 100%)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Footer Links */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
              <div className="mb-4 sm:mb-0">
                <p className="text-white/90 text-lg sm:text-xl font-normal mb-1">Connect with tutors in seconds</p>
                <p className="text-white/90 text-lg sm:text-xl font-normal">& learn smarter with AI.</p>
                <p className="text-white/60 text-sm mt-6">&copy; Athira, Inc. 2025</p>
              </div>
              <div className="flex flex-col items-start space-y-2 mb-4 sm:mb-0 text-white/90">
                <a 
                  href="/privacy-policy.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-base"
                >
                  Privacy Policy
                </a>
              <a 
                href="mailto:contact@athira.tech?subject=Inquiry%20from%20Athira%20Waitlist"
                className="hover:text-white transition-colors text-base"
              >
                Contact Us
              </a>
            </div>
            <div className="flex flex-col space-y-3">
              <a href="https://www.linkedin.com/company/109055380/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/athira.tech/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/athiraonx" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Large Athira Branding */}
          <div className="w-full px-4">
            <h2 className="text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-black text-white leading-none text-center uppercase" style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.02em'
            }}>
              Athira
            </h2>
          </div>
        </div>
      </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
      backgroundImage: 'url(/hero%20-%20bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      {/* Main Content - Registration Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="w-full max-w-3xl mx-auto">
          {/* Header Section with Logo and Title */}
          <div className="text-center mb-12">
            {/* Logo Icon */}
            <div className="flex justify-center mb-6">
              <img 
                src="/Athira logo.png" 
                alt="Athira Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Main Headline and Tagline */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white">
                Welcome To Athira
              </h1>
              <p className="text-white/90 text-base italic">
                Because "due tomorrow" means "help tonight"
              </p>
            </div>
          </div>

          {/* Form - NO white container, directly on blue gradient */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-base font-normal text-white mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-base ${
                    errors.firstName ? 'border-2 border-red-400 bg-red-50' : 'border-0 bg-white'
                  }`}
                  style={{ height: '56px' }}
                  placeholder="e.g, John"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-200">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-base font-normal text-white mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-base ${
                    errors.lastName ? 'border-2 border-red-400 bg-red-50' : 'border-0 bg-white'
                  }`}
                  style={{ height: '56px' }}
                  placeholder="e.g, Doe"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-200">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-normal text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-base ${
                  errors.email ? 'border-2 border-red-400 bg-red-50' : 'border-0 bg-white'
                }`}
                style={{ height: '56px' }}
                placeholder="e.g, johndoe@mail.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-200">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-base font-normal text-white mb-2">
                Goal (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-6 py-4 rounded-3xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 text-base border-0 bg-white"
                placeholder="Tell us what you want to achieve"
              />
            </div>

            {/* Display submission error if any */}
            {submitError && (
              <div className="bg-red-100/90 border-2 border-red-400 rounded-3xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-full font-semibold focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 text-lg mt-6"
              style={{
                height: '60px',
                boxShadow: '0 8px 32px rgba(37, 99, 235, 0.4)'
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Join The Waitlist'
              )}
            </button>
          </form>
          
          {/* Privacy Notice */}
          <p className="mt-6 text-sm text-center leading-relaxed" style={{ color: '#4A5568' }}>
            We'll use your email to send updates about Athira and related news.<br />
            You may unsubscribe at any time via the link in our emails.
          </p>
        </div>
      </main>

      {/* Footer Section with Large Athira Branding */}
      <footer className="relative z-10 pb-8 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Footer Links */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-white/90 text-lg sm:text-xl font-normal mb-1">Connect with tutors in seconds</h1>
              <h1 className="text-white/90 text-lg sm:text-xl font-normal">& learn smarter with AI.</h1>
              <p className="text-white/60 text-sm mt-6">&copy; Athira, Inc. 2025</p>
            </div>
            <div className="flex flex-col items-start space-y-2 mb-4 sm:mb-0 text-white/90">
              <a 
                href="/privacy-policy.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-base"
              >
                Privacy Policy
              </a>
              <a 
                href="mailto:contact@athira.tech?subject=Inquiry%20from%20Athira%20Waitlist"
                className="hover:text-white transition-colors text-base"
              >
                Contact Us
              </a>
            </div>
            <div className="flex flex-col space-y-3">
              <a href="https://www.linkedin.com/company/109055380/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/athira.tech/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://x.com/athiraonx" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Large Athira Branding */}
          <div className="w-full px-4">
            <h2 className="text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[20rem] font-black text-white leading-none text-center uppercase" style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.02em'
            }}>
              Athira
            </h2>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
