<!-- 选择组件 -->
<template>
  <a-select
    v-bind:value="typeof value === 'string' && ['multiple', 'tags'].indexOf(mode) > -1 ? value.split(',') : ((value === 'string' || typeof value === 'number') ? value + '' : value)"
    @change="onChange"
    :placeholder="placeholder" :showSearch="showSearch"
    :allowClear="allowClear" :mode="mode"
    :disabled="disabled"
  >
    <a-select-option :key="index" v-for="(item, index) in list" :value="item[analysis.key]">{{item[analysis.value]}}</a-select-option>
  </a-select>
</template>
<script>

export default {
  name: 'SystemSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    data: { // 数据源,如果是字符串则认为是调用ajax去获取,如果是数组就直接用
      default: []
    },
    params: { // 访问需要携带的参数, 如{"status":1}
      type: Object,
      default: () => {
        return {}
      }
    },
    analysis: { // data数据的解析
      type: Object,
      default: () => {
        return {
          key: 'key',
          value: 'value'
        }
      }
    },
    value: {
      default: undefined
    },
    mode: { // 模式 'default' | 'multiple' | 'tags' | 'combobox'
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    params: {
      handler: function () {
        this.update(this.data)
      }
    },
    data: {
      handler: function (val) {
        this.update(val)
      },
      immediate: true
    }
  },
  methods: {
    update (val) {
      if (typeof val === 'object') {
        this.list = []
        for (const item of val) {
          const tempItem = {}
          tempItem[this.analysis.key] = item[this.analysis.key] + ''
          tempItem[this.analysis.value] = item[this.analysis.value]
          this.list.push(tempItem)
        }
      } else if (typeof val === 'string') {
        this.list = []
        // 字符串,需要获取数据
        this.$api.request(this, val, this.params, (res, err) => {
          if (!err) {
            const data = res.data || []
            for (const item of data) {
              const obj = {}
              obj[this.analysis.key] = item[this.analysis.key] + ''
              obj[this.analysis.value] = item[this.analysis.value]
              this.list.push(obj)
            }
          }
        })
      }
    },
    onChange (value) {
      this.$emit('input', value || '')
      this.$emit('change', value || '')
    }
  },
  data () {
    return {
      list: []
    }
  }
}
</script>
