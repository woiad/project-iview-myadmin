<template>
  <div class="maunal-container">
    <div class="table">
      <i-table :columns="columnsData" :data="idcData" @on-expand="expand"></i-table>
    </div>
    <div class="modal">
      <div class="modal">
        <Modal v-model="buildIpShow" title="修改牵引时间" class="build-ip" @on-cancel="buildIpCancel">
          <div class="content">
            <div class="item" style="margin-bottom: 10px">
              <label>ip地址</label>
              <i-input placeholder="请输入ip地址" v-model="buildData.ip"></i-input>
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
                name: this.idc_name,
                level: this.levelMess
              }
            })
          }
        },
        {
          title: '机房名称',
          key: 'idc_name'
        },
        {
          title: '操作',
          key: 'option',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: this.levelMess['新建'] !== 'true'
              },
              on: {
                click: () => {
                  this.buildClick(params)
                }
              }
            }, '新建')
          }
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
      levelMess: {}
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
  methods: {
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/public', {key: 'idc_root'})
        .then(res => {
          console.log(res)
          res.forEach((item, index) => {
            this.idcData.push(item)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    expand (data, status) {
      this.idc_name = data.idc_name
    },
    buildClick (params) {
      this.buildIpShow = true
      this.buildInd = params.index
    },
    buildIpCancel () {
      this.buildData.ip = ''
      this.buildData.remarks = ''
    },
    subBuildIp () {
      if (this.buildData.ip === '' || this.buildData.remarks === '') {
        alert('请填写完整资料！')
        return true
      }
      if (!util.regIp(this.buildData.ip)) {
        alert('ip格式不正确！')
        return true
      }
      let id = this.idcData[this.buildInd].id
      this.$post('http://113.105.246.233:9100/webapi/manualtow', {key: 'add', ip: this.buildData.ip, idc_root_id: id, remarks: this.buildData.remarks})
        .then(res => {
          this.$Message.info('添加成功')
          this.buildIpShow = false
          this.buildIpCancel()
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
  .build-ip label{
    display: inline-block;
    padding-bottom: 8px;
  }
</style>
