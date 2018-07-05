<template>
    <div class="list">
      <Col :xs="{span: 16}" :sm="{span: 8}" :md="{span: 7}" :lg="{span: 6}">
        <Card>
          <p slot="title">权限列表</p>
          <ul>
            <li v-for="(item, key, index) in message" :key="index" class="access-list">
              <span class="text-access">{{key}}</span>
              <div class="right">
                <span class="modifi-access">
                  <Button type="info" size="small" @click="modalShow(key)">修改权限</Button>
                </span>
                <span class="del-access"><Button type="error" size="small" @click="confirm(key)">删除权限</Button></span>
              </div>
            </li>
          </ul>
        </Card>
      </Col>
      <div class="modife-modal">
        <Modal
          v-model="modal"
          title="权限修改操作"
          @on-ok="ok"
          @on-cancel="cancel">
          <ul  class="modife-container">
            <li v-for="(item, key, index) in shoewAccessList" :key="index">
              <span class="access-name">{{key}}</span>
              <i-switch :ref="key" :value="intialSwitch(item)"  @on-change="switchChange(key)" class="access-switch"></i-switch>
            </li>
          </ul>
        </Modal>
      </div>
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
      allData: {},
      message: {},
      modal: false,
      switchStatus: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    jsonOption (allData, active) {
      let data = allData
      let currentAccess = active
      for (let i in data.user_level) {
        if (i === currentAccess) {
          for (let j in data.user_level[i]) {
            let chartBol = this.$refs[j][0].currentValue
            let flag = chartBol === true ? 'true' : 'false'
            if (data.user_level[i][j] !== flag) {
              data.user_level[i][j] = flag
            }
          }
        }
      }
    },
    getData () {
      axios.get('http://113.105.246.233:9005/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/api/webapi/login_level').then((response) => {
        let list = {}
        this.allData = response.data
        list = response.data.user_level
        for (let i in list) {
          if (i === this.accessListName) {
            this.message = list[i]
          }
        }
        delete this.message.status
      })
    },
    ok () {
      this.jsonOption(this.allData, this.$store.state.active)
      console.log(this.allData)
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
    switchChange (accessName) {
      let currentVal = this.$refs[accessName][0].currentValue
      this.$Message.info(accessName + '权限状态:&nbsp;&nbsp;' + currentVal)
      axios.post('http://113.105.246.233:9005/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/webapi/template', 'show')
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    modalShow (accessName) {
      this.modal = true
    },
    confirm (key) {
      this.$Modal.confirm({
        title: '确认提示框',
        content: '确认删除？一旦删除该权限无法恢复！',
        onOk: () => {
          let data = this.allData
          let currentAccess = this.$store.state.active
          for (let i in data.user_level) {
            if (i === currentAccess) {
              for (let j in data.user_level[i]) {
                if (j === key) {
                  this.$delete(this.message, j)
                }
              }
              console.log(this.message)
            }
          }
          axios.post('http://113.105.246.233:9005/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/webapi/template')
            .then((response) => {
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
            })
          this.$Message.info('删除成功')
        },
        onCancel: () => {
          this.$Message.info('删除取消')
        }
      })
    }
  },
  computed: {
    shoewAccessList () {
      return this.message
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
  .list li.access-list{
    display: flex;
    list-style: none;
    margin-bottom: 10px;
    line-height: 20px;
  }
  .list li .text-access{
    display: inline-block;
    flex: 1;
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
    margin-bottom: 10px;
    heightL: 30px;
    list-style: none;
  }
  .modife-container li .access-name{
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    line-height: 20px;
  }
  .modife-container li .access-switch{
    float: right;
    margin-right: 20px;
  }
</style>
