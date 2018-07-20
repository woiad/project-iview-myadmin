<template>
  <div class="mis-container">
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
          if (this.time.start !== null) {
            return data && data.valueOf() < this.time.start.valueOf() + 86400000
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
      mistakeData: []
    }
  },
  mounted () {
    this.$post('http://113.105.246.233:9100/webapi/public', {key: 'idc_root'})
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
      let obj = {}
      if (this.time.start !== '' && this.time.end !== '') {
        obj.time_start = util.timeTransform(this.time.start)
        obj.time_endt = util.timeTransform(this.time.end)
      }
      if (this.time.start === '' && this.time.end === '' && this.ip !== '') {
        obj.time_start = util.timeTransform(new Date())
        obj.time_endt = util.addDat(obj.time_start, 1)
      }
      if (this.idcName !== '') {
        obj.idc_root_name = this.idcName
      }
      let chart = JSON.stringify(obj)
      this.$post('http://113.105.246.233:9100/webapi/log', {key: 'warning', content: chart})
        .then(res => {
          this.mistakeData = []
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              this.mistakeData.push(item)
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
      this.getData()
    }
  }
}
</script>

<style scoped>
  @import 'common/query.css';
  .mis-container{
    padding: 14px 16px;
  }
</style>
