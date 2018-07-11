<template>
  <access-list :accessListName="$route.name"></access-list>
</template>

<script>
import accessList from '.././access-list/accessList'
export default {
  name: 'realtimeAdmin',
  data () {
    return {
      message: {}
    }
  },
  components: {
    accessList
  },
  methods: {
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'show'})
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
