<template>
  <div class="admin-container">
    <div class="admin-add">
      <Button type="primary" icon="ios-plus-empty" trigger="click">添加机房</Button>
    </div>
    <div class="admin-list">
      <ul>
          <li v-for="(item, index) in adminData" :key="index" class="item-list">
            <div class="dropdown">
              <div class="dropdown-header">
                <a href="javascript:void(0)" class="name" @click="dropdownShow(index)">
                  <span>{{item.idc_name}}</span>
                  <span>{{item.idc_Reamrks}}</span>
                  <Icon type="arrow-down-b" class="name-icon"></Icon>
                </a>
                <Button type="primary" size="small" class="modifier-btn">修改</Button>
                <Button type="error" size="small">删除</Button>
              </div>
              <div slot="list" class="dropwdown-item" ref="dropdownItem">
                  <div class="item defend">
                    <span>全墙防护总流量：{{item.idc_config.idc_flow_total }} (mb/s)</span>
                  </div>
                  <div class="item ip-flow">
                    <span>默认IP流量：{{item.idc_config.idc_overtop_flow }} (mb/s)</span>
                  </div>
                  <div class="item ip-time">
                    <span>默认IP牵引时间：{{item.idc_config.idc_tow_default_time }} (分)</span>
                  </div>
                  <div class="item pull-time">
                    <div class="pull">
                      <p>自动延长牵引时间策略</p>
                      <div class="pull-item">
                        <span>生效时间：{{item.idc_config.idc_set_tow_time }} (分) </span>
                        <span>超出次数1：{{item.idc_config.idc_one_tow_cum}} (次)</span>
                        <span>封停时间1: {{item.idc_config.idc_one_tow_time}} (分)</span>
                        <span>超出次数2：{{item.idc_config.idc_two_tow_cum}} (次)</span>
                        <span>封停时间2: {{item.idc_config.idc_two_tow_time}} (分)</span>
                      </div>
                    </div>
                  </div>
                  <div class="item white-list">
                    <p>客户端白名单ip:</p>
                    <p v-for="(val, index) in item.idc_towopenip" :key="index">
                      <span>{{index}}</span>
                      <span>备注：{{val}}</span>
                    </p>
                  </div>
                  <div class="item ip-derss">
                    <span>客户端ip地址：{{item.idc_towip}}</span>
                  </div>
                  <div class="item firewall-num">
                    <span>防火墙台数：{{item.idc_fw_num}}</span>
                  </div>
                </div>
            </div>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import util from '../.././util/index'
export default {
  name: 'allAdmin',
  data () {
    return {
      adminData: [],
      num: false
    }
  },
  methods: {
    dropdownShow (index) {
      if (this.$refs.dropdownItem[index].style.display !== 'block') {
        this.$refs.dropdownItem[index].style.display = 'block'
      } else {
        this.$refs.dropdownItem[index].style.display = 'none'
      }
    }
  },
  mounted () {
    this.$post('http://113.105.246.233:9100/webapi/global', {key: 'show'})
      .then(res => {
        for (let i = 0; i < res.length; i++) {
          this.adminData.push(res[i])
          this.adminData[i].idc_config = util.evil(res[i].idc_config)
          this.adminData[i].idc_towopenip = util.evil(res[1].idc_towopenip)
        }
        console.log(this.adminData)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
  @-webkit-keyframes dropdown{
    from{
      top: 0px;
    }
    to{
      top: 100px;
    }
  }
  .admin-container{
    width: 100%;
    padding: 14px 16px;
  }
  .admin-add{
    margin-bottom: 15px;
  }
  .admin-list ul .item-list{
    width: 300px;
    margin-bottom: 15px;
    list-style: none;
    background: #fff;
    border: 1px solid #a9c9e2;
  }
  .admin-list ul li:last-child{
    margin-bottom: 150px;
  }
  .admin-list ul li .name{
    display: inline-block;
    padding: 15px 15px;
    font-size: 16px;
  }
  .admin-list ul li .dropwdown-item{
    display: none;
    padding: 10px;
    text-align: left;
    border-top: 1px solid #a9c9e2;
    animation: dropdowm .5s linear;
    transition: all 5.3s linear;
    transform: translate3d(0, 0, 0);
  }
  .admin-list ul li .dropwdown-item .item{
    margin-bottom: 10px;
  }
  .pull{
    width: 270px;
    border: 1px solid rgba(0, 0, 0, .4);
    padding: 10px;
  }
  .pull-item{
    display: flex;
    flex-wrap: wrap;
  }
  .pull-item span{
    display: inline-block;
    width: 50%;
    margin-top: 10px;
  }
  .white-list p:first-child{
    margin-top: 0;
  }
  .white-list p{
    margin-top: 10px;
  }
  .modifier-btn{
    margin-right: 15px;
  }
</style>
