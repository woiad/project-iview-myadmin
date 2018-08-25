<template>
  <div class="trac-container">
    <div class="query">
      <div class="query-time">
        <div class="start-time time">
          <DatePicker type="date" placeholder="请选择开始日期" style="width: 130px" v-model="date.start"></DatePicker>
        </div>
        <div class="time">
          <TimePicker type="time" placeholder="请选择开始时间" style="width: 130px" v-model="time.start"></TimePicker>
        </div>
        <div class="end-time time">
          <DatePicker type="date" placeholder="请选择结束日期" style="width: 130px" v-model="date.end" :options="endOptions"></DatePicker>
        </div>
        <div class="time">
          <TimePicker type="time" placeholder="请选择结束时间" style="width: 130px" v-model="time.end"></TimePicker>
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
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
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
          if (this.date.start !== null) {
            return data && data.valueOf() < this.date.start.valueOf()
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
      setFlowShow: false,
      pageNum: '',
      pageShow: false,
      originData: [],
      date: {
        start: '',
        end: ''
      }
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
      if (this.levelMess['查看全部']) {
        data.push({
          title: '真实流量 (单位：mb/s)',
          key: 'flow',
          width: 180
        })
      }
      if (this.levelMess['查看全部']) {
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
      return data
    }
  },
  mounted () {
    this.$post('webapi/user', {key: 'level'})
      .then(res => {
        this.levelMess = res.user_level['实时牵引管理']
      })
    this.getData()
  },
  methods: {
    getData () {
      let obj = util.dateProces(this.date.start, this.date.end, this.time.start, this.time.end, this.ip)
      if (this.ip !== '') {
        obj.ip = this.ip
      }
      let chart = JSON.stringify(obj)
      this.$post('/webapi/log', {key: 'towlog', content: chart})
        .then(res => {
          this.tracData = []
          this.originData = []
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
              this.originData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageShow = true
            this.pageNum = res.length
            this.tracData = this.originData.slice(0, 10)
          } else if (res.length <= 10) {
            this.pageShow = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ipQuery () {
      if (this.ip === '' && this.date.start === '' && this.date.end === '') {
        alert('请输入查询!')
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
    },
    pageChange (num) {
      this.tracData = this.originData.slice((num - 1) * 10, num * 10)
    }
  }
}
</script>

<style scoped>
  @import "common/query.css";
  .trac-container{
    padding: 14px 16px;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
