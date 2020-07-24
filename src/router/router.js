/**
 * 路由配置
 */
// import Vue from 'vue'
// import Router from 'vue-router'
import RouterView from '@/system/page/router/SystemRouter'
// Vue.use(Router)
export const title = '' // 默认页面标题
export const routers = [
  {
    path: '/',
    name: 'index',
    redirect: '/list/plan',
    invisible: true,
    component: () => import('@/system/page/menu/SystemMenuView'),
    icon: 'none',
    children: [
      {
        path: '/list',
        name: '列表页',
        component: RouterView,
        icon: 'table',
        children: [
          {
            path: '/list/plan',
            name: '查询表格',
            component: () => import('@/views/ad/planList'),
            icon: 'none'
          }
        ]
      },
      {
        path: '/report',
        name: '报表页',
        component: RouterView,
        icon: 'pie-chart',
        children: [
          {
            path: '/report/a',
            name: '基础报表',
            component: () => import('@/views/report/a'),
            icon: 'none'
          }
        ]
      },
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
