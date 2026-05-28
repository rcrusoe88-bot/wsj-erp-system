import { defineConfig } from 'umi';

export default defineConfig({
  title: 'MATERIA ERP',
  favicons: [
    'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' rx=\'14\' fill=\'%230f4a33\'/%3E%3Ctext x=\'32\' y=\'40\' font-size=\'28\' text-anchor=\'middle\' fill=\'white\' font-family=\'Microsoft YaHei UI,Arial\'%3E%E9%9D%92%3C/text%3E%3C/svg%3E',
  ],

  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },

  routes: [
    {
      path: '/login',
      component: '@/pages/login/index',
      layout: false,
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        { path: '/', component: '@/pages/dashboard/index' },
        { path: '/materials', component: '@/pages/materials/index' },
        { path: '/materials/create', component: '@/pages/materials/create' },
        { path: '/materials/:id/edit', component: '@/pages/materials/edit' },
        { path: '/warehouses', component: '@/pages/warehouses/index' },
        { path: '/warehouses/create', component: '@/pages/warehouses/create' },
        { path: '/warehouses/:id/edit', component: '@/pages/warehouses/edit' },
        { path: '/users', component: '@/pages/users/index' },
        { path: '/stock-in', component: '@/pages/stock-in/index' },
        { path: '/stock-in/create', component: '@/pages/stock-in/create' },
        { path: '/stock-in/:id', component: '@/pages/stock-in/detail' },
        { path: '/stock-out', component: '@/pages/stock-out/index' },
        { path: '/stock-out/create', component: '@/pages/stock-out/create' },
        { path: '/stock-out/:id', component: '@/pages/stock-out/detail' },
        { path: '/approval', component: '@/pages/approval/index' },
        { path: '/inventory', component: '@/pages/inventory/index' },
        { path: '/inventory/:id', component: '@/pages/inventory/detail' },
        { path: '/trace', component: '@/pages/trace/index' },
      ],
    },
  ],

  npmClient: 'npm',
});
