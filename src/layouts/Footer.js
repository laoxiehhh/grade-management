import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '首页',
          title: '首页',
          href: '/welcome',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://github.com/laoxiehhh/grade-management',
          blankTarget: true,
        },
        {
          key: 'Blog',
          title: 'Blog',
          href: 'https://github.com/laoxiehhh/laoxiea',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 武汉理工大学信管出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
