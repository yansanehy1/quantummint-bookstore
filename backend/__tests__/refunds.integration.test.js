const request = require('supertest');
const app = require('../server');
const { RefundRequest, Purchase, User } = require('../models');

// Mock user and purchase creation helpers would be here

describe('Refund workflow integration', () => {
  let userToken, adminToken, purchaseId;

  beforeAll(async () => {
    // Create user, admin, and purchase (mock or seed)
    // userToken = ...
    // adminToken = ...
    // purchaseId = ...
  });

  it('Learner submits refund request', async () => {
    const res = await request(app)
      .post('/api/refunds')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ purchaseId, reason: 'Book was defective' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('Admin approves refund and wallet is credited', async () => {
    // Find the refund request
    const refund = await RefundRequest.findOne({ where: { purchaseId } });
    const res = await request(app)
      .put(`/api/admin/refunds/${refund.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' });
    expect(res.statusCode).toBe(200);
    // Check wallet credited (mock or check balance)
  });
});
