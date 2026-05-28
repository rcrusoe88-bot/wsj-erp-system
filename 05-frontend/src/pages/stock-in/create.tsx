import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import {
  Card, Form, Select, Input, InputNumber, Button, message, Space, DatePicker, Divider,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { api } from '@/services/api';

const StockInCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    api.get<any[]>('/warehouses').then((res) => setWarehouses(Array.isArray(res) ? res : (res as any).data || [])).catch(() => {});
    api.get<any[]>('/materials').then((res) => setMaterials(Array.isArray(res) ? res : (res as any).data || [])).catch(() => {});
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        items: values.items.map((item: any) => ({
          ...item,
          productionDate: item.productionDate?.toISOString(),
          expiryDate: item.expiryDate?.toISOString(),
        })),
      };
      await api.post('/stock-in', payload);
      message.success('入库申请创建成功');
      history.push('/stock-in');
    } catch (err: any) {
      message.error(err.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title={<Space><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.push('/stock-in')} />新建入库申请</Space>}>
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 800 }}>
          <Space size="large" wrap style={{ display: 'flex' }}>
            <Form.Item name="stockInType" label="入库类型" rules={[{ required: true, message: '请选择' }]}>
              <Select style={{ width: 200 }} options={[
                { label: '采购入库', value: 'purchase' }, { label: '生产入库', value: 'production' }, { label: '退货入库', value: 'return' },
              ]} />
            </Form.Item>
            <Form.Item name="warehouseId" label="目标仓库" rules={[{ required: true, message: '请选择' }]}>
              <Select style={{ width: 200 }} showSearch optionFilterProp="label"
                options={warehouses.map((w: any) => ({ label: w.warehouseName, value: w.id }))}
              />
            </Form.Item>
          </Space>
          <Form.Item name="sourceReference" label="来源单号">
            <Input placeholder="采购单号/生产批号" style={{ width: 280 }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="备注信息" style={{ width: 400 }} />
          </Form.Item>

          <Divider>入库明细</Divider>

          <Form.List name="items" rules={[{ required: true, validator: async (_, value) => { if (!value || value.length === 0) throw new Error('至少添加一个物料'); } }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Card key={key} size="small" style={{ marginBottom: 12, background: '#fafafa' }} extra={fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#a8331f' }} />}>
                    <Space wrap align="start">
                      <Form.Item {...rest} name={[name, 'materialId']} label="物料" rules={[{ required: true }]}>
                        <Select style={{ width: 180 }} showSearch optionFilterProp="label"
                          options={materials.map((m: any) => ({ label: `[${m.materialCode}] ${m.materialName}`, value: m.id }))}
                        />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'lotNumber']} label="批号" rules={[{ required: true }]}>
                        <Input style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'quantity']} label="数量" rules={[{ required: true }]}>
                        <InputNumber min={0.000001} step={0.01} style={{ width: 120 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'unit']} label="单位" rules={[{ required: true }]}>
                        <Select style={{ width: 90 }} options={[
                          { label: 'mg', value: 'mg' }, { label: 'g', value: 'g' }, { label: 'kg', value: 'kg' },
                          { label: 'mL', value: 'mL' }, { label: 'L', value: 'L' }, { label: '支', value: '支' },
                          { label: '瓶', value: '瓶' }, { label: '盒', value: '盒' },
                        ]} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'productionDate']} label="生产日期">
                        <DatePicker style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'expiryDate']} label="效期至">
                        <DatePicker style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, 'remark']} label="备注">
                        <Input style={{ width: 140 }} />
                      </Form.Item>
                    </Space>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加物料</Button>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
              <Button onClick={() => history.push('/stock-in')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StockInCreatePage;
