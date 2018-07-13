<template>
  <div class="table-expand">
    <div v-if="dataNullShow" class="data-null">
      <p>机房暂无数据，请稍后重试</p>
    </div>
    <div v-if="dataShow" v-for="(item, index) in this.row.data" :key="index" class="data-show">
      <Row class="expand-row">
        <Col span="8">
          <span class="expand-key">ip:</span>
          <span class="expand-value">{{item.tow_value.ip}}</span>
        </Col>
        <Col span="8">
          <span class="expand-key">攻击流量:</span>
          <span class="expand-value">{{item.tow_value.ran_flow}} (mb/s)</span>
        </Col>
        <Col span="8">
          <span class="expand-key">解封时间:</span>
          <span class="expand-value">{{item.tow_value.tow_time_r}}</span>
        </Col>
        <Col span="8">
          <span class="expand-key">操作人:</span>
          <span class="expand-value">{{item.tow_value.user}}</span>
        </Col>
        <Col span="8">
          <span class="expand-key">类型:</span>
          <span class="expand-value">{{item.tow_value.type}}</span>
        </Col>
        <Col span="8">
          <Button type="primary" :disabled="!checkAll" @click="show(index)">查看更多权限</Button>
        </Col>
        <div class="more-data" ref="moreAccess">
          <Col span="8">
            <span class="expand-key">设置防护值:</span>
            <span class="expand-value">{{item.tow_value.set_flow}} (mb/s)</span>
          </Col>
          <Col span="8">
            <span class="expand-key">牵引时间:</span>
            <span class="expand-value">{{item.tow_value.tow_time_start}}</span>
          </Col>
          <Col span="8">
            <span class="expand-key">真实流量:</span>
            <span class="expand-value">{{item.tow_value.flow}} (mb/s)</span>
          </Col>
        </div>
      </Row>
    </div>
    <div v-if="!dataStatus" class="not-access">
      <p>
        {{row.data}}
      </p>
    </div>
  </div>
</template>

<script>
import util from '../.././util/index'
export default {
  name: 'tableExpand',
  props: {
    row: {
      type: Object
    },
    level: {
      type: Object
    }
  },
  data () {
    return {
      dataNullShow: false,
      dataShow: false,
      dataStatus: false,
      checkAll: '',
      moreDataShow: false,
      ind: ''
    }
  },
  created () {
    alert(1)
    console.log(this.row)
    if (this.row.status === true) {
      this.dataStatus = true
    } else {
      this.dataStatus = false
    }
    if (this.row.data.length === undefined) {
      this.dataNullShow = true
    }
    if (this.row.status === true && this.row.data.length !== undefined) {
      this.dataShow = true
    }
    if (typeof this.row.data === 'object') {
      for (let i = 0; i < this.row.data.length; i++) {
        if (typeof this.row.data[i].tow_value === 'string') {
          this.row.data[i].tow_value = util.evil(this.row.data[i].tow_value)
        }
      }
    }
    if (this.level['查看全部'] === 'true') {
      this.checkAll = true
    }
  },
  methods: {
    show (index) {
      this.$refs.moreAccess[index].style.display = 'block'
      this.ind = index
    }
  }
}
</script>

<style scoped>
  .table-expand{
    width: 100%;
  }
  .table-expand .data-show{
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #DCDFE6;
  }
  .ivu-col-span-8{
    padding-bottom: 10px;
  }
  .more-data {
    display: none;
  }
</style>
