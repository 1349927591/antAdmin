<!-- 标准表格查询页 -->
<template>
  <a-card class="system-table">
    <!-- 新建/编辑表单 -->
    <system-modal v-if="Array.isArray(modalElement)"
      v-model="isFormModel"
      :title="modalTitle"
      :cancelText="params.editModal.cancelText"
      :okText="params.editModal.okText"
      :api="modalApi"
      :defaultData="formData"
      :element="modalElement"
      :beforeEdit="beforeEdit"
      :endEdit="endEdit"
      :isEdit="isEdit"
    >
      <template v-slot:modal-form-bottom="{data}">
        <slot name="modal-form-bottom" v-bind:data="data">
        </slot>
      </template>
    </system-modal>
    <div :class="advanced ? '' : 'search-hide'" class="search">
      <a-form layout="horizontal" v-if="queryElement.length > 0">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <template v-for="(item, index) in queryElement">
              <a-col :md="6" :key="index" v-if="advanced">
                <a-form-item
                  :label="item.label"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
                >
                  <a-input v-model="queryParams[item.key]" v-if="item.type === 'search'" :placeholder="item.placeholder" />
                  <system-select v-model="queryParams[item.key]" v-if="item.type === 'select'"
                    :placeholder="item.placeholder" :showSearch="item.showSearch" :data="item.data"
                    :params="item.params" :analysis="{'key':item.key, 'value':item.valueParam || ''}"
                  >
                  </system-select>
                  <system-date v-model="queryParams[item.key]" style="width:100%" v-if="item.type === 'date'" />
                </a-form-item>
              </a-col>
            </template>
          </a-row>
        </div>
        <div class="search-btn">
          <a-button v-if="advanced" type="primary" @click="query">查询</a-button>
          <a-button v-if="advanced" style="margin-left: 8px" @click="clear">重置</a-button>
        </div>
      </a-form>
    </div>
    <div style="margin-bottom: 10px;" v-if="$slots.head">
      <slot name="head"></slot> <!-- 扩展一个头部的插销 -->
    </div>
    <div>
      <standard-table
        :columns="params.columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        :isBatch="params.table.isBatch"
        :total="total"
        :current="current"
        :defaultPageSize="defaultPageSize"
        :rowKey="this.params.key"
        @change="onchange"
        @onSearch="onSearch"
        @pageSort="pageSort"
        :expandedRowsChange="params.table.expandedRowsChange"
        :expand="params.table.expand"
        :is_search="this.params.api && this.params.api.query && this.params.api.query.searchKey !== ''"
      >
        <template :slot="$scopedSlots['expandedRowRender'] ? 'expandedRowRender' : 'noexpandedRowRender'" slot-scope="{record}">
          <slot name="expandedRowRender" v-bind:record="record"></slot>
        </template>
        <template v-slot:head-left>
          <a-dropdown v-if="params.isBatch">
            <a-menu @click="handleMenuClick" slot="overlay">
              <a-menu-item v-authority="params.api.del.path" key="delete" @click="delBatch">删除</a-menu-item>
            </a-menu>
            <a-button>
              批量操作 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </template>
        <template v-slot:head-right>
          <a-button v-authority="params.api.add.path"  @click="edit(options.api.add.params || {})" type="primary" style="margin-right:10px;">新建</a-button>
          <a-button v-authority="params.api.query.path" @click="onExport" v-if="params.table.export" type="dashed" icon="download" style="margin-right:50px" >下载表格</a-button>
          <a-button v-if="queryElement.length > 0"  @click="toggleAdvanced" type="primary" style="margin-right:10px;">筛选</a-button>
          <slot name="tableHeader"></slot>
        </template>
        <template v-slot:operation="{record}">
          <slot name="operation" v-bind:record="record">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>编辑</span>
              </template>
              <a-button v-authority="params.api.edit.path" @click="edit(record)" shape="circle" icon="edit"></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>
                  {{
                    Number(record.status) === Number(params.api.stop.status) ? '启用' : '停用'
                  }}
                </span>
              </template>
              <a-button v-if="record.status != -1 && record.status != 2"
                v-authority="params.api.stop.path"
                @click="upstatus(record)" shape="circle">
                {{
                  Number(record.status) === Number(params.api.stop.status) ? '启' : '停'
                }}
              </a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>删除</span>
              </template>
              <a-button v-authority="params.api.del.path" @click="del(record)" shape="circle" icon="delete" />
            </a-tooltip>
            <slot name="operation-extend" v-bind:record="record"></slot>
          </slot>
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import SystemDate from '@/system/components/date/SystemDate'
import SystemSelect from '@/system/components/select/SystemSelect'
import StandardTable from '@/system/components/table/StandardTable'
import SystemModal from '@/system/components/modal/SystemModal'
import SystemUploaderImg from '@/system/components/uploader/SystemUploaderImg'
function getDefault () {
  return {
    key: 'id', // 修改,查询的主键
    search: [],
    route: '', // 编辑新增的跳转路由
    editModal: {
      okText: '提交',
      cancelText: '取消'
    },
    api: {
      query: {
        path: '',
        searchKey: '', // 搜索的主键
        params: {}
      }, // 查询的api
      add: {
        path: '',
        params: {}
      }, // 新增的api,如果是跳页面,传入是为了判断权限
      del: {
        path: ''
      }, // 删除api
      edit: {
        path: ''
      }, // 修改api
      stop: {
        path: '',
        status: 3 // 停用状态
      } // 停用api
    },
    table: {
      isBatch: true, // 是否可以批量操作
      isOperation: true, // 是否显示操作列
      show_total: false, // 显示所有的数据数量
      defaultPageSize: 20,
      export: false,
      exportName: '',
      expandedRowsChange: () => {},
      expand: () => {}
    },
    columns: []// 表格头,如果数据源为undefined则不显示该列
  }
}
export default {
  name: 'SystemTable',
  components: {StandardTable, SystemDate, SystemSelect, SystemModal, SystemUploaderImg},
  props: {
    options: {
      type: Object,
      default: () => getDefault()
    }
  },
  watch: {
    options: {
      handler: async function (val, oldVal) {
        val = val || {}
        if (!this.$kit.isEmpty(val.api)) {
          for (const key in val.api) {
            if (this.$kit.isString(val.api[key])) {
              // 字符串
              val.api[key] = {
                path: val.api[key]
              }
            }
          }
        }
        this.params = this.$kit.extend(this.params, JSON.parse(JSON.stringify(val)))
        this.params.beforeEdit = val.beforeEdit || null
        this.params.beforeAdd = val.beforeAdd || null
        this.params.edit = val.edit || null
        this.params.add = val.add || null
        if (val.table && val.table.expand) {
          this.params.table.expand = val.table.expand
        }
        this.params['columns'] = []
        if (val.columns) {
          for (const key in val.columns) {
            const column = {}
            for (const objKey in val.columns[key]) {
              column[objKey] = val.columns[key][objKey]
            }
            this.params['columns'].push(column)
          }
        }
        if (!this.$kit.isEmpty(this.params.columns)) {
          const {modalColumns, tableColumns} = await this.parseColumns(this.params.columns)
          this.modalElement = modalColumns
          this.params.columns = tableColumns
          const lastColumn = this.params.columns[this.params.columns.length - 1]
          if (lastColumn['dataIndex'] !== '_operation' && this.params.table.isOperation) {
            // 最后一个不是操作项, 加上
            this.params.columns.push({
              title: '操作',
              dataIndex: '_operation',
              key: '_operation',
              scopedSlots: {
                customRender: 'operation'
              }
            })
          }
        }
        const list = this.authorityFilter(val.search || [])
        this.defaultPageSize = this.params.table.pageSize || 20
        this.pageSortParams.pageSize = this.params.table.pageSize || 20
        this.queryElement = []
        for (const item of list) {
          this.queryElement.push(item)
          if (!this.$kit.isEmpty(item.defaultValue)) {
            this.queryParams[item.key] = item.defaultValue
          }
        }
        for (const key in this.params.api.query.params) {
          const item = this.params.api.query.params[key]
          if (typeof item === 'string') {
            this.queryParams[key] = item
          }
        }
        this.dataSource = []
        this.query()
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      params: getDefault(),
      queryParams: {},
      advanced: false, // 是否展开搜索
      dataSource: [], // 列表数据源
      selectedRowKeys: [],
      selectedRows: [],
      queryElement: [], // 查询元素
      current: 1, // 当前页
      defaultPageSize: 20, // 默认页面数据数量
      total: 0, // 总数量
      pageSortParams: {
        current: 1,
        pageSize: 20
      },
      isFormModel: false, // 是否显示编辑对话框
      modalApi: '', // 新增/编辑API
      formData: {}, // 当前选中记录的数据
      isEdit: false,
      modalTitle: '', // 对话框标题
      modalDatas: {}, // model查询框出来的数据存放点
      modalElement: [],
      isAll: false, // 是否全选
      blacklist: [] // 黑名单
    }
  },
  methods: {
    // 权限过滤
    authorityFilter (data) {
      // 解析传入的数组,将无权限的过滤
      const list = []
      for (const item of data) {
        if (this.$kit.isEmpty(item)) {
          continue
        }
        if (this.$kit.isEmpty(item.data) || !this.$kit.isString(item.data)) {
          // 如果不需要数据源或者无需调用api获取数据源则不用判断权限
          list.push(item)
          continue
        }
        if (this.$api.isAuthority(this, item.data)) {
          // 有权限
          list.push(item)
        }
      }
      return list
    },
    // 解析传递过来的columns
    async parseColumns (columns = []) {
      const tableColumns = [] // 表格头部
      const modalColumns = [] // 对话框元素
      for (const item of columns) {
        const editParam = item.edit || null
        const type = item.type || ''
        const data = item.data || {}
        const _params = item.params || {}
        delete item.edit
        delete item.type
        delete item.data
        if (!this.$kit.isEmpty(editParam) || !this.$kit.isEmpty(type)) {
          const modalItem = Object.assign({
            key: item.dataIndex,
            label: item.title,
            type: type,
            data: data,
            params: _params,
            valueParam: item.valueParam || '',
            analysis: item.analysis
          }, editParam || {})
          this.modalDatas[modalItem.key] = {
            type: modalItem.type
          }
          if (!this.$kit.isEmpty(modalItem.data)) {
            try {
              const mData = await this.getSearchData(modalItem.data, modalItem.params)
              if (this.$kit.isArray(mData)) {
                modalItem.data = mData
                // 如果是数组就解析
                const mObj = {}
                for (const mItem of mData) {
                  let _key = modalItem.key || ''
                  let _value = modalItem.valueParam || ''
                  if (!this.$kit.isEmpty(modalItem.analysis)) {
                    _key = modalItem.analysis.key
                    _value = modalItem.analysis.value
                  }
                  if (!this.$kit.isEmpty(mItem[_key])) {
                    mObj[mItem[_key]] = mItem[_value]
                  }
                }
                if (!this.$kit.isEmpty(mObj)) {
                  this.modalDatas[modalItem.key]['data'] = mObj
                }
              } else {
                this.modalDatas[modalItem.key]['data'] = mData
                modalItem.data = []
                for (const key in mData) {
                  const modalObj = {}
                  modalObj[modalItem.key] = key
                  modalObj['value'] = mData[key]
                  modalItem.data.push(modalObj)
                }
                modalItem.valueParam = 'value'
              }
            } catch (e) {
              console.log(e)
            }
          }
          if (!this.$kit.isEmpty(editParam)) {
            modalColumns.push(modalItem)
          }
        }
        // 解析表格参数
        if (typeof item['customRender'] !== 'function') {
          const that = this
          const _data = that.modalDatas[item['dataIndex']] || {}
          if (!this.$kit.isEmpty(_data['type'])) {
            item['customRender'] = function (text, record, index) {
              if (text === null || text === undefined) {
                return ''
              }
              if (!that.$kit.isEmpty(_data)) {
                switch (_data['type']) {
                  case 'select':
                  case 'checkbox':
                  case 'radio':
                    if (that.$kit.isEmpty(_data.data)) {
                      return text
                    }
                    const textArr = typeof text === 'string' ? text.split(',') : [text]
                    const textIndexArr = []
                    for (const textItem of textArr) {
                      textIndexArr.push(_data.data[textItem])
                      record[textItem] = _data.data[textItem]
                    }
                    return textIndexArr.join(',') || text
                  case 'time':
                    return that.$kit.dateTime('HH:mm:ss', text)
                  case 'date':
                    return that.$kit.dateTime('YYYY-MM-DD HH:mm:ss', text)
                  case 'img':
                    return <system-uploader-img defaultList={text || ''} disabled={true}></system-uploader-img>
                  case 'switch':
                    return <a-switch default-checked={!!text} disabled={true} />
                  case 'boolean':
                    return text ? <a-icon type="check" /> : ''
                  case 'currency':
                    return ((Number(text || 0) || 0) / (Number(_data.scale) || 100)) + (_data.unit || '')
                }
              }
              return text
            }
          }
        }
        if (item.show !== false) {
          tableColumns.push(item)
        }
      }
      return {modalColumns, tableColumns}
    },
    getSearchData (data = [], params = {}) {
      const that = this
      return new Promise((resolve, reject) => {
        if (!that.$kit.isEmpty(data)) {
          if (typeof data === 'string') {
            // 字符串,需要获取数据
            that.$api.request(that, data, params || {}, (res, err) => {
              if (!err) {
                resolve(res.data || [])
                return []
              }
              resolve([])
            })
            return
          } else {
            resolve(data || [])
            return
          }
        }
        resolve([])
      })
    },
    // 格式化参数
    parseParams (params) {
      if (this.$kit.isEmpty(params)) {
        return {}
      }
      const data = {}
      for (const key in params) {
        const eConfig = this.getElementConfig(key)
        if (this.$kit.isEmpty(eConfig)) {
          data[key] = params[key]
          continue
        }
        if (eConfig.type === 'date') {
          if (!Array.isArray(eConfig.keys)) {
            eConfig.keys = []
          }
          if (!this.$kit.isEmpty(params[key][0])) {
            data[eConfig.keys[0] || 'startTime'] = this.$kit.dateTime('YYYY-MM-DD', params[key][0]) // that.$kit.dateTime
          }
          if (!this.$kit.isEmpty(params[key][1])) {
            data[eConfig.keys[1] || 'endTime'] = this.$kit.dateTime('YYYY-MM-DD', params[key][1])
          }
          continue
        }
        data[key] = params[key]
      }
      return data
    },
    // 通过key获取element配置
    getElementConfig: function (key) {
      for (const item of this.queryElement) {
        if (item.key === key) {
          return item
        }
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    query () {
      // 搜索，强制将页数转为 1
      this.current = 1
      this.pageSortParams.current = 1
      const params = this.parseParams(this.queryParams)
      this.getTableData(params) // 重新获取表格数据
    },
    onSearch (value) {
      // 点击了搜索
      // 搜索，强制将页数转为 1
      this.current = 1
      this.pageSortParams.current = 1
      delete this.queryParams['searchKey']
      delete this.queryParams['searchWord']
      if (!this.$kit.isEmpty(value)) {
        this.queryParams['searchKey'] = this.params.api.query.searchKey
        this.queryParams['searchWord'] = value
      }
      const params = this.parseParams(this.queryParams)
      this.getTableData(params) // 重新获取表格数据
    },
    // 重置搜索选项
    clear () {
      for (const key in this.queryParams) {
        if (this.$kit.isArray(this.queryParams[key])) {
          this.queryParams[key] = []
          continue
        }
        if (this.$kit.isObject(this.queryParams[key])) {
          this.queryParams[key] = {}
          continue
        }
        this.queryParams[key] = undefined
      }
    },
    // 点击了排序,分页
    pageSort (opts) {
      this.pageSortParams = this.$kit.extend(this.pageSortParams, opts)
      this.current = this.pageSortParams.current
      const params = this.parseParams(this.queryParams)
      this.getTableData(params)
    },
    // 获取表格数据
    getTableData (params = {}) {
      if (this.$kit.isEmpty(this.params.api.query)) {
        this.dataSource = [] // 没有查询的api,列表为空
      }
      // opts = Object.assign({}, this.params.api.query.params || {}, opts, this.pageSortParams)
      // 将空值去掉
      const opts = Object.assign({}, this.params.api.query.params || {}, params, this.pageSortParams)
      for (const key in opts) {
        const opt = opts[key]
        if (this.$kit.isEmpty(opt) && opt !== 0) {
          delete opts[key]
        }
      }
      this.$api.request(this, this.params.api.query.path, opts, (res, err) => {
        this.dataSource = []
        if (!err && res.isSuccess) {
          const data = res.data || {}
          if (Array.isArray(data)) {
            this.total = data.length
            this.dataSource = data || []
          } else {
            this.total = data.count || 0
            this.dataSource = data.data || []
          }
        }
        this.$emit('query', res, err, opts)
      })
    },
    // 编辑
    edit (item = {}) {
      let isAdd = false
      if (this.$kit.isEmpty(item) || this.$kit.isEmpty(item[this.params.key])) {
        isAdd = true
      }
      if (typeof this.params.add === 'function' && isAdd) {
        return this.params.add()
      } else if (typeof this.params.edit === 'function' && !isAdd) {
        return this.params.edit(item)
      }
      let route = ''
      if (!this.$kit.isEmpty(this.params.api.add) && isAdd) {
        route = this.params.api.add.route
      }
      if (!this.$kit.isEmpty(this.params.api.edit) && !isAdd) {
        route = this.params.api.edit.route
      }
      if (!this.$kit.isEmpty(route)) {
        const opts = {}
        if (!isAdd) {
          opts[this.params.key] = item[this.params.key]
        }
        this.$router.push({
          path: route,
          query: opts
        }) // 如果是字符串则直接跳转
        return
      }
      this.modalTitle = isAdd ? '新增' : '编辑'
      this.modalApi = isAdd ? this.params.api.add.path : this.params.api.edit.path
      this.formData = {}
      for (const key in item) {
        this.$set(this.formData, key, item[key])
      }
      this.isEdit = !isAdd
      this.$emit('beforeShowEdit', isAdd, JSON.parse(JSON.stringify(this.formData)))
      this.isFormModel = true // 显示弹窗
    },
    beforeEdit (data) {
      // 新增/编辑前
      if (this.$kit.isEmpty(data[this.params.key])) {
        // 新增
        if (typeof this.params.beforeAdd === 'function') {
          return this.params.beforeAdd(data)
        }
        return data
      }
      // 编辑
      if (typeof this.params.beforeEdit === 'function') {
        return this.params.beforeEdit(data)
      }
      return data
    },
    endEdit () {
      // 刷新数据
      this.getTableData()
    },
    upstatus (item) {
      // 修改状态
      const str = Number(item.status) === Number(this.params.api.stop.status) ? '启用' : '禁用'
      const that = this
      this.$confirm({
        title: str,
        content: `是否确定${str}`,
        okText: '确认',
        cancelText: '取消',
        onOk () {
          const opts = {
            status: Number(item.status) === Number(this.params.api.stop.status) ? 1 : 3
          }
          opts[that.params.key] = item[that.params.key]
          const api = (Number(item.status) === 0 && that.$store.state.config.grade_id === 'admin') ? that.params.api.audit : that.params.api.stop.path
          that.$api.request(that, api, opts, (res, err) => {
            if (!err) {
              that.$message.success('操作成功')
              // 刷新数据
              that.getTableData()
            }
          })
        }
      })
    },
    // 批量删除
    delBatch () {
      const params = {}
      params[this.params.key] = this.selectedRowKeys
      this.del(params)
    },
    // 删除
    del (item) {
      const that = this
      this.$confirm({
        title: '删除',
        content: `是否确定删除`,
        okText: '确认',
        cancelText: '取消',
        onOk () {
          const opts = {
            status: -1
          }
          opts[that.params.key] = item[that.params.key]
          that.$api.request(that, that.params.api.del.path, opts, (res, err) => {
            if (!err) {
              that.$message.success('删除成功')
              // 刷新数据
              that.getTableData()
            }
          })
        }
      })
    },
    onchange (selectedRowKeys, selectedRows, blacklist = [], isAll = false) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.isAll = isAll
      this.blacklist = blacklist
      this.$emit('onChange', this.selectedRowKeys, this.selectedRows, this.blacklist, this.isAll)
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
    },
    handleMenuClick (e) {
      if (e.key === 'delete') {
        this.remove()
      }
    },
    // 下载表格
    onExport () {
      const dict = []
      const columns = this.params.columns || []
      for (const col of columns) {
        if (col.dataIndex === '_operation') {
          continue
        }
        dict.push({
          key: col.valueParam || col.dataIndex,
          title: col.title,
          value: ''
        })
      }
      const params = this.parseParams(this.queryParams)
      const opts = Object.assign({}, this.params.api.query.params || {}, params)
      for (const key in opts) {
        const opt = opts[key]
        if (this.$kit.isEmpty(opt) && opt !== 0) {
          delete opts[key]
        }
      }
      opts.exportFormat = 'csv'
      opts.exportName = this.params.table.exportName
      opts.exportDict = dict
      this.$api.request(this, this.params.api.query.path, opts, (data, err) => {
        if (data) {
          this.$kit.downloadFile(`${opts.exportName}${this.$kit.dateTime('YYYYMMDDHHmmss')}.csv`, data, {
            type: 'application/vnd.ms-excel'
          })
        }
      }, 'stream')
      console.log(dict)
    }
  },
  mounted () {
    // this.getTableData()
  }
}
</script>
<style lang="less" scoped>
  @import url('SystemTable.less');
</style>
