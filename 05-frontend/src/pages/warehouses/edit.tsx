import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { Card, Form, Input, Button, message, Space, Spin, Result, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const { TextArea } = Input;

const WarehousesEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    api.get(`/warehouses/${id}`).then((data) => {
      form.setFieldsValue(data);
      setPageLoading(false);
    }).catch((err) => {
      setPageError(err.message || '加载失败');
      setPageLoading(false);
    });
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.patch(`/warehouses/${id}`, values);
      message.success('仓库更新成功');
      history.push('/warehouses');
    } catch (err: any) {
      message.error(err.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (pageError) return <Result status="error" title="加载失败" subTitle={pageError} extra={<Button onClick={() => history.push('/warehouses')}>返回列表</Button>} />;

  return (
    <div>
      <Card title={<Space><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.push('/warehouses')} />编辑仓库</Space>}>
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 480 }}>
          <Form.Item name="warehouseCode" label="仓库编码" rules={[{ required: true, message: '请输入仓库编码' }, { max: 50 }]}>
            <Input placeholder="手动输入唯一编码" />
          </Form.Item>
          <Form.Item name="warehouseName" label="仓库名称" rules={[{ required: true, message: '请输入仓库名称' }]}>
            <Input placeholder="请输入仓库名称" />
          </Form.Item>
          <Form.Item name="location" label="位置">
            <Input placeholder="如：A栋1层冷库" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select options={[{ label: '启用', value: 'active' }, { label: '停用', value: 'inactive' }]} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="备注信息" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
              <Button onClick={() => history.push('/warehouses')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default WarehousesEditPage;
