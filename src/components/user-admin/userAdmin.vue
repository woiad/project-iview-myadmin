<template>
  <access-list :accessListName="$route.name"></access-list>
</template>

<script>
import accessList from '.././access-list/accessList'
export default {
  name: 'userAdmin',
  data () {
    return {
      message: {}
    }
  },
  components: {
    accessList
  }
}
</script>

<style scoped>

</style>
