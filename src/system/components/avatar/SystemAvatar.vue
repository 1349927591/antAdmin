<!-- 使用者 -->
<template>
  <a-dropdown style="display: inline-block; height: 100%; vertical-align: initial">
    <span style="cursor: pointer">
      <a-avatar class="avatar" shape="circle" :src="src" />
      <span style="color:#fff;font-size:20px;">{{name}}</span>
    </span>
    <a-menu style="width: 150px" slot="overlay">
      <a-menu-item>
        <router-link :to="userPage">
          <a-icon type="user" />
          <span>个人中心</span>
        </router-link>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item>
        <router-link :to="signOutPage">
          <a-icon type="poweroff" />
          <span>退出登录</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  name: 'SystemAvatar',
  props: {
    src: { // 头像路径
      type: String,
      required: false,
      default: './static/img/head.png'
    },
    name: { // 用户名
      type: String,
      required: false,
      default: '未知'
    },
    userPage: { // 个人中心页面
      required: false,
      default: ''
    },
    signOutPage: { // 退出登录页面
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
@import url("SystemAvatar.less");
</style>
