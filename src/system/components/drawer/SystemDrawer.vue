<!-- 抽屉组件 -->
<template>
  <div>
    <div :class="['mask', openDrawer ? 'open' : 'close']" @click="close"></div>
    <div :class="['drawer', placement, openDrawer ? 'open' : 'close']">
      <div ref="drawer" style="position: relative; height: 100%;">
        <slot></slot>
      </div>
      <div
        v-if="showHandler"
        :class="['handler-container', placement]"
        ref="handler"
        @click="handle"
      >
        <slot v-if="$slots.handler" name="handler"></slot>
        <div v-else class="handler">
          <a-icon :type="openDrawer ? 'close'  : 'bars'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemDrawer',
  data () {
    return {
      drawerWidth: 0
    }
  },
  props: {
    openDrawer: {
      type: Boolean,
      required: false,
      default: false
    },
    placement: {
      type: String,
      required: false,
      default: 'left'
    },
    showHandler: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mounted () {
    this.drawerWidth = this.getDrawerWidth()
  },
  watch: {
    drawerWidth: function (val) {
      if (this.placement === 'left') {
        this.$refs.handler.style.left = val + 'px'
      } else {
        this.$refs.handler.style.right = val + 'px'
      }
    }
  },
  methods: {
    open () {
      this.$emit('change', true)
    },
    close () {
      this.$emit('change', false)
    },
    handle () {
      this.$emit('change', !this.openDrawer)
    },
    getDrawerWidth () {
      return this.$refs.drawer.clientWidth
    }
  }
}
</script>
<style lang="less" scoped>
  @import url("SystemDrawer.less");
</style>
