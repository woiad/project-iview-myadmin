<template>
  <div class="login-log-container">
    <div class="query">
      <div class="query-time">
        <h1>时间查询</h1>
        <div class="start-time time">
          <DatePicker type="date" @on-change="startTime" placeholder="请选择开始时间" style="width: 200px" v-model="time.start"></DatePicker>
        </div>
        <div class="end-time time">
          <DatePicker type="date" placeholder="请选择结束时间" style="width: 200px" v-model="time.end" :options="endOptions"></DatePicker>
        </div>
        <div class="but">
          <Button type="primary" @click="timeQuery">查询</Button>
        </div>
      </div>
      <div class="query-ip">
        <h1>输入ip查询</h1>
        <i-input style="width: 200px" placeholder="请输入ip" v-model="ip"></i-input>
        <div class="but">
          <Button type="primary" @click="ipQuery">查询</Button>
        </div>
      </div>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="loginData"></i-table>
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
        disabledDate (data) {
          if (this.time.start !== null) {
            return data && this.time.start.getDate().valueOf() > data.getData().valueOf()
          }
        }
      },
      ip: '',
      loginData: []
    }
  },
  methods: {
    getData () {
      let obj = {}
      if (this.time.start !== '' && this.time.end !== '') {
        obj.time_start = util.timeTransform(this.time.start)
        obj.time_end = util.timeTransform(this.time.end)
      }
      if (this.ip !== '') {
        obj.ip = this.ip
      }
      let chart = JSON.stringify(obj)
      this.$post('http://113.105.246.233:9100/webapi/log', {key: 'loginlog', content: chart})
        .then(res => {
          this.loginData = []
          if (JSON.stringify(res) === '{}') {
            this.loginData = []
          } else {
            res.forEach((item, index) => {
              this.loginData.push(item)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    timeQuery () {
      if (this.time.start === '') {
        alert('请选择开始时间！')
        return true
      }
      if (this.time.end === '') {
        alert('请选择结束时间！')
        return true
      }
      console.log(util.timeTransform(this.time.start))
      console.log(util.timeTransform(this.time.end))
      this.getData()
    },
    ipQuery () {
      if (this.ip === '') {
        alert('请输入ip地址!')
        return true
      }
      if (!util.regIp(this.ip)) {
        alert('输入ip格式不正确！')
        return true
      }
      this.getData()
    },
    startTime () {
      console.log(this.time.start)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  .login-log-container{
    padding: 14px 16px;
  }
  .login-log-container .query{
    margin-bottom: 15px;
    width: 100%;
  }
  .login-log-container .query .but{
    display: inline-block;
    margin-left: 8px;
  }
  .login-log-container .query h1{
    font-size: 16px;
    margin-bottom: 8px;
  }
  .login-log-container .query-time{
    display: inline-block;
  }
  .login-log-container .query .time {
    display: inline-block;
  }
  .login-log-container .query .end-time{
    margin-left: 15px;
  }
  .login-log-container .query-ip{
    display: inline-block;
    margin-left: 30px;
  }
</style>
