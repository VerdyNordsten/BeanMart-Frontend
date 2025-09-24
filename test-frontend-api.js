// Test frontend API connection
import axios from 'axios';

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API connection...');
    
    // Test 1: Test without authentication
    console.log('\n1. Testing API without authentication...');
    try {
      const response1 = await axios.get('http://localhost:3000/api/v1/products');
      console.log('✅ API accessible without auth');
      console.log('Status:', response1.status);
      console.log('Success:', response1.data.success);
      console.log('Data length:', response1.data.data?.length || 0);
    } catch (error) {
      console.log('❌ API requires authentication');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }
    
    // Test 2: Test with fake token
    console.log('\n2. Testing API with fake token...');
    try {
      const response2 = await axios.get('http://localhost:3000/api/v1/products', {
        headers: {
          'Authorization': 'Bearer fake-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ API works with fake token');
    } catch (error) {
      console.log('❌ API rejects fake token');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }
    
    console.log('\n🎉 Frontend API tests completed!');
    
  } catch (error) {
    console.error('❌ Frontend API test failed:');
    console.error('Error:', error.message);
  }
}

testFrontendAPI();
