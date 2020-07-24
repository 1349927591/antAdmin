import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/system/modules/config'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    config
  }
})
