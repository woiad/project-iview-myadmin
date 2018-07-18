<template>
  <access-list :accessListName="$route.name"></access-list>
</template>

<script>
import accessList from '.././access-list/accessList'
import axios from 'axios'
export default {
  name: 'historyAdmin',
  data () {
    return {
      message: {}
    }
  },
  mounted () {
    this.$post('http://113.105.246.233:9100/webapi/user', {key: 'level'})
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
