<template>
  <div>
    <a-input :disabled="disabled" :placeholder="placeholder" @focus="onFocus" @blur="onBlur" v-model="inputValue"
      @change="inputChange"
    ></a-input>
    <div v-show="this.IsDropdownShow" class="data-input-dropdown">
      <ul style="padding-inline-start:0px;">
        <li v-for="item of searchData" value="item" :key="item" class="data-input-item" @mousedown="itemClick(item)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
// 可搜索的input框
export default {
  name: 'searchInput',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    data: {
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
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
    params: { // 访问需要携带的参数, 如{"status":1}
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      IsDropdownShow: false,
      searchData: [],
      list: [],
      inputValue: ''
    }
  },
  watch: {
    data: {
      handler: function (val, oldVal) {
        this.getData(val)
        this.getSearchData()
      },
      deep: true,
      immediate: true
    },
    value: () => {
      this.inputValue = this.value
    }
  },
  mounted () {
    this.inputValue = this.value
    this.getSearchData()
  },
  methods: {
    // 输入框获取到焦点
    onFocus () {
      this.IsDropdownShow = true
      this.getSearchData()
    },
    // 输入框失去焦点
    onBlur () {
      this.IsDropdownShow = false
    },
    // 输入框内容改变
    inputChange () {
      console.log('内容改变')
      this.getSearchData()
      this.$emit('input', this.inputValue)
      this.$emit('change', this.inputValue || '')
    },
    getData (val) {
      if (typeof val === 'object') {
        this.list = []
        for (const item of val) {
          this.list.push(item[this.analysis.value])
        }
      } else if (typeof val === 'string') {
        this.list = []
        // 字符串,需要获取数据
        this.$api.request(this, val, this.params, (res, err) => {
          if (!err) {
            const data = res.data || []
            for (const item of data) {
              this.list.push(item[this.analysis.value])
            }
          }
        })
      }
    },
    getSearchData () {
      this.searchData = []
      if (this.inputValue === '') {
        this.searchData = this.list
        return
      }
      for (const item of this.list) {
        if (item.indexOf(this.inputValue) > -1) {
          this.searchData.push(item)
        }
      }
    },
    // 点击选择
    itemClick (item) {
      this.inputValue = item
      this.$emit('input', this.inputValue)
      this.$emit('change', this.inputValue || '')
    }
  }
}
</script>
<style lang="less" scoped>
  @import url('SystemSearchInput.less');
</style>
