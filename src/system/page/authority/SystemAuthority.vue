<!-- 权限列表管理 -->
<template>
  <a-card style="box-shadow: 2px 2px 5px #888888;height:100%">
    <div style="width:250px;height:100%;">
      <search-tree></search-tree>
    </div>
  </a-card>
</template>

<script>
import SearchTree from '@/system/components/tree/SearchTree'
export default {
  name: 'SystemAuthority',
  components: {SearchTree}
}
</script>
<style>
.ant-card-body {
  height: 100%;
}
</style>
