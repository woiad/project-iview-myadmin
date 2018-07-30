<template>
  <div class="option-container">
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
        <!--<i-input style="width: 200px" placeholder="请输入ip" v-model="ip"></i-input>-->
        <div class="but">
          <Button type="primary" @click="ipQuery">查询</Button>
        </div>
      </div>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="optionData"></i-table>
    </div>
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
    </div>
  </div>
</template>

<script>
import util from '../../.././util/index'
export default {
  name: 'optionLog',
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
          title: '用户名',
          key: 'oper_name'
        },
        {
          title: '操作类型',
          key: 'oper_type'
        },
        {
          title: '操作时间',
          key: 'oper_time'
        },
        {
          title: '账号',
          key: 'oper_accounts'
        },
        {
          title: '操作内容',
          key: 'oper_content',
          width: 200
        }
      ],
      optionData: [],
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
      let chart = JSON.stringify(obj)
      this.$post('/webapi/log', {key: 'operlog', content: chart})
        .then(res => {
          this.optionData = []
          this.originData = []
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              this.optionData.push(item)
              this.originData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageNum = res.length
            this.pageShow = true
            this.optionData = this.originData.slice(0, 10)
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
      this.optionData = this.originData.slice((num - 1) * 10, num * 10)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
  @import 'common/query.css';
  .option-container{
    padding: 14px 16px;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
