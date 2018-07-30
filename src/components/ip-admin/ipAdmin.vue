<template>
  <div class="ip-container">
    <div class="layout">
      <Layout>
        <div class="nav">
          <Sider hide-trigger>
            <Menu theme="light" width="auto" :active-name="changeActive" @on-select="handleChange">
              <MenuItem v-for="(item, index) in levelMess" :key="index" v-if="item" :name="index" :class="{active: changeActive === index}">
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
      </Layout>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ipAdmin',
  data () {
    return {
      levelMess: {}
    }
  },
  computed: {
    changeActive () {
      return this.$route.name
    }
  },
  methods: {
    getData () {
      this.$post('/webapi/user', {key: 'level'})
        .then(res => {
          this.levelMess = res.user_level['ip防护管理']
          delete this.levelMess['status']
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange (name) {
      this.active = false
      this.$router.push({name: name})
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .ip-container{
    width: 100%;
    padding: 14px 16px;
    overflow: hidden;
    height: 80%;
  }
  .ip-container .ivu-menu-item.active{
    color: #2d8cf0;
    border-right: 2px solid #2d8cf0;
  }
  .ip-container .layout{
    height: 100%;
  }
  .ip-container .ivu-layout{
    height: 100%;
  }
  .ip-container .ivu-layout-sider{
    height: 100%;
    bakcground: #fff;
  }
  .ip-container .ivu-menu{
    height: 100%;
  }
  .ip-container .ivu-menu-item{
    font-size: 12px;
  }
</style>
