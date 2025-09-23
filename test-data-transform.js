// Test script to verify data transformation
// Run with: node test-data-transform.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testDataTransform() {
  console.log('Testing data transformation...');
  
  try {
    // Get products from API
    const response = await axios.get(`${API_BASE_URL}/products`);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    // Transform data to match frontend expectations
    let products = [];
    if (response.data && Array.isArray(response.data.data)) {
      products = response.data.data.map((apiProduct) => ({
        id: apiProduct.id,
        slug: apiProduct.slug,
        name: apiProduct.name,
        short_description: apiProduct.short_description || '',
        long_description: apiProduct.long_description || '',
        price_min: parseFloat(apiProduct.base_price) || 0,
        price_max: parseFloat(apiProduct.base_compare_at_price) || parseFloat(apiProduct.base_price) || 0,
        origin: '', // Not available in current API
        roast_level: 'medium', // Default value
        tasting_notes: [], // Not available in current API
        processing_method: '', // Not available in current API
        altitude: '', // Not available in current API
        producer: '', // Not available in current API
        harvest_date: '', // Not available in current API
        is_featured: false, // Not available in current API
        is_active: apiProduct.is_active,
        category_id: '', // Not available in current API
        created_at: apiProduct.created_at,
        updated_at: apiProduct.updated_at,
        variants: [], // Not available in current API
        images: [{ 
          id: 'default', 
          url: '/api/placeholder/300/300', 
          alt_text: apiProduct.name, 
          is_primary: true, 
          sort_order: 0 
        }]
      }));
    }
    
    console.log('\nTransformed products:', JSON.stringify(products, null, 2));
    console.log('\nNumber of products:', products.length);
    
  } catch (error) {
    console.log('Error:', error.response?.status, error.response?.data?.message || error.message);
  }
}

testDataTransform();
