<template>
  <div class="login-log-container">
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
        <i-input style="width: 150px" placeholder="请输入ip" v-model="ip"></i-input>
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
      date: {
        start: '',
        end: ''
      },
      endOptions: {
        disabledDate: (data) => {
          if (this.date.start !== null) {
            return data && data.valueOf() < this.date.start.valueOf()
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
      let obj = util.dateProces(this.date.start, this.date.end, this.time.start, this.time.end, this.ip)
      if (this.ip !== '') {
        obj.ip = this.ip
      }
      let chart = JSON.stringify(obj)
      this.$post('/webapi/log', {key: 'loginlog', content: chart})
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
          } else if (res.length <= 10) {
            this.pageShow = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ipQuery () {
      if (this.date.start === '' || this.date.end === '') {
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
