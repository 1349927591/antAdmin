/** 路由处理 */
import Vue from 'vue'
import Router from 'vue-router'
import {kit} from '@/system/common/kit'
import {title as systemTitle, errorRouter as systemErrorRouter, routers as systemRouter} from '@/system/router/router'
import {title, routers} from '@/router/router'

Vue.use(Router)

routers.push(systemErrorRouter)

const routerList = mergeRouter(systemRouter || [], routers || [])

// 路由配置
const RouterConfig = {
  routes: routerList
}
export const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
  kit.setTitle(to.meta.title || title || systemTitle) // 设置标题
  if (to.meta.isAuthority !== false) {
    if (!kit.isPageAuthority(to.path)) {
      // 没有权限
      next({
        replace: true,
        name: 'login'
      })
      return false
    }
  }
  next()
})

/**
 * 合并路由
 * @param {Array} sourceRouter 源路由
 * @param {Array} otherRouter 需要合并进来的路由
 */
function mergeRouter (sourceRouter = [], otherRouter = []) {
  for (var item of sourceRouter) {
    var routerItem = isExist(item, otherRouter)
    if (!routerItem) {
      otherRouter.push(item)
    } else {
      if (item.children && item.children.length > 0) {
        if (!routerItem.children || routerItem.children.length === 0) {
          routerItem.children = item.children || []
        } else {
          routerItem.children = mergeRouter(item.children, routerItem.children)
        }
      }
    }
  }
  return otherRouter
}

function isExist (item, routers) {
  for (var rItem of routers) {
    if (item['name'] === rItem['name']) {
      return rItem
    }
  }
  return false
}
