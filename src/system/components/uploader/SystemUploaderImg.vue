<template>
  <div class="uploader">
    <div class="demo-upload-list" v-for="(item,index) in imgList" :key="index">
      <template v-if="item != ''">
        <img :src="item">
        <div class="demo-upload-list-cover">
          <a-icon type="eye" @click.native="handleView(index)"></a-icon>
          <a-icon type="delete" @click.native="handleRemove(index)" v-if="!disabled"></a-icon>
        </div>
      </template>
    </div>
    <div class="ivu-upload ivu-upload-drag" v-if="isUploaded">
      <div style="width: 58px; height: 58px; line-height: 58px;" :id="paramkey">
        <a-icon type="plus" />
      </div>
    </div>
    <a-modal :footer="null" title="查看图片" v-model="preview.visible" class-name="center-modal">
      <img :src="preview.src" style="width: 100%">
    </a-modal>
  </div>
</template>
<script>
import plupload from 'plupload' // 上传
import OSS from 'ali-oss' // 上传

export default {
  name: 'SystemUploaderImg',
  data: function () {
    return {
      imgList: [], // 已上传的图片列表
      preview: { // 预览配置
        visible: false,
        src: ''
      }
    }
  },
  props: {
    maxNum: { // 最多上传的数量
      type: Number,
      default: 1
    },
    paramkey: {
      type: String,
      default: 'selectfiles'
    },
    defaultList: { // 默认已上传的图片列表
      default: ''
    },
    disabled: { // 只读,上传和删除去掉,只剩下预览
      type: Boolean,
      default: false
    },
    opts: { // 上传配置
      type: Object,
      default: () => { return {} }
    }
  },
  watch: {
    defaultList: {
      handler: function (val, oldVal) {
        let list = this.defaultList || []
        if (typeof list === 'string' && list !== '') {
          list = list.split(',')
        }
        this.imgList = list || []
        if (this.disabled && this.imgList.length === 0) {
          this.imgList.push('')
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    isUploaded: function () {
      const value = this.imgList.length < this.maxNum && !this.disabled
      if (value) {
        this.$nextTick(() => {
          this.init()
        })
      }
      return value
    }
  },
  methods: {
    init () {
      let ossOpts = this.$store.state.config.ossOpts || {}
      ossOpts = Object.assign({
        success_action_status: '200'
      }, ossOpts, this.opts)
      const region = ossOpts.region
      const bucket = ossOpts.bucket
      const dir = ossOpts.dir || ''
      const accessKeyId = ossOpts.accessKeyId || ''
      const accessKeySecret = ossOpts.accessKeySecret || ''
      delete ossOpts.region
      delete ossOpts.bucket
      delete ossOpts.dir
      delete ossOpts.accessKeyId
      delete ossOpts.accessKeySecret
      const time = new Date().getTime()
      // eslint-disable-next-line no-template-curly-in-string
      ossOpts.key = dir + time + '${filename}'
      const host = `https://${bucket}.${region}.aliyuncs.com/`
      const uploader = new plupload.Uploader({
        url: host,
        browse_button: this.paramkey,
        rename: true, // 重命名
        unique_names: true, // 生成一个唯一的文件名
        multipart_params: ossOpts,
        resize: {
          quality: 80,
          preserve_headers: false // 压缩后是否保留图片的元数据
        },
        filters: {
          mime_types: [
            // 只允许上传图片
            {
              title: 'Image files',
              extensions: 'jpeg,jpg,gif,png'
            }
          ]
        }
      })
      uploader.init()
      const that = this
      uploader.bind('Error', function (up, err) {
        if (err.code === -600) {
          that.$message.warning('您上传的图片尺寸过大,请重新选择上传')
        } else {
          that.$message.warning('图片上传错误,原因:' + JSON.stringify(err))
        }
      })
      // // 绑定文件上传进度事件
      // uploader.bind('UploadProgress', function (uploader, file) {
      //   that.uploadShow = true
      //   that.percent2 = file.percent
      // })
      // 当队列中的某一个文件上传完成后触发监听
      uploader.bind('FileUploaded', function (up, file, info) {
        if (info.status === 200) {
          // that.uploadShow = false
          // that.percent2 = 0
          if (that.imgList.length > that.maxNum) {
            that.$message.warning('最多只能上传' + that.maxNum + '张图片')
            return
          }
          const imgSrc = host + dir + time + file.name
          that.imgList.push(imgSrc) // 将上传后的文件路径放入变量
          that.$emit('uploadImg', that.paramkey, imgSrc, that.imgList, that.maxNum || 1) // 发出响应事件
          // 修改一下缓存时间
          // eslint-disable-next-line no-irregular-whitespace
          const client = new OSS({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            region: region,
            bucket: bucket
          })
          client.copy(dir + time + file.name, dir + time + file.name, {
            headers: {
              'Cache-Control': 'max-age=86400'
            }
          })
        } else {
          that.$message.error('上传失败')
        }
      })
      // uploader.bind('BeforeUpload', (uploader, file) => {})
      // 添加文件进来的回调
      uploader.bind('FilesAdded', function (up, files) {
        uploader.start()
      })
    },
    // 预览
    handleView (index) {
      this.preview.visible = true
      this.preview.src = this.imgList[index]
    },
    // 删除
    handleRemove (index) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `是否确定删除?`,
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.imgList.splice(index, 1)
          that.$emit('removeImg', that.paramkey, that.imgList, that.maxNum, index)
        }
      })
    }
  },
  created () {

  }
}

</script>
<style lang="less">
  @import url('SystemUploaderImg.less');
</style>
