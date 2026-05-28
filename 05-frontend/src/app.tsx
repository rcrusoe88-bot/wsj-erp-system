import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#0f4a33',
          colorSuccess: '#2c7a55',
          colorWarning: '#8a6308',
          colorError: '#a8331f',
          colorInfo: '#3d4bc4',
          fontFamily: `"Microsoft YaHei UI","PingFang SC",system-ui,sans-serif`,
          borderRadius: 6,
        },
      }}
    >
      {container}
    </ConfigProvider>
  );
}
