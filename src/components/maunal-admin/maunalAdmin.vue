<template>
  <div class="maunal-container">
    <div class="manual-build">
      <Button type="primary" icon="ios-plus-empty" @click="buildClick" :disabled="!levelMess['新建']">新建封停ip</Button>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="idcData"></i-table>
    </div>
    <div class="modal">
      <div class="modal">
        <Modal v-model="buildIpShow" title="新建封停ip" class="build-ip" @on-cancel="buildIpCancel">
          <div class="content">
            <div class="item" style="margin-bottom: 10px">
              <label>ip地址</label>
              <i-input placeholder="请输入ip地址" v-model="buildData.ip"></i-input>
            </div>
            <div class="item">
              <label>备注</label>
              <i-input placeholder="请输入备注" v-model="buildData.remarks"></i-input>
            </div>
            <div class="item" style="margin-top: 20px">
              <Select v-model="choseIdc"  placeholder="请选择机房">
                <Option v-for="(item, index) in idcData" :value="item.idc_name" :key="index">{{ item.idc_name }}</Option>
              </Select>
            </div>
          </div>
          <div slot="footer">
            <Button @click="buildIpCancel">重置</Button>
            <Button type="primary" @click="subBuildIp">提交</Button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import maunalExpand from './maunalExpand'
import util from '../.././util/index'
export default {
  name: 'maunalAdmin',
  data () {
    return {
      columnsData: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(maunalExpand, {
              props: {
                row: params.row,
                level: this.levelMess,
                originData: this.addData
              },
              ref: 'chil'
            })
          }
        },
        {
          title: '机房名称',
          key: 'idc_name'
        }
      ],
      idcData: [],
      idc_name: '',
      buildIpShow: false,
      buildData: {
        ip: '',
        remarks: ''
      },
      buildInd: '',
      levelMess: {},
      choseIdc: '',
      addData: []
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
      this.$post('/webapi/manualtow', {key: 'show'})
        .then(res => {
          this.addData = []
          if (JSON.stringify(res) !== '{}' && res !== undefined) {
            res.forEach((item, index) => {
              this.addData.push(item)
            })
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
    subBuildIp () {
      if (this.buildData.ip === '' || this.buildData.remarks === '' || this.choseIdc === '') {
        alert('请填写完整资料！')
        return true
      }
      if (!util.regIp(this.buildData.ip)) {
        alert('ip格式不正确！')
        return true
      }
      let id = ''
      for (let i = 0; i < this.idcData.length; i++) {
        if (this.idcData[i].idc_name === this.choseIdc) {
          id = this.idcData[i].id
        }
      }
      this.$post('/webapi/manualtow', {key: 'add', ip: this.buildData.ip, idc_root_id: id, remarks: this.buildData.remarks})
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
    }
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
  }
}
</script>

<style scoped>
  .maunal-container{
    width: 100%;
    padding: 14px 16px;
  }
  .maunal-container .manual-build{
    margin-bottom: 10px;
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
    margin-bottom: 150px;
  }
</style>
