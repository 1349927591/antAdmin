<!-- 页头 -->
<template>
  <a-layout-header :class="[theme, 'global-header']">
    <div :class="['global-header-wide', layout]">
      <router-link
        v-if="isMobile || layout === 'head'"
        :to="defaultPage"
        :class="['logo', isMobile ? null : 'pc', theme]"
      >
        <img width="50" :src="menuLogo" />
        <h1 v-if="!isMobile" class="menuName">{{menuName}}</h1>
      </router-link>

      <div v-else :class="['logo', theme, collapsed ? 'logo-collapsed' : 'logo-no-collapsed']" style="text-align: center;">
        <router-link :to="defaultPage">
          <img width="50" :src="menuLogo">
          <h1 class="menuName">{{menuName}}</h1>
        </router-link>
      </div>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon
        v-if="layout === 'side'"
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapse"
      />
      <div v-if="layout === 'head'" class="global-header-menu">
        <system-menu
          style="height: 64px; line-height: 64px;"
          :theme="theme"
          mode="horizontal"
          :menuData="menuData"
          @select="onSelect"
        />
      </div>
      <div :class="['global-header-right', theme]">
        <system-avatar class="header-item"
          :src="avatar.src" :name="avatar.name" :userPage="avatar.userPage" :signOutPage="avatar.signOutPage"
        />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import SystemAvatar from '@/system/components/avatar/SystemAvatar'
import SystemMenu from '@/system/components/menu/menu'

export default {
  name: 'SystemHeader',
  components: { SystemMenu, SystemAvatar },
  props: {
    collapsed: {
      // 是否折叠
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      // 菜单数据
      type: Array,
      required: true,
      default: () => []
    },
    isMobile: { // 是否手机
      type: Boolean,
      required: false,
      default: false
    },
    layout: { // 布局
      type: String,
      required: false,
      default: 'side'
    },
    theme: { // 主题
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
    defaultPage: { // 默认显示页面
      required: false,
      default: ''
    },
    avatar: {
      src: '', // 头像路径
      name: '', // 用户名
      userPage: '', // 个人中心页面
      signOutPage: '' // 退出登录页面
    }
  },
  watch: {
    layout: function (val) { // 主题改变时
      this.theme = val === 'side' ? 'light' : this.theme
    }
  },
  methods: {
    toggleCollapse () {
      // 切换折叠
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      // 选择菜单
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
<style lang="less" scoped>
  @import url("SystemHeader.less");
</style>
