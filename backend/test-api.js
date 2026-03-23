const http = require('http');

// Test function
function testEndpoint(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: body ? JSON.parse(body) : null,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== QuantumMint API Tests ===\n');

  try {
    // Test 1: Health check
    console.log('1. Health Check');
    const health = await testEndpoint('GET', '/');
    console.log(`   Status: ${health.statusCode}`);
    console.log(`   Response:`, health.body);
    console.log();

    // Test 2: Register new user
    console.log('2. Register User');
    const registerData = {
      name: `Test User`,
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };
    const register = await testEndpoint('POST', '/api/auth/register', registerData);
    console.log(`   Status: ${register.statusCode}`);
    console.log(`   Response:`, register.body);
    const token = register.body?.token;
    console.log();

    // Test 3: Login
    console.log('3. Login');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };
    const login = await testEndpoint('POST', '/api/auth/login', loginData);
    console.log(`   Status: ${login.statusCode}`);
    console.log(`   Response:`, login.body);
    const loginToken = login.body?.token || token;
    console.log();

    // Test 4: Get current user (with auth)
    if (loginToken) {
      console.log('4. Get Current User (Authenticated)');
      const meOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json'
        }
      };

      const meReq = new Promise((resolve, reject) => {
        const req = http.request(meOptions, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              body: body ? JSON.parse(body) : null
            });
          });
        });
        req.on('error', reject);
        req.end();
      });

      const me = await meReq;
      console.log(`   Status: ${me.statusCode}`);
      console.log(`   Response:`, me.body);
      console.log();

      // Test 5: Get wallet balance
      console.log('5. Get Wallet Balance');
      const walletOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/wallet/balance',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json'
        }
      };

      const walletReq = new Promise((resolve, reject) => {
        const req = http.request(walletOptions, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              body: body ? JSON.parse(body) : null
            });
          });
        });
        req.on('error', reject);
        req.end();
      });

      const wallet = await walletReq;
      console.log(`   Status: ${wallet.statusCode}`);
      console.log(`   Response:`, wallet.body);
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

runTests();
