import RouterView from '@/system/page/router/SystemRouter'
export const title = '' // 默认页面标题
export const errorRouter = {
  path: '/error',
  name: 'error',
  invisible: true,
  meta: {
    title: '错误',
    isAuthority: false // 不需要校验权限
  },
  component: () => import('@/system/page/error/error')
}
export const routers = [
  {
    path: '/login',
    name: 'login',
    invisible: true,
    meta: {
      title: '登录',
      isAuthority: false // 不需要校验权限
    },
    component: () => import('@/system/page/login/SystemLogin')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/list/plan',
    invisible: true,
    component: () => import('@/system/page/menu/SystemMenuView'),
    icon: 'none',
    children: [
      {
        path: '/system',
        name: '系统管理',
        component: RouterView,
        icon: 'tool',
        children: [
          {
            path: '/system/authority',
            name: '权限列表',
            component: () => import('@/system/page/authority/SystemAuthority'),
            icon: 'none'
          }
        ]
      }
    ]
  }
]
