export default {
  common: {
    domain: '', // api域名
    codeParam: 'errno', // 错误码对应的参数
    msgParam: 'errmsg', // 错误信息对应的参数
    data: 'data', // data对应的参数,如果是多级,可以用data.data这种方式
    successCode: 0, // 正确回调的code
    loginExpireCode: 2, // 登录过期的code
    isHandle: true, // 是否处理返回res.data, 而不是res
    curpageParam: 'curpage', // 当前页参数
    pageSizeParam: 'recordcount', // 当前页所需条数参数
    orderParam: 'order', // 排序所需参数
    requestToken: 'access_token' // // 访问接口携带的token的key,如果接口需要登录则会加载GET参数上,如果不想带上,则设置为空
  },
  // 登录
  login: {
    path: 'user/auth/login',
    isLogin: false,
    isAuthority: false,
    success: function (param, ctx) {
      const res = param.res
      if (res.isSuccess) {
        const data = res.data
        ctx.$store.commit('config/setUserInfo', data)
        ctx.$store.commit('config/setToken', data.access_token)
        // 格式化权限
        const roleList = data.role_list
        const pageBizList = [] // 前端权限
        const apiBizList = [] // api权限
        for (const role of roleList) {
          if (!ctx.$kit.isEmpty(role) && !ctx.$kit.isEmpty(role.biz_list)) {
            for (const biz of role.biz_list) {
              if (!ctx.$kit.isEmpty(biz.cf)) {
                // 存在前端权限
                pageBizList.push(biz.cf)
              }
              if (!ctx.$kit.isEmpty(biz.api_code)) {
                // 存在api权限
                const api = biz.api_code.replace(/^\/|\/$/g, '')
                if (apiBizList.indexOf(api) === -1) {
                  apiBizList.push(api)
                }
              }
            }
          }
        }
        ctx.$store.commit('config/setAuthority', {
          type: 'page',
          list: pageBizList
        }) // 报存前端权限
        ctx.$store.commit('config/setAuthority', {
          type: 'api',
          list: apiBizList
        }) // 保存api权限
      }
    }
  },
  // 获取计划列表
  planList: 'ad/info/lists',
  planAdd: 'ad/info/create',
  positionList: 'ad/position/lists',
  report: 'ad/info/daily'
}
