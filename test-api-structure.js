// Test script to check detailed product data and API structure
// Run with: node test-api-structure.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testApiStructure() {
  console.log('Testing API structure and data...');
  
  try {
    // Test categories endpoint first
    console.log('\n1. Testing categories endpoint...');
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
      console.log('Categories endpoint status:', categoriesResponse.status);
      console.log('Categories data structure:', JSON.stringify(categoriesResponse.data, null, 2));
    } catch (catError) {
      console.log('Categories endpoint error:', catError.response?.status, catError.response?.data?.message || catError.message);
    }
    
    // Test products endpoint with different parameters
    console.log('\n2. Testing products endpoint with active filter...');
    try {
      const activeProductsResponse = await axios.get(`${API_BASE_URL}/products/active`);
      console.log('Active products endpoint status:', activeProductsResponse.status);
      console.log('Active products data structure:', JSON.stringify(activeProductsResponse.data, null, 2));
    } catch (activeError) {
      console.log('Active products endpoint error:', activeError.response?.status, activeError.response?.data?.message || activeError.message);
    }
    
    // Test basic products endpoint
    console.log('\n3. Testing basic products endpoint...');
    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products`);
      console.log('Products endpoint status:', productsResponse.status);
      console.log('Products data structure:', JSON.stringify(productsResponse.data, null, 2));
      
      // Check the structure of the response
      if (productsResponse.data) {
        console.log('\nResponse structure analysis:');
        console.log('- Has success property:', 'success' in productsResponse.data);
        console.log('- Has data property:', 'data' in productsResponse.data);
        console.log('- Has products property:', 'products' in productsResponse.data);
        
        if (productsResponse.data.data) {
          console.log('- Data array length:', Array.isArray(productsResponse.data.data) ? productsResponse.data.data.length : 'Not an array');
          if (Array.isArray(productsResponse.data.data) && productsResponse.data.data.length > 0) {
            console.log('- First item structure:', Object.keys(productsResponse.data.data[0]));
          }
        }
        
        if (productsResponse.data.products) {
          console.log('- Products array length:', Array.isArray(productsResponse.data.products) ? productsResponse.data.products.length : 'Not an array');
          if (Array.isArray(productsResponse.data.products) && productsResponse.data.products.length > 0) {
            console.log('- First product structure:', Object.keys(productsResponse.data.products[0]));
          }
        }
      }
    } catch (prodError) {
      console.log('Products endpoint error:', prodError.response?.status, prodError.response?.data?.message || prodError.message);
      if (prodError.response?.data) {
        console.log('Full error data:', JSON.stringify(prodError.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.log('General error:', error.message);
  }
}

testApiStructure();