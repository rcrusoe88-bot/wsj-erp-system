import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, Space, Empty, Modal, message, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { api } from '@/services/api';

interface User {
  id: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
}

const roleLabels: Record<string, string> = { admin: '管理员', reviewer: '审核员', operator: '操作员' };
const roleColors: Record<string, string> = { admin: 'red', reviewer: 'blue', operator: 'green' };

const UsersPage: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<User[]>('/users');
      setData(Array.isArray(res) ? res : (res as any).data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setCreateLoading(true);
      await api.post('/users', values);
      message.success('用户创建成功');
      setCreateVisible(false);
      form.resetFields();
      fetchData();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error(err.message || '创建失败');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    Modal.confirm({
      title: `${newStatus === 'active' ? '启用' : '停用'}用户`,
      content: `确定要${newStatus === 'active' ? '启用' : '停用'}用户"${user.username}"吗？`,
      onOk: async () => {
        try {
          await api.patch(`/users/${user.id}/status`, { status: newStatus });
          message.success(`用户已${newStatus === 'active' ? '启用' : '停用'}`);
          fetchData();
        } catch (err: any) {
          message.error(err.message || '操作失败');
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 160 },
    { title: '角色', dataIndex: 'role', key: 'role', width: 100,
      render: (v) => <Tag color={roleColors[v]}>{roleLabels[v] || v}</Tag>,
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v) => v === 'active' ? <Tag color="green">启用</Tag> : <Tag color="default">停用</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180,
      render: (v) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, record) => (
        <Button
          type="link"
          danger={record.status === 'active'}
          onClick={() => handleToggleStatus(record)}
        >
          {record.status === 'active' ? '停用' : '启用'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="用户管理"
        extra={
          <Button type="primary" onClick={() => setCreateVisible(true)}>
            新增用户
          </Button>
        }
      >
        <Table<User>
          rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 700 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
          locale={{ emptyText: <Empty description={error || '暂无用户数据'}><Button type="primary" onClick={fetchData}>刷新</Button></Empty> }}
        />
      </Card>

      <Modal
        title="新增用户"
        open={createVisible}
        onCancel={() => { setCreateVisible(false); form.resetFields(); }}
        onOk={handleCreate}
        confirmLoading={createLoading}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
            <Input.Password placeholder="请输入密码（至少6位）" />
          </Form.Item>
          <Form.Item name="fullName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="reviewer">审核员</Select.Option>
              <Select.Option value="operator">操作员</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
