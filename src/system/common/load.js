/**
 * 加载配置
 */
import {
  kit
} from '@/system/common/kit' // api默认配置
import API from '@/system/api/request'
export default {
  // 加载所有
  loadAll: function () {
    const config = this.loadApiConfig()
    const apiHandler = this.loadApiHandler()
    return {
      config,
      apiHandler
    }
  },
  // 加载api配置
  loadApiConfig: function () {
    const apiDefaultConfig = require('@/system/api/config').default || {}
    return apiDefaultConfig
  },
  /**
   * 加载Api处理器
   * 路径 @/api/request/handle
   */
  loadApiHandler: function () {
    // 加载所有处理器
    let handle = {}
    const requestBase = require('@/system/api/request/handle/base')['default']
    try {
      const files = require.context('@/api', true, /\.js$/)
      files.keys().forEach(key => {
        const fileName = key.replace(/(\.\/|\.js)/g, '')
        handle[fileName] = files(key)['default']
      })
    } catch (e) {
      console.log(handle, e)
    }
    if (kit.isEmpty(handle)) {
      throw new Error('缺少处理器')
    }
    if (kit.isEmpty(requestBase)) {
      throw new Error('缺少 base 处理器')
    }
    const custom = {} // 自定义处理器
    for (const key in handle) {
      const item = handle[key]
      if (!kit.isEmpty(item) && kit.isObject(item)) {
        const common = item['common'] || {}
        for (const hKey in item) {
          if (hKey === 'common') {
            continue
          }
          let api = item[hKey]
          if (!kit.isEmpty(api)) {
            if (kit.isString(api)) {
              api = {
                path: api
              }
            }
            custom[hKey] = Object.assign({}, common, api)
          }
        }
      }
    }
    return {
      base: requestBase, // 基础处理器
      custom // 自定义处理器
    }
  },

  /**
   * 初始化
   */
  init: function (ctx) {
    console.log(ctx.$route)
    ctx.$kit.enquireScreen(isMobile => {
      ctx.$store.commit('config/setDevice', isMobile)
    })
    const config = ctx.$store.state.config
    const userInfo = ctx.$kit.cache(config.userInfoKey)
    const token = ctx.$kit.cache(config.tokenKey)
    if (!ctx.$kit.isEmpty(userInfo) && !ctx.$kit.isEmpty(token)) {
      // 获取到用户信息
      ctx.$store.commit('config/setUserInfo', userInfo)
      ctx.$store.commit('config/setToken', token)
      // 加载权限
      ctx.$store.commit('config/setAuthority', {type: 'page'})
      ctx.$store.commit('config/setAuthority', {type: 'api'})
    }
  },
  /**
   * 加载全局指令
   * @param {Vue} vue
   */
  directive: function (vue, ctx) {
    // 判断权限的指令, 没权限会删除元素
    vue.directive('authority', {
      inserted: (el, data) => {
        const api = data.value
        if (kit.isEmpty(api)) {
          el.parentNode.removeChild(el)
          return
        }
        const isAuth = API.isAuthority(ctx, api)
        if (!isAuth) {
          // 没有权限,删除元素
          console.log(api)
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}
