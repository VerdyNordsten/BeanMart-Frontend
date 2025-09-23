// Test script to verify API integration
// Run with: node test-api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testAPI() {
  console.log('Testing API endpoints...');
  
  try {
    // Test categories endpoint
    console.log('\nTesting categories endpoint...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
    console.log('Categories endpoint working. Status:', categoriesResponse.status);
    console.log('Categories count:', categoriesResponse.data.data?.length || 0);
    
    // Test products endpoint
    console.log('\nTesting products endpoint...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log('Products endpoint working. Status:', productsResponse.status);
    console.log('Products count:', productsResponse.data.data?.length || 0);
    
    console.log('\nAll tests passed!');
    
  } catch (error) {
    if (error.response) {
      console.log('Request failed with status:', error.response.status);
      console.log('Error message:', error.response.data.message || error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testAPI();