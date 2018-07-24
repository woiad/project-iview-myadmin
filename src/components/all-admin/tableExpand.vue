<template>
  <div class="expand-container">
    <div class="admin-list">
      <div class="dropdown">
        <div class="dropwdown-item" ref="dropdownItem">
          <div class="item defend">
            <span>全墙防护总流量：{{data.idc_config.idc_flow_total }} (mb/s)</span>
          </div>
          <div class="item ip-flow">
            <span>默认IP流量：{{data.idc_config.idc_overtop_flow }} (mb/s)</span>
          </div>
          <div class="item ip-time">
            <span>默认IP牵引时间：{{data.idc_config.idc_tow_default_time }} (分钟)</span>
          </div>
          <div class="item pull-time">
            <div class="pull">
              <p>自动延长牵引时间策略</p>
              <div class="pull-item">
                <span>生效时间：{{data.idc_config.idc_set_tow_time }} (分钟) </span>
                <span>超出次数1：{{data.idc_config.idc_one_tow_cum}} (次)</span>
                <span>封停时间1: {{data.idc_config.idc_one_tow_time}} (分钟)</span>
                <span>超出次数2：{{data.idc_config.idc_two_tow_cum}} (次)</span>
                <span>封停时间2: {{data.idc_config.idc_two_tow_time}} (分钟)</span>
              </div>
            </div>
          </div>
          <div class="item white-list">
            <p>客户端白名单ip:</p>
            <p v-for="(val, index) in data.idc_towopenip" :key="index">
              <span>{{index}}</span>
              <span>备注：{{val}}</span>
            </p>
          </div>
          <div class="item ip-derss">
            <span>客户端ip地址：{{data.idc_towip}}</span>
          </div>
          <div class="item firewall-num">
            <span>防火墙台数：{{data.idc_config.idc_fw_num}} (台)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tableExpand',
  props: {
    data: {
      type: Object
    }
  },
  created () {
    console.log(this.data)
  }
}
</script>

<style scoped>
  .admin-list .dropwdown-item .item{
    padding: 15px 0px 5px 5px;
    font-size: 12px;
    color: #495060;
    border-bottom: 1px solid #E4E7ED;
  }
  .admin-list .dropwdown-item .item:last-child{
    padding-bottom: 10px;
    border: none;
  }
  .admin-list .dropwdown-item .pull-time.item{
    border: none;
    padding: 15px 0 0 0;
  }
  .pull{
    width: 100%;
    border: 1px solid #DCDFE6;
    padding: 10px;
  }
  .pull p{
    text-align: center;
  }
  .pull-item{
    display: flex;
    flex-wrap: wrap;
  }
  .pull-item span{
    display: inline-block;
    width: 20%;
    margin-top: 10px;
  }
  .white-list p:first-child{
    margin-top: 0;
  }
  .white-list p{
    margin-top: 10px;
  }
</style>
<style>
  .table td.ivu-table-expanded-cell{
    padding: 20px 20px;
  }
</style>
