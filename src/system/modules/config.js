import {kit} from '@/system/common/kit'
import config from '@/config/config'
const defaultState = {
  isMobile: false, // 是否为手机
  userInfoKey: 'userInfo', // 用户信息保存的key
  tokenKey: 'accessToken', // token保存的key
  errMsg: '发生点小事故，喝杯茶再来吧~~~', // 错误默认提示
  layout: 'side', // 布局
  theme: 'light', // 主题
  logo: 'https://vue-alain.github.io/img/logo.01ffc33b.svg', // logo路径
  menuName: '测试', // 菜单名字
  defaultPage: '/list/query', // 默认跳转的页面
  ossOpts: { // oss默认配置
    region: '',
    bucket: '',
    // eslint-disable-next-line no-template-curly-in-string
    dir: '', // 存放的文件夹, 为空则为根目录
    policy: '',
    OSSAccessKeyId: '', // 账号ID
    accessKeyId: '', // 账号ID, 修改头部用
    accessKeySecret: '', // Secret
    success_action_status: '200', // 让服务端返回200,不然，默认会返回204
    signature: ''
  },
  login: { // 登录页配置
    title: '登录', // logo 旁边的title
    desc: '这是登录', // logo下方的描述
    isAccount: true, // 是否使用账号登录
    isPhone: true, // 是否使用手机登录
    footer: { // 登录底部配置
      linkList: [],
      copyright: '版权所有'
    },
    account: { // 账号登录所需参数
      loginApi: 'login', // 登录api
      params: {
        account: {
          name: 'account', // 账号对应的参数名
          placeholder: '请输入用户名',
          rules: [{
            enum: 'string',
            message: '请输入用户名',
            whitespace: true,
            required: true
          }] // 表单校验规则
        },
        password: {
          name: 'password', // 密码对应的参数名
          placeholder: '请输入密码',
          rules: [{
            enum: 'string',
            message: '请输入密码',
            whitespace: true,
            required: true
          }] // 表单校验规则
        }
      }
    }, // isAccount 为false时忽略该参数
    phone: { // 手机号登录所需参数
      loginApi: '', // 登录API
      sendCodeApi: '', // 发送验证码的api
      interval: 30, // 发送验证码的间隔,默认30秒
      params: {
        phone: {
          name: 'phone', // 账号对应的参数名
          placeholder: '请输入手机号'
        },
        code: {
          name: 'code', // 验证码对应的参数名
          placeholder: '请输入验证码',
          rules: [{ // 验证码校验规则
            message: '请输入验证码',
            whitespace: true,
            required: true
          }] // 表单校验规则
        }
      }
    }, // isPhone 为false时忽略该参数
    forgetPwd: '', // 忘记密码的跳转路径,如果没有该值则不显示该元素
    register: '' // 注册账号的跳转路径,如果没有该值则不显示该元素
  }
}
const stateConfig = kit.extend(defaultState, config)
export default {
  namespaced: true,
  state: stateConfig,
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setLogo (state, logo) {
      state.logo = logo
    },
    setUserInfo (state, info) {
      if (!kit.isEmpty(info)) {
        kit.cache(stateConfig.userInfoKey, info)
      }
      info = kit.cache(stateConfig.userInfoKey)
      // 设置用户信息
      state.userInfo = info
      state.grade_id = info.grade_id
    },
    /**
     * 设置全局权限
     * @param {object} opts 参数
     * @param {Array} opts.list 权限列表
     * @param {string} opts.type page: 页面权限, api: api权限
     */
    setAuthority (state, opts) {
      const type = opts.type
      let key = 'pageBizList'
      if (type === 'api') {
        key = 'apiBizList'
      }
      if (!kit.isEmpty(opts.list)) {
        kit.cache(key, opts.list)
      }
      const list = kit.cache(key) || []
      const data = []
      for (const item of list) {
        data.push(item.replace(/^\/|\/$/g, ''))
      }
      state[key] = data || []
      kit.cache(key, data || [])
    },
    setToken (state, token) {
      // 保存token
      if (!kit.isEmpty(token)) {
        kit.cache(stateConfig.tokenKey, token)
      }
      token = kit.cache(stateConfig.tokenKey)
      // 设置token信息
      state.token = token
    }
  }
}
