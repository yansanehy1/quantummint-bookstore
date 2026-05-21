process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-integration';
process.env.DISABLE_SUBSCRIPTION_WORKER = 'true';
process.env.DB_SYNC_ALTER = 'false';
process.env.SQLITE_PATH = ':memory:';
// Prevent .env from selecting MySQL during tests
delete process.env.DB_HOST;
delete process.env.DB_NAME;
delete process.env.DB_USER;

const request = require('supertest');
const { buildApp, syncDatabase } = require('../app');

let app;
let sequelize;

beforeAll(async () => {
    const built = buildApp();
    app = built.app;
    sequelize = built.sequelize;
    await syncDatabase(sequelize);
}, 30_000);

afterAll(async () => {
    if (sequelize) {
        await sequelize.close();
    }
});

describe('API integration', () => {
    it('GET /health returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    it('GET /api/books returns an array', async () => {
        const res = await request(app).get('/api/books');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/auth/register then login returns user and token', async () => {
        const email = `test-${Date.now()}@example.com`;
        const password = 'password123';

        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email, password });

        expect(registerRes.status).toBe(201);
        expect(registerRes.body.token).toBeDefined();
        expect(registerRes.body.user).toMatchObject({
            email,
            name: 'Test User',
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email, password });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.token).toBeDefined();
        expect(loginRes.body.user.email).toBe(email);
    });

    it('returns 404 for unknown routes', async () => {
        const res = await request(app).get('/api/does-not-exist');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
    });
});
