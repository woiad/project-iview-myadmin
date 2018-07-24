<template>
  <div class="manual-container">
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
      <i-table :columns="columnsData" :data="manualData"></i-table>
    </div>
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
    </div>
  </div>
</template>

<script>
import util from '../../.././util/index'
export default {
  name: 'manualLog',
  data () {
    return {
      endOptions: {
        disabledDate: (data) => {
          if (this.date.start !== null) {
            return data && data.valueOf() < this.date.start.valueOf()
          }
        }
      },
      columnsData: [
        {
          title: '机房名称',
          key: 'idc_root_name'
        },
        {
          title: 'ip地址',
          key: 'ip'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '操作人',
          key: 'opername'
        },
        {
          title: '操作类型',
          key: 'type'
        }
      ],
      manualData: [],
      time: {
        start: '',
        end: ''
      },
      ip: '',
      pageNum: '',
      pageShow: false,
      originData: [],
      date: {
        start: '',
        end: ''
      }
    }
  },
  methods: {
    getData () {
      let obj = util.dateProces(this.date.start, this.date.end, this.time.start, this.time.end, this.ip)
      if (this.ip !== '') {
        obj.ip = this.ip
      }
      let chart = JSON.stringify(obj)
      this.$post('http://113.105.246.233:9100/webapi/log', {key: 'manualtow', content: chart})
        .then(res => {
          this.manualData = []
          this.originData = []
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              this.manualData.push(item)
              this.originData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageShow = true
            this.pageNum = res.length
            this.manualData = this.originData.slice(0, 10)
          } else if (res.length < 10) {
            this.pageShow = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ipQuery () {
      if (this.ip === '' && this.date.start === '' && this.date.end === '') {
        alert('请输入查询日期!')
        return true
      }
      if (!util.regIp(this.ip) && this.ip !== '') {
        alert('输入ip格式不正确！')
        return true
      }
      this.getData()
    },
    pageChange (num) {
      this.manualData = this.originData.slice((num - 1) * 10, num * 10)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  @import 'common/query.css';
  .manual-container{
    padding: 14px 16px;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
