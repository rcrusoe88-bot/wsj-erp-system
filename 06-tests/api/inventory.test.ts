import { request, loginAsAdmin } from './helpers';

beforeAll(async () => {
  await loginAsAdmin();
});

describe('Inventory API', () => {
  describe('GET /inventory/balances', () => {
    it('should return inventory balance list', async () => {
      const res = await request('GET', '/inventory/balances');

      expect(res.success).toBe(true);
      expect(res.data.items).toBeDefined();
      expect(res.data.total).toBeDefined();
    });
  });

  describe('GET /inventory/transactions', () => {
    it('should support pagination', async () => {
      const res = await request('GET', '/inventory/transactions?page=1&pageSize=10');

      expect(res.success).toBe(true);
    });
  });
});
