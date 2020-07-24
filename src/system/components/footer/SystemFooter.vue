<template>
  <div class="footer">
    <div class="links">
      <a target="_blank" :key="index" :href="item.link ? item.link : 'javascript: void(0)'" v-for="(item, index) in linkList">
        <a-icon v-if="item.icon" :type="item.icon"/>{{item.name}}
      </a>
    </div>
    <div v-if="copyright != ''" class="copyright">
      Copyright <a-icon type="copyright" /> {{copyright}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'GlobalFooter',
  props: ['copyright', 'linkList']
}
</script>
<style lang="less" scoped>
  @import url('SystemFooter.less');
</style>
