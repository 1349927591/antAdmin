/**
 * api配置
 */
'use strict'
export default {
  domain: 'http://127.0.0.1/', // api域名
  codeParam: 'errno', // 错误码对应的参数
  msgParam: 'errmsg', // 错误信息对应的参数
  data: 'data', // data对应的参数,如果是多级,可以用data.data这种方式
  successCode: 0, // 正确回调的code
  isAuthority: true, // 是否判断权限
  isLogin: true, // 是否登录才能访问
  loginExpireCode: 2, // 登录过期的code
  authorityCode: 999, // 权限错误的code
  token: 'data.data.token', // 登录的时候返回的数据里对应的token参数
  requestToken: '', // 访问接口携带的token的key,如果接口需要登录则会加载GET参数上,如果不想带上,则设置为空
  isHandle: true, // 是否处理返回res.data, 而不是res
  curpageParam: 'curpage', // 当前页参数
  pageSizeParam: 'recordcount', // 当前页所需条数参数
  orderParam: 'order' // 排序所需参数
}
