import { defineConfig } from 'umi';

export default defineConfig({
  title: 'MATERIA ERP',
  favicons: ['data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' rx=\'14\' fill=\'%230f4a33\'/%3E%3Ctext x=\'32\' y=\'40\' font-size=\'28\' text-anchor=\'middle\' fill=\'white\' font-family=\'Microsoft YaHei UI,Arial\'%3E%E9%9D%92%3C/text%3E%3C/svg%3E'],
  routes: [
    { path: '/', redirect: '/materials-ledger' },
    { path: '/materials-ledger', component: '@/pages/MaterialsLedger' },
    { path: '/inbound-review', component: '@/pages/InboundReview' },
    { path: '/outbound-approval', component: '@/pages/OutboundApproval' },
    { path: '/batch-expiry', component: '@/pages/BatchExpiry' },
    { path: '/purchase-order', component: '@/pages/PurchaseOrder' },
    { path: '/settings', component: '@/pages/Settings' },
  ],
  antd: {
    theme: {
      token: {
        colorPrimary: '#0f4a33',
        colorSuccess: '#2c7a55',
        colorWarning: '#8a6308',
        colorError: '#a8331f',
        colorInfo: '#3d4bc4',
        fontFamily: `"Microsoft YaHei UI","PingFang SC",system-ui,sans-serif`,
        borderRadius: 6,
      },
    },
  },
  mock: {
    include: ['src/mock/**/*'],
  },
});
