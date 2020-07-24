<!-- 日期组件 -->
<template>
  <a-range-picker
   :ranges="ranges"
   :placeholder="['开始日期', '结束日期']"
   :allowClear="allowClear"
   :defaultValue="value"
   @change="onChange"
  />
</template>
<script>
import moment from 'moment'
import {kit} from '@/system/common/kit'
export default {
  name: 'SystemDrawer',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ranges: {
        '今天': this.getDay(),
        '本周': this.getWeek(),
        '本月': this.getMonth()
      },
      moment
    }
  },
  methods: {
    // 获取当天日期
    getDay () {
      return [moment(new Date()), moment(new Date())]
    },
    // 获取本周 结尾为今天
    getWeek () {
      const nowDate = new Date()
      const startWeek = new Date(nowDate.getUTCFullYear(), nowDate.getMonth(), nowDate.getDate() - nowDate.getDay())
      return [moment(startWeek), moment(new Date())]
    },
    // 获取本月 结尾为今天
    getMonth () {
      return [moment(kit.dateTime('YYYY-MM-01')), moment(new Date())]
    },
    onChange (dates, dateStrings) {
      console.log('aaaaaaaaaaaaaaa', dates)
      this.$emit('input', dates)
    }
  }
}
</script>
