import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { Card, Button, Descriptions, Table, Tag, Space, Spin, Result, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const InventoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/inventory/balances/${id}`),
      api.get('/inventory/transactions', { balanceId: id }),
    ]).then(([balanceData, txData]) => {
      setBalance(balanceData);
      setTransactions(Array.isArray(txData) ? txData : (txData as any)?.data || []);
    }).catch((err) => setError(err.message || '加载失败')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (error) return <Result status="error" title="加载失败" subTitle={error} extra={<Button onClick={() => history.push('/inventory')}>返回列表</Button>} />;
  if (!balance) return null;

  const getExpiryTag = (date?: string) => {
    if (!date) return <Tag>-</Tag>;
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (days <= 0) return <Tag color="red">已过期</Tag>;
    if (days <= 30) return <Tag color="orange">临期 ({days}天)</Tag>;
    return <Tag color="green">正常</Tag>;
  };

  return (
    <div>
      <Card title={<Space><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.push('/inventory')} />库存详情</Space>}>
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
          <Descriptions.Item label="物料编码">{balance.material?.materialCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="物料名称">{balance.material?.materialName || '-'}</Descriptions.Item>
          <Descriptions.Item label="批号">{balance.lotNumber}</Descriptions.Item>
          <Descriptions.Item label="仓库">{balance.warehouse?.warehouseName || '-'}</Descriptions.Item>
          <Descriptions.Item label="在库数量">{balance.quantityOnHand}</Descriptions.Item>
          <Descriptions.Item label="可用数量">{balance.quantityAvailable}</Descriptions.Item>
          <Descriptions.Item label="锁定数量">{balance.quantityLocked}</Descriptions.Item>
          <Descriptions.Item label="单位">{balance.unit}</Descriptions.Item>
          <Descriptions.Item label="效期状态">{getExpiryTag(balance.expiryDate)}</Descriptions.Item>
          <Descriptions.Item label="效期至">{balance.expiryDate ? new Date(balance.expiryDate).toLocaleDateString('zh-CN') : '-'}</Descriptions.Item>
          <Descriptions.Item label="生产日期" span={2}>{balance.productionDate ? new Date(balance.productionDate).toLocaleDateString('zh-CN') : '-'}</Descriptions.Item>
        </Descriptions>

        <Card title="收发明细" size="small">
          <Table rowKey="id" dataSource={transactions} pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }} size="small" columns={[
            { title: '类型', dataIndex: 'transactionType', key: 'type', width: 80, render: (v) => v === 'stock_in' ? <Tag color="green">入库</Tag> : <Tag color="red">出库</Tag> },
            { title: '数量', dataIndex: 'quantity', key: 'qty', width: 100 },
            { title: '来源单号', dataIndex: 'sourceOrderNo', key: 'source', width: 180, render: (v: string) => v || '-' },
            { title: '时间', dataIndex: 'createdAt', key: 'time', width: 180, render: (v) => v ? new Date(v).toLocaleString('zh-CN') : '-' },
          ]} locale={{ emptyText: <Empty description="暂无交易记录" /> }} />
        </Card>
      </Card>
    </div>
  );
};

export default InventoryDetailPage;
