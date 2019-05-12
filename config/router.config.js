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
            authority: ['teacher'],
          },
          {
            path: '/lesson/teacherlesson',
            name: '我的课程',
            component: './Lesson/TeacherLesson',
            authority: ['teacher'],
          },
          {
            path: '/lesson/joinlesson',
            name: '加入课程',
            component: './Lesson/JoinLesson',
            authority: ['student'],
          },
          {
            path: '/lesson/access/:lessonId',
            name: '课程审批',
            component: './Lesson/AccessToLesson',
            hideInMenu: true,
            authority: ['teacher'],
          },
          {
            path: '/lesson/:lessonId/task',
            name: '课程任务',
            component: './Lesson/Task',
            hideInMenu: true,
            authority: ['teacher'],
          },
          {
            path: '/lesson/:lessonId/task/:taskId',
            name: '成绩登记',
            component: './Lesson/TaskDetail',
            hideInMenu: true,
            authority: ['teacher'],
          },
        ],
      },
      {
        path: '/score',
        name: '统计查询',
        icon: 'dashboard',
        routes: [
          {
            path: '/score/teachersearch',
            name: '成绩查询',
            component: './Score/TeacherSearch',
            authority: ['teacher'],
          },
          {
            path: '/score/task',
            name: '任务成绩',
            component: './Score/SearchTask',
            hideInMenu: true,
          },
          {
            path: '/score/studentsearch',
            name: '成绩查询',
            component: './Score/StudentSearch',
            authority: ['student'],
          },
          {
            path: '/score/studentanalysis',
            name: '成绩分析',
            component: './Score/StudentAnalysis',
            authority: ['student'],
          },
          {
            path: '/score/teacheranalysis',
            name: '成绩分析',
            component: './Score/TeacherAnalysis',
            authority: ['teacher'],
          },
        ],
      },
    ],
  },
];
