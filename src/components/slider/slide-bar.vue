<template>
    <Menu hide-trigger :active-name="changeActive" theme="dark" width="auto" :class="menuitemClasses" @on-select="handelChange">
      <MenuItem :name="key" v-for="(value, key) in accessList" :key="key" :class="[value['status'], {show: changeActive === key}, {iconShow: isCollapsed}]">
        <Tooltip placement="right-start" :content="key">
          <span class="icon" :class='key' v-if="iconShow"></span>
        </Tooltip>
        <span v-if="textShow">{{key}}</span>
      </MenuItem>
    </Menu>
</template>

<script>
export default {
  name: 'slide-bar',
  props: {
    isCollapsed: {
      type: Boolean
    },
    accessList: {
      type: Object
    },
    iconShow: {
      type: Boolean
    },
    textShow: {
      type: Boolean
    }
  },
  watch: {
    '$route' (to, form) {
      if (typeof this.$store.state.userLevel === 'object') {
        for (let i in this.$store.state.userLevel['日志管理']) {
          if (i === to.name) {
            console.log(form)
            this.$store.commit('changeActive', '日志管理')
            return true
          }
        }
      }
      this.$store.commit('changeActive', to.name)
    }
  },
  computed: {
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    changeActive () {
      if (this.$store.state.active === '') {
        return localStorage.getItem(name)
      }
      return this.$store.state.active
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handelChange (name) {
      let width = window.screen.width
      this.$router.push({name: name})
    },
    init () {
      if (JSON.stringify(this.$store.state.userLevel) === '{}') {
        let activeName = localStorage.getItem('name')
        this.$store.commit('changeActive', activeName)
        return true
      } else if (typeof this.$store.state.userLevel === 'object') {
        for (let i in this.$store.state.userLevel['日志管理']) {
          if (i === this.$route.name) {
            this.$store.commit('changeActive', '日志管理')
            return true
          }
        }
      }
      this.$store.commit('changeActive', this.$route.name)
    }
  }
}
</script>

<style>
  .false{display: none}
  .show{
    background: #363e4f;
    border-right: 2px solid #2d8cf0;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item.show:hover{
    background: #363e4f;
    border-right: 2px solid #2d8cf0;
    color: #2d8cf0;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item.show{color: #2d8cf0;}
  .icon{
    display: inline-block;
    width: 50px;
    height: 30px;
    background: url('../../assets/maunal.png') no-repeat;
    background-position: center center;
    background-size: 50%;
  }
  .ivu-menu-item{
    white-space: nowrap;
  }
  .ivu-menu-item.iconShow{
    padding: 14px 10px;
  }
  .ivu-tooltip-popper{
    maargin-left: 10px;
  }
  .ivu-tooltip-content{
    margin-left: 10px;
  }
  .ivu-tooltip-popper .ivu-tooltip-arrow{
    border: none;
    background: #000;
  }
  .用户管理{
    background-image: url(../../assets/user.png);
  }
  .全局管理{
    background-image: url(../../assets/allAdmin.png);
  }
  .实时牵引管理{
    background-image: url(../../assets/realtime.png);
  }
  .手动封停管理{
    background-image: url(../../assets/maunal.png);
  }
  .历史管理{
    background-image: url(../../assets/history.png);
  }
  .虚拟牵引{
    background-image: url(../../assets/virtual.png);
  }
  .权限模版{
    background-image: url(../../assets/template.png);
  }
  .日志管理{
    background-image: url(../../assets/log.png);
  }
  .临时防护管理{
    background-image: url(../../assets/denfend.png);
  }
</style>
