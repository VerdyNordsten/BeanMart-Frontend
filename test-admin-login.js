// Test script to verify admin login
// Save this as test-admin-login.js and run with: node test-admin-login.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';
const TEST_ADMIN_EMAIL = 'admin@beanmart.com';
const TEST_ADMIN_PASSWORD = 'admin123'; // Change this to the actual admin password

async function testAdminLogin() {
  console.log('Testing admin login...');
  
  try {
    // Try to login
    const loginResponse = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email: TEST_ADMIN_EMAIL,
      password: TEST_ADMIN_PASSWORD
    });
    
    console.log('Login successful!');
    console.log('Token:', loginResponse.data.token || loginResponse.data.accessToken);
    
    // Get profile
    const token = loginResponse.data.token || loginResponse.data.accessToken;
    const profileResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile:', profileResponse.data);
    
    // Check if user is admin
    const profile = profileResponse.data.data || profileResponse.data;
    if (profile.role === 'admin') {
      console.log('SUCCESS: Logged in as admin user!');
    } else {
      console.log('WARNING: Logged in as regular user, not admin');
    }
    
  } catch (error) {
    if (error.response) {
      console.log('Login failed with status:', error.response.status);
      console.log('Error message:', error.response.data.message || error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testAdminLogin();