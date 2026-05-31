import { request, loginAsAdmin } from './helpers';

beforeAll(async () => {
  await loginAsAdmin();
});

describe('Warehouses API', () => {
  describe('POST /warehouses', () => {
    it('should create a warehouse', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const res = await request('POST', '/warehouses', {
        warehouseCode: `WH-TEST-${timestamp}`,
        warehouseName: `测试仓库-${timestamp}`,
        location: '测试位置',
      });

      expect(res.success).toBe(true);
    });

    it('should reject duplicate warehouse code', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const code = `WH-DUP-${timestamp}`;

      await request('POST', '/warehouses', { warehouseCode: code, warehouseName: '仓库1', location: '位置1' });
      const res = await request('POST', '/warehouses', { warehouseCode: code, warehouseName: '仓库2', location: '位置2' });

      expect(res.success).toBe(false);
    });
  });

  describe('GET /warehouses', () => {
    it('should return warehouse list', async () => {
      const res = await request('GET', '/warehouses');

      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });
});
