<template>
  <div class="trac-container">
    <div class="query">
      <div class="query-time">
        <div class="start-time time">
          <DatePicker type="date" placeholder="请选择开始时间" style="width: 200px" v-model="time.start"></DatePicker>
        </div>
        <div class="end-time time">
          <DatePicker type="date" placeholder="请选择结束时间" style="width: 200px" v-model="time.end" :options="endOptions"></DatePicker>
        </div>
      </div>
      <div class="query-ip">
        <i-input style="width: 200px" placeholder="请输入ip" v-model="ip"></i-input>
        <div class="but">
          <Button type="primary" @click="ipQuery">查询</Button>
        </div>
      </div>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="tracData"></i-table>
    </div>
  </div>
</template>

<script>
import util from '../../.././util/index'
export default {
  name: 'tracLog',
  data () {
    return {
      endOptions: {
        disabledDate: (data) => {
          if (this.time.start !== null) {
            return data && data.valueOf() < this.time.start.valueOf() + 86400000
          }
        }
      },
      levelMess: {},
      time: {
        start: '',
        end: ''
      },
      ip: '',
      tracData: [],
      flowShow: false,
      setFlowShow: false
    }
  },
  computed: {
    columnsData () {
      let data = []
      data.push({
        title: 'ip地址',
        key: 'ip',
        fixed: 'left',
        width: 150
      })
      data.push({
        title: '机房名称',
        key: 'idcrootname',
        width: 120
      })
      if (this.flowShow) {
        data.push({
          title: '真实流量 (单位：mb/s)',
          key: 'flow',
          width: 180
        })
      }
      if (this.setFlowShow) {
        data.push({
          title: '设置防护值 (单位：mb/s)',
          key: 'set_flow',
          width: 180
        })
      }
      data.push({
        title: '牵引开始时间',
        key: 'tow_time_start',
        width: 180
      })
      data.push({
        title: '牵引结束时间',
        key: 'tow_time_end',
        width: 180
      })
      data.push({
        title: '攻击值',
        key: 'ran_flow',
        width: 120
      })
      data.push({
        title: '操作人员',
        key: 'opername',
        width: 120
      })
      data.push({
        title: '类型',
        key: 'type',
        width: 120
      })
      data.push({
        title: '操作',
        width: 80,
        fixed: 'right',
        align: 'center',
        render: (h, params) => {
          return h('Button', {
            props: {
              type: 'error',
              size: 'small',
              disabled: this.levelMess['查看全部'] !== 'true'
            },
            on: {
              click: () => {
                this.showALL()
              }
            }
          }, '全部')
        }
      })
      return data
    },
    a () {
      return this.$store.state.userLevel
    }
  },
  watch: {
    a: {
      handler: function (val) {
        this.levelMess = val['实时牵引管理']
      }
    }
  },
  mounted () {
    if (this.$store.state.userLevel !== undefined) {
      this.levelMess = this.$store.state.userLevel['实时牵引管理']
    }
    this.getData()
  },
  methods: {
    getData () {
      let obj = {}
      if (this.time.start !== '' && this.time.end !== '') {
        obj.time_start = util.timeTransform(this.time.start)
        obj.time_end = util.timeTransform(this.time.end)
      }
      if (this.time.start === '' && this.time.end === '' && this.ip !== '') {
        obj.time_start = util.timeTransform(new Date())
        obj.time_end = util.addDat(obj.time_start, 1)
      }
      if (this.ip !== '') {
        obj.ip = this.ip
      }
      let chart = JSON.stringify(obj)
      this.$post('http://113.105.246.233:9100/webapi/log', {key: 'towlog', content: chart})
        .then(res => {
          this.tracData = []
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              if (JSON.stringify(item.all_value) !== '{}' || item.all_value !== undefined) {
                let key = {}
                let val = {}
                for (let i in item.all_value) {
                  key[i] = i
                  val[i] = item.all_value[i]
                  item[key[i]] = val[i]
                }
              }
              this.tracData.push(item)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ipQuery () {
      if (this.ip === '' && this.time.start === '' && this.time.end === '') {
        alert('请输入查询条件!')
        return true
      }
      if (!util.regIp(this.ip) && this.ip !== '') {
        alert('输入ip格式不正确！')
        return true
      }
      this.getData()
    },
    showALL () {
      this.flowShow = true
      this.setFlowShow = true
    }
  }
}
</script>

<style scoped>
  @import "common/query.css";
  .trac-container{
    padding: 14px 16px;
  }
</style>
