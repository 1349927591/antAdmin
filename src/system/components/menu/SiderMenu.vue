<template>
  <a-layout-sider class="sider-menu" :class="[theme, 'sider', isMobile ? null : 'shadow']" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <System-menu :theme="theme" :collapsed="collapsed" :menuData="menuData" @select="onSelect"/>
  </a-layout-sider>
</template>
<script>
import SystemMenu from './menu'
export default {
  name: 'SiderMenu',
  components: {SystemMenu},
  props: {
    collapsible: { // 是否可收起
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: { // 收起状态
      type: Boolean,
      required: false,
      default: false
    },
    menuData: { // 菜单数据
      type: Array,
      required: true,
      default: () => []
    },
    theme: { // 菜单主题
      type: String,
      required: false,
      default: 'light'
    },
    menuLogo: { // 菜单logo
      type: String,
      required: false,
      default: ''
    },
    menuName: { // 菜单名字
      type: String,
      required: false,
      default: '菜单'
    },
    isMobile: { // 是否为手机
      type: Boolean,
      required: false,
      default: false
    },
    defaultPage: { // 默认显示页面
      required: false,
      default: ''
    }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('SiderMenu.less');
</style>

<style lang="less">
.sider-menu{
  .ant-menu-item .anticon, .ant-menu-submenu-title .anticon,
  .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .anticon{
    transform: translateY(5px);
    font-size: 26px !important;
  }
  .ant-menu-item{
    padding-left: 60px !important;
  }
}
</style>
