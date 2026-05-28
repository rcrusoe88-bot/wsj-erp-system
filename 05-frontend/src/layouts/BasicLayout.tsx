import React, { useEffect, useState } from 'react';
import { Outlet, history, useLocation } from 'umi';
import { Layout, Menu, Button, Dropdown, Spin, Result, theme } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ImportOutlined,
  ExportOutlined,
  AuditOutlined,
  DatabaseOutlined,
  NodeIndexOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { api } from '@/services/api';
import { setCurrentUser, getCurrentUser, canAccess, UserInfo } from '@/access';
import { removeToken, getToken } from '@/utils/token';

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const allMenuItems: MenuItem[] = [
  { key: 'dashboard', label: '工作台', icon: <DashboardOutlined />, path: '/' },
  {
    key: 'master-data', label: '主数据', icon: <AppstoreOutlined />,
    children: [
      { key: 'materials', label: '物料管理', icon: <AppstoreOutlined />, path: '/materials' },
      { key: 'warehouses', label: '仓库管理', icon: <EnvironmentOutlined />, path: '/warehouses' },
      { key: 'users', label: '用户与角色', icon: <TeamOutlined />, path: '/users' },
    ],
  },
  { key: 'stock-in', label: '入库管理', icon: <ImportOutlined />, path: '/stock-in' },
  { key: 'stock-out', label: '出库管理', icon: <ExportOutlined />, path: '/stock-out' },
  { key: 'approval', label: '审批中心', icon: <AuditOutlined />, path: '/approval' },
  { key: 'inventory', label: '实时库存', icon: <DatabaseOutlined />, path: '/inventory' },
  { key: 'trace', label: '批次追溯', icon: <NodeIndexOutlined />, path: '/trace' },
];

function filterMenu(items: MenuItem[]): MenuItem[] {
  return items
    .filter((item) => {
      if (item.children) {
        const filtered = filterMenu(item.children);
        if (filtered.length === 0) return false;
        return true;
      }
      return canAccess(item.key);
    })
    .map((item) => {
      if (item.children) {
        return { ...item, children: filterMenu(item.children) };
      }
      return item;
    });
}

const BasicLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const location = useLocation();
  const { token: themeToken } = theme.useToken();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      history.push('/login');
      return;
    }

    api.get<UserInfo>('/auth/me')
      .then((user) => {
        setCurrentUser(user);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    history.push('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large"><div style={{ padding: 50 }}>加载中...</div></Spin>
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle="无法获取用户信息，请重新登录"
        extra={
          <Button type="primary" onClick={handleLogout}>
            返回登录
          </Button>
        }
      />
    );
  }

  const user = getCurrentUser();
  const menus = filterMenu(allMenuItems);

  const selectedKey = location.pathname.split('/')[1] || 'dashboard';
  const openKeys = menus
    .filter((item) => item.children?.some((child) => selectedKey.startsWith(child.key)))
    .map((item) => item.key);

  const userMenuItems = [
    {
      key: 'role',
      label: `角色：${user?.role === 'admin' ? '管理员' : user?.role === 'reviewer' ? '审核员' : '操作员'}`,
      disabled: true,
    },
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        theme="dark"
        style={{ overflow: 'auto', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <div
          style={{
            height: 48,
            margin: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          MATERIA ERP
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menus.map((item) => {
            if (item.children) {
              return {
                key: item.key,
                icon: item.icon,
                label: item.label,
                children: item.children.map((child) => ({
                  key: child.key,
                  icon: child.icon,
                  label: child.label,
                })),
              };
            }
            return { key: item.key, icon: item.icon, label: item.label };
          })}
          onClick={({ key }) => {
            const findPath = (items: MenuItem[]): string | undefined => {
              for (const item of items) {
                if (item.key === key) return item.path;
                if (item.children) {
                  const found = findPath(item.children);
                  if (found) return found;
                }
              }
              return undefined;
            };
            const path = findPath(menus);
            if (path) history.push(path);
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: 220 }}>
        <Header
          style={{
            background: themeToken.colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => {
                if (key === 'logout') handleLogout();
              },
            }}
          >
            <Button type="text" icon={<UserOutlined />}>
              {user?.username}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
