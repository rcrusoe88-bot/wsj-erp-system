import { request, loginAsAdmin } from './helpers';

beforeAll(async () => {
  await loginAsAdmin();
});

describe('Users API', () => {
  describe('GET /users', () => {
    it('should return user list (admin only)', async () => {
      const res = await request('GET', '/users');

      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should list all three seeded users', async () => {
      const res = await request('GET', '/users');

      const usernames = res.data.map((u: any) => u.username);
      expect(usernames).toContain('admin');
      expect(usernames).toContain('reviewer');
      expect(usernames).toContain('operator');
    });
  });
});
