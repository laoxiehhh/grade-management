export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/welcome' },
      // dashboard
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: 'https://github.com/umijs/umi-blocks/tree/master/ant-design-pro',
        name: 'more-blocks',
        icon: 'block',
      },
    ],
  },
];
