import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Table, Button, Space, Input, Tag, message, Card, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { hasRole } from '@/access';

interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  location: string | null;
  status: string;
  createdAt: string;
}

const WarehousesPage: React.FC = () => {
  const [data, setData] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Warehouse[]>('/warehouses');
      setData(Array.isArray(res) ? res : (res as any).data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns: ColumnsType<Warehouse> = [
    { title: '仓库编码', dataIndex: 'warehouseCode', key: 'warehouseCode', width: 140 },
    { title: '仓库名称', dataIndex: 'warehouseName', key: 'warehouseName', width: 180 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 200, render: (v) => v || '-' },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v) => v === 'active' ? <Tag color="green">启用</Tag> : <Tag color="default">停用</Tag>,
    },
    {
      title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180,
      render: (v) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, record) => hasRole('admin') ? (
        <Button type="link" icon={<EditOutlined />} onClick={() => history.push(`/warehouses/${record.id}/edit`)}>编辑</Button>
      ) : null,
    },
  ];

  if (error) {
    return <Card><Empty description={error}><Button type="primary" onClick={fetchData}>重试</Button></Empty></Card>;
  }

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索仓库编码或名称"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={fetchData}
            style={{ width: 240 }}
            allowClear
          />
          <Button type="primary" onClick={fetchData}>查询</Button>
          {hasRole('admin') && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/warehouses/create')}>新建仓库</Button>
          )}
        </Space>
      </Card>
      <Card>
        <Table<Warehouse>
          rowKey="id" columns={columns} dataSource={data} loading={loading}
          scroll={{ x: 900 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
          locale={{ emptyText: <Empty description="暂无仓库数据" /> }}
        />
      </Card>
    </div>
  );
};

export default WarehousesPage;
