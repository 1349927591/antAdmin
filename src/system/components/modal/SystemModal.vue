<!-- 新增/修改对话框 -->
<template>
  <a-modal v-model="visible" :title="title">
    <template slot="footer">
      <a-button key="back" @click="cancel">{{cancelText}}</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="ok">{{okText}}</a-button>
    </template>
    <a-form-model
      ref="ruleForm"
      :model="data"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-model-item style="margin-bottom:10px !important;" :key="index" v-for="(item, index) in elementData" :label="item.label || item.key"
        :prop="item.key" :ref="item.key"
      >
        <a-input class="form-item" v-if="item.type == 'input'"
          v-model="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder"
          @change="onChange(item)"
        />
        <a-input class="form-item" v-else-if="item.type == 'textarea'"
          v-model="data[item.key]"
          :placeholder="item.placeholder"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          type="textarea"
          @change="onChange(item)"
        />
        <a-input-number class="form-item" v-else-if="item.type == 'inputNum'"
          v-model="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder"
          @change="onChange(item)"
        />
        <system-search-input class="form-item" v-else-if="item.type == 'inputSearch'"
          v-model="data[item.key]" :params="item.params" :analysis="item.analysis ? item.analysis : {'key':item.key, 'value':item.valueParam || ''}"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder"
          :data="item.data"
          @change="onChange(item)"
        />
        <a-date-picker class="form-item" v-else-if="item.type == 'date'"
          v-model="data[item.key]"
          type="date"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder"
           @change="onChange(item)"
        />
        <a-time-picker class="form-item" v-else-if="item.type == 'time'"
          v-model="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder"
          @change="onChange(item)"
        />
        <system-select class="form-item" v-else-if="item.type === 'select'"
          v-model="data[item.key]" :params="item.params" :analysis="item.analysis ? item.analysis : {'key':item.key, 'value':item.valueParam || ''}"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder" :showSearch="item.showSearch" :data="item.data"
          :mode="item.mode"
          @change="onChange(item)"
        >
        </system-select>
        <a-switch v-else-if="item.type === 'switch'"
          v-model="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :defaultChecked="item.defaultChecked"
          @change="onChange(item)"
        />
        <a-checkbox-group v-else-if="item.type === 'checkbox'"
          v-model="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :defaultValue="data[item.key]"
          :name="item.key"
        >
          <a-checkbox :key="checkboxIndex"
            v-for="(checkboxItem, checkboxIndex) in (item.data || [])"
            :value="checkboxItem[item.key]"
            @change="onChange(item)"
          >
            {{checkboxItem[item.valueParam]}}
          </a-checkbox>
        </a-checkbox-group>
        <a-radio-group v-else-if="item.type === 'radio'"
          v-model="data[item.key]"
          :defaultValue="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          @change="onChange(item)"
        >
          <a-radio :key="radioIndex" v-for="(radioItem, radioIndex) in (item.data || [])"
            :value="radioItem[item.key]"
          >
            {{radioItem[item.valueParam]}}
          </a-radio>
        </a-radio-group>
        <system-uploader-img v-else-if="item.type === 'img'"
          :maxNum="item.maxNum"
          :paramkey="item.key"
          :defaultList="data[item.key] || ''"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          @uploadImg="uploadImg"
          @removeImg="removeImg"
        >
        </system-uploader-img>
        <a-input-number class="form-item" v-else-if="item.type == 'currency'"
          v-model="data[item.key]"
          :disabled="(isEdit && item.editReadOnly) || item.readOnly"
          :placeholder="item.placeholder"
          :formatter="value => value ? `${Number(value).toFixed(2)}${item.unit || ''}` : ''"
          :parser="value => item.unit ? value.replace(item.unit, '') : value"
          @change="onChange(item)"
        />
      </a-form-model-item>
      <slot name="modal-form-bottom" v-bind:data="data"></slot>
    </a-form-model>
  </a-modal>
</template>

<script>
import SystemSelect from '@/system/components/select/SystemSelect'
import SystemUploaderImg from '@/system/components/uploader/SystemUploaderImg'
import SystemSearchInput from '@/system/components/searchInput/SystemSearchInput'
import moment from 'moment'
export default {
  name: 'SystemModal',
  components: {SystemSelect, SystemUploaderImg, SystemSearchInput},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    // primaryKey: {
    //   type: String,
    //   default: '主键'
    // },
    okText: {
      type: String,
      default: '提交'
    },
    cancelText: {
      type: String,
      default: '返回'
    },
    api: { // 新增/修改API
      type: String,
      default: ''
    },
    defaultData: {
      type: Object,
      default: () => { return {} }
    },
    element: {
      type: Array,
      default: () => { return [] }
    },
    beforeEdit: { // 编辑/添加前,可以修改数据
      type: Function
    },
    endEdit: { // 编辑/添加后
      type: Function
    },
    isEdit: { // 是否为编辑
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: function () {
      this.visible = this.value
    },
    visible: function () {
      this.$emit('input', this.visible)
    },
    element: {
      handler: function (val, oldVal) {
        this.elementData = []
        for (const item of val) {
          this.elementData.push(Object.assign({}, item))
        }
        this.getRules()
      },
      immediate: true,
      deep: true
    },
    defaultData: {
      handler: function (val, oldVal) {
        this.data = {}
        for (const key in val) {
          if (!val[key] && val[key] !== 0) {
            continue
          }
          const eConfig = this.getElementConfig(key)
          if (this.$kit.isEmpty(eConfig)) {
            this.data[key] = val[key]
            continue
          }
          if (eConfig.type === 'date' || eConfig.type === 'time') {
            this.data[key] = moment(val[key] || new Date())
            continue
          }
          if (eConfig.type === 'checkbox') {
            if (typeof val[key] === 'string') {
              if (val[key] !== '') {
                this.data[key] = val[key].splic(',')
              } else {
                this.data[key] = []
              }
            }
            continue
          }
          // 货币类型
          if (eConfig.type === 'currency') {
            this.data[key] = Number(((Number(val[key] || 0) || 0) / (Number(eConfig.scale) || 100)).toFixed(2))
            continue
          }
          if (eConfig.type === 'switch') {
            this.data[key] = !!val[key]
            continue
          }
          this.data[key] = val[key]
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      rules: {}, // 校验规则
      loading: false,
      visible: false,
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      data: {},
      elementData: []
    }
  },
  methods: {
    // 点击了确认
    ok () {
      const that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (that.$kit.isEmpty(this.data)) {
            that.cancel()
            return true
          }
          // 校验成功, 调用api
          if (that.$kit.isEmpty(that.api)) {
            that.$message.error('缺少相关配置,请联系管理员~~')
            return
          }
          let data = this.parseParams(this.data)
          if (!that.$kit.isEmpty(that.beforeEdit)) {
            const param = that.beforeEdit(data)
            if (param === false) {
              // 阻止了继续往下进行
              return false
            }
            if (that.$kit.isObject(param)) {
              // 修改了参数
              data = param
            }
          }
          that.$api.request(this, this.api, data, (res, err) => {
            if (!err) {
              // 操作成功
              that.$message.success('操作成功')
              that.cancel()
              if (!that.$kit.isEmpty(that.endEdit)) {
                that.endEdit(res)
              }
            }
          })
        }
      })
    },
    // 点击了取消
    cancel () {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    /**
     * 图片上传之后
     * @param {string} key 参数key
     * @param {string} src 上传后的图片路径
     * @param {array} list 已上传的图片列表
     * @param {number} maxNum 最多上传的数量
     */
    uploadImg (key, src, list, maxNum = 1) {
      if (maxNum <= 1) {
        // 只需要上传一张图, 则数据直接等于当前图片
        this.data[key] = src
      } else {
        this.data[key] = list
      }
      const eConfig = this.getElementConfig(key)
      if (!this.$kit.isEmpty(eConfig) && typeof eConfig['onChange'] === 'function') {
        eConfig['onChange'](list)
      }
    },
    /**
     * 图片删除之后
     * @param {string} key 参数key
     * @param {array} list 已上传的图片列表
     * @param {number} maxNum 最多上传的数量
     */
    removeImg (key, list, maxNum) {
      if (maxNum <= 1) {
        // 只需要上传一张图, 则直接为空
        this.data[key] = ''
      } else {
        this.data[key] = list
      }
      const eConfig = this.getElementConfig(key)
      if (!this.$kit.isEmpty(eConfig) && typeof eConfig['onChange'] === 'function') {
        eConfig['onChange'](list)
      }
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
          if (!this.$kit.isEmpty(params[key])) {
            data[key] = params[key].format('YYYY-MM-DD')
          } else {
            data[key] = ''
          }
          continue
        }
        if (eConfig.type === 'time') {
          if (!this.$kit.isEmpty(params[key])) {
            data[key] = params[key].format('HH:mm:ss')
          } else {
            data[key] = ''
          }
          continue
        }
        // 货币类型
        if (eConfig.type === 'currency') {
          data[key] = parseInt((Number(params[key] || 0) || 0) * (Number(eConfig.scale) || 100)) || 0
          continue
        }
        data[key] = params[key]
      }
      return data
    },
    // 通过key获取element配置
    getElementConfig: function (key) {
      for (const item of this.element) {
        if (item['key'] === key) {
          return item
        }
      }
    },
    // 根据参数,生成校验规则
    getRules () {
      for (const key in this.element) {
        const item = this.element[key]
        if (item.isRequired) {
          this.rules[item.key] = [
            {
              required: true,
              message: item.errMessage || `请输入${item.label}`
            }
          ]
        }
      }
    },
    onChange (item) {
      item.func && item.func()
      this.$forceUpdate()
    }
  },
  mounted () {
    this.getRules()
  }
}
</script>
<style lang="less">
  @import url('SystemModal.less');
</style>
