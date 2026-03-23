import request from 'supertest';
import { app } from '../index.js';
import jwt from 'jsonwebtoken';

describe('Voice Profile Service', () => {
  test('requires auth header for /voice-profile/:id', async () => {
    const response = await request(app).get('/voice-profile/nonexistent');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Missing authorization' });
  });

  test('returns 404 for missing profile with valid token', async () => {
    const token = jwt.sign({ id: '00000000-0000-0000-0000-000000000000', role: 'admin' }, process.env.JWT_SECRET || 'test-secret');
    const response = await request(app)
      .get('/voice-profile/nonexistent')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'not found' });
  });
});
