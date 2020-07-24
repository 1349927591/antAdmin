<!-- 基础报表 -->
<template>
  <system-table :options="params" @query="query">
    <template v-slot:head>
      <div class="head">
        <template v-if="totalData.length > 0">
          <div class="num-card" :key="index" v-for="(item, index) in totalData">
            <system-number-card v-model="item.val" :desc="item.desc"></system-number-card>
          </div>
        </template>
        <slot name="total-bottom"></slot>
      </div>
    </template>
    <template v-slot:operation="{record}">
      <slot name="operation" v-bind:record="record">
        <a-button type="primary" size="small" @click="detail">
          详情
        </a-button>
      </slot>
    </template>
  </system-table>
</template>

<script>
import SystemTable from '@/system/page/table/systemTable'
import SystemNumberCard from '@/system/components/numberCard/SystemNumberCard'
function getDefault () {
  return {
    key: 'id', // 修改,查询的主键
    table: {
      isBatch: false,
      isOperation: true, // 是否显示操作列
      detailPath: ''
    },
    totalList: [], // 统计 {"key":"对应返回数据的参数", desc:"备注"}
    search: [],
    api: {
      query: {
        path: '',
        searchKey: '', // 搜索的主键
        params: {}
      }
    },
    columns: []
  }
}
export default {
  name: 'SystemReport',
  components: {SystemTable, SystemNumberCard},
  props: {
    options: {
      type: Object,
      default: () => getDefault(),
      tableData: {}
    }
  },
  watch: {
    options: {
      handler: function (val, oldVal) {
        this.params = val
        // 修改统计列数据
        this.upTotal()
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      // 统计列
      totalData: [],
      params: getDefault(),
      queryParams: {}
    }
  },
  methods: {
    query (res, err, params) {
      if (!err) {
        this.tableData = res.data || {}
        this.upTotal()
        this.queryParams = params || {}
        this.$emit('query', res, err, params)
      }
    },
    upTotal () {
      if (this.$kit.isEmpty(this.tableData)) {
        return false
      }
      const total = this.tableData.total
      if (!this.$kit.isEmpty(total)) {
        this.totalData = []
        // 有统计数据,更新统计列
        for (const item of this.params.totalList) {
          this.totalData.push({
            val: total[item.key] || 0,
            desc: item.desc
          })
        }
      }
    },
    // 点击详情按钮
    detail (item) {
      if (!this.$kit.isEmpty(this.params.table.detailPath)) {
        const opts = {}
        opts[this.params.key] = item[this.params.key]
        this.$router.push({
          path: this.params.table.detailPath,
          query: Object.assign({}, opts, this.queryParams)
        })
      }
    }
  }
}
</script>

<style lang="less">
  @import url('SystemReport.less');
</style>
