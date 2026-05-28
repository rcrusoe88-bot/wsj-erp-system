import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Table, Button, Space, Input, Select, Tag, Card, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

interface InventoryBalance {
  id: string;
  material?: { materialCode: string; materialName: string };
  warehouse?: { warehouseName: string };
  lotNumber: string;
  quantityOnHand: number;
  quantityAvailable: number;
  quantityLocked: number;
  unit: string;
  expiryDate?: string;
}

const InventoryPage: React.FC = () => {
  const [data, setData] = useState<InventoryBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expiryStatus, setExpiryStatus] = useState<string | undefined>();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
      if (search) params.materialCode = search;
      if (expiryStatus) params.expiryStatus = expiryStatus;
      const res = await api.get<InventoryBalance[]>('/inventory/balances', params);
      setData(Array.isArray(res) ? res : (res as any).data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getExpiryTag = (date?: string) => {
    if (!date) return <Tag>-</Tag>;
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (days <= 0) return <Tag color="red">已过期</Tag>;
    if (days <= 30) return <Tag color="orange">临期 ({days}天)</Tag>;
    return <Tag color="green">正常</Tag>;
  };

  const columns: ColumnsType<InventoryBalance> = [
    { title: '物料编码', dataIndex: ['material', 'materialCode'], key: 'code', width: 140 },
    { title: '物料名称', dataIndex: ['material', 'materialName'], key: 'name', width: 160 },
    { title: '批号', dataIndex: 'lotNumber', key: 'lot', width: 140 },
    { title: '仓库', dataIndex: ['warehouse', 'warehouseName'], key: 'warehouse', width: 140, render: (v) => v || '-' },
    { title: '在库数量', dataIndex: 'quantityOnHand', key: 'qoh', width: 100 },
    { title: '可用数量', dataIndex: 'quantityAvailable', key: 'qa', width: 100 },
    { title: '锁定数量', dataIndex: 'quantityLocked', key: 'ql', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 70 },
    { title: '效期状态', key: 'expiry', width: 120, render: (_, r) => getExpiryTag(r.expiryDate) },
    { title: '效期至', dataIndex: 'expiryDate', key: 'ed', width: 120, render: (v) => v ? new Date(v).toLocaleDateString('zh-CN') : '-' },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" icon={<EyeOutlined />} onClick={() => history.push(`/inventory/${record.id}`)}>明细</Button>
    )},
  ];

  if (error) return <Card><Empty description={error}><Button type="primary" onClick={fetchData}>重试</Button></Empty></Card>;

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input placeholder="搜索物料编码或批号" prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} onPressEnter={fetchData} style={{ width: 240 }} allowClear />
          <Select placeholder="效期状态" value={expiryStatus} onChange={setExpiryStatus} allowClear style={{ width: 140 }}
            options={[{ label: '临期(≤30天)', value: 'warning' }, { label: '已过期', value: 'expired' }, { label: '正常', value: 'normal' }]} />
          <Button type="primary" onClick={fetchData}>查询</Button>
        </Space>
      </Card>
      <Card>
        <Table<InventoryBalance> rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 1200 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
          locale={{ emptyText: <Empty description="暂无库存数据" /> }} />
      </Card>
    </div>
  );
};

export default InventoryPage;
