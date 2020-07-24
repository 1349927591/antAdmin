<!-- 整体布局 -->
<template>
  <a-layout style="height: 100%">
    <system-header
      :isMobile="isMobile" :defaultPage="defaultPage" :menuLogo="menuLogo" :menuName="menuName"
      :theme="theme" :layout="layout" :menuData="menuData" :collapsed="collapsed"
      @toggleCollapse="toggleCollapse" :avatar="avatar"
    />
    <a-layout class="main">
      <system-drawer v-if="isMobile" :openDrawer="collapsed" @change="onDrawerChange">
        <sider-menu
          :isMobile="isMobile" :defaultPage="defaultPage" :menuLogo="menuLogo" :menuName="menuName"
          :theme="theme" :menuData="menuData" :collapsed="false" :collapsible="false" @menuSelect="onMenuSelect"
        />
      </system-drawer>
      <sider-menu
        v-else-if="layout === 'side'"
        :isMobile="isMobile" :defaultPage="defaultPage" :menuLogo="menuLogo" :menuName="menuName"
        :theme="theme" :menuData="menuData" :collapsed="collapsed"
        :collapsible="true"
      />
      <a-layout class="content">
        <a-layout-content style="height: calc(100vh - 60px)">
          <slot></slot>
        </a-layout-content>
        <system-footer style="margin: 0px 0 10px;" copyright="广州趣互联科技有限公司 All Rights Reserved 版权所有 粤ICP备17102243号-3" />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import SystemHeader from '@/system/components/header/SystemHeader'
import SystemDrawer from '@/system/components/drawer/SystemDrawer'
import SiderMenu from '@/system/components/menu/SiderMenu'
import SystemFooter from '@/system/components/footer/SystemFooter'
// const minHeight = window.innerHeight - 64 - 24 - 122
export default {
  name: 'SystemLayout',
  components: {SystemHeader, SystemDrawer, SiderMenu, SystemFooter},
  data () {
    return {
      collapsed: false
      // minHeight: minHeight + 'px'
    }
  },
  props: {
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
    layout: { // 布局
      type: String,
      required: false,
      default: 'side'
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
    defaultPage: { // 菜单默认跳转页面
      required: false,
      default: ''
    },
    avatar: {
      required: false,
      default: ''
    }
  },
  methods: {
    // 切换菜单折叠状态
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    onDrawerChange (show) {
      this.collapsed = show
    },
    // 选择菜单
    onMenuSelect () {
      this.toggleCollapse()
    }
  }
}
</script>

<style lang="less" scoped>
  @import url("SystemLayout.less");
</style>

<style lang="less">
  .ant-card {
    border-radius: 4px;
  }
</style>
