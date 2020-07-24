<!-- 框架组件-手机号验证 -->
<template>
  <a-form :form="form">
    <a-form-item>
      <a-input v-decorator="phoneDecorator" size="large" :placeholder="params.params.phone.placeholder">
        <a-icon slot="prefix" type="mobile" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-row :gutter="8" style="margin: 0 -4px">
        <a-col :span="16">
          <a-form-item>
            <a-input v-decorator="codeDecorator" size="large" :placeholder="params.params.code.placeholder">
              <a-icon slot="prefix" type="mail" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8" style="padding-left: 4px">
          <a-button @click="sendCode" :disabled="sending" style="width: 100%" class="captcha-button" size="large">{{codeButtonText}}</a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
</template>5
<script>
function getDefault () {
  return {
    sendCodeApi: '', // 发送验证码的api
    interval: 30, // 发送验证码的间隔,默认30秒
    params: {
      phone: {
        name: 'phone', // 手机号对应的参数名
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
  }
}
export default {
  name: 'SystemPhone',
  beforeCreate () {
    this.form = this.$form.createForm(this, {name: 'phone'})
  },
  props: {
    options: {
      type: Object,
      default: function () {
        return getDefault()
      }
    }
  },
  watch: {
    options: {
      handler: function (val, oldVal) {
        this.params = this.$kit.extend(this.params, getDefault(), this.options, val)
        this.phoneDecorator[0] = this.params.params.phone.name
        this.phoneDecorator[1] = {
          rules: this.phoneRules
        }
        this.codeDecorator[0] = this.params.params.code.name
        this.codeDecorator[1] = {
          rules: this.params.params.code.rules
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      sending: false, // 发送验证码发送中
      codeButtonText: '发送验证码',
      params: {},
      phoneDecorator: [],
      codeDecorator: [],
      phoneRules: [ // 手机号验证规则
        {
          required: true,
          whitespace: true,
          message: '请输入手机号'
        },
        {
          pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
          message: '请输入正确的手机号'
        }
      ]
    }
  },
  methods: {
    sendCode () {
      this.form.validateFields(['phone'], (err, values) => {
        if (!err) {
          // 校验正确,调用发送验证码接口
          if (this.$kit.isEmpty(this.params.sendCodeApi)) {
            this.$message.error('短信服务缺失, 请联系管理员')
            return
          }
          this.sending = true // 验证码发送中
          const codeParams = {}
          const key = this.params.params.phone.name
          codeParams[key] = this.form.getFieldValue(key)
          this.$api.request(this, this.params.sendCodeApi, codeParams, (res) => {
            if (this.params.interval > 0) {
              // 如果间隔大于0,则出现倒计时
              let interval = this.params.interval
              this.codeButtonText = `发送中(${interval})`
              const sendCodeTime = setInterval(() => {
                if (interval <= 1) {
                  clearInterval(sendCodeTime)
                  this.codeButtonText = '发送验证码'
                  this.sending = false
                  return
                }
                this.codeButtonText = `发送中(${--interval})`
              }, 1000)
            } else {
              this.sending = false
            }
          })
        }
      })
    }
  },
  mounted () {
    this.options.form = this.form
  }
}
</script>

<style lang="less" scoped>
  @import url('SystemPhone.less');
</style>
