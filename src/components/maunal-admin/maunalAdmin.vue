<template>
  <access-list :accessListName="$route.name"></access-list>
</template>

<script>
import accessList from '.././access-list/accessList'
export default {
  name: 'maunalAdmin',
  data () {
    return {
      message: {}
    }
  },
  mounted () {
    this.$post('http://113.105.246.233:9100/webapi/manualtow', {key: 'show'})
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },
  components: {
    accessList
  }
}
</script>

<style scoped>

</style>
