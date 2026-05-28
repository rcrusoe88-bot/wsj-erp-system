import React, { useState } from 'react';
import { history } from 'umi';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { setToken } from '@/utils/token';
import { setCurrentUser, UserInfo } from '@/access';

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post<{ access_token: string }>('/auth/login', values);
      setToken(res.access_token);

      const user = await api.get<UserInfo>('/auth/me');
      setCurrentUser(user);

      message.success(`欢迎回来，${user.username}`);
      history.push('/');
    } catch (err: any) {
      message.error(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f4a33 0%, #1a6b4a 50%, #0d3b28 100%)',
      }}
    >
      <Card
        style={{ width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
        styles={{ body: { padding: '32px 40px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ marginBottom: 4, color: '#0f4a33' }}>
            MATERIA ERP
          </Title>
          <span style={{ color: '#666', fontSize: 14 }}>
            mRNA/LNP 生产物料管理系统
          </span>
        </div>
        <Form<LoginForm>
          name="login"
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
