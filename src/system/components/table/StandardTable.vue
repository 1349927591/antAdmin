<template>
  <div class="standard-table">
    <div class="standard-table-header">
      <div class="standard-table-header-left">
        <a-alert class="standard-table-header-alert" type="info" :show-icon="true" v-if="isBatch">
          <div slot="message" class="standard-table-header-message">
            <template>
              <div>满足条件: </div>
              <a style="font-weight: 600">{{total}} </a>
              <a-checkbox v-model="isAll" @change="onChangeAll">全选</a-checkbox>
            </template>
            <!-- <div>已选择</div>
            <a style="font-weight: 600">{{isAll ? total - blacklist.length : selectedRows.length}}</a>
            <div>项</div> -->
            <template  v-for="(item, index) in needTotalList">
              {{item.title}}总计&nbsp;
              <a :key="index" style="font-weight: 600">
              {{item.customRender ? item.customRender(item.total) : item.total}}
              </a>&nbsp;&nbsp;
            </template>
            <a v-if="selectedRowKeys.length > 0 || (isAll && total - blacklist.length > 0)" @click="cleanSelectedKeys" style="margin-left: 16px">清空</a>
          </div>
        </a-alert>
        <slot name="head-left"></slot>
      </div>
      <div class="standard-table-header-right">
        <a-input-search v-model="searchVal" placeholder="请输入搜索值" style="width: 300px" allowClear @search="onSearch" @pressEnter="onSearch" v-if="is_search" />
        <slot name="head-right"></slot>
      </div>
    </div>
    <a-table
      :scroll="{y: height}"
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="rowKey"
      :pagination="pageOptions"
      :rowSelection="isBatch ? {selectedRowKeys: selectedRowKeys, onChange: updateSelect} : null"
      @change="onChange"
      @expandedRowsChange="expandedRowsChange"
      @expand="expand"
    >
      <template :slot="$scopedSlots['expandedRowRender'] ? 'expandedRowRender' : 'noexpandedRowRender'" slot-scope="record">
        <slot name="expandedRowRender" v-bind:record="record"></slot>
      </template>
      <template slot="operation" slot-scope="text, record">
        <slot name="operation" v-bind:record="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'StandardTable',
  props: [
    'bordered', 'loading', 'columns', 'dataSource', 'rowKey', 'pagination',
    'selectedRows', 'isBatch', 'height', 'total', 'current', 'defaultPageSize',
    'expandedRowsChange', 'expand', 'is_search'
  ],
  data () {
    return {
      needTotalList: [],
      selectedRowKeys: [],
      searchVal: null,
      isAll: false,
      blacklist: []
    }
  },
  computed: {
    pageOptions: function () {
      return {
        hideOnSinglePage: false,
        defaultPageSize: this.defaultPageSize,
        showSizeChanger: true,
        current: this.current,
        total: this.total
      }
    }
  },
  methods: {
    // isBlaclist 是否过滤黑名单
    updateSelect (selectedRowKeys, selectedRows) {
      if (this.isAll) {
        // 打开了全选,需要将没选中的加入黑名单,将选中的从黑名单去掉
        for (const item of this.dataSource) {
          const _index = this.blacklist.indexOf(item[this.rowKey])
          if (_index === -1) {
            // 加入黑名单
            this.blacklist.push(item[this.rowKey])
          }
        }
        for (const item of selectedRowKeys) {
          const _index = this.blacklist.indexOf(item)
          if (_index > -1) {
            // 存在黑名单，将其移除
            this.blacklist.splice(_index, 1)
          }
        }
      }
      this.selectedRowKeys = selectedRowKeys
      let list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            return sum + val[item.dataIndex]
          }, 0)
        }
      })
      this.$emit('change', selectedRowKeys, selectedRows, this.blacklist, this.isAll)
    },
    initTotalList (columns) {
      const totalList = []
      columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({...column, total: 0})
        }
      })
      return totalList
    },
    cleanSelectedKeys () {
      this.isAll = false
      this.updateSelect([], [])
    },
    onChangeAll () {
      this.blacklist = [] // 清空黑名单
      if (this.isAll) {
        // 打开了全选
        const keys = []
        for (const item of this.dataSource) {
          const key = item[this.rowKey]
          if (keys.indexOf(key) === -1) {
            keys.push(key)
          }
        }
        this.updateSelect(keys, this.dataSource)
      } else {
        this.updateSelect([], [])
      }
    },
    // 点击搜索
    onSearch (value) {
      this.$emit('onSearch', (this.searchVal || '').trim())
    },
    // onChange 点击了分页,筛选,排序
    onChange (pagination, filters, sorter) {
      const opts = {
        pageSize: pagination.pageSize,
        current: pagination.current
      }
      if (!this.$kit.isEmpty(sorter)) {
        opts['order'] = [`${sorter.field} ${sorter.order === 'ascend' ? 'asc' : 'desc'}`]
      }
      this.$emit('pageSort', opts)
    }
  },
  created () {
    this.needTotalList = this.initTotalList(this.columns)
  },
  watch: {
    'selectedRows': function (selectedRows) {
      this.needTotalList = this.needTotalList.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            return sum + val[item.dataIndex]
          }, 0)
        }
      })
    },
    dataSource: {
      handler: function (val) {
        if (this.isAll) {
          // 打开了全选
          for (const item of val) {
            const key = item[this.rowKey]
            if (this.blacklist.indexOf(key) === -1 && this.selectedRowKeys.indexOf(key) === -1) {
              this.selectedRowKeys.push(key)
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="less">
  @import url('StandardTable.less');
</style>
