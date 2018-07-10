<template>
  <div class="admin-container">
    <div class="admin-add">
      <Button type="primary" icon="ios-plus-empty" @click="addRoom">添加机房</Button>
    </div>
    <div class="admin-list">
      <ul>
          <li v-for="(item, index) in adminData" :key="index" class="item-list">
            <div class="dropdown">
              <div class="dropdown-header">
                <a href="javascript:void(0)" class="name" @click="dropdownShow(index)">
                  <span>{{item.idc_name}}</span>
                  <span>{{item.idc_Remarks}}</span>
                  <Icon type="arrow-down-b" class="name-icon"></Icon>
                </a>
                <Button type="primary" size="small" class="modifier-btn" @click="modifier(index)">修改</Button>
                <Button type="error" size="small" @click="delteMacRoom(index)">删除</Button>
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
    <div class="modal">
      <Modal v-model="macRoomAdd" @on-cancel="cancelAddRoom">
        <p slot="header" class="title">机房新增</p>
        <div class="mac-config">
          <div class="mac-name mac">
            <label>机房名字:</label>
            <input  v-model="macConfig.macName">
          </div>
          <div class="mac flow-total">
            <label>全墙防护总流量:</label>
            <input v-model="macConfig.macFlowTotal">
            <span>mb/s</span>
          </div>
          <div class="mac over-flow">
            <label>默认ip流量:</label>
            <input v-model="macConfig.macOverTopFlow">
            <span>mb/s</span>
          </div>
          <div class="mac default-time">
            <label>默认IP牵引时间:</label>
            <input v-model="macConfig.macDefaultTime">
            <span>分钟</span>
          </div>
          <div class="traction mac">
            <h1>自动延长牵引时间策略</h1>
            <div class="tow-time tow">
              <label>生效时间:</label>
              <input v-model="macConfig.macTowTime">
              <span>分钟</span>
            </div>
            <div class="tow-cum tow">
              <label>超出次数1:</label>
              <input v-model="macConfig.macOneTowCum">
              <span>次</span>
            </div>
            <div class="tow-time tow">
              <label>封停时间1:</label>
              <input v-model="macConfig.macOneTowTime">
              <span>分钟</span>
            </div>
            <div class="two-tow-cum tow">
              <label>超出次数2:</label>
              <input v-model="macConfig.macTwoTowCum">
              <span>次</span>
            </div>
            <div class="tow-time tow">
              <label>封停时间2:</label>
              <input v-model="macConfig.macTwoTowTime">
              <span>分钟</span>
            </div>
            <div class="mac fire-wall">
              <label>防火墙台数:</label>
              <input v-model="macConfig.macFwNum">
              <span>台</span>
            </div>
          </div>
          <div class="open-ip mac">
            <Button type="primary" icon="ios-plus-empty" @click="addWhiteIp">添加客户端白名单ip</Button>
            <div class="whilte-list-ip">
              <ul>
                <li v-for="(listIp, index) in whilteListIp" :key="index">
                  <p>{{listIp.ipName}} <i>备注：{{listIp.ipRemarks}}</i></p>
                  <span class="del" @click="delAddIp(index)"><Icon type="ios-trash-outline"></Icon>删除</span>
                  <span class="modifier" @click="midifierAddip(index)"><Icon type="ios-compose-outline"></Icon>修改</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="mac tow-ip">
            <label>客户端ip：</label>
            <input v-model="macConfig.macTowIp">
          </div>
          <div class="mac remarks">
            <label>机房备注：</label>
            <input v-model="macConfig.macRemarks">
          </div>
        </div>
        <div slot="footer">
          <Button @click="cancelAddRoom">重置</Button>
          <Button type="primary" @click="subMacConfig">提交</Button>
        </div>
      </Modal>
      <Modal v-model="macRoomModifier" @on-cancel="cancelAddRoomModifier">
        <p slot="header" class="title">机房信息修改</p>
        <div class="mac-config">
          <div class="mac-name mac">
            <label>机房名字:</label>
            <input  v-model="macConfig.macName" :placeholder="modifierData.idc_name">
          </div>
          <div class="mac flow-total">
            <label>全墙防护总流量:</label>
            <input v-model="macConfig.macFlowTotal" :placeholder="modifierData.idc_config.idc_flow_total">
            <span>mb/s</span>
          </div>
          <div class="mac over-flow">
            <label>默认ip流量:</label>
            <input v-model="macConfig.macOverTopFlow" :placeholder="modifierData.idc_config.idc_overtop_flow">
            <span>mb/s</span>
          </div>
          <div class="mac default-time">
            <label>默认IP牵引时间:</label>
            <input v-model="macConfig.macDefaultTime" :placeholder="modifierData.idc_config.idc_tow_default_time">
            <span>分钟</span>
          </div>
          <div class="traction mac">
            <h1>自动延长牵引时间策略</h1>
            <div class="tow-time tow">
              <label>生效时间:</label>
              <input v-model="macConfig.macTowTime" :placeholder="modifierData.idc_config.idc_set_tow_time">
              <span>分钟</span>
            </div>
            <div class="tow-cum tow">
              <label>超出次数1:</label>
              <input v-model="macConfig.macOneTowCum" :placeholder="modifierData.idc_config.idc_one_tow_cum">
              <span>次</span>
            </div>
            <div class="tow-time tow">
              <label>封停时间1:</label>
              <input v-model="macConfig.macOneTowTime" :placeholder="modifierData.idc_config.idc_one_tow_time">
              <span>分钟</span>
            </div>
            <div class="two-tow-cum tow">
              <label>超出次数2:</label>
              <input v-model="macConfig.macTwoTowCum" :placeholder="modifierData.idc_config.idc_two_tow_cum">
              <span>次</span>
            </div>
            <div class="tow-time tow">
              <label>封停时间2:</label>
              <input v-model="macConfig.macTwoTowTime" :placeholder="modifierData.idc_config.idc_two_tow_time">
              <span>分钟</span>
            </div>
            <div class="mac fire-wall">
              <label>防火墙台数:</label>
              <input v-model="macConfig.macFwNum" :placeholder="modifierData.idc_config.idc_fw_num">
              <span>台</span>
            </div>
          </div>
          <div class="open-ip mac">
            <p>添加客户端白名单ip</p>
            <div class="whilte-list-ip">
              <ul>
                <li v-for="(val, key, index) in modifierData.idc_towopenip" :key="index">
                  <p><i ref="ipName">{{key}}</i> &nbsp;&nbsp;&nbsp;备注：<i ref="ipRemarks">{{val}}</i></p>
                  <span class="del" @click="delAddIp(index)"><Icon type="ios-trash-outline"></Icon>删除</span>
                  <span class="modifier" @click="midifierAddip(index)"><Icon type="ios-compose-outline"></Icon>修改</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="mac tow-ip">
            <label>客户端ip：</label>
            <input v-model="macConfig.macTowIp" :placeholder="modifierData.idc_towip">
          </div>
          <div class="mac remarks">
            <label>机房备注：</label>
            <input v-model="macConfig.macRemarks" :placeholder="modifierData.idc_Remarks">
          </div>
        </div>
        <div slot="footer">
          <Button @click="cancelAddRoom">重置</Button>
          <Button type="primary" @click="subMacModifier">提交</Button>
        </div>
      </Modal>
      <Modal v-model="addIpShow" :title="addTitle">
        <div>
          <div class="ip">
            <label style="display: inline-block; margin-bottom: 10px;">白名单ip:</label>
            <i-input v-model="addIp.ipName" :placeholder="placeholder.ipName"></i-input>
          </div>
          <div class="remarks" style="margin-top: 15px">
            <label style="display: inline-block; margin-bottom: 10px;">白名单ip备注:</label>
            <i-input v-model="addIp.ipRemarks" :placeholder="placeholder.ipRemarks"></i-input>
          </div>
        </div>
        <div slot="footer">
          <Button @click="addIpCancel">重置</Button>
          <Button type="primary" @click="addIpSub">提交</Button>
        </div>
      </Modal>
      <Modal v-model="addIdDelShow" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align: center">
          <p>该白名单ip一经删除，无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDel">删除</Button>
        </div>
      </Modal>
      <Modal v-model="macRoomDelShow" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align: center">
          <p>该机房一经删除，无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDelMac">删除</Button>
        </div>
      </Modal>
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
      num: false,
      macRoomAdd: false,
      macConfig: {
        macName: '',
        macFlowTotal: '',
        macOverTopFlow: '',
        macDefaultTime: '',
        macTowTime: '',
        macOneTowCum: '',
        macOneTowTime: '',
        macTwoTowCum: '',
        macTwoTowTime: '',
        macFwNum: '',
        macTowIp: '',
        macRemarks: ''
      },
      whilteListIndex: '',
      modifierIndex: '',
      addIpShow: false,
      addTitle: '',
      whilteListIp: [],
      placeholder: {
        ipName: '请输入白名单ip',
        ipRemarks: '请输入白名单备注'
      },
      addIp: {
        ipName: '',
        ipRemarks: ''
      },
      addIdDelShow: false,
      macRoomModifier: false,
      distinction: '',
      modifierData: {
        idc_config: {}
      },
      delIndex: '',
      macRoomDelShow: false
    }
  },
  methods: {
    dropdownShow (index) {
      if (this.$refs.dropdownItem[index].style.display !== 'block') {
        this.$refs.dropdownItem[index].style.display = 'block'
      } else {
        this.$refs.dropdownItem[index].style.display = 'none'
      }
    },
    addRoom () {
      this.macRoomAdd = true
    },
    addWhiteIp () {
      this.addIpShow = true
      this.addTitle = '增加白名单ip'
      this.placeholder.ipName = '请输入白名单ip'
      this.placeholder.ipRemarks = '请输入白名单备注'
    },
    addIpCancel () {
      this.addIp.ipName = ''
      this.addIp.ipRemarks = ''
    },
    addIpSub () {
      let ipObj = {}
      if (this.addTitle === '增加白名单ip') {
        if (this.addIp.ipName !== '' && this.addIp.ipRemarks !== '') {
          ipObj.ipName = this.addIp.ipName
          ipObj.ipRemarks = this.addIp.ipRemarks
          this.whilteListIp.push(ipObj)
          this.addIpCancel()
          this.addIpShow = false
          this.$Message.info('添加成功')
        } else {
          window.alert('请填写完整的白名单ip信息!')
        }
      } else if (this.addTitle === '修改白名单ip') {
        if (this.addIp.ipName !== '' && this.addIp.ipRemarks !== '') {
          for (let i = 0; i < this.whilteListIp.length; i++) {
            if (i === this.whilteListIndex) {
              this.whilteListIp[i].ipName = this.addIp.ipName
              this.whilteListIp[i].ipRemarks = this.addIp.ipRemarks
            }
          }
          this.addIpCancel()
          this.addIpShow = false
          this.$Message.info('修改成功')
        } else {
          window.alert('请填写完整的白名单ip信息!')
        }
      }
      if (this.distinction === '修改') {
        if (this.addIp.ipName !== '') {
          this.$refs.ipName[this.modifierIndex].innerHTML = this.addIp.ipName
        }
        if (this.addIp.ipRemarks !== '') {
          this.$refs.ipRemarks[this.modifierIndex].innerHTML = this.addIp.ipRemarks
        }
        this.addIpShow = false
        this.addIpCancel()
      }
    },
    midifierAddip (index) {
      this.addIpShow = true
      this.addTitle = '白名单ip修改'
      if (this.distinction === '修改') {
        this.modifierIndex = index
        let arr = this.objTransformArr(this.modifierData.idc_towopenip)
        this.placeholder.ipName = arr[index].ipName
        this.placeholder.ipRemarks = arr[index].ipRemarks
      } else {
        this.whilteListIndex = index
        for (let i = 0; i < this.whilteListIp.length; i++) {
          if (i === this.whilteListIndex) {
            this.placeholder.ipName = this.whilteListIp[i].ipName
            this.placeholder.ipRemarks = this.whilteListIp[i].ipRemarks
          }
        }
      }
    },
    delAddIp (index) {
      this.whilteListIndex = index
      this.addIdDelShow = true
    },
    confirmDel () {
      if (this.distinction === '修改') {
        let arr = []
        for (let i in this.modifierData.idc_towopenip) {
          let obj = {}
          obj.ipName = i
          obj.ipRemarks = this.modifierData.idc_towopenip[i]
          arr.push(obj)
        }
        this.$delete(this.modifierData.idc_towopenip, arr[this.whilteListIndex].ipName, arr[this.whilteListIndex].ipRemarks)
        this.addIdDelShow = false
        this.$Message.info('删除成功')
      } else {
        this.whilteListIp.splice(this.whilteListIndex, 1)
        this.addIdDelShow = false
        this.$Message.info('删除成功')
      }
    },
    subMacConfig () {
      if (this.macConfig.macName === '' || this.macConfig.macFlowTotal === '' || this.macConfig.macOverTopFlow === '' ||
        this.macConfig.macDefaultTime === '' || this.macConfig.macTowTime === '' || this.macConfig.macOneTowCum === '' ||
        this.macConfig.macOneTowTime === '' || this.macConfig.macTwoTowCum === '' || this.macConfig.macTwoTowTime === '' ||
        this.macConfig.macFwNum === '' || this.macConfig.macRemarks === '' || this.macConfig.macTowIp === '' || this.whilteListIp.length === 0) {
        window.alert('请填写完成机房信息！')
        return true
      }
      let subObj = {}
      let ip = {}
      let remarks = {}
      subObj.idc_name = this.macConfig.macName
      subObj.idc_config = {}
      subObj.idc_config.idc_flow_total = this.macConfig.macFlowTotal
      subObj.idc_config.idc_overtop_flow = this.macConfig.macOverTopFlow
      subObj.idc_config.idc_set_tow_time = this.macConfig.macTowTime
      subObj.idc_config.idc_one_tow_cum = this.macConfig.macOneTowCum
      subObj.idc_config.idc_one_tow_time = this.macConfig.macOneTowTime
      subObj.idc_config.idc_two_tow_cum = this.macConfig.macTwoTowCum
      subObj.idc_config.idc_two_tow_time = this.macConfig.macTwoTowTime
      subObj.idc_config.idc_tow_default_time = this.macConfig.macDefaultTime
      subObj.idc_config.idc_fw_num = this.macConfig.macFwNum
      subObj.idc_Remarks = this.macConfig.macRemarks
      subObj.idc_towopenip = {}
      subObj.idc_towip = this.macConfig.macTowIp
      for (let i = 0; i < this.whilteListIp.length; i++) {
        ip[i] = this.whilteListIp[i].ipName
        remarks[i] = this.whilteListIp[i].ipRemarks
        subObj.idc_towopenip[ip[i]] = remarks[i]
      }
      let chart = JSON.stringify(subObj)
      this.$post('http://113.105.246.233:9100/webapi/global', {key: 'add', content: chart})
        .then(res => {
          this.$Message.info('机房添加成功')
          this.getData()
          this.macRoomAdd = false
          console.log(res)
        })
        .catch(err => {
          this.$Message.info('机房添加失败' + err)
          console.log(err)
        })
      console.log(subObj)
    },
    cancelAddRoom () {
      this.macConfig.macName = ''
      this.macConfig.macFlowTotal = ''
      this.macConfig.macOverTopFlow = ''
      this.macConfig.macDefaultTime = ''
      this.macConfig.macTowTime = ''
      this.macConfig.macOneTowCum = ''
      this.macConfig.macOneTowTime = ''
      this.macConfig.macTwoTowCum = ''
      this.macConfig.macTwoTowTime = ''
      this.macConfig.macFwNum = ''
      this.macConfig.macRemarks = ''
      this.macConfig.macTowIp = ''
      this.whilteListIp = []
    },
    cancelAddRoomModifier () {
      this.cancelAddRoom()
    },
    modifier (index) {
      this.macRoomModifier = true
      this.modifierData = this.adminData[index]
      this.distinction = '修改'
    },
    subMacModifier () {
      let changeDataChart = JSON.stringify(this.modifierData)
      let changeObj = this.change(JSON.parse(changeDataChart))
      let id = changeObj.id
      let changeChart = JSON.stringify(changeObj)
      this.$post('http://113.105.246.233:9100/webapi/global', {key: 'update', content: changeChart, id: id})
        .then(res => {
          this.$Message.info('修改成功')
          this.macRoomModifier = false
          this.cancelAddRoom()
          this.getData()
        })
        .catch(err => {
          this.$Message.info('修改失败' + err)
        })
    },
    change (data) {
      let arr = this.objTransformArr(data.idc_towopenip)
      let changeArr = this.dowopenipChange(arr)
      data.idc_towopenip = this.arrTransformObj(changeArr)
      data.idc_name = this.compare(this.macConfig.macName) || data.idc_name
      data.idc_config.idc_flow_total = this.compare(this.macConfig.macFlowTotal) || data.idc_config.idc_flow_total
      data.idc_config.idc_overtop_flow = this.compare(this.macConfig.macOverTopFlow) || data.idc_config.idc_overtop_flow
      data.idc_config.idc_tow_default_time = this.compare(this.macConfig.macDefaultTime) || data.idc_config.idc_tow_default_time
      data.idc_config.idc_set_tow_time = this.compare(this.macConfig.macTowTime) || data.idc_config.idc_set_tow_time
      data.idc_config.idc_one_tow_cum = this.compare(this.macConfig.macOneTowCum) || data.idc_config.idc_one_tow_cum
      data.idc_config.idc_one_tow_time = this.compare(this.macConfig.macOneTowTime) || data.idc_config.idc_one_tow_time
      data.idc_config.idc_two_tow_cum = this.compare(this.macConfig.macTwoTowCum) || data.idc_config.idc_two_tow_cum
      data.idc_config.idc_fw_num = this.compare(this.macConfig.macFwNum) || data.idc_config.idc_fw_num
      data.idc_towip = this.compare(this.macConfig.macTowIp) || data.idc_towip
      data.idc_Remarks = this.compare(this.macConfig.macRemarks) || data.idc_Remarks
      return data
    },
    delteMacRoom (index) {
      this.delIndex = index
      this.macRoomDelShow = true
    },
    confirmDelMac () {
      let id = this.adminData[this.delIndex].id
      this.$post('http://113.105.246.233:9100/webapi/global', {key: 'del', id: id})
        .then(res => {
          this.$Message.info('删除成功')
          this.macRoomDelShow = false
          this.getData()
        })
        .catch(err => {
          this.$Message.info('删除失败' + err)
        })
    },
    arrTransformObj (arr) {
      let ip = {}
      let obj = {}
      let remarks = {}
      for (let i = 0; i < arr.length; i++) {
        ip[i] = arr[i].ipName
        remarks[i] = arr[i].ipRemarks
        obj[ip[i]] = remarks[i]
      }
      return obj
    },
    objTransformArr (data) {
      let arr = []
      for (let i in data) {
        let obj = {}
        obj.ipName = i
        obj.ipRemarks = data[i]
        arr.push(obj)
      }
      return arr
    },
    dowopenipChange (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].ipName !== this.$refs.ipName[i].innerText) {
          arr[i].ipName = this.$refs.ipName[i].innerText
        }
        if (arr[i].ipRemarks !== this.$refs.ipRemarks[i].innerText) {
          arr[i].ipRemarks = this.$refs.ipRemarks[i].innerText
        }
      }
      return arr
    },
    compare (itemVal) {
      if (itemVal !== '') {
        return itemVal
      }
    },
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/global', {key: 'show'})
        .then(res => {
          this.adminData = []
          for (let i = 0; i < res.length; i++) {
            console.log(res)
            this.adminData.push(res[i])
            this.adminData[i].idc_config = util.evil(res[i].idc_config)
            this.adminData[i].idc_towopenip = util.evil(res[i].idc_towopenip)
          }
          console.log(this.adminData)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getData()
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
  .title{
    width: 100%;
    height: 20px;font-size: 18px;
    line-height: 20px;
    font-weight: 700;
    color: #1c2438
  }
  .mac-config label, .mac-config span{
    font-size: 16px;
  }
  .mac-config input{
    margin-left: 10px;
    font-size: 16px;
    color: #657180;
    padding: 4px 8px 4px 8px;
    border: none;
    border-bottom: 1px solid #e9eaec;
    outline: none;
  }
  .mac-config .mac, .mac-config .tow{
    margin-bottom: 15px;
  }
  .mac-config .traction{
    border: 1px solid #dddee1;
    padding: 10px;
  }
  .mac-config .traction h1{
    margin-bottom: 15px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }
  .mac-config .open-ip P{
    font-size: 16px;
  }
  .mac-config .whilte-list-ip{
    margin-top: 15px;
  }
  .mac-config .whilte-list-ip li{
    margin-bottom: 15px;
    height: 32px;
    list-style: none;
    font-size: 16px;
    line-height: 32px;
  }
  .mac-config .whilte-list-ip li p{
    display: inline-block;
  }
  .mac-config .whilte-list-ip li p i{
    font-style: normal;
  }
  .mac-config .whilte-list-ip li span{
    color: #03a9f4;
    float: right;
    cursor: pointer;
    transition: color .2s linear;
    margin-left: 20px;
  }
  .mac-config .whilte-list-ip li span:hover{
    color: #1e88e5;
  }
</style>
