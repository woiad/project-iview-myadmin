import index from '.././components/index'
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
      {path: 'index', name: '虚拟管理', component: () => import('@/components/virtual-admin/virtualAdmin'), meta: {title: '虚拟管理'}}
    ]
  }
]

export const routers = [
  otherRouter,
  loginRouter,
  ...appRouter,
  page404
]
