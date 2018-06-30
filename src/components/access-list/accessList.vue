<template>
    <div class="list">
      <Col :xs="{span: 16}" :sm="{span: 8}" :md="{span: 7}" :lg="{span: 6}">
        <Card>
          <p slot="title">权限列表</p>
          <ul>
            <li v-for="(item, key, index) in message" :key="index">
              <span class="text-access">{{key}}</span>
              <span class="modifi-access">
                <Button type="info" size="small" @click="modal = true">修改权限</Button>
                <div :class="key">
                   <Modal
                     v-model="modal"
                     title="权限列表"
                     @on-ok="ok"
                     @on-cancel="cancel">
                    <span>{{key}}</span>
                    <i-switch ref="swh" :value="intialSwitch(item)"  @on-change="switchChange"></i-switch>
                  </Modal>
                </div>
              </span>
              <span class="del-access"><Button type="error" size="small">删除权限</Button></span>
            </li>
          </ul>
        </Card>
      </Col>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'accessList',
  props: {
    accessListName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      message: {},
      modal: false,
      switchStatus: false
    }
  },
  mounted () {
    axios.get('http://113.105.246.233:9005/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/api/webapi/login_level').then((response) => {
      let list = {}
      list = response.data.user_level
      for (let i in list) {
        if (i === this.accessListName) {
          this.message = list[i]
        }
      }
      delete this.message.status
    })
  },
  methods: {
    ok () {
      console.log(this.message)
    },
    cancel () {
      console.log('cancel')
    },
    intialSwitch (item) {
      if (item) {
        return true
      } else {
        return false
      }
    },
    switchChange (status) {
      console.log(this.$refs.swh)
      this.$Message.info('权限状态' + status)
    }
  }
}
</script>

<style scoped>
  .list{
    margin: 20px;
    width: 100%;
    overflow: hidden;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
  }
  .list li{
    list-style: none;
    margin-bottom: 10px;
    line-height: 20px;
  }
  .list li .text-access{
    display: inline-block;
    padding-top: 2px;
    vertical-align: middle;
    color: #2d8cf0;
    line-height: 16px;
    font-size: 16px;
    font-weight: normal;
    cursor: pointer;
  }
  .list li span{
    margin-left: 10px;
  }
  .modife-container li{
    list-style: none;
  }
</style>
