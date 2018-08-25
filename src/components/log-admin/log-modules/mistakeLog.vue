<template>
  <div class="mis-container">
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
        <Select v-model="idcName" style="width:200px" placeholder="请选择机房名称">
          <Option v-for="(item,index) in idcData" :value="item.idc_name" :key="index">{{ item.idc_name }}</Option>
        </Select>
        <div class="but">
          <Button type="primary" @click="ipQuery">查询</Button>
        </div>
      </div>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="mistakeData"></i-table>
    </div>
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
    </div>
  </div>
</template>

<script>
import util from '../../.././util/index'
export default {
  name: 'mistakeLog',
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
          key: 'abnormall_idcname'
        },
        {
          title: '警告类型',
          key: 'abnormal_type'
        },
        {
          title: '发生时间',
          key: 'abnormal_time'
        },
        {
          title: '警告内容',
          key: 'abnormal_content'
        },
        {
          title: '事件等级',
          key: 'abnormal_event'
        }
      ],
      time: {
        start: '',
        end: ''
      },
      idcName: '',
      idcData: [],
      mistakeData: [],
      pageNum: '',
      pageShow: false,
      originData: [],
      date: {
        start: '',
        end: ''
      }
    }
  },
  mounted () {
    this.$post('/webapi/public', {key: 'idc_root'})
      .then(res => {
        if (JSON.stringify[res] !== '{}' && res !== undefined) {
          res.forEach((item, index) => {
            this.idcData.push(item)
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    getData () {
      let obj = util.dateProces(this.date.start, this.date.end, this.time.start, this.time.end, this.ip)
      if (this.idcName !== '') {
        obj.idc_root_name = this.idcName
      }
      let chart = JSON.stringify(obj)
      this.$post('/webapi/log', {key: 'warning', content: chart})
        .then(res => {
          this.mistakeData = []
          this.originData = []
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              this.mistakeData.push(item)
              this.originData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageNum = res.length
            this.pageShow = true
            this.mistakeData = this.originData.slice(0, 10)
          } else if (res.length <= 10) {
            this.pageShow = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ipQuery () {
      if (this.idcName === '' && this.date.start === '' && this.date.end === '') {
        alert('请输入查询日期!')
        return true
      }
      this.getData()
    },
    pageChange (num) {
      this.mistakeData = this.originData.slice((num - 1) * 10, num * 10)
    }
  }
}
</script>

<style scoped>
  @import 'common/query.css';
  .mis-container{
    padding: 14px 16px;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
