<template>
  <div class="log-container">
    <div class="layout">
      <layout>
        <div class="nav">
          <Sider hide-trigger>
            <Menu theme="light" width="auto" :active-name="changeActive" ref="menu" @on-select="handelChange">
              <MenuItem v-for="(item, index) in levelMess" :key="index" :name="index" v-if="item" :class="{active: changeActive === index}">
                <span>{{index}}</span>
              </MenuItem>
            </Menu>
          </Sider>
        </div>
        <Layout>
          <Content>
            <keep-alive><router-view></router-view></keep-alive>
          </Content>
        </Layout>
      </layout>
    </div>
  </div>
</template>

<script>
export default {
  name: 'logAdmin',
  data () {
    return {
      levelMess: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/user', {key: 'level'})
        .then(res => {
          this.levelMess = res.user_level['日志管理']
          delete this.levelMess['status']
          delete this.levelMess['虚拟日志']
        })
        .catch(err => {
          console.log(err)
        })
    },
    handelChange (name) {
      this.active = false
      this.$router.push({name: name})
    }
  },
  computed: {
    changeActive () {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
  .log-container{
    width: 100%;
    height: 80%;
    overflow: hidden;
    padding: 14px 16px;
  }
  .log-container .ivu-menu-item.active{
    color: #2d8cf0;
    border-right: 2px solid #2d8cf0;
  }
  .log-container .layout{
    height: 100%;
  }
  .log-container .ivu-layout{
    height: 100%;
  }
  .log-container .ivu-layout-sider{
    height: 100%;
    bakcground: #fff;
  }
  .log-container .ivu-menu{
    height: 100%;
  }
  .log-container .ivu-menu-item{
    font-size: 12px;
  }
</style>
