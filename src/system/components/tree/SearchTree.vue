<!-- 可搜索树状 -->
<template>
  <div class="search-tree">
    <a-input-search class="search-input" placeholder="搜索" @change="onChange" />
    <div class="tree">
      <a-tree
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="data"
        @expand="onExpand"
      >
      </a-tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: [] // 树状数据
  },
  watch: {
    data: { // 树状数据改变
      handler: function (val, oldVal) {
        this.keyAll = []
        // 获取所有节点
        const getKeyAll = data => {
          for (const item of data) {
            this.keyAll.push({
              key: item.key,
              title: item.title
            })
            if (this.$kit.isEmpty(item.children)) {
              getKeyAll(item.children)
            }
          }
        }
        getKeyAll(this.data)
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      expandedKeys: [], // 展开指定的树节点
      keyAll: [], // 所有树节点
      searchValue: '', // 搜索值
      autoExpandParent: true // 是否自动展开父节点
    }
  },
  methods: {
    // 展开/收起节点时触发
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 搜索框内容改变
    onChange (e) {
      const value = e.target.value
      const expandedKeys = this.keyAll
        .map(item => {
          if (item.key.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.data)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    getParentKey (key, data) {
      let parentKey
      for (const node of data) {
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    }
  }
}
</script>

<style lang="less">
.search-tree {
  height: 100%;
}
.search-tree .search-input {
  margin-bottom: 8px
}
.search-tree .tree {
  height:calc(100% - 45px);
  width:100%;
  overflow:auto;
}
</style>
