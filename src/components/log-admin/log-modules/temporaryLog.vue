<template>
  <div class="tem-container">
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
      <i-table :columns="columnsData" :data="temData"></i-table>
    </div>
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
    </div>
  </div>
</template>

<script>
import util from '../../../util/index'
export default {
  name: 'temporaryLog',
  data () {
    return {
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
          title: '生效时间',
          key: 'start_time'
        },
        {
          title: '结束时间',
          key: 'end_time'
        },
        {
          title: '设置防护时间 (单位：mb/s)',
          key: 'idc_ip_bps',
          width: 200
        }
      ],
      endOptions: {
        disabledDate: (data) => {
          if (this.time.start !== null) {
            return data && data.valueOf() < this.time.start.valueOf() + 86400000
          }
        }
      },
      temData: [],
      time: {
        start: '',
        end: ''
      },
      ip: '',
      pageNum: '',
      pageShow: false,
      originData: []
    }
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
      this.$post('http://113.105.246.233:9100/webapi/log', {key: 'temfwiplog', content: chart})
        .then(res => {
          this.temData = []
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              this.temData.push(item)
              this.originData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageShow = true
            this.pageNum = res.length
            this.temData = this.originData.slice(0, 10)
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
    pageChange (num) {
      this.temData = this.originData.slice((num - 1) * 10, num * 10)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  @import 'common/query.css';
  .tem-container{
    padding: 14px 16px;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
