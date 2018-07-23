<template>
  <div class="login-log-container">
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
      <i-table :columns="columnsData" :data="loginData"></i-table>
    </div>
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
    </div>
  </div>
</template>

<script>
import util from '../../.././util/index'
export default {
  name: 'loginLog',
  data () {
    return {
      columnsData: [
        {
          title: '登陆账号',
          key: 'login_accounts'
        },
        {
          title: '登陆用户名',
          key: 'login_name'
        },
        {
          title: '登陆ip',
          key: 'login_ip'
        },
        {
          title: '登陆时间',
          key: 'login_time'
        }
      ],
      time: {
        start: '',
        end: ''
      },
      endOptions: {
        disabledDate: (data) => {
          if (this.time.start !== null) {
            return data && data.valueOf() < this.time.start.valueOf() + 86400000
          }
        }
      },
      ip: '',
      loginData: [],
      originData: [],
      pageNum: '',
      pageShow: false
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
      this.$post('http://113.105.246.233:9100/webapi/log', {key: 'loginlog', content: chart})
        .then(res => {
          this.loginData = []
          this.originData = []
          if (JSON.stringify(res) === '{}') {
            this.loginData = []
          } else {
            res.forEach((item, index) => {
              this.loginData.push(item)
              this.originData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageNum = res.length
            this.pageShow = true
            this.loginData = this.originData.slice(0, 10)
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
      this.loginData = this.originData.slice((num - 1) * 10, num * 10)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  @import 'common/query.css';
  .login-log-container{
    padding: 14px 16px;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
