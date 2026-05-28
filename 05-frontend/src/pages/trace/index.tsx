import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, Tag, Space, Empty, Divider, message } from 'antd';
import { SearchOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

interface TraceNode {
  id: string;
  materialCode: string;
  materialName: string;
  lotNumber: string;
  relationType: string;
  quantity: number;
  unit: string;
}

const TracePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [upstream, setUpstream] = useState<TraceNode[]>([]);
  const [downstream, setDownstream] = useState<TraceNode[]>([]);
  const [center, setCenter] = useState<any>(null);
  const [form] = Form.useForm();

  const handleSearch = async (values: { materialCode: string; lotNumber: string }) => {
    setLoading(true);
    setUpstream([]);
    setDownstream([]);
    setCenter(null);
    try {
      const res = await api.get('/inventory/balances', { materialCode: values.materialCode, lotNumber: values.lotNumber });
      const items = Array.isArray(res) ? res : (res as any)?.data || [];
      if (items.length > 0) {
        setCenter(items[0]);
        // In production, this would call a dedicated trace API
        // For now, show the found balance record as the center node
      }
    } catch (err: any) {
      message.error(err.message || '查询失败');
    } finally {
      setLoading(false);
    }
  };

  const relationColumns = [
    { title: '物料编码', dataIndex: 'materialCode', key: 'code' },
    { title: '物料名称', dataIndex: 'materialName', key: 'name' },
    { title: '批号', dataIndex: 'lotNumber', key: 'lot' },
    { title: '关系', dataIndex: 'relationType', key: 'rel', render: (v: string) => {
      if (v === 'input') return <Tag color="blue">投入原料</Tag>;
      if (v === 'output') return <Tag color="green">产出</Tag>;
      return <Tag>{v}</Tag>;
    }},
    { title: '数量', dataIndex: 'quantity', key: 'qty' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="materialCode" label="物料编码" rules={[{ required: true, message: '请输入物料编码' }]}>
            <Input placeholder="物料编码" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item name="lotNumber" label="批号" rules={[{ required: true, message: '请输入批号' }]}>
            <Input placeholder="批号" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>追溯查询</Button>
          </Form.Item>
        </Form>
      </Card>

      {center ? (
        <>
          <Card title="当前物料" size="small" style={{ marginBottom: 16 }}>
            <Space size="large">
              <span><strong>物料编码：</strong>{center.material?.materialCode || center.materialCode}</span>
              <span><strong>物料名称：</strong>{center.material?.materialName || center.materialName}</span>
              <span><strong>批号：</strong>{center.lotNumber}</span>
              <span><strong>在库数量：</strong>{center.quantityOnHand} {center.unit}</span>
            </Space>
          </Card>

          <Card title="上游原料追溯" size="small" style={{ marginBottom: 16 }}>
            {upstream.length > 0 ? (
              <Table rowKey="id" columns={relationColumns} dataSource={upstream} pagination={false} size="small" />
            ) : (
              <Empty description="暂无上游追溯数据（此功能需调用专属追溯API）" />
            )}
          </Card>

          <Card title="下游使用追溯" size="small">
            {downstream.length > 0 ? (
              <Table rowKey="id" columns={relationColumns} dataSource={downstream} pagination={false} size="small" />
            ) : (
              <Empty description="暂无下游追溯数据（此功能需调用专属追溯API）" />
            )}
          </Card>
        </>
      ) : (
        <Card>
          <Empty description={loading ? '查询中...' : '请输入物料编码和批号开始追溯查询'}>
            <NodeIndexOutlined style={{ fontSize: 48, color: '#0f4a33' }} />
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default TracePage;
