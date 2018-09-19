<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  mounted () {
    setInterval(() => {
      this.$post('/webapi/user', {key: 'level'})
        .then(res => {
          if (typeof res !== 'object') {
            alert('登陆超时，请重新登陆')
            axios.get('/login_out')
              .then(res => {
                window.location.href = '/'
              })
              .catch(err => {
                this.$Message.info('退出失败' + err)
              })
          }
        })
    }, 10000)
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
