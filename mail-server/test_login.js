const http = require('http');

function request(path, method, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8081,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    console.log('Raw body:', data);
                    resolve({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    try {
        console.log('--- Testing Login ---');
        const loginRes = await request('/api/auth/login', 'POST', { username: 'admin', password: 'password' });
        console.log('Login Status:', loginRes.statusCode);

        if (loginRes.statusCode !== 200) {
            console.error('Login Failed:', loginRes.body);
            return;
        }

        const token = loginRes.body.token;
        console.log('Token acquired.');

        console.log('\n--- Testing Stats ---');
        const statsRes = await request('/api/stats', 'GET', null, { 'Authorization': `Bearer ${token}` });
        console.log('Stats Status:', statsRes.statusCode);
        console.log('Stats Body:', JSON.stringify(statsRes.body, null, 2));

    } catch (e) {
        console.error('Test script failed:', e);
    }
}

run();
