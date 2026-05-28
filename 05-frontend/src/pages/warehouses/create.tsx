import React, { useState } from 'react';
import { history } from 'umi';
import { Card, Form, Input, Button, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const { TextArea } = Input;

const WarehousesCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.post('/warehouses', values);
      message.success('仓库创建成功');
      history.push('/warehouses');
    } catch (err: any) {
      message.error(err.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title={<Space><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.push('/warehouses')} />新建仓库</Space>}>
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
          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="备注信息" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
              <Button onClick={() => history.push('/warehouses')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default WarehousesCreatePage;
