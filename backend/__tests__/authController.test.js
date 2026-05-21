const request = require('supertest');
const app = require('../app');

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser2@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser2@example.com',
        password: 'password123',
      });
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser2@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(400);
  });
});
