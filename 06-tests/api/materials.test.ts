import { request, loginAsAdmin } from './helpers';

beforeAll(async () => {
  await loginAsAdmin();
});

describe('Materials API', () => {
  let createdCode: string;

  describe('GET /materials', () => {
    it('should return material list', async () => {
      const res = await request('GET', '/materials');

      expect(res.success).toBe(true);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('should return materials with correct fields', async () => {
      const res = await request('GET', '/materials');

      if (res.data.length > 0) {
        const m = res.data[0];
        expect(m.materialCode).toBeDefined();
        expect(m.materialName).toBeDefined();
        expect(m.materialCategory).toBeDefined();
        expect(m.unit).toBeDefined();
      }
    });
  });

  describe('POST /materials', () => {
    it('should create a new material', async () => {
      const timestamp = Date.now().toString().slice(-6);
      createdCode = `TEST-${timestamp}`;

      const res = await request('POST', '/materials', {
        materialCode: createdCode,
        materialName: `测试物料-${timestamp}`,
        materialCategory: '辅料',
        unit: 'mg',
        batchManaged: true,
        expiryManaged: true,
      });

      expect(res.success).toBe(true);
      expect(res.data.materialCode).toBe(createdCode);
    });

    it('should reject duplicate material code', async () => {
      const res = await request('POST', '/materials', {
        materialCode: createdCode,
        materialName: '重复物料',
        materialCategory: '辅料',
        unit: 'mg',
      });

      expect(res.success).toBe(false);
    });

    it('should reject missing required fields', async () => {
      const res = await request('POST', '/materials', { materialName: '无编码物料' });
      expect(res.success).toBe(false);
    });
  });

  describe('GET /materials/:id', () => {
    it('should return material detail', async () => {
      const listRes = await request('GET', '/materials');
      if (listRes.data.length > 0) {
        const id = listRes.data[0].id;
        const res = await request('GET', `/materials/${id}`);
        expect(res.success).toBe(true);
        expect(res.data.id).toBe(id);
      }
    });

    it('should return 404 for non-existent material', async () => {
      const res = await request('GET', '/materials/non-existent-id');
      expect(res.success).toBe(false);
    });
  });
});
