#!/usr/bin/env node

// Test script to verify Formspree integration
const fetch = require('node-fetch');

const FORMSPREE_URL = 'https://formspree.io/f/myzngqlz';

async function testFormspreeSubmission() {
  console.log('🧪 Testing Formspree Integration\n');
  
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    description: 'Testing Formspree integration',
    fullName: 'Test User',
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending test data to Formspree...');
  console.log('📊 Data:', testData);
  console.log('🔗 URL:', FORMSPREE_URL);
  
  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('\n📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('📄 Response Body:', result);
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Formspree integration is working!');
      console.log('🎉 Check your Formspree dashboard for the submission');
      return true;
    } else {
      console.log('\n❌ FAILED! Status:', response.status);
      return false;
    }
    
  } catch (error) {
    console.error('\n💥 ERROR:', error.message);
    return false;
  }
}

async function runTest() {
  console.log('🚀 Starting Formspree Integration Test\n');
  
  const success = await testFormspreeSubmission();
  
  console.log('\n📊 Test Result:');
  if (success) {
    console.log('🎉 Formspree integration is working perfectly!');
    console.log('✅ You can now use your React app with confidence');
  } else {
    console.log('⚠️  Formspree integration needs attention');
    console.log('📖 Check the Formspree URL and try again');
  }
}

runTest().catch(console.error);
