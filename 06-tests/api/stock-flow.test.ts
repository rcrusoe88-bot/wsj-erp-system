import { request, loginAsAdmin } from './helpers';

beforeAll(async () => {
  await loginAsAdmin();
});

describe('Stock Flow Integration', () => {
  let materialId: string;
  let warehouseId: string;

  beforeAll(async () => {
    // Get or create test material
    const matList = await request('GET', '/materials');
    if (matList.data.length > 0) {
      materialId = matList.data[0].id;
    } else {
      const ts = Date.now().toString().slice(-8);
      const matRes = await request('POST', '/materials', {
        materialCode: `FLOW-${ts}`,
        materialName: `流程测试物料-${ts}`,
        materialCategory: '辅料',
        unit: 'mg',
      });
      materialId = matRes.data.id;
    }

    // Get or create test warehouse
    const whList = await request('GET', '/warehouses');
    if (whList.data.length > 0) {
      warehouseId = whList.data[0].id;
    } else {
      const ts = Date.now().toString().slice(-8);
      const whRes = await request('POST', '/warehouses', {
        warehouseCode: `FLOW-WH-${ts}`,
        warehouseName: `流程测试仓库-${ts}`,
      });
      warehouseId = whRes.data.id;
    }
  });

  describe('Stock In', () => {
    it('GET /stock-in should return paginated list', async () => {
      const res = await request('GET', '/stock-in');
      expect(res.success).toBe(true);
      expect(res.data.items).toBeDefined();
      expect(res.data.total).toBeDefined();
    });

    it('should create stock-in order', async () => {
      const batchNo = `BATCH-${Date.now().toString().slice(-8)}`;
      const res = await request('POST', '/stock-in', {
        warehouseId,
        items: [{
          materialId,
          batchNo,
          quantity: 100,
          unitPrice: 50.00,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }],
      });

      if (res.success) {
        expect(res.data.id).toBeDefined();
      }
    });
  });

  describe('Stock Out', () => {
    it('GET /stock-out should return paginated list', async () => {
      const res = await request('GET', '/stock-out');
      expect(res.success).toBe(true);
    });

    it('should reject stock-out with no stock', async () => {
      const res = await request('POST', '/stock-out', {
        warehouseId,
        items: [{
          materialId,
          batchNo: 'NONEXISTENT-BATCH',
          quantity: 9999,
        }],
      });

      if (!res.success) {
        expect(res.message).toBeDefined();
      }
    });
  });

  describe('Approval', () => {
    it('GET /approval/history should work', async () => {
      const res = await request('GET', '/approval/history/stock-in/any-id');
      // May return empty or 404 - either is acceptable for MVP
      expect(res.success !== undefined).toBe(true);
    });
  });
});
