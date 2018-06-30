<template>
  <div class="nav">
    <Breadcrumb>
      <BreadcrumbItem v-for="(item, index) in path" :key="index" :href="item.path">{{item.title}}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'navBar',
  props: {
    path: {
      type: Array,
      required: true
    }
  },
  watch: {
    '$route' (to, from) {
      this.$store.commit('setCurrentPath', to)
    }
  }
}
</script>

<style scoped>
  .nav{
    position: absolute;
    top: 0;
    margin-left: 60px;
  }
</style>
