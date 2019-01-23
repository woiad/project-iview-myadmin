<template>
  <div class="table-expand">
    <div v-if="dataNullShow" class="data-null">
      <p>机房暂无数据，请稍后重试</p>
    </div>
    <div class="table" v-if="dataShow">
      <i-table :columns="tracIpColumns" :data="dataChange" v-if="loadingShow"></i-table>
      <div ref="spin">
        <Spin ref="spin">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>
    </div>
    <div v-if="row.status === 'false'" class="not-access">
      <p>
        {{row.data}}
      </p>
    </div>
    <div class="modal">
      <Modal v-model="modifierTracTime" title="修改牵引时间" class="modifierTime" @on-cancel="modifierCancel">
        <div class="content">
          <div class="item">
            <label>牵引时间&nbsp;&nbsp;(单位分钟)</label>
            <i-input placeholder="请输入牵引时间" v-model="inpDataTime"></i-input>
          </div>
        </div>
        <div slot="footer">
          <Button @click="modifierCancel">重置</Button>
          <Button type="primary" @click="subTracTime">提交</Button>
        </div>
      </Modal>
      <Modal v-model="confirm" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>解封确认</span>
        </p>
        <div style="text-align: center">
          <p>确定解封该ip?</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDec">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import util from '../.././util/index'
export default {
  name: 'tableExpand',
  props: {
    row: {
      type: Object
    },
    level: {
      type: Object
    }
  },
  data () {
    return {
      tracIpData: [],
      dataNullShow: false,
      dataShow: false,
      dataStatus: false,
      checkAll: '',
      moreDataShow: false,
      ind: '',
      modifierTracTime: false,
      modifierInd: '',
      inpDataTime: '',
      confirm: false,
      reliveInd: '',
      originData: [],
      loadingShow: false,
      inter: ''
    }
  },
  computed: {
    tracIpColumns () {
      let columns = []
      columns.push({
        title: 'ip地址',
        key: 'ip',
        fixed: 'left',
        width: 200
      })
      columns.push({title: '攻击流量 (单位: mb/s)',
        key: 'ran_flow',
        width: 180
      })
      columns.push({
        title: '牵引时间',
        key: 'tow_time_start',
        width: 180
      })
      if (this.level['查看全部']) {
        columns.push({
          title: '设置防护值 (单位: mb/s)',
          key: 'set_flow',
          align: 'center',
          width: 200
        })
      }
      if (this.level['查看全部']) {
        columns.push({
          title: '真实流量 (单位：mb/s)',
          key: 'flow',
          width: 180
        })
      }
      columns.push({
        title: '操作',
        key: 'option',
        fixed: 'right',
        width: 150,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: !this.level['修改牵引时间']
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showModifierTime(params)
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: !this.level['手动解封']
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.reliveIpBut(params)
                }
              }
            }, '解封ip')
          ])
        }
      })
      columns.push({title: '解封时间',
        key: 'tow_time_r',
        width: 220})
      columns.push({title: '操作人',
        key: 'user',
        width: 180})
      columns.push({title: '类型',
        key: 'type',
        width: 180})
      return columns
    },
    dataChange () {
      let keyObj = {}
      let valObj = {}
      let dataArr = []
      for (let i = 0; i < this.originData.length; i++) {
        if (this.originData[i].idc_name === this.row.idc_name) {
          if (typeof this.originData[i].data !== 'string') {
            for (let j = 0; j < this.originData[i].data.length; j++) {
              let obj = {}
              for (let k in this.originData[i].data[j].tow_value) {
                keyObj[j] = k
                valObj[j] = this.originData[i].data[j].tow_value[k]
                obj[keyObj[j]] = valObj[j]
              }
              dataArr.push(obj)
            }
          }
        }
      }
      return dataArr
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === '实时牵引管理') {
        this.realInter = setInterval(() => {
          this.getData()
        }, 6000)
      } else {
        clearInterval(this.realInter)
      }
    }
  },
  created () {
    this.getData()
    if (this.$store.state.active === '实时牵引管理') {
      this.realInter = setInterval(() => {
        this.getData()
      }, 6000)
    }
  },
  beforeDestroy () {
    clearInterval(this.realInter)
  },
  mounted () {
    if (this.row.status === 'true' && this.row.data instanceof Array !== true) {
      this.dataNullShow = true
    }
    if (this.row.status === 'true' && this.row.data instanceof Array) {
      this.dataShow = true
    }
    if (typeof this.row.data === 'object') {
      for (let i = 0; i < this.row.data.length; i++) {
        if (typeof this.row.data[i].tow_value === 'string') {
          this.row.data[i].tow_value = util.evil(this.row.data[i].tow_value)
        }
      }
    }
  },
  methods: {
    showModifierTime (params) {
      this.modifierTracTime = true
      this.modifierInd = params.index
    },
    modifierCancel () {
      this.inpDataTime = ''
    },
    subTracTime () {
      if (this.inpDataTime === '') {
        window.alert('请填写完整资料，再提交！！！')
        return true
      }
      let id = ''
      let ip = ''
      this.originData.forEach((item, index) => {
        if (item.idc_name === this.row.idc_name) {
          id = item.data[this.modifierInd].tow_value.idc_id
          ip = item.data[this.modifierInd].tow_key
        }
      })
      this.$post('/webapi/realtimetow', {key: 'updatetowtime', time: this.inpDataTime, ip: ip, idc_id: id})
        .then(res => {
          this.$Message.info('修改成功')
          this.modifierCancel()
          this.modifierTracTime = false
          this.getData()
        })
        .catch(err => {
          this.$Message.info('修改失败' + err)
        })
    },
    reliveIpBut (params) {
      this.confirm = true
      this.reliveInd = params.index
    },
    confirmDec () {
      let id = ''
      let ip = ''
      this.originData.forEach((item, index) => {
        if (item.idc_name === this.row.idc_name) {
          id = item.data[this.reliveInd].tow_value.idc_id
          ip = item.data[this.reliveInd].tow_key
        }
      })
      this.$post('/webapi/realtimetow', {key: 'remove', ip: ip, idc_id: id})
        .then(res => {
          this.$Message.info('解封成功')
          this.confirm = false
          this.getData()
        })
        .catch(err => {
          this.$Message.info('解封失败' + err)
        })
    },
    getData () {
      this.$post('/webapi/realtimetow', {key: 'show'})
        .then(res => {
          this.originData = []
          let show = false
          for (let i = 0; i < res.length; i++) {
            for (let k = 0; k < res[i].data.length; k++) {
              if (typeof res[i].data[k].tow_value === 'string') {
                res[i].data[k].tow_value = util.evil(res[i].data[k].tow_value)
              }
            }
            this.originData.push(res[i])
            if (this.originData[i].idc_name === this.row.idc_name && this.originData[i].data instanceof Array) {
              show = true
              this.dataShow = true
              this.dataNullShow = false
            }
            if (this.originData[i].idc_name === this.row.idc_name && this.originData[i].data instanceof Array !== true && this.originData[i].status === 'true') {
              this.dataShow = false
              this.dataNullShow = true
            }
          }
          if (show) {
            this.$refs.spin.style.display = 'none'
            this.loadingShow = true
            this.dataNullShow = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
  .table-expand{
    width: 100%;
  }
  .table-expand .data-show{
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #DCDFE6;
  }
  .modifierTime label{
    display: inline-block;
    padding-bottom: 8px;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>

<style>
  .table td.ivu-table-expanded-cell{
    padding: 20px 20px;
  }
</style>
