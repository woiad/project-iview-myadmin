<template>
  <div class="ipDefend-container">
    <div class="build">
      <Button type="primary" icon="ios-plus-empty" @click="bulidIp">IP新建</Button>
    </div>
    <div class="query">
      <div class="query-idcName">
        <Select v-model="idcName" style="width:200px" placeholder="请选择机房">
          <Option v-for="(item, index) in idcList" :value="item.idc_name" :key="index">{{ item.idc_name }}</Option>
        </Select>
      </div>
      <div class="query-ip">
        <i-input style="width: 200px" placeholder="请输入IP" v-model="ip"></i-input>
        <div class="but">
          <Button type="primary" @click="ipQuery">查询</Button>
        </div>
      </div>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="ipDefendData" :loading="loading"></i-table>
    </div>
    <div class="modal">
      <Modal v-model="buildShow" title="新建IP" @on-cancel="buildCancel">
        <div class="text">
          <div class="item">
            <label>IP地址</label>
            <i-input v-model="buildData.ip" placeholder="请输入IP地址"></i-input>
          </div>
          <div class="item">
            <label>IP防护值 (单位： mb/s)</label>
            <i-input v-model="buildData.idcIpBps" placeholder="请输入IP防护值"></i-input>
          </div>
          <div class="item">
            <label>IP牵引时间 (单位： 分钟)</label>
            <i-input v-model="buildData.time" placeholder="请输入IP牵引时间"></i-input>
          </div>
        </div>
        <div slot="footer">
          <Button @click="buildCancel">重置</Button>
          <Button primary="default" @click="submitData">提交</Button>
        </div>
      </Modal>
      <Modal v-model="midifiShow" title="修改IP" @on-cancel="modifierCancel">
        <div class="text">
          <div class="item">
            <label>IP防护值 (单位： mb/s)</label>
            <input v-model="modifierData.idcIpBps" :placeholder="originData.idc_ip_bps" class="inp">
          </div>
          <div class="item">
            <label>牵引时间 (单位： 分钟)</label>
            <input v-model="modifierData.time" :placeholder="originData.idc_ip_tow_time" class="inp">
          </div>
        </div>
        <div slot="footer">
          <Button @click="modifierCancel">重置</Button>
          <Button type="primary" @click="submitModifierData">提交</Button>
        </div>
      </Modal>
      <Modal v-model="delConfirm" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align: center">
          <p>该ip一经删除，无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDel">删除</Button>
        </div>
      </Modal>
    </div>
    <div class="page">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow" :current="currentPage"></Page>
    </div>
  </div>
</template>

<script>
import util from '../../.././util/index'
export default {
  name: 'ipDefend',
  data () {
    return {
      columnsData: [
        {
          title: '机房名称',
          key: 'idc_ip_name'
        },
        {
          title: 'IP地址',
          key: 'idc_ip'
        },
        {
          title: '防护值 （单位：mb/s）',
          key: 'idc_ip_bps',
          width: 170
        },
        {
          title: '数据ID',
          key: 'id'
        },
        {
          title: '牵引时间 (单位：分钟)',
          key: 'idc_ip_tow_time',
          width: 170
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modifierShow(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delShow(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      loading: true,
      ipDefendData: [],
      idcName: '',
      ip: '',
      idcList: [],
      buildShow: false,
      buildData: {
        ip: '',
        idcIpBps: '',
        time: ''
      },
      midifiShow: false,
      modifierData: {
        time: '',
        idcIpBps: ''
      },
      originData: {},
      delConfirm: false,
      delData: {},
      pageNum: '',
      pageShow: false,
      allData: [],
      currentPage: 1,
      page: 0
    }
  },
  methods: {
    getIdcData () {
      this.$post('/webapi/public', {key: 'idc_root'})
        .then(res => {
          if (JSON.stringify(res) !== '{}') {
            res.forEach((item, index) => {
              this.idcList.push(item)
            })
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    getShowData (chart, type) { // type 用来判断操作时删除还是修改
      this.loading = true
      this.$post('/webapi/ipfwset', {key: 'ipshow', content: chart})
        .then(res => {
          this.ipDefendData = []
          this.allData = []
          if (JSON.stringify(res) !== '{}') {
            console.log(res.length)
            res.forEach((item, index) => {
              this.ipDefendData.push(item)
              this.allData.push(item)
            })
          }
          if (res.length > 10) {
            this.pageNum = res.length
            this.pageShow = true
            if (this.currentPage === this.page) { // 当删除数据时，页面停留在当前页，且删除当前页数据
              if (res.length % 10 === 0 && !type) { // 判断当前页面数据清空时，直接显示前一页数据
                this.page -= 1
                this.currentPage -= 1
                this.ipDefendData = this.allData.slice((this.page - 1) * 10, this.page * 10)
              } else {
                this.ipDefendData = this.allData.slice((this.page - 1) * 10, this.page * 10)
              }
            } else {
              this.ipDefendData = this.allData.slice(0, 10)
            }
          } else if (res.length <= 10) {
            this.pageShow = false
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    ipQuery (type) {
      let obj = {}
      if (this.idcName === '' && this.ip === '') {
        alert('请输入机房名称或IP地址')
        return true
      }
      if (!util.regIp(this.ip) && this.ip !== '') {
        alert('输入IP格式不正确')
        return true
      }
      if (this.idcName !== '') {
        for (let i = 0; i < this.idcList.length; i++) {
          if (this.idcName === this.idcList[i].idc_name) {
            obj.idc_id_root = this.idcList[i].id
          }
        }
      } else {
        obj.idc_id_root = 1
      }
      if (this.ip !== '') {
        obj.ip = this.ip
      } else {
        obj.ip = ''
      }
      let chart = JSON.stringify(obj)
      this.getShowData(chart, type)
    },
    bulidIp () {
      this.buildShow = true
    },
    buildCancel () {
      this.buildData.idcName = ''
      this.buildData.ip = ''
      this.buildData.idcIpBps = ''
      this.buildData.time = ''
    },
    submitData () {
      let obj = {}
      if (this.buildData.ip === '' || this.buildData.idcIpBps === '' || this.buildData.time === '') {
        alert('请填写完整资料！')
        return true
      }
      if (!util.regIp(this.buildData.ip) && this.buildData.ip !== '') {
        alert('IP格式不正确！')
        return true
      }
      obj.ip = this.buildData.ip
      obj.time = this.buildData.time
      obj.idc_ip_bps = this.buildData.idcIpBps
      let chart = JSON.stringify(obj)
      this.$post('/webapi/ipfwset', {key: 'ipadd', content: chart})
        .then(res => {
          if (res[1] === 403) {
            alert(res[2])
          } else if (res[1] === 200) {
            this.$Message.info('提交成功！')
            this.buildCancel()
            this.buildShow = false
            this.showAddIp(obj.ip)
            if (this.idcName !== '') {
              this.ipQuery()
            }
          }
        })
        .catch(err => {
          this.$Message.info('提交失败' + err)
        })
    },
    showAddIp (ip) { // 无数据时，添加ip，ip显示在table里
      let obj = {}
      obj.ip = ip
      obj.idc_id_root = ''
      this.$post('/webapi/ipfwset', {key: 'ipshow', content: JSON.stringify(obj)})
        .then(res => {
          if (JSON.stringify(res) !== {}) {
            this.ipDefendData.unshift(res[0])
          }
        })
        .catch(err => {
          this.$Message.error(err)
          console.log(err)
        })
    },
    modifierShow (params) {
      this.originData = {}
      this.ipDefendData.forEach((item, index) => {
        if (index === params.index) {
          this.originData = item
        }
      })
      this.midifiShow = true
    },
    modifierCancel () {
      this.modifierData.time = ''
      this.modifierData.idcIpBps = ''
    },
    submitModifierData () {
      let obj = {}
      if (this.modifierData.time === '' && this.modifierData.idcIpBps === '') {
        alert('请修改后再提交！')
        return true
      }
      if (this.modifierData.time !== '') {
        obj.time = this.modifierData.time
      } else {
        obj.time = this.originData.idc_ip_tow_time
      }
      if (this.modifierData.idcIpBps !== '') {
        obj.idc_ip_bps = this.modifierData.idcIpBps
      } else {
        obj.idc_ip_bps = this.originData.idc_ip_bps
      }
      obj.ip = this.originData.idc_ip
      obj.id = this.originData.id
      let chart = JSON.stringify(obj)
      this.$post('/webapi/ipfwset', {key: 'ipupdate', content: chart})
        .then(res => {
          this.$Message.info('修改成功')
          this.modifierCancel()
          this.currentPage = this.page
          this.midifiShow = false
          this.ipQuery('modify')
        })
        .catch(err => {
          this.$Message.info('修改失败' + err)
        })
    },
    delShow (params) {
      this.delConfirm = true
      this.delData = params.row
    },
    confirmDel () {
      let id = this.delData.id
      this.$post('/webapi/ipfwset', {key: 'ipdel', id: id})
        .then(res => {
          this.$Message.info('删除成功！')
          this.delConfirm = false
          this.currentPage = this.page
          this.ipQuery()
        })
        .catch(err => {
          this.$Message.info('删除失败' + err)
        })
    },
    pageChange (num) {
      this.page = num
      this.ipDefendData = this.allData.slice((num - 1) * 10, num * 10)
    }
  },
  mounted () {
    this.getIdcData()
  }
}
</script>

<style scoped>
  .ipDefend-container{
    width: 100%;
    padding: 14px 16px;
  }
  .ipDefend-container .query{
    display: inline-block;
  }
  .ipDefend-container .query-idcName, .ipDefend-container .query-ip{
    display: inline-block;
  }
  .ipDefend-container .query-idcName{
    margin-right: 8px;
  }
  .but{
    display: inline-block;
    margin-left: 8px;
  }
  .ipDefend-container .build{
    display: inline-block;
    margin-right: 50px;
  }
  .ipDefend-container .table{
    margin-top: 15px;
  }
  .text .item{
    margin-bottom: 10px;
  }
  .text .item:last-child{
    margin-bottom: 0;
  }
  .text .item label{
    display: inline-block;
    margin-bottom: 8px;
  }
  .text .item .inp{
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    cursor: text;
    transition: border-color .2s ;
  }
  .text .item .inp:focus{
    border-color: #57a3f3;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45,140,240,.2)
  }
  .text .item .inp:hover{
    border-color: #57a3f3;
  }
  .text .item .inp::placeholder{
    color: #999999;
  }
  .page{
    margin-top: 25px;
    text-align: center;
  }
</style>
