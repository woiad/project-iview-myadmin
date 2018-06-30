<template>
  <div class="container">
    <h1 class="title">权限管理</h1>
    <div class="list">
      <ul>
        <li v-for="items in accessJson" :key="items.id" class="card">
          <template v-for="(item, index) in items.access">
            <Card  class="access-list" :key="index">
              <p slot="title" class="list-title">
                <Avatar icon="person" />
                <span class="list-name">{{items.name}}</span>
              </p>
              <span class="list-con-title">权限列表</span>
              <span class="list-access">权限操作</span>
              <ul>
                <li v-for="(child, index) in item" :key="index">
                  <span class="access-name">{{child.name}}</span>
                  <template>
                    <i-switch size="small" :value="child.val" :disabled=" !child.val" class="switch"></i-switch>
                  </template>
                </li>
              </ul>
            </Card>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'access',
  data () {
    return {
      accessJson: []
    }
  },
  computed () {
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  created () {
    axios.get('../.././static/access.json').then((response) => {
      this.accessJson = response.data.user
    })
  },
  methods: {

  }
}
</script>

<style scoped>
  .container{
    margin: 20px;
  }
  .container title{
    font-size: 18px;
  }
  .card{
    margin-top: 15px;
    overflow: hidden;
  }
  .card:after{
    content:'';
    clear: both;
    overflow: hidden;
  }
  .list{
    margin: 20px;
  }
  ul li{
    list-style: none;
  }
  .list-title{
    height: auto
  }
  .list-name{
    margin-left: 15px
  }
  .list-con-title, .list-access{
    font-size: 18px
  }
  .access-list{
    float: left;
    margin-left: 15px;
  }
  .list-access{
    float: right;
  }
  .access-name{
    font-size: 16px;
  }
  .switch{
    float: right
  }
</style>
