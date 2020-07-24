// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router/router'
import {router} from '@/system/router'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import store from './store'
import load from '@/system/common/load'
import {kit} from '@/system/common/kit'
import API from '@/system/api/request'
Vue.prototype.$kit = kit
Vue.prototype.$apiConfig = load.loadAll()
Vue.prototype.$api = API

Vue.use(Viser)
Vue.use(Antd)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted () {
    /** 自定义全局指令 */
    load.directive(Vue, this)
  }
})
