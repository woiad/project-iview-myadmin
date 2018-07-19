<template>
  <div class="tem-container">
    <div class="tem-add">
      <Button type="primary" icon="ios-plus-empty" @click="addTem" :disabled="levelMess['新建'] !== 'true'">添加防护</Button>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="idcData"></i-table>
    </div>
    <div class="modal">
      <Modal v-model="buildTemShow" @on-cancel="temCancel">
        <div class="content">
          <div class="item">
            <label>防护ip</label>
            <i-input placeholder="请输入防护ip" v-model="defData.ip"></i-input>
          </div>
          <div class="item">
            <label>生效时间&nbsp;&nbsp; (单位：小时)</label>
            <i-input placeholder="请输入生效时间" v-model="defData.time"></i-input>
          </div>
          <div class="item">
            <label>防护值&nbsp;&nbsp; (单位：mb/s)</label>
            <i-input placeholder="请输入防护值" v-model="defData.idc_ip_bps"></i-input>
          </div>
          <div class="item">
            <label>牵引时间&nbsp;&nbsp; (单位：分钟)</label>
            <i-input placeholder="请输入牵引时间" v-model="defData.idc_ip_tow_time"></i-input>
          </div>
          <div class="item">
            <label>机房名称：&nbsp;{{defData.idc_name}}</label>
            <Select v-model="defData.idc_name"  placeholder="请选择机房">
              <Option v-for="item in idcList" :value="item.idc_name" :key="item.idc_name">{{ item.idc_name }}</Option>
            </Select>
          </div>
        </div>
        <div slot="footer">
          <Button @click="temCancel">重置</Button>
          <Button type="primary" @click="temSub">提交</Button>
        </div>
      </Modal>
      <Modal v-model="confirmShow" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align: center">
          <p>确定解删除ip?</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDec">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import temporaryExpand from './temporaryExpand'
import util from '../.././util/index'
export default {
  name: 'temporaryDenfend',
  data () {
    return {
      columnsData: [
        {
          title: '机房名称',
          key: 'idc_root_name'
        },
        {
          title: 'ip',
          key: 'ip'
        },
        {
          title: '开始时间',
          key: 'start_time'
        },
        {
          title: '结束时间',
          key: 'end_time'
        },
        {
          title: '防护值(单位：mb/s)',
          key: 'idc_ip_bps'
        },
        {
          title: '牵引时间(单位：分钟)',
          key: 'idc_ip_tow_time'
        },
        {
          title: '操作',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: this.levelMess['删除'] !== 'true'
              },
              on: {
                click: () => {
                  this.delClick(params)
                }
              }
            }, '删除')
          }
        }
      ],
      idcData: [],
      levelMess: {},
      buildTemShow: false,
      defData: {
        ip: '',
        idc_name: '',
        time: '',
        idc_ip_bps: '',
        idc_ip_tow_time: ''
      },
      confirmShow: false,
      idcList: []
    }
  },
  methods: {
    getData () {
      this.idcData = []
      this.$post('http://113.105.246.233:9100/webapi/temfwip', {key: 'show'})
        .then(res => {
          console.log(res)
          if (res instanceof Array) {
            res.forEach((item, index) => {
              this.idcData.push(item)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.$post('http://113.105.246.233:9100/webapi/public', {key: 'idc_root'})
        .then(res => {
          this.idcList = []
          res.forEach((item, index) => {
            this.idcList.push(item)
          })
        })
    },
    addTem () {
      this.buildTemShow = true
    },
    temCancel () {
      this.defData.ip = ''
      this.defData.idc_name = ''
      this.defData.idc_ip_bps = ''
      this.defData.time = ''
      this.defData.idc_ip_tow_time = ''
    },
    temSub () {
      if (this.defData.ip === '' || this.defData.idc_name === '' || this.defData.idc_ip_bps === '' || this.defData.time === '' || this.defData.idc_ip_tow_time === '') {
        alert('请填写完整资料！')
        return true
      }
      if (!util.regIp(this.defData.ip)) {
        alert('ip格式不正确！')
        return true
      }
      let id = ''
      for (let i = 0; i < this.idcList.length; i++) {
        if (this.defData.idc_name === this.idcList[i].idc_name) {
          id = this.idcList[i].id
        }
      }
      let obj = {}
      obj.ip = this.defData.ip
      obj.idc_root_id = id
      obj.idc_root_name = this.defData.idc_name
      obj.time = this.defData.time
      obj.idc_ip_bps = this.defData.idc_ip_bps
      obj.idc_ip_tow_time = this.defData.idc_ip_tow_time
      let chart = JSON.stringify(obj)
      this.$post('http://113.105.246.233:9100/webapi/temfwip', {key: 'add', content: chart})
        .then(res => {
          this.$Message.info('添加成功')
          this.getData()
          this.temCancel()
          this.buildTemShow = false
        })
        .catch(err => {
          this.$Message.info('添加失败' + err)
        })
    },
    delClick (params) {
      this.confirmShow = true
      this.delData = params
    },
    confirmDec () {
      console.log(this.delData.row.ip)
      let ip = this.delData.row.ip
      this.$post('http://113.105.246.233:9100/webapi/temfwip', {key: 'del', ip: ip})
        .then(res => {
          this.$Message.info('删除成功')
          this.getData()
          this.confirmShow = false
        })
        .catch(err => {
          this.$Message.info('删除失败' + err)
        })
    }
  },
  mounted () {
    let levelObj = {}
    levelObj = this.$store.state.userLevel
    if (levelObj !== undefined) {
      for (let i in levelObj) {
        if (i === this.$route.name) {
          this.levelMess = levelObj[i]
        }
      }
    }
    this.getData()
  },
  computed: {
    a () {
      return this.$store.state.userLevel
    }
  },
  watch: {
    a: {
      handler: function (val) {
        for (let i in val) {
          if (i === this.$route.name) {
            this.levelMess = val[i]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .tem-container{
    padding: 14px 16px;
  }
  .tem-container .tem-add{
    margin-bottom: 15px;
  }
  .item{
    margin-bottom: 8px;
  }
  .item label{
    display: inline-block;
    margin-bottom: 8px;
  }
  .table{
    margin-bottom: 150px;
  }
</style>
