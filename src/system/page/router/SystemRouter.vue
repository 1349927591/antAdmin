<template>
  <transition name="page-toggle">
    <keep-alive>
      <router-view />
    </keep-alive>
  </transition>
</template>

<script>
export default {
  name: 'RouteView'
}
</script>
