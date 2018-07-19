import index from '.././components/index'
import logAdmin from '.././components/log-admin/logAdmin'
export const otherRouter = {
  path: '/',
  name: 'home',
  redirect: '/home',
  component: index,
  children: [
    {path: 'home', name: 'home_index', component: () => import('@/components/home/home'), meta: {title: '首页'}},
    {path: 'ownspace', name: '个人中心', component: () => import('@/components/personal-center/personalCenter'), meta: {title: '个人中心'}}
  ]
}
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login-登录'
  },
  component: () => import('@/components/login/login')
}
export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/components/error-page/404')
}
export const appRouter = [
  {
    path: '/userAdmin',
    name: 'userAdmin',
    component: index,
    children: [
      {path: 'index', name: '用户管理', component: () => import('@/components/user-admin/userAdmin'), meta: {title: '用户管理'}}
    ]
  },
  {
    path: '/allAdmin',
    name: 'allAdmin',
    component: index,
    children: [
      {path: 'index', name: '全局管理', component: () => import('@/components/all-admin/allAdmin'), meta: {title: '全局管理'}}
    ]
  },
  {
    path: '/historyAdmin',
    name: 'historyAdmin',
    component: index,
    children: [
      {path: 'index', name: '历史管理', component: () => import('@/components/history-admin/historyAdmin'), meta: {title: '历史管理'}}
    ]
  },
  {
    path: '/realtimeAdmin',
    name: 'realtimeAdmin',
    component: index,
    children: [
      {path: 'index', name: '实时牵引管理', component: () => import('@/components/realtime-admin/realtimeAdmin'), meta: {title: '实时牵引管理'}}
    ]
  },
  {
    path: '/maunalAdmin',
    name: 'maunalAdmin',
    component: index,
    children: [
      {path: 'index', name: '手动封停管理', component: () => import('@/components/maunal-admin/maunalAdmin'), meta: {title: '手动封停管理'}}
    ]
  },
  {
    path: '/virtualAdmin',
    name: 'virtualAdmin',
    component: index,
    children: [
      {path: 'index', name: '虚拟牵引', component: () => import('@/components/virtual-admin/virtualAdmin'), meta: {title: '虚拟牵引'}}
    ]
  },
  {
    path: '/tempalteAdmin',
    name: 'templateAdmin',
    component: index,
    children: [
      {path: 'index', name: '权限模版', component: () => import('@/components/template-admin/templateAdmin2'), meta: {title: '权限模板'}}
    ]
  },
  {
    path: '/temporaryDefend',
    name: 'temporaryDefend',
    component: index,
    children: [
      {path: 'index', name: '临时防护管理', component: () => import('@/components/temporary-defend/temporaryDenfend'), meta: {title: '临时防护管理'}}
    ]
  },
  {
    path: '/logAdmin',
    name: 'logAdmin',
    component: index,
    children: [
      {
        path: 'index',
        name: '日志管理',
        component: logAdmin,
        redirect: '/logAdmin/index/loginLog',
        children: [
          {path: '/logAdmin/index/loginLog', name: '登陆历史', component: () => import('@/components/log-admin/log-modules/loginLog'), meta: {title: '登陆日志'}},
          {path: '/logAdmin/index/manualLog', name: '手动封停日志', component: () => import('@/components/log-admin/log-modules/manualLog'), meta: {title: '手动封停日志'}},
          {path: '/logAdmin/index/mistakeLog', name: '错误日志', component: () => import('@/components/log-admin/log-modules/mistakeLog'), meta: {title: '错误日志'}},
          {path: '/logAdmin/index/optionLog', name: '操作日志', component: () => import('@/components/log-admin/log-modules/optionLog'), meta: {title: '操作日志'}},
          {path: '/logAdmin/index/temporaryLog', name: '临时防护日志', component: () => import('@/components/log-admin/log-modules/temporaryLog'), meta: {title: '临时防护日志'}},
          {path: '/logAdmin/index/tracLog', name: '牵引日志', component: () => import('@/components/log-admin/log-modules/tracLog'), meta: {title: '牵引日志'}},
          {path: '/logAdmin/index/virtualLog', name: '虚拟日志', component: () => import('@/components/log-admin/log-modules/virtualLog'), meta: {title: '虚拟日志'}}
        ]
      }
    ]
  }
]

export const routers = [
  otherRouter,
  loginRouter,
  ...appRouter,
  page404
]
