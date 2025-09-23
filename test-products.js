// Test script to check product data
// Run with: node test-products.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testProducts() {
  console.log('Testing products endpoint...');
  
  try {
    // Test products endpoint
    console.log('\nTesting products endpoint...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log('Products endpoint working. Status:', productsResponse.status);
    console.log('Response data:', JSON.stringify(productsResponse.data, null, 2));
    
    // Also check if there are any products
    if (productsResponse.data && productsResponse.data.data) {
      console.log('Products count:', productsResponse.data.data.length);
      if (productsResponse.data.data.length > 0) {
        console.log('First product:', JSON.stringify(productsResponse.data.data[0], null, 2));
      }
    } else {
      console.log('No products data found in response');
    }
    
  } catch (error) {
    if (error.response) {
      console.log('Request failed with status:', error.response.status);
      console.log('Error message:', error.response.data.message || error.response.data);
      console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testProducts();