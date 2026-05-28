import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Table, Button, Space, Tag, Card, Empty, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import { hasRole } from '@/access';

interface StockOut {
  id: string;
  orderNo: string;
  stockOutType: string;
  status: string;
  warehouse?: { warehouseName: string };
  createdBy?: { username: string };
  createdAt: string;
}

const typeLabels: Record<string, string> = { production_issue: '生产领料', scrap: '报废出库', transfer: '调拨出库' };
const statusColors: Record<string, string> = { draft: 'default', pending_review: 'processing', approved: 'success', rejected: 'error' };
const statusLabels: Record<string, string> = { draft: '草稿', pending_review: '待审批', approved: '已通过', rejected: '已驳回' };

const StockOutPage: React.FC = () => {
  const [data, setData] = useState<StockOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | undefined>();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
      if (status) params.status = status;
      const res = await api.get<StockOut[]>('/stock-out', params);
      setData(Array.isArray(res) ? res : (res as any).data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns: ColumnsType<StockOut> = [
    { title: '单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
    { title: '出库类型', dataIndex: 'stockOutType', key: 'type', width: 100, render: (v) => typeLabels[v] || v },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (v) => <Tag color={statusColors[v]}>{statusLabels[v] || v}</Tag> },
    { title: '仓库', key: 'warehouse', width: 140, render: (_, r) => (r as any).warehouse?.warehouseName || '-' },
    { title: '去向', dataIndex: 'destination', key: 'dest', width: 140, render: (v: string) => v || '-' },
    { title: '创建人', key: 'creator', width: 100, render: (_, r) => (r as any).createdBy?.username || '-' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180, render: (v) => v ? new Date(v).toLocaleString('zh-CN') : '-' },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" icon={<EyeOutlined />} onClick={() => history.push(`/stock-out/${record.id}`)}>详情</Button>
    )},
  ];

  if (error) return <Card><Empty description={error}><Button type="primary" onClick={fetchData}>重试</Button></Empty></Card>;

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select placeholder="状态筛选" value={status} onChange={setStatus} allowClear style={{ width: 140 }}
            options={[{ label: '草稿', value: 'draft' }, { label: '待审批', value: 'pending_review' }, { label: '已通过', value: 'approved' }, { label: '已驳回', value: 'rejected' }]} />
          <Button type="primary" onClick={fetchData}>查询</Button>
          {hasRole('admin', 'operator') && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/stock-out/create')}>新建出库</Button>
          )}
        </Space>
      </Card>
      <Card>
        <Table<StockOut> rowKey="id" columns={columns} dataSource={data} loading={loading} scroll={{ x: 1000 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
          locale={{ emptyText: <Empty description="暂无出库记录" /> }} />
      </Card>
    </div>
  );
};

export default StockOutPage;
