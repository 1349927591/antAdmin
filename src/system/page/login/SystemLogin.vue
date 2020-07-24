<!-- 框架页面级组件-登录主键 -->
<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="header">
          <img alt="logo" class="logo" :src="logo" />
          <span class="title">{{params.title}}</span>
        </div>
        <div class="desc">{{params.desc}}</div>
      </div>
      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-tabs v-model="loginType" size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
            <a-tab-pane v-if="params.isAccount" style="height: 131px;" tab="账号登录" key="account">
              <a-form-item>
                <a-input v-decorator="accountDecorator" size="large" :placeholder="params.account.params.account.placeholder" >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input v-decorator="pwdDecorator" size="large" :placeholder="params.account.params.password.placeholder" type="password">
                  <a-icon slot="prefix" type="lock" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
            <a-tab-pane v-if="params.isPhone" style="height: 131px;" tab="手机登录" key="phone">
              <system-phone :options="systemPhoneOptions"></system-phone>
            </a-tab-pane>
          </a-tabs>
          <div style="text-align:right">
            <router-link style="margin-right:10px;" v-if="params.forgetPwd != ''" :to="params.forgetPwd">忘记密码</router-link>
            <router-link v-if="params.register != ''" :to="params.register">注册账号</router-link>
          </div>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
      <system-footer :link-list="params.footer.linkList" :copyright="params.footer.copyright" />
    </div>
  </div>
</template>
<script>
import SystemPhone from '@/system/components/phone/SystemPhone'
import SystemFooter from '@/system/components/footer/SystemFooter'
function getDefault () {
  return {
    title: '登录', // logo 旁边的title
    desc: '', // logo下方的描述
    isAccount: true, // 是否使用账号登录
    isPhone: true, // 是否使用手机登录
    footer: { // 登录底部配置
      linkList: [],
      copyright: ''
    },
    account: { // 账号登录所需参数
      loginApi: '', // 登录api
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
          name: 'account', // 账号对应的参数名
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
export default {
  name: 'SystemLogin',
  components: {SystemPhone, SystemFooter},
  beforeCreate () {
    this.form = this.$form.createForm(this, {name: 'account'})
  },
  computed: {
    logo () {
      return this.$store.state.config.logo
    },
    options () {
      return this.$store.state.config.login
    }
  },
  data () {
    return {
      logging: false, // 是否显示加载
      params: getDefault(),
      loginType: '', // 当前选择的登录方式
      accountDecorator: [],
      pwdDecorator: [],
      systemPhoneOptions: {
        from: null
      }
    }
  },
  methods: {
    onSubmit (e) {
      e.preventDefault()
      switch (this.loginType) {
        case 'account':
          this.accountLogin()
          break
        case 'phone':
          this.phoneLogin()
          break
      }
    },
    // 账号密码登录
    accountLogin () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$kit.isEmpty(this.params.account.loginApi)) {
            this.$message.error('缺少登录服务,请联系管理员')
            return
          }
          this.logging = true
          this.$api.request(this, this.params.account.loginApi, values, (res, err) => {
            this.logging = false
            this.loginAfter(res, err)
          })
        }
      })
    },
    // 手机号码登录
    phoneLogin () {
      this.systemPhoneOptions.form.validateFields((err, values) => {
        if (!err) {
          if (this.$kit.isEmpty(this.params.phone.loginApi)) {
            this.$message.error('缺少登录服务,请联系管理员')
            return
          }
          this.logging = true
          this.$api.request(this, this.params.phone.loginApi, values, (res, err) => {
            this.logging = false
            this.loginAfter(res, err)
          })
        }
      })
    },
    // 登录后处理
    loginAfter (data, err) {
      const errmsg = this.$store.state.config.errMsg
      if (!this.$kit.isEmpty(err)) {
        return false
      }
      if (this.$kit.isEmpty(data)) {
        this.$message.error(errmsg)
        return false
      }
      if (!data.isSuccess) {
        return false
      }
    },
    // 初始化
    init () {
      this.params = this.$kit.extend(this.params, this.options)
      if (this.params.isAccount) {
        this.loginType = 'account'
      } else if (this.params.isPhone) {
        this.loginType = 'phone'
      }
      this.accountDecorator[0] = this.params.account.params.account.name
      this.accountDecorator[1] = {
        rules: this.params.account.params.account.rules
      }
      this.pwdDecorator[0] = this.params.account.params.password.name
      this.pwdDecorator[1] = {
        rules: this.params.account.params.password.rules
      }
      if (!this.$kit.isEmpty(this.params.phone)) {
        for (const key in this.params.phone) {
          this.systemPhoneOptions[key] = this.params.phone[key]
        }
      }
    }
  },
  mounted () {
    // 处于登录页, 清除所有信息
    this.$kit.clearCache()
    this.init()
    console.log(this)
  }
}
</script>
<style lang="less">
  @import url('SystemLogin.less');
</style>
