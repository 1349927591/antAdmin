<template>
  <div></div>
  <!-- <textarea id="editor" ref="editor"></textarea> -->
  <!-- <froala id="edit" :tag="'textarea'" :config="config" v-model="value"
    class="editor"></froala> -->
</template>

<script>
import Jodit from 'jodit'
import 'jodit/build/jodit.min.css'
// import 'froala-editor/css/froala_editor.pkgd.min.css'
// import 'froala-editor/css/froala_style.min.css'
// import 'froala-editor/js/froala_editor.pkgd.min.js'
// import 'froala-editor/js/languages/zh_cn.js'
// import 'froala-editor/js/plugins.pkgd.min.js'
// import VueFroala from 'vue-froala-wysiwyg'
// Vue.use(VueFroala)
// Vue.config.productionTip = false

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: function () {
      }
    }
  },
  data () {
    return {
      // config: {
      //   language: 'zh_cn',
      //   colorsHEXInput: false,
      //   zIndex: 2501,
      //   height: '300',
      //   toolbarButtons: [
      //     'undo',
      //     'redo',
      //     'clearFormatting',
      //     'bold',
      //     'italic',
      //     'underline',
      //     'strikeThrough',
      //     'fontFamily',
      //     'fontSize',
      //     'color',
      //     'inlineStyle',
      //     'paragraphFormat',
      //     'align',
      //     'formatOL',
      //     'formatUL',
      //     'outdent',
      //     'indent',
      //     'quote',
      //     'insertLink',
      //     'insertImage',
      //     'insertVideo',
      //     'embedly',
      //     'insertTable',
      //     'specialCharacters',
      //     'insertHR',
      //     'selectAll',
      //     'print',
      //     'spellChecker',
      //     'html',
      //     'help',
      //     'fullscreen'
      //   ],
      //   events: {
      //     initialized: function () {
      //       console.log('initialized')
      //     }
      //   }
      // },
      editor: null
    }
  },
  watch: {
    value: {
      handler: function (val) {
        if (this.editor) {
          this.editor.setEditorValue(val || '')
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.editor = new Jodit(this.$el, Object.assign({
      language: 'zh_cn',
      height: 600,
      toolbarButtonSize: 'large'
    }, this.options))
    this.editor.setEditorValue(this.value)
    this.editor.events.on('change', val => {
      this.$emit('input', val)
    })
  },
  beforeDestroy () {
    this.editor.destruct()
  }
}
</script>

<style lang="less"></style>
