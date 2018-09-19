<template>
  <div class="maunal-container">
    <div class="manual-build">
      <Button type="primary" icon="ios-plus-empty" @click="buildClick" :disabled="!levelMess['新建']">新建封停ip</Button>
    </div>
    <div class="query">
      <div class="query-idc">
        <Select v-model="idcName" style="width:200px" placeholder="请选择机房名称" @on-change="choseIdcName">
          <Option v-for="(item,index) in idcData" :value="item.idc_name" :key="index">{{ item.idc_name }}</Option>
        </Select>
      </div>
      <div class="query-ip">
        <i-input v-model="queryIp" @on-focus="inpFocus" @on-blur="inpBlur" placeholder="请输入查询ip" style="width: 200px"></i-input>
      </div>
      <div class="query-btn">
        <Button type="primary" @click="Query">查询</Button>
      </div>
      <div class="history">
        <Button type="primary" @click="hisQuery">近一周记录</Button>
      </div>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="addData"></i-table>
    </div>
    <div class="page" style="text-align: center; margin-bottom: 150px">
      <Page :total="pageNum" show-elevator @on-change="pageChange" v-if="pageShow"></Page>
    </div>
    <div class="modal">
      <div class="modal">
        <Modal v-model="buildIpShow" title="新建封停ip" class="build-ip" @on-cancel="buildIpCancel">
          <div class="content">
            <div class="item" style="margin-bottom: 10px">
              <label>ip地址（可新建多个ip，请以换行分隔！）</label>
              <i-input placeholder="请输入ip地址" type="textarea" v-model="buildData.ip"></i-input>
            </div>
            <div class="item">
              <label>备注</label>
              <i-input placeholder="请输入备注" v-model="buildData.remarks"></i-input>
            </div>
          </div>
          <div slot="footer">
            <Button @click="buildIpCancel">重置</Button>
            <Button type="primary" @click="subBuildIp">提交</Button>
          </div>
        </Modal>
        <Modal v-model="confirmShow" width="360">
          <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
            <Icon type="information-circled"></Icon>
            <span>解封确认</span>
          </p>
          <div style="text-align: center">
            <p>确定解封该ip?</p>
          </div>
          <div slot="footer">
            <Button type="error" size="large" long @click="confirmDec">确定</Button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../.././util/index'
export default {
  name: 'maunalAdmin',
  data () {
    return {
      columnsData: [
        {
          title: '机房名称',
          key: 'ftow_root_name'
        },
        {
          title: 'ip地址',
          key: 'ftow_key'
        },
        {
          title: '备注',
          key: 'ftow_remarks'
        },
        {
          title: '操作时间',
          key: 'ftow_time'
        },
        {
          title: '操作人员',
          key: 'ftow_user'
        },
        {
          title: '操作',
          key: 'option',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: !this.levelMess['删除']
              },
              on: {
                click: () => {
                  this.confirmClick(params)
                }
              }
            }, '解封ip')
          }
        }
      ],
      idcData: [{'idc_name': '全部', 'id': ''}],
      idc_name: '',
      buildIpShow: false,
      buildData: {
        ip: '',
        remarks: ''
      },
      buildInd: '',
      levelMess: {},
      addData: [],
      queryIp: '',
      idcName: '',
      pageNum: '',
      pageShow: false,
      originData: '',
      confirmShow: false,
      confirmInd: '',
      inter: ''
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
    this.getIpData()
    this.inter = setInterval(() => {
      this.getIpData()
    }, 3000)
  },
  methods: {
    getData () {
      this.$post('/webapi/public', {key: 'idc_root'})
        .then(res => {
          if (JSON.stringify(res) !== '{}' && res !== undefined) {
            res.forEach((item, index) => {
              this.idcData.push(item)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getIpData () {
      let id = ''
      let obj = {}
      for (let i = 0; i < this.idcData.length; i++) {
        if (this.idcName === this.idcData[i].idc_name) {
          id = this.idcData[i].id
        }
      }
      obj.ip = this.queryIp
      obj.root_id = id
      let chart = JSON.stringify(obj)
      this.$post('/webapi/manualtow', {key: 'show', content: chart})
        .then(res => {
          this.addData = []
          this.originData = []
          if (JSON.stringify(res) !== '{}' && res !== undefined) {
            res.forEach((item, index) => {
              this.addData.push(item)
              this.originData.push(item)
            })
            if (res.length > 10) {
              this.pageNum = res.length
              console.log(typeof this.pageNum)
              this.pageShow = true
              this.addData = this.originData.slice(0, 10)
            } else if (res.length <= 10) {
              this.pageShow = false
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    buildClick () {
      this.buildIpShow = true
    },
    buildIpCancel () {
      this.buildData.ip = ''
      this.buildData.remarks = ''
      this.choseIdc = ''
    },
    confirmClick (params) {
      this.confirmShow = true
      this.confirmInd = params.index
    },
    confirmDec () {
      let data = this.addData
      let id = data[this.confirmInd].id
      this.$post('/webapi/manualtow', {key: 'del', id: id})
        .then(res => {
          this.$Message.info('解封成功')
          this.getIpData()
          this.confirmShow = false
        })
        .catch(err => {
          this.$Message.info('解封失败' + err)
        })
    },
    subBuildIp () {
      let ipArr = []
      if (this.buildData.ip === '' || this.buildData.remarks === '') {
        alert('请填写完整资料！')
        return true
      }
      let regx = /[^\d.\s]+/g
      if (regx.test(this.buildData.ip)) {
        alert('两个ip地址之间用换行符分隔，请勿输入其他符号')
        return true
      } else {
        ipArr = this.buildData.ip.split(/\s/g)
      }
      this.$post('/webapi/manualtow', {key: 'add', ip: ipArr.join(' '), remarks: this.buildData.remarks})
        .then(res => {
          if (res[1] === 403) {
            alert(res[2])
            return true
          }
          this.$Message.info('添加成功')
          this.buildIpShow = false
          this.buildIpCancel()
          this.getIpData()
        })
        .catch(err => {
          this.$Message.info('添加失败' + err)
        })
    },
    Query () {
      if (this.idcName === '' && this.queryIp === '') {
        alert('请输入机房名称或ip地址！')
        return true
      }
      if (!util.regIp(this.queryIp) && this.queryIp !== '') {
        alert('输入ip格式不正确！')
        return true
      }
      if (this.idcName === '全部' && this.queryIp === '') {
        alert('请输入查询IP！')
        return true
      }
      this.getIpData()
    },
    pageChange (num) {
      this.addData = this.originData.slice((num - 1) * 10, num * 10)
    },
    inpFocus () {
      clearInterval(this.inter)
    },
    inpBlur () {
      this.inter = setInterval(() => {
        this.getIpData()
      }, 3000)
    },
    choseIdcName (val) {
      if (val !== '全部') {
        this.getIpData()
      }
    },
    hisQuery () {
      let obj = {
        ip: '',
        root_id: ''
      }
      this.idcName = ''
      this.queryIp = ''
      let chart = JSON.stringify(obj)
      this.$post('/webapi/manualtow', {key: 'show', content: chart})
        .then(res => {
          this.addData = []
          this.originData = []
          if (JSON.stringify(res) !== '{}' && res !== undefined) {
            res.forEach((item, index) => {
              this.addData.push(item)
              this.originData.push(item)
            })
            if (res.length > 10) {
              this.pageNum = res.length
              this.pageShow = true
              this.addData = this.originData.slice(0, 10)
            } else if (res.length <= 10) {
              this.pageShow = false
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    a () {
      return this.$store.state.userLevel
    }
  },
  watch: {
    '$route' (to, from) {
      clearInterval(this.inter)
    },
    a: {
      handler: function (val) {
        for (let i in val) {
          if (i === this.$route.name) {
            this.levelMess = val[i]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .maunal-container{
    width: 100%;
    padding: 14px 16px;
  }
  .maunal-container .manual-build{
    display: inline-block;
    margin-bottom: 10px;
  }
  .query{
    display: inline-block;
    margin-left: 60px;
  }
  .query .query-ip, .query .query-idc, .query .query-btn{
    display: inline-block;
  }
  .query .query-ip{
    margin-right: 30px;
  }
  .query .query-idc{
    margin-right: 30px;
  }
  .query .history{
    display: inline-block;
    margin-left: 30px;
  }
  .build-ip label{
    display: inline-block;
    padding-bottom: 8px;
  }
  .build-ip .item h1{
    margin: 10px 0 8px 0;
    font-size: 12px;
    font-weight: normal;
  }
  .table{
    margin-bottom: 20px;
  }
</style>
