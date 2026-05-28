import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ImportOutlined,
  ExportOutlined,
  AuditOutlined,
  AlertOutlined,
} from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审批入库"
              value={0}
              prefix={<ImportOutlined />}
              valueStyle={{ color: '#0f4a33' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审批出库"
              value={0}
              prefix={<ExportOutlined />}
              valueStyle={{ color: '#8a6308' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日审批完成"
              value={0}
              prefix={<AuditOutlined />}
              valueStyle={{ color: '#2c7a55' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="临期预警"
              value={0}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#a8331f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="最近入库记录">
            <div style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
              暂无数据
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最近出库记录">
            <div style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
              暂无数据
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
