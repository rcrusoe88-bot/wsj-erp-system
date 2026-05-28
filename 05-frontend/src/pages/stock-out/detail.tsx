import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { Card, Button, Descriptions, Table, Tag, Space, Spin, Result, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const typeLabels: Record<string, string> = { production_issue: '生产领料', scrap: '报废出库', transfer: '调拨出库' };
const statusColors: Record<string, string> = { draft: 'default', pending_review: 'processing', approved: 'success', rejected: 'error' };
const statusLabels: Record<string, string> = { draft: '草稿', pending_review: '待审批', approved: '已通过', rejected: '已驳回' };

const StockOutDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/stock-out/${id}`).then(setData).catch((err) => setError(err.message || '加载失败')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (error) return <Result status="error" title="加载失败" subTitle={error} extra={<Button onClick={() => history.push('/stock-out')}>返回列表</Button>} />;
  if (!data) return null;

  const itemColumns = [
    { title: '物料编码', dataIndex: ['material', 'materialCode'], key: 'code' },
    { title: '物料名称', dataIndex: ['material', 'materialName'], key: 'name' },
    { title: '批号', dataIndex: 'lotNumber', key: 'lot' },
    { title: '数量', dataIndex: 'quantity', key: 'qty' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
  ];

  return (
    <div>
      <Card title={<Space><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.push('/stock-out')} />出库详情</Space>}>
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
          <Descriptions.Item label="单号">{data.orderNo}</Descriptions.Item>
          <Descriptions.Item label="状态"><Tag color={statusColors[data.status]}>{statusLabels[data.status] || data.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="出库类型">{typeLabels[data.stockOutType] || data.stockOutType}</Descriptions.Item>
          <Descriptions.Item label="仓库">{data.warehouse?.warehouseName || '-'}</Descriptions.Item>
          <Descriptions.Item label="去向">{data.destination || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建人">{data.createdBy?.username || '-'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{data.remark || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(data.createdAt).toLocaleString('zh-CN')}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{new Date(data.updatedAt).toLocaleString('zh-CN')}</Descriptions.Item>
        </Descriptions>

        <Card title="出库明细" size="small" style={{ marginBottom: 16 }}>
          <Table rowKey="id" columns={itemColumns} dataSource={data.items || []} pagination={false} size="small"
            locale={{ emptyText: <Empty description="无明细数据" /> }} />
        </Card>

        {data.approvals && data.approvals.length > 0 && (
          <Card title="审批记录" size="small">
            <Table rowKey="id" dataSource={data.approvals} pagination={false} size="small" columns={[
              { title: '审批人', dataIndex: ['reviewer', 'username'], key: 'reviewer' },
              { title: '结果', dataIndex: 'result', key: 'result', render: (v: string) => <Tag color={v === 'approved' ? 'success' : 'error'}>{v === 'approved' ? '通过' : '驳回'}</Tag> },
              { title: '意见', dataIndex: 'comment', key: 'comment', render: (v: string) => v || '-' },
              { title: '时间', dataIndex: 'reviewedAt', key: 'time', render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-' },
            ]} />
          </Card>
        )}
      </Card>
    </div>
  );
};

export default StockOutDetailPage;
