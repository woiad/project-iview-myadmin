<template>
  <div class="container">
    <div class="layout">
      <layout>
        <Sider ref="slide" breakpoint="sm" hide-trigger collapsible :collapsed-width="70" v-model="isCollapsed" :style="{position: 'fixed', top: top(), bottom: '0', zIndex: '20'}">
          <slide-bar :is-collapsed="isCollapsed" :access-list="message" :icon-show="iconShow" :text-show="textShow"></slide-bar>
        </Sider>
        <Layout>
          <Header :style="{paddingLeft: paddingLeft + 'px'}" class="layout-header-bar">
            <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
            <nav-bar :path="path"></nav-bar>
            <div class="user-dropdown-menu-con">
              <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                  <a href="javascript:void(0)">
                    <span>{{username}}</span>
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Avatar src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg" style="background: #619fe7;margin-left: 10px;"></Avatar>
              </Row>
            </div>
          </Header>
          <div class="tags-con" :style="{paddingLeft: paddingLeft + 'px'}">
            <tags-open-list :pageList = pageList></tags-open-list>
          </div>
          <div class="singe-page" :style="{left: paddingLeft + 'px'}">
            <keep-alive><router-view></router-view></keep-alive>
          </div>
          <div class="footer">
            <p>版权</p>
          </div>
        </Layout>
      </layout>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SlideBar from './slider/slide-bar'
import accessList from './access-list/accessList'
import navBar from './navBar/navBar'
import cookies from 'js-cookie'
import tagsOpenList from './tagOpenList/tags-opend-list'
export default {
  name: 'index',
  components: {
    SlideBar,
    accessList,
    navBar,
    tagsOpenList
  },
  watch: {
    '$route' (to) {
      this.$store.commit('increatteTage', to)
    }
  },
  data () {
    return {
      isCollapsed: false,
      message: {},
      accessList: {},
      username: cookies.get('user_accounts'),
      iconShow: false,
      textShow: true
    }
  },
  methods: {
    init () {
      this.$store.commit('setCurrentPath', this.$route)
    },
    handleClickUserDropdown (name) {
      if (name === 'loginout') {
        cookies.remove('user_accounts')
        this.$router.push({name: 'login'})
      } else if (name === 'ownSpace') {
        this.$router.push({name: '个人中心'})
      }
    },
    collapsedSider () {
      let width = window.screen.width
      this.isCollapsed = !this.isCollapsed
      if (width <= 768) {
        this.iconShow = false
      } else {
        this.iconShow = this.isCollapsed
        this.textShow = !this.isCollapsed
      }
    },
    top () {
      let width = window.screen.width
      if (width <= 768) {
        return '60px'
      } else {
        return 0
      }
    }
  },
  mounted () {
    axios.get('http://113.105.246.233:9005/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/api/webapi/login_level').then((response) => {
      this.message = response.data.user_level
      this.$set(this.message, '模板管理', {status: 'true', 模板查看: 'true', 模板新建: 'true', 模板删除: 'true', 模板修改: 'true'})
    })
    this.init()
    this.$store.commit('setOpenList')
  },
  computed: {
    path () {
      return this.$store.state.currentPath
    },
    rotateIcon () {
      return [
        'munu-icon',
        this.isCollapsed ? 'rotateIcon' : ''
      ]
    },
    paddingLeft () {
      let width = window.screen.width
      if (width < 768) {
        return 0
      } else {
        return this.isCollapsed ? 71 : 201
      }
    },
    pageList () {
      return this.$store.state.pageOpenList
    }
  }
}
</script>

<style scoped>
  .container{
    height: 100%;
  }
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
  }
  .ivu-layout-header{
    padding: 0 5px;
  }
  .layout-header-bar{
    height: 60px;
    line-height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    transition: padding-left .25s linear;
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .user-dropdown-menu-con{
    position: absolute;
    right: 0;
    top: 0;
    height: 60px;
    width: 150px;
  }
  .user-dropdown-menu-con .user-dropdown-innercon{
    padding-right: 14px;
    height: 100%;
  }
  .user-dropdown-menu-con .user-dropdown-imnnercon .main-user-name{
    display: inline-block;
    width: 80px;
    word-break: keep-all;
    white-space: nowrap;
    vertical-align: middle;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    text-align: right;
  }
  .tags-con{
    position: relative;
    height: 44px;
    z-index: 1;
    overflow: hidden;
    background: #f0f0f0;
    border-bottom: 2px solid #e2e2e2;
    border-top: 2px solid #e2e2e2;
    transition: padding-left .25s linear;
  }
  .singe-page{
    position: fixed;
    top: 104px;
    height: 100%;
    overflow: scroll;
    /*position: relative;*/
    right: 0;
    bottom: 0;
    background: #f0f0f0;
    transition: left .25s linear;
  }
  .footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    background: #d1c7b7;
  }
  .footer p{
    font-size: 16px;
    color: #000;
    line-height: 60px;
    text-align: center;
  }
  @media screen and (max-width: 768px) {
    .user-dropdown-menu-con{
      right: 0;
    }
  }
</style>
<style>
  .user-dropdown-menu-con .ivu-dropdown .ivu-select-dropdown{
    width: 100px !important;
    right: 10px;
    margin: -4px 0 0 0;
  }
  .user-dropdown-menu-con .ivu-dropdown-item{
    text-align: center;
  }
</style>
