/**
 * api请求控制封装
 * API权限控制,判断登录过期等功能封装
 */
import {
  kit
} from '@/system/common/kit'
import load from '@/system/common/load'
export default {
  /**
   * 同步请求api
   * @param {*} ctx
   * @param {*} api
   * @param {*} [params={}]
   */
  request (ctx, api, params = {}, callback = 'json', responseType = 'json') {
    if (typeof callback !== 'function') {
      const that = this
      return new Promise((resolve, reject) => {
        that.requestBase(ctx, api, params, (res, err) => {
          if (err) {
            reject(err)
            return false
          }
          resolve(res)
        }, callback)
      })
    } else {
      return this.requestBase(ctx, api, params, callback, responseType)
    }
  },

  /**
   * 请求API
   * @param {context} ctx
   * @param {string} api 如果是调用共有api,但是路径不同,可以用 base:user/auth/login 实现
   * @param {object} params
   * @param {Function} callback 正确访问后的回调
   */
  requestBase (ctx, api, params = {}, callback, responseType = 'json') {
    try {
      if (kit.isEmpty(ctx)) {
        // eslint-disable-next-line no-throw-literal
        throw '缺少ctx参数'
      }
      if (kit.isEmpty(api)) {
        // eslint-disable-next-line no-throw-literal
        throw '缺少api参数'
      }
      const {
        base,
        config
      } = this.getConfig(api)
      if (kit.isEmpty(config.path)) {
        // eslint-disable-next-line no-throw-literal
        throw `api【${api}】没有配置path`
      }
      let url = config.domain + config.path
      // 将标准分页和排序字段转为配置字段
      if (!kit.isEmpty(params)) {
        if (!kit.isEmpty(params.current)) {
          const curpage = params.current
          delete params.current
          params[config.curpageParam] = curpage
        }
        if (!kit.isEmpty(params.pageSize)) {
          const pageSize = params.pageSize
          delete params.pageSize
          params[config.pageSizeParam] = pageSize
        }
        if (!kit.isEmpty(params.order)) {
          const order = params.order
          delete params.order
          params[config.orderParam] = order
        }
      }
      // 判断是否处于登录中
      if (config.isLogin) {
        // 需要判断登录
        if (!this.isLogin(ctx)) {
          // 没有处于登录中,需要跳转登录
          this.jumpLogin(ctx)
          return
        }
        if (!kit.isEmpty(config.requestToken)) {
          // 需要在请求后面加上token
          const token = ctx.$store.state.config.token
          url += (url.indexOf('?') > -1 ? '&' : '?') + `${config.requestToken}=${token}`
        }
      }
      // 判断权限
      if (config.isAuthority && !this.isAuthority(ctx, api)) {
        // 没有权限
        // ctx.$message.error(`api ${config.path}暂无权限,请联系管理员`)
        callback(null, `api ${config.path}暂无权限,请联系管理员`)
        return
      }
      const ajaxParams = {
        api,
        url,
        params
      }
      // 调用 before 行为
      this.call(ctx, base, config, 'before', ajaxParams)
      // 开始请求
      kit.axios(ajaxParams.url, ajaxParams.params, 'post', responseType, (res) => { // 正确请求回调
        if (typeof res.data !== 'object' && responseType !== 'json') {
          callback(res.data, null)
          return
        }
        // 判断是否登录过期
        const code = kit.getRuleParam(res.data, config.codeParam)
        // eslint-disable-next-line eqeqeq
        if (code == config.loginExpireCode) {
          // 登录过期
          this.jumpLogin(ctx)
          return
        }
        // eslint-disable-next-line eqeqeq
        if (code == config.authorityCode) {
          ctx.$message.error(`api ${config.path}暂无权限,请联系管理员`)
          callback(null, `api ${config.path}暂无权限,请联系管理员`)
          return
        }
        // eslint-disable-next-line eqeqeq
        const isSuccess = kit.getRuleParam(res.data, config.codeParam) == config.successCode // 是否为正确code返回
        const reqData = kit.getRuleParam(res.data, config.data)
        const reqMsg = kit.getRuleParam(res.data, config.msgParam)
        // 将数据强制转换为固定格式 {"data":{}, "code": 0, "msg": ""}
        res.data = {
          data: reqData,
          msg: reqMsg,
          code: kit.getRuleParam(res.data, config.codeParam),
          isSuccess: isSuccess
        }
        const successParams = {
          api,
          res
        }
        if (config.isHandle) {
          // 需要处理返回的消息
          successParams.res = res.data || {}
        }
        if (!isSuccess) {
          ctx.$message.error(reqMsg || ctx.$store.state.config.errMsg)
        }
        // 调用 success 回调钩子
        this.call(ctx, base, config, 'success', successParams)
        if (typeof callback === 'function') {
          callback(successParams.res, null)
        }
      }, (err) => { // 请求错误
        ctx.$message.error(kit.isEmpty(err) ? ctx.$store.state.config.errMsg : JSON.stringify(err))
        // 调用 error 回调
        this.call(ctx, base, config, 'error', {
          api,
          err
        })
        if (typeof callback === 'function') {
          callback(null, err)
        }
      })
    } catch (e) {
      if (typeof callback === 'function') {
        ctx.$message.error(kit.isEmpty(e) ? ctx.$store.state.config.errMsg : JSON.stringify(e))
        callback(null, e)
      }
    }
  },

  /**
   * 获取API配置
   * @param {context} ctx
   * @param {string} api
   */
  getConfig (api) {
    const {config, apiHandler} = load.loadAll()
    if (kit.isEmpty(api)) {
      throw new Error('缺少api参数')
    }
    const apiArr = api.split(':')
    api = apiArr[0]
    const apiPath = apiArr[1] || ''
    const apiParams = api.split('?') // 解析有无 login?xxx=xxx这种类型
    api = apiParams[0]
    if (kit.isEmpty(config)) {
      throw new Error('缺少config参数')
    }
    if (kit.isEmpty(apiHandler)) {
      throw new Error('缺少apiHandler参数')
    }
    if (kit.isEmpty(apiHandler.base)) {
      throw new Error('缺少apiHandler base参数')
    }
    let apiConfig = config
    if (!kit.isEmpty(apiHandler.custom) && kit.isObject(apiHandler.custom)) {
      // 如果存在自定义处理器,则查找是否由当前api的
      const custom = apiHandler.custom[api]
      if (!kit.isEmpty(custom)) {
        if (kit.isString(custom)) {
          // 字符串, 直接当做api处理
          apiConfig.path = custom
        }
        if (kit.isObject(custom)) {
          apiConfig = Object.assign({}, apiConfig, custom)
        }
      }
    }
    apiConfig.path = apiPath || apiConfig.path
    if (!kit.isEmpty(apiParams[1])) {
      apiConfig.path += (apiConfig.path.indexOf('?') > -1 ? '&' : '?') + apiParams[1]
    }
    return {
      base: apiHandler.base,
      config: apiConfig
    }
  },

  /**
   * 获取权限列表
   * @param {context} ctx
   */
  getAuthorityList (ctx) {
    return ctx.$store.state.config.apiBizList || []
  },

  /**
   * 判断是否有权限
   * @param {string} api 需要判断权限的api路径
   * @param {object} config api的config配置
   */
  isAuthority (ctx, api) {
    const apiList = this.getAuthorityList(ctx)
    const {
      config
    } = this.getConfig(api)
    if (kit.isEmpty(config) || kit.isEmpty(config.path)) {
      return false
    }
    let path = config.path.split('?')[0]
    path = path.replace(/^\/|\/$/g, '')
    if (apiList.indexOf(path) > -1) {
      return true // 有api权限
    }
    return false
  },

  /**
   * 调用处理器
   * @param {class} base
   * @param {object} handler
   * @param {string} behavior 行为
   * @param {string} param 参数
   */
  call (ctx, baseHandler, handler, behavior = 'before', param = {}) {
    const baseBehavior = baseHandler['before']
    if (!kit.isEmpty(handler) && !kit.isEmpty(handler[behavior]) && kit.isFunction(handler[behavior])) {
      const handlerBehavior = handler[behavior]
      handlerBehavior(param, ctx, baseBehavior)
      return
    }
    baseBehavior(param, ctx)
  },

  /**
   * 判断是否处于登录状态
   */
  isLogin (ctx) {
    if (kit.isEmpty(ctx.$store.state.config.userInfo) || kit.isEmpty(ctx.$store.state.config.token)) {
      // 用户信息或者token不存在,则认为不处于登录状态
      return false
    }
    return true
  },

  /**
   * 跳转登录
   */
  jumpLogin (ctx) {
    ctx.$router.push({
      name: 'login'
    })
  }
}
