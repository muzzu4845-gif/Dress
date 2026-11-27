const BASE_URL = 'http://127.0.0.1:5000/api';

let adminToken = '';
let userToken = '';
let testProductId = '';
let testOrderId = '';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passed++;
  } else {
    console.error(`FAIL: ${testName}`);
    failed++;
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function runTests() {
  console.log('=== STYLEHUB AUTOMATED API INTEGRATION TESTS ===\n');

  try {
    const health = await request('/health');
    assert(health.status === 200 && health.data.success, 'GET /api/health');

    const productsRes = await request('/products');
    assert(productsRes.status === 200 && productsRes.data.products?.length > 0, 'GET /api/products returns items');
    testProductId = productsRes.data.products[0]._id;

    const singleProd = await request(`/products/${testProductId}`);
    assert(singleProd.status === 200 && singleProd.data._id === testProductId, `GET /api/products/${testProductId}`);

    const catRes = await request('/products/category/t-shirts');
    assert(catRes.status === 200 && catRes.data.products?.length > 0, 'GET /api/products/category/t-shirts');

    const searchRes = await request('/products/search?q=tee');
    assert(searchRes.status === 200 && searchRes.data.products?.length > 0, 'GET /api/products/search?q=tee');

    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@stylehub.com', password: 'AdminPassword123!' }
    });
    assert(adminLogin.status === 200 && adminLogin.data.token && adminLogin.data.role === 'admin', 'POST /api/auth/login as Admin');
    adminToken = adminLogin.data.token;

    const userLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'user@stylehub.com', password: 'UserPassword123!' }
    });
    assert(userLogin.status === 200 && userLogin.data.token, 'POST /api/auth/login as User');
    userToken = userLogin.data.token;

    const profileRes = await request('/auth/profile', { token: userToken });
    assert(profileRes.status === 200 && profileRes.data.email === 'user@stylehub.com', 'GET /api/auth/profile');

    const addCart = await request('/cart', {
      method: 'POST',
      token: userToken,
      body: { productId: testProductId, quantity: 2, size: 'M' }
    });
    assert(addCart.status === 200 && addCart.data.items?.length > 0, 'POST /api/cart Add item');

    const getCart = await request('/cart', { token: userToken });
    assert(getCart.status === 200 && getCart.data.items?.length > 0, 'GET /api/cart Get cart items');

    const updateCart = await request(`/cart/${testProductId}`, {
      method: 'PUT',
      token: userToken,
      body: { quantity: 3, size: 'M' }
    });
    assert(updateCart.status === 200, `PUT /api/cart/${testProductId} Update quantity`);

    const toggleWish = await request(`/users/wishlist/${testProductId}`, {
      method: 'POST',
      token: userToken
    });
    assert(toggleWish.status === 200, `POST /api/users/wishlist/${testProductId} Toggle wishlist`);

    const getWish = await request('/users/wishlist', { token: userToken });
    assert(getWish.status === 200, 'GET /api/users/wishlist');

    const codOrder = await request('/orders', {
      method: 'POST',
      token: userToken,
      body: {
        shippingAddress: {
          fullName: 'Test User',
          phone: '9876543210',
          addressLine1: '123 Fashion Street',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        paymentMethod: 'COD'
      }
    });
    assert(codOrder.status === 201 && (codOrder.data.order?.orderId || codOrder.data.order?.orderNumber), 'POST /api/orders Create COD Order');
    if (codOrder.data.order) testOrderId = codOrder.data.order._id;

    const myOrders = await request('/orders/my-orders', { token: userToken });
    assert(myOrders.status === 200 && myOrders.data.length > 0, 'GET /api/orders/my-orders');

    if (testOrderId) {
      const singleOrder = await request(`/orders/${testOrderId}`, { token: userToken });
      assert(singleOrder.status === 200 && singleOrder.data._id === testOrderId, `GET /api/orders/${testOrderId}`);
    }

    const rzpOrder = await request('/orders/create-razorpay-order', {
      method: 'POST',
      token: userToken,
      body: { amount: 1500 }
    });
    assert(rzpOrder.status === 200 && (rzpOrder.data.razorpayOrderId || rzpOrder.data.demoMode), 'POST /api/orders/create-razorpay-order');

    const adminStats = await request('/users/admin/stats', { token: adminToken });
    assert(adminStats.status === 200 && adminStats.data.stats, 'GET /api/users/admin/stats (Admin only)');

    const adminOrders = await request('/orders', { token: adminToken });
    assert(adminOrders.status === 200 && adminOrders.data.orders, 'GET /api/orders (Admin only)');

    const unauthTest = await request('/orders/my-orders');
    assert(unauthTest.status === 401, 'Unauthorized access correctly rejected (401)');

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
