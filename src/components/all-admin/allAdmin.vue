<template>
  <div class="admin-container">
    <div class="admin-add">
      <Button type="primary" icon="ios-plus-empty" @click="addRoom" :disabled="!levelMess['新建']">添加机房</Button>
    </div>
    <div class="table">
      <i-table :columns="columns3" :data="adminData"></i-table>
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
                  <p><i ref="AddipName">{{listIp.ipName}}</i> &nbsp;&nbsp;备注：<i ref="AddipRemarks">{{listIp.ipRemarks}}</i></p>
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
          <div class="mac idc-tow-show">
            <label>实时牵引: &nbsp;{{macConfig.idcTowShow}}</label>
            <Select v-model="macConfig.idcTowShow" style="width: 200px;" placeholder="请选择实时牵引是否显示" placement="bottom" :transfer="true">
              <Option value="显示">显示</Option>
              <Option value="不显示">不显示</Option>
            </Select>
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
            <Button type="primary" icon="ios-plus-empty" @click="addWhiteIp" style="margin-bottom: 15px">添加客户端白名单ip</Button>
            <p>客户端白名单ip</p>
            <div class="whilte-list-ip">
              <ul>
                <li v-for="(val, key, index) in modifierData.idc_towopenip" :key="index" v-if="ipShow">
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
          <div class="mac idc-tow-show">
            <label>实时牵引：&nbsp;{{showText()}}</label>
            <Select v-model="macConfig.idcTowShow" style="width:200px;" :placeholder="modifierData.idc_tow_show === '0' ? '显示' : '不显示'">
              <Option value="显示">显示</Option>
              <Option value="不显示">不显示</Option>
            </Select>
          </div>
        </div>
        <div slot="footer">
          <Button @click="cancelAddRoom">重置</Button>
          <Button type="primary" @click="subMacModifier">提交</Button>
        </div>
      </Modal>
      <Modal v-model="addIpShow" :title="addTitle" @on-cancel="addIpCancel">
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
import tableExpand from './tableExpand'
export default {
  name: 'allAdmin',
  data () {
    return {
      columns3: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(tableExpand, {
              props: {
                data: params.row
              }
            })
          }
        },
        {
          title: '机房名字',
          key: 'idc_name'
        },
        {
          title: '机房备注',
          key: 'idc_Remarks'
        },
        {
          title: '机房id',
          key: 'id'
        },
        {
          title: '操作',
          key: 'option',
          width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: !this.levelMess['修改']
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modifier(params.index)
                  }
                }
              }, '修改机房'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.levelMess['删除']
                },
                on: {
                  click: () => {
                    this.delteMacRoom(params.index)
                  }
                }
              }, '删除机房')
            ])
          }
        }
      ],
      adminData: [], // 全局查看数据
      macRoomAdd: false, // 机房添加 modal 弹出
      macConfig: { // modla 填写的机房配置的信息
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
        macRemarks: '',
        idcTowShow: ''
      },
      whilteListIndex: '', // 添加的白名单ip的索引值
      modifierIndex: '', // 修改白名单ip的索引值
      addIpShow: false, // 添加白名单ip的 modal 弹出 ，该对话框可以添加白名单ip
      addTitle: '', // modal title
      whilteListIp: [], // 所有的白名单ip
      placeholder: { // 在新建机房时添加白名单ip的 modal 弹窗的输入框的placeholder
        ipName: '请输入白名单ip',
        ipRemarks: '请输入白名单备注'
      },
      addIp: { // 在新建机房时添加白名单ip的 modal 弹窗的输入框的内容，即增加的白名单ip
        ipName: '',
        ipRemarks: ''
      },
      addIdDelShow: false, // 白名单ip处的删除modal
      macRoomModifier: false, // 删除机房的 modal
      distinction: '',
      modifierData: { // 修改机房里的信息
        idc_config: {}
      },
      delIndex: '', // 删除机房的index
      modifierIdcInd: '',
      macRoomDelShow: false, // 删除机房的 modal
      modifierDataOriArr: [], // 添加的所有白名单ip，为了辨别，用户在修改时是否删除了白名单ip
      levelMess: {}, // 全局管理权限
      originTowIp: '', // 在修改机房按钮处添加客户端白名单ip时，保存原来的数组，后与新添加的数组进行比对
      ipShow: false, // 修改机房客户端白名单时，会影响到其他机房的数据，所以需要重新渲染一次
      text: ''
    }
  },
  methods: {
    addRoom () { // 添加机房的 modal 弹出
      this.macRoomAdd = true
    },
    addWhiteIp () { // 添加白名单ip的 modal 弹出
      this.addIpShow = true
      this.addTitle = '增加白名单ip'
      this.placeholder.ipName = '请输入白名单ip'
      this.placeholder.ipRemarks = '请输入白名单备注'
    },
    addIpCancel () { // 关闭白名单ip的modal时清空里面的数据
      this.addIp.ipName = ''
      this.addIp.ipRemarks = ''
    },
    addIpSub () { // 提交 白名单ip modal 里的数据
      let ipObj = {}
      if (this.addTitle === '增加白名单ip') { // 区别 modal 是添加白名单ip，还是修改白名单ip
        if (this.addIp.ipName !== '' && this.addIp.ipRemarks !== '') {
          if (!util.regIp(this.addIp.ipName)) {
            alert('ip格式不正确！')
            return true
          }
          ipObj.ipName = this.addIp.ipName
          ipObj.ipRemarks = this.addIp.ipRemarks
          this.whilteListIp.push(ipObj)
          if (this.distinction === '修改') {
            console.log(this.modifierIdcInd)
            this.adminData[this.modifierIdcInd].idc_towopenip[ipObj.ipName] = ipObj.ipRemarks
          }
          this.addIpCancel()
          this.addIpShow = false
          this.$Message.info('添加成功')
        } else {
          window.alert('请填写完整的白名单ip信息!')
        }
        return true
      } else if (this.addTitle === '白名单ip修改' && this.distinction !== '修改') { // 修改白名单ip
        if (this.addIp.ipName === '' && this.addIp.ipRemarks === '') {
          alert('请修改数据后再提交!')
          return true
        }
        if (!util.regIp(this.addIp.ipName) && this.addIp.ipName !== '') {
          alert('ip格式不正确！')
          return true
        }
        if (this.addIp.ipName !== '') {
          this.$refs.AddipName[this.modifierIndex].innerHTML = this.addIp.ipName
        }
        if (this.addIp.ipRemarks) {
          this.$refs.AddipRemarks[this.modifierIndex].innerHTML = this.addIp.ipRemarks
        }
        this.addIpCancel()
        this.addIpShow = false
        this.$Message.info('修改成功')
      }
      if (this.distinction === '修改') { // 此处修改是机房修改处的白名单修改
        if (this.addIp.ipName === '' && this.addIp.ipRemarks === '') {
          alert('请修改数据后再提交!')
          return true
        }
        if (!util.regIp(this.addIp.ipName) && this.addIp.ipName !== '') {
          alert('ip格式不正确！')
          return true
        }
        console.log(this.modifieredIp)
        if (this.addIp.ipName !== '') {
          this.$refs.ipName[this.modifierIndex].innerHTML = this.addIp.ipName
        }
        if (this.addIp.ipRemarks !== '') {
          this.$refs.ipRemarks[this.modifierIndex].innerHTML = this.addIp.ipRemarks
        }
        this.addIpCancel()
        this.addIpShow = false
      }
    },
    midifierAddip (index, key) { // 修改 添加客户端白名单ip 和 客户端白名单ip 的白名单ip
      console.log(this.$refs)
      this.addIpShow = true
      this.addTitle = '白名单ip修改'
      this.modifierIndex = index
      if (this.distinction === '修改') {
        this.placeholder.ipName = this.$refs.ipName[this.modifierIndex].innerHTML
        this.placeholder.ipRemarks = this.$refs.ipRemarks[this.modifierIndex].innerHTML
      } else {
        this.placeholder.ipName = this.$refs.AddipName[index].innerHTML
        this.placeholder.ipRemarks = this.$refs.AddipRemarks[index].innerHTML
      }
    },
    delAddIp (index) { // 添加客户端白名单Ip 和 客户端白名单ip 处的删除按钮
      this.whilteListIndex = index
      this.addIdDelShow = true
    },
    confirmDel () { // 确认删除白名单ip
      if (this.distinction === '修改') {
        let arr = []
        for (let i in this.modifierData.idc_towopenip) {
          let obj = {}
          obj.ipName = i
          obj.ipRemarks = this.modifierData.idc_towopenip[i]
          arr.push(obj)
        }
        this.modifierDataOriArr = arr
        this.$delete(this.modifierData.idc_towopenip, arr[this.whilteListIndex].ipName, arr[this.whilteListIndex].ipRemarks)
        this.addIdDelShow = false
        this.$Message.info('删除成功')
      } else {
        this.whilteListIp.splice(this.whilteListIndex, 1)
        this.addIdDelShow = false
        this.$Message.info('删除成功')
      }
    },
    subMacConfig () { // 提交新增机房的信息
      if (this.macConfig.macName === '' || this.macConfig.macFlowTotal === '' || this.macConfig.macOverTopFlow === '' ||
        this.macConfig.macDefaultTime === '' || this.macConfig.macTowTime === '' || this.macConfig.macOneTowCum === '' ||
        this.macConfig.macOneTowTime === '' || this.macConfig.macTwoTowCum === '' || this.macConfig.macTwoTowTime === '' ||
        this.macConfig.macFwNum === '' || this.macConfig.macRemarks === '' || this.macConfig.macTowIp === '' || this.macConfig.idcTowShow === '' || this.whilteListIp.length === 0) {
        window.alert('请填写完成机房信息！')
        return true
      }
      // if (!util.regIp(this.macConfig.macTowIp)) {
      //   alert('ip格式不正确！')
      //   return true
      // }
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
      subObj.idc_tow_show = this.macConfig.idcTowShow === '显示' ? '0' : '1'
      for (let i = 0; i < this.whilteListIp.length; i++) {
        ip[i] = this.whilteListIp[i].ipName
        remarks[i] = this.whilteListIp[i].ipRemarks
        subObj.idc_towopenip[ip[i]] = remarks[i]
      }
      let chart = JSON.stringify(subObj)
      this.$post('/webapi/global', {key: 'add', content: chart})
        .then(res => {
          this.$Message.info('机房添加成功')
          this.getData()
          this.cancelAddRoom()
          this.macRoomAdd = false
          console.log(res)
        })
        .catch(err => {
          this.$Message.info('机房添加失败' + err)
          console.log(err)
        })
    },
    cancelAddRoom () { // 关闭新增机房时，清空modal里的数据
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
      this.macConfig.idcTowShow = ''
      this.whilteListIp = []
    },
    cancelAddRoomModifier () { // 关闭新增机房
      this.cancelAddRoom()
      this.distinction = ''
      this.ipShow = false
    },
    showText () {
      if (this.macConfig.idcTowShow !== '' && this.macConfig.idcTowShow !== undefined) {
        return this.macConfig.idcTowShow
      } else {
        return this.modifierData.idc_tow_show === '0' ? '显示' : '不显示'
      }
    },
    modifier (index) { // 修改机房信息的modal 弹出
      this.modifierIdcInd = index
      this.macRoomModifier = true
      this.modifierData = this.adminData[index]
      this.originTowIp = JSON.stringify(this.adminData[index].idc_towopenip)
      this.distinction = '修改'
      this.ipShow = true
      let arr = []
      for (let i in this.modifierData.idc_towopenip) {
        let obj = {}
        obj.ipName = i
        obj.ipRemarks = this.modifierData.idc_towopenip[i]
        arr.push(obj)
      }
      this.modifierDataOriArr = arr
    },
    subMacModifier () { // 提交修改后的机房信息
      let changeDataChart = JSON.stringify(this.modifierData)
      let changeObj = this.change(JSON.parse(changeDataChart))
      let towipObj = JSON.parse(this.originTowIp)
      let flag = this.compareValChange(this.modifierData, changeObj, towipObj)
      console.log(flag)
      let id = changeObj.id
      changeObj.idc_tow_show = this.macConfig.idcTowShow === '显示' ? '0' : '1'
      let changeChart = JSON.stringify(changeObj)
      if (flag) {
        this.$post('/webapi/global', {key: 'update', content: changeChart, id: id})
          .then(res => {
            this.$Message.info('修改成功')
            this.macRoomModifier = false
            this.cancelAddRoom()
            this.ipShow = false
            this.distinction = ''
            this.getData()
          })
          .catch(err => {
            this.$Message.info('修改失败' + err)
          })
      } else {
        window.alert('数据请修改后在提交！！！')
      }
    },
    compareValChange (unchange, change, towip) { // 判断机房信息是否有修改。如果修改返回tru，否则返回false
      let unchangeTowOpenIpArr = this.objTransformArr(unchange.idc_towopenip)
      let changeTowOpenIpArr = this.objTransformArr(change.idc_towopenip)
      let towipArr = this.objTransformArr(towip)
      if (towipArr.length !== changeTowOpenIpArr.length) {
        return true
      }
      if (this.macConfig.idcTowShow !== unchange.idc_tow_show === '0' ? '显示' : '不显示' && this.macConfig.idcTowShow !== '' && this.macConfig.idcTowShow !== undefined) {
        return true
      }
      if (unchange.idc_name !== change.idc_name) {
        return true
      }
      if (unchange.idc_Remarks !== change.idc_Remarks) {
        return true
      }
      if (unchange.idc_towip !== change.idc_towip) {
        return true
      }
      if (this.modifierDataOriArr.length !== changeTowOpenIpArr.length) {
        return true
      }
      for (let i = 0; i < changeTowOpenIpArr.length; i++) {
        if (unchangeTowOpenIpArr[i].ipName !== changeTowOpenIpArr[i].ipName) {
          return true
        }
        if (unchangeTowOpenIpArr[i].ipRemarks !== changeTowOpenIpArr[i].ipRemarks) {
          return true
        }
      }
      for (let i in change.idc_config) {
        if (change.idc_config[i] !== unchange.idc_config[i]) {
          return true
        }
      }
      return false
    },
    change (data) { // 收集修改后的机房信息
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
    delteMacRoom (index) { // 删除机房的确认 modal 弹出
      this.delIndex = index
      this.macRoomDelShow = true
    },
    confirmDelMac () { // 确认删除机房
      let id = this.adminData[this.delIndex].id
      this.$post('/webapi/global', {key: 'del', id: id})
        .then(res => {
          this.$Message.info('删除成功')
          this.macRoomDelShow = false
          this.getData()
        })
        .catch(err => {
          this.$Message.info('删除失败' + err)
        })
    },
    arrTransformObj (arr) { // 主要用于把数组转换成对象
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
    objTransformArr (data) { // 把对象转换成数组
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
      for (let i = 0; i < arr.length; i++) { // 客户端白名单ip是否改变，如改变则覆盖之前的ip
        if (arr[i].ipName !== this.$refs.ipName[i].innerText) {
          arr[i].ipName = this.$refs.ipName[i].innerText
        }
        if (arr[i].ipRemarks !== this.$refs.ipRemarks[i].innerText) {
          arr[i].ipRemarks = this.$refs.ipRemarks[i].innerText
        }
      }
      return arr
    },
    compare (itemVal) { // 机房信息是否改变
      if (itemVal !== '') {
        return itemVal
      }
    },
    getData () { // 获取页面的初始显示数据
      this.$post('/webapi/global', {key: 'show'})
        .then(res => {
          this.adminData = []
          for (let i = 0; i < res.length; i++) {
            this.adminData.push(res[i])
            this.adminData[i].idc_config = util.evil(res[i].idc_config)
            this.adminData[i].idc_towopenip = util.evil(res[i].idc_towopenip)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    let levelObj = {}
    levelObj = this.$store.state.userLevel
    if (levelObj !== undefined) {
      for (let i in levelObj) {
        if (i === this.$route.name) {
          this.levelMess = levelObj[i]
        }
      }
    }
    this.getData()
  },
  computed: {
    a () {
      return this.$store.state.userLevel
    }
  },
  watch: {
    a: {
      handler: function (val) {
        for (let i in val) {
          if (i === this.$route.name) {
            this.levelMess = val[i]
          }
        }
      }
    }
  },
  components: {
    tableExpand
  }
}
</script>

<style scoped>
  .admin-container{
    width: 100%;
    padding: 14px 16px;
  }
  .admin-add{
    margin-bottom: 15px;
  }
  .table{
    margin-bottom: 150px;
  }
  .title{
    width: 100%;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    color: #1c2438
  }
  .mac-config label, .mac-config span{
    font-size: 12px;
  }
  .mac-config input{
    margin-left: 10px;
    font-size: 12px;
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
    border: 1px solid #DCDFE6;
    padding: 10px;
  }
  .mac-config .traction h1{
    margin-bottom: 15px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
  }
  .mac-config .open-ip P{
    font-size: 12px;
  }
  .mac-config .whilte-list-ip{
    margin-top: 10px;
  }
  .mac-config .whilte-list-ip li{
    margin-bottom: 10px;
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
  .mac-config .idc-tow-show{
    margin-bottom: 20px;
  }
</style>
