import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import {
  Table, Button, Space, Input, Select, Tag, message, Popconfirm, Empty, Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { hasRole } from '@/access';

interface Material {
  id: string;
  materialCode: string;
  materialName: string;
  materialCategory: string;
  specification: string | null;
  unit: string;
  batchManaged: boolean;
  expiryManaged: boolean;
  status: string;
  storageCondition: string | null;
  createdAt: string;
}

const MaterialsPage: React.FC = () => {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await api.get<Material[]>('/materials', params);
      setData(Array.isArray(res) ? res : (res as any).data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<Material> = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 140,
      fixed: 'left',
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 160,
    },
    {
      title: '分类',
      dataIndex: 'materialCategory',
      key: 'materialCategory',
      width: 100,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 140,
      render: (v) => v || '-',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '批次管理',
      dataIndex: 'batchManaged',
      key: 'batchManaged',
      width: 90,
      render: (v) => v ? <Tag color="green">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '效期管理',
      dataIndex: 'expiryManaged',
      key: 'expiryManaged',
      width: 90,
      render: (v) => v ? <Tag color="green">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v) => v === 'active'
        ? <Tag color="green">启用</Tag>
        : <Tag color="default">停用</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (v) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => hasRole('admin') ? (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => history.push(`/materials/${record.id}/edit`)}
        >
          编辑
        </Button>
      ) : null,
    },
  ];

  if (error) {
    return (
      <Card>
        <Empty description={error}>
          <Button type="primary" onClick={fetchData}>重试</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索物料编码或名称"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={fetchData}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder="物料分类"
            value={category}
            onChange={setCategory}
            allowClear
            style={{ width: 160 }}
            options={[
              { label: '原辅料', value: '原辅料' },
              { label: '脂质', value: '脂质' },
              { label: '中间体', value: '中间体' },
              { label: '成品', value: '成品' },
              { label: '耗材', value: '耗材' },
              { label: '设备', value: '设备' },
            ]}
          />
          <Button type="primary" onClick={fetchData}>查询</Button>
          {hasRole('admin') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/materials/create')}
            >
              新建物料
            </Button>
          )}
        </Space>
      </Card>

      <Card>
        <Table<Material>
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          locale={{
            emptyText: <Empty description="暂无物料数据" />,
          }}
        />
      </Card>
    </div>
  );
};

export default MaterialsPage;
