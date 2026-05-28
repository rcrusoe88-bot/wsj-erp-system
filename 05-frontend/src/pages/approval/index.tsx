import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Table, Button, Tag, Tabs, Card, Space, Empty, Modal, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const statusColors: Record<string, string> = { pending_review: 'processing', approved: 'success', rejected: 'error' };
const statusLabels: Record<string, string> = { pending_review: '待审批', approved: '已通过', rejected: '已驳回' };

interface PendingItem {
  id: string;
  orderNo: string;
  type: 'stock_in' | 'stock_out';
  typeLabel: string;
  status: string;
  createdBy?: { username: string };
  warehouse?: { warehouseName: string };
  createdAt: string;
}

const ApprovalPage: React.FC = () => {
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PendingItem | null>(null);
  const [comment, setComment] = useState('');
  const [approving, setApproving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch pending stock-in and stock-out orders
      const [stockIn, stockOut] = await Promise.all([
        api.get<any[]>('/stock-in', { status: 'pending_review' }).catch(() => []),
        api.get<any[]>('/stock-out', { status: 'pending_review' }).catch(() => []),
      ]);

      const items: PendingItem[] = [
        ...(Array.isArray(stockIn) ? stockIn : (stockIn as any)?.data || []).map((item: any) => ({
          ...item, type: 'stock_in' as const, typeLabel: '入库',
        })),
        ...(Array.isArray(stockOut) ? stockOut : (stockOut as any)?.data || []).map((item: any) => ({
          ...item, type: 'stock_out' as const, typeLabel: '出库',
        })),
      ];
      setPending(items);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (approved: boolean) => {
    if (!currentItem) return;
    setApproving(true);
    try {
      const endpoint = `/approval/${currentItem.type === 'stock_in' ? 'stock-in' : 'stock-out'}/${currentItem.id}`;
      await api.post(endpoint, { result: approved ? 'approved' : 'rejected', comment });
      message.success(approved ? '已通过' : '已驳回');
      setModalOpen(false);
      setComment('');
      fetchData();
    } catch (err: any) {
      message.error(err.message || '操作失败');
    } finally {
      setApproving(false);
    }
  };

  const columns: ColumnsType<PendingItem> = [
    { title: '单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
    { title: '类型', dataIndex: 'typeLabel', key: 'type', width: 80, render: (v) => <Tag>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (v) => <Tag color={statusColors[v]}>{statusLabels[v] || v}</Tag> },
    { title: '仓库', key: 'warehouse', width: 140, render: (_, r) => (r as any).warehouse?.warehouseName || '-' },
    { title: '申请人', key: 'creator', width: 100, render: (_, r) => (r as any).createdBy?.username || '-' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180, render: (v) => v ? new Date(v).toLocaleString('zh-CN') : '-' },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => history.push(`/${record.type === 'stock_in' ? 'stock-in' : 'stock-out'}/${record.id}`)}>查看</Button>
          <Button type="link" icon={<CheckOutlined />} style={{ color: '#2c7a55' }} onClick={() => { setCurrentItem(record); setModalOpen(true); }}>审批</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Tabs defaultActiveKey="pending" items={[
          {
            key: 'pending',
            label: `待审批 (${pending.length})`,
            children: (
              <Table<PendingItem>
                rowKey="id" columns={columns} dataSource={pending} loading={loading}
                pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                locale={{ emptyText: <Empty description={error || '暂无待审批单据'}><Button type="primary" onClick={fetchData}>刷新</Button></Empty> }}
              />
            ),
          },
          { key: 'history', label: '已审批', children: <Empty description="已审批记录将在后续版本中提供" /> },
        ]} />
      </Card>

      <Modal
        title="审批意见"
        open={modalOpen}
        onOk={() => handleApprove(true)}
        onCancel={() => setModalOpen(false)}
        confirmLoading={approving}
        footer={[
          <Button key="reject" danger icon={<CloseOutlined />} loading={approving} onClick={() => handleApprove(false)}>驳回</Button>,
          <Button key="approve" type="primary" icon={<CheckOutlined />} loading={approving} onClick={() => handleApprove(true)}>通过</Button>,
        ]}
      >
        <p style={{ marginBottom: 8 }}>单据号：{currentItem?.orderNo}</p>
        <Input.TextArea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="审批意见（可选）"
        />
      </Modal>
    </div>
  );
};

export default ApprovalPage;
