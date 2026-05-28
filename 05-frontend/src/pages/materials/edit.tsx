import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import {
  Card, Form, Input, Select, Switch, Button, message, Space, Spin, Result,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const { TextArea } = Input;

interface MaterialFormValues {
  materialCode: string;
  materialName: string;
  materialCategory: string;
  specification?: string;
  unit: string;
  batchManaged: boolean;
  expiryManaged: boolean;
  status: string;
  storageCondition?: string;
  remark?: string;
}

const MaterialsEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [form] = Form.useForm<MaterialFormValues>();

  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    api.get<any>(`/materials/${id}`)
      .then((material) => {
        form.setFieldsValue(material);
        setPageLoading(false);
      })
      .catch((err) => {
        setPageError(err.message || '加载失败');
        setPageLoading(false);
      });
  }, [id]);

  const onFinish = async (values: MaterialFormValues) => {
    setLoading(true);
    try {
      await api.patch(`/materials/${id}`, values);
      message.success('物料更新成功');
      history.push('/materials');
    } catch (err: any) {
      message.error(err.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageError) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={pageError}
        extra={<Button onClick={() => history.push('/materials')}>返回列表</Button>}
      />
    );
  }

  return (
    <div>
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => history.push('/materials')}
            />
            编辑物料
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 640 }}
        >
          <Form.Item
            name="materialCode"
            label="物料编码"
            rules={[
              { required: true, message: '请输入物料编码' },
              { max: 50, message: '不超过50个字符' },
            ]}
          >
            <Input placeholder="手动输入唯一编码" />
          </Form.Item>

          <Form.Item
            name="materialName"
            label="物料名称"
            rules={[{ required: true, message: '请输入物料名称' }]}
          >
            <Input placeholder="请输入物料名称" />
          </Form.Item>

          <Form.Item
            name="materialCategory"
            label="物料分类"
            rules={[{ required: true, message: '请选择物料分类' }]}
          >
            <Select
              placeholder="请选择分类"
              options={[
                { label: '原辅料', value: '原辅料' },
                { label: '脂质', value: '脂质' },
                { label: '中间体', value: '中间体' },
                { label: '成品', value: '成品' },
                { label: '耗材', value: '耗材' },
                { label: '设备', value: '设备' },
              ]}
            />
          </Form.Item>

          <Form.Item name="specification" label="规格">
            <Input placeholder="规格型号" />
          </Form.Item>

          <Form.Item
            name="unit"
            label="单位"
            rules={[{ required: true, message: '请输入计量单位' }]}
          >
            <Select
              placeholder="请选择单位"
              showSearch
              options={[
                { label: 'mg', value: 'mg' },
                { label: 'g', value: 'g' },
                { label: 'kg', value: 'kg' },
                { label: 'mL', value: 'mL' },
                { label: 'L', value: 'L' },
                { label: '支', value: '支' },
                { label: '瓶', value: '瓶' },
                { label: '盒', value: '盒' },
                { label: '包', value: '包' },
                { label: '批', value: '批' },
                { label: '个', value: '个' },
                { label: '台', value: '台' },
                { label: '套', value: '套' },
                { label: '片', value: '片' },
                { label: '卷', value: '卷' },
              ]}
            />
          </Form.Item>

          <Form.Item name="batchManaged" label="批次管理" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="expiryManaged" label="效期管理" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '启用', value: 'active' },
                { label: '停用', value: 'inactive' },
              ]}
            />
          </Form.Item>

          <Form.Item name="storageCondition" label="存储条件">
            <Input placeholder="如：2-8°C 冷藏、-20°C 冷冻" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="备注信息" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => history.push('/materials')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MaterialsEditPage;
