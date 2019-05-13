import React from 'react';
import HomeImg from '@/assets/home.jpg';
import { Typography } from 'antd';

const { Title } = Typography;

export default () => (
  <div style={{ textAlign: 'center', marginTop: '150px' }}>
    <img src={HomeImg} alt="home" />
    <Title>平时成绩管理系统</Title>
  </div>
);
