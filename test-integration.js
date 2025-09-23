#!/usr/bin/env node

// Test script to verify Google Sheets integration
const fetch = require('node-fetch');

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoZ7KUWg_jDRVk1AbiDc3C395AbcF--0UQDNbrI2OQTBcbKb3HkRWcFPH11Dg20zLB2A/exec';

async function testHealthCheck() {
  console.log('🔍 Testing GET request (health check)...');
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'GET',
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('📄 Response body:', result);
    
    return response.ok;
  } catch (error) {
    console.error('❌ GET test failed:', error.message);
    return false;
  }
}

async function testPostRequest() {
  console.log('\n🔍 Testing POST request (form submission)...');
  try {
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      description: 'Testing the integration'
    };
    
    console.log('📤 Sending data:', testData);
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('📄 Response body:', result);
    
    if (response.ok) {
      const parsed = JSON.parse(result);
      console.log('✅ Parsed response:', parsed);
      return parsed.success;
    } else {
      console.error('❌ POST request failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ POST test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting Google Sheets Integration Tests\n');
  
  const healthCheckPassed = await testHealthCheck();
  const postTestPassed = await testPostRequest();
  
  console.log('\n📊 Test Results:');
  console.log('📋 Health Check (GET):', healthCheckPassed ? '✅ PASSED' : '❌ FAILED');
  console.log('📋 Form Submission (POST):', postTestPassed ? '✅ PASSED' : '❌ FAILED');
  
  if (healthCheckPassed && postTestPassed) {
    console.log('\n🎉 All tests passed! The integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the Apps Script deployment.');
  }
}

runTests().catch(console.error);
