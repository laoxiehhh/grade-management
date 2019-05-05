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
    Routes: ['src/pages/Authorized'],
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
        path: '/system',
        name: '系统管理',
        icon: 'dashboard',
        authority: ['admin'],
        routes: [
          {
            path: '/system/profession',
            name: '创建专业',
            component: './System/Profession',
          },
          {
            path: '/system/class',
            name: '创建班级',
            component: './System/Class',
          },
          {
            path: '/system/assessmentCategory',
            name: '创建考核类别',
            component: './System/AssessmentCategory',
          },
        ],
      },
      {
        path: '/lesson',
        name: '课程管理',
        icon: 'project',
        routes: [
          {
            path: '/lesson/create',
            name: '创建课程',
            component: './Lesson/CreateLesson',
          },
          {
            path: '/lesson/mylessons',
            name: '我的课程',
            component: './Lesson/MyLesson',
          },
        ],
      },
    ],
  },
];
