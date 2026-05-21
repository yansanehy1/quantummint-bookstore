const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Wallet Controller', () => {
  let testUser;

  beforeAll(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      balance: 1000,
      currency: 'USD',
    });
  });

  afterAll(async () => {
    await User.destroy({ where: { email: 'testuser@example.com' } });
  });

  it('should get wallet balance for a user', async () => {
    const res = await request(app)
      .get(`/api/wallet/${testUser.id}`)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('balance');
    expect(res.body).toHaveProperty('currency');
  });
});
