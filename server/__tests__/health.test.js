import request from 'supertest';
import app from '../app.js';

describe('Server health endpoint', () => {
  it('should return a success response from /api/health', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('đang hoạt động');
    expect(response.body).toHaveProperty('timestamp');
  });
});
