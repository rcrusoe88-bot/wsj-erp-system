import { request, loginAsAdmin } from './helpers';

describe('Auth API', () => {
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request('POST', '/auth/login', {
        username: 'admin',
        password: '123456',
      });

      expect(res.success).toBe(true);
      expect(res.data.accessToken).toBeDefined();
      expect(res.data.user.username).toBe('admin');
      expect(res.data.user.role).toBe('admin');
    });

    it('should reject wrong password', async () => {
      const res = await request('POST', '/auth/login', {
        username: 'admin',
        password: 'wrong',
      });

      expect(res.success).toBe(false);
      expect(res.message).toBeDefined();
    });

    it('should reject non-existent user', async () => {
      const res = await request('POST', '/auth/login', {
        username: 'nonexistent',
        password: '123456',
      });

      expect(res.success).toBe(false);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user with valid token', async () => {
      await loginAsAdmin();
      const res = await request('GET', '/auth/me');

      expect(res.success).toBe(true);
      expect(res.data.username).toBe('admin');
      expect(res.data.role).toBe('admin');
    });

    it('should reject without token', async () => {
      const res = await fetch('http://localhost:3000/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
