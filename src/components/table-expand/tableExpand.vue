<template>
  <div class="table-expand">
    <div v-if="dataNullShow" class="data-null">
      <p>机房暂无数据，请稍后重试</p>
    </div>
    <div class="table" v-if="dataStatus">
      <i-table :columns="tracIpColumns" :data="tracIpData"></i-table>
    </div>
    <div v-if="!dataStatus" class="not-access">
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
      showSetFlow: false,
      showTowTimeStart: false,
      showFlow: false,
      modifierTracTime: false,
      modifierInd: '',
      inpDataTime: '',
      confirm: false,
      reliveInd: ''
    }
  },
  computed: {
    tracIpColumns () {
      let columns = []
      if (this.showSetFlow) {
        columns.push({
          title: '设置防护值 (单位: mb/s)',
          key: 'set_flow',
          width: 180,
          align: 'center'
        })
      }
      if (this.showFlow) {
        columns.push({
          title: '真实流量 (单位：mb/s)',
          key: 'flow',
          width: 180
        })
      }
      if (this.showTowTimeStart) {
        columns.push({
          title: '牵引时间',
          key: 'tow_time_start',
          width: 180
        })
      }
      columns.push({
        title: '操作',
        key: 'option',
        fixed: 'right',
        width: 300,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showModifierTime(params)
                }
              }
            }, '修改牵引时间'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.reliveIpBut(params)
                }
              }
            }, '解封ip'),
            h('Button', {
              props: {
                size: 'small',
                disabled: this.checkAll
              },
              on: {
                click: () => {
                  this.showMoreAccess()
                }
              }
            }, '查看更多权限')
          ])
        }
      })
      columns.push({
        title: 'ip地址',
        key: 'ip',
        fixed: 'left',
        width: 150
      })
      columns.push({title: '攻击流量 (单位: mb/s)',
        key: 'ran_flow',
        width: 180})
      columns.push({title: '解封时间',
        key: 'tow_time_r',
        width: 220})
      columns.push({title: '操作人',
        key: 'user',
        width: 150})
      columns.push({title: '类型',
        key: 'type',
        width: 150})
      return columns
    }
  },
  mounted () {
    console.log(this.row)
    let keyObj = {}
    let valObj = {}
    if (typeof this.row.data !== 'string') {
      for (let i = 0; i < this.row.data.length; i++) {
        let obj = {}
        for (let k in this.row.data[i].tow_value) {
          keyObj[i] = k
          valObj[i] = this.row.data[i].tow_value[k]
          obj[keyObj[i]] = valObj[i]
        }
        this.tracIpData.push(obj)
      }
    }
    if (this.row.status) {
      this.dataStatus = true
    } else {
      this.dataStatus = false
    }
    if (this.row.data.length === undefined) {
      this.dataNullShow = true
    }
    if (this.row.status && this.row.data.length !== undefined) {
      this.dataShow = true
    }
    if (typeof this.row.data === 'object') {
      for (let i = 0; i < this.row.data.length; i++) {
        if (typeof this.row.data[i].tow_value === 'string') {
          this.row.data[i].tow_value = util.evil(this.row.data[i].tow_value)
        }
      }
    }
    console.log(this.level)
    if (this.level['查看全部'] === 'true') {
      this.checkAll = false
    }
  },
  methods: {
    show (index) {
      this.$refs.moreAccess[index].style.display = 'block'
      this.ind = index
    },
    showMoreAccess () {
      this.showFlow = true
      this.showSetFlow = true
      this.showTowTimeStart = true
    },
    showModifierTime (params) {
      this.modifierTracTime = true
      this.modifierInd = params.index
      console.log(this.modifierInd)
    },
    modifierCancel () {
      this.inpDataTime = ''
    },
    subTracTime () {
      debugger
      if (this.inpDataTime === '') {
        window.alert('请填写完整资料，再提交！！！')
        return true
      }
      let ip = this.row.data[this.modifierInd].tow_key
      let id = this.row.data[this.modifierInd].tow_value.idc_id
      this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'updatetowtime', time: this.inpDataTime, ip: ip, idc_id: id})
        .then(res => {
          this.$Message.info('修改成功')
          this.modifierCancel()
          this.modifierTracTime = false
        })
        .catch(err => {
          this.$Mesage.info('修改失败' + err)
        })
    },
    reliveIpBut (params) {
      this.confirm = true
      this.reliveInd = params.index
    },
    confirmDec () {
      let id = this.row.data[this.reliveInd].tow_value.idc_id
      let ip = this.row.data[this.reliveInd].tow_key
      console.log(id)
      this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'remove', ip: ip, idc_id: id})
        .then(res => {
          this.$Message.info('解封成功')
          this.confirm = false
        })
        .catch(err => {
          this.$Message.info('解封失败' + err)
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
</style>
