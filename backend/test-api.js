// Quick API test script
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Get Products
    console.log('1. Testing GET /api/products...');
    const productsRes = await axios.get(`${API_URL}/products`);
    console.log(`   ✅ Products loaded: ${productsRes.data.length} products`);
    console.log(`   Products: ${productsRes.data.map(p => p.name).join(', ')}\n`);

    // Test 2: Get Product by ID
    if (productsRes.data.length > 0) {
      console.log('2. Testing GET /api/products/:id...');
      const productRes = await axios.get(`${API_URL}/products/${productsRes.data[0]._id}`);
      console.log(`   ✅ Product detail loaded: ${productRes.data.name}\n`);
    }

    // Test 3: Register User
    console.log('3. Testing POST /api/auth/register...');
    const testEmail = `test${Date.now()}@example.com`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: 'test123456'
    });
    console.log(`   ✅ User registered: ${registerRes.data.email}`);
    const token = registerRes.data.token;
    console.log(`   Token received: ${token.substring(0, 20)}...\n`);

    // Test 4: Get Wallet Balance
    console.log('4. Testing GET /api/portfolio/wallet (with auth)...');
    const walletRes = await axios.get(`${API_URL}/portfolio/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✅ Wallet balance: ₹${walletRes.data.walletBalance}\n`);

    // Test 5: Get Portfolio
    console.log('5. Testing GET /api/portfolio (with auth)...');
    const portfolioRes = await axios.get(`${API_URL}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✅ Portfolio loaded: ${portfolioRes.data.portfolio.length} holdings\n`);

    // Test 6: Get Watchlist
    console.log('6. Testing GET /api/watchlist (with auth)...');
    const watchlistRes = await axios.get(`${API_URL}/watchlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`   ✅ Watchlist loaded: ${watchlistRes.data.length} items\n`);

    console.log('🎉 All API tests passed!');
  } catch (error) {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error('❌ No response from server. Make sure the backend server is running on port 5000');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testAPI();

