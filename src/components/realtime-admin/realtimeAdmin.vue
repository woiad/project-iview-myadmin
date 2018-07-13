<template>
  <div class="user-container">
    <div class="table">
      <i-table :columns="columns3" :data="originData" @on-expand="expand"></i-table>
    </div>
    <div class="modal">
      <Modal v-model="modifierTracTime" title="修改牵引时间" class="modifierTime" @on-cancel="modifierCancel">
        <div class="content">
          <div class="item">
            <label>请输入需要修改牵引时间的ip</label>
            <i-input placeholder="请输入ip" v-model="inpData.ip"></i-input>
          </div>
          <div class="item">
            <label>牵引时间&nbsp;&nbsp;(单位分钟)</label>
            <i-input placeholder="请输入牵引时间" v-model="inpData.time"></i-input>
          </div>
        </div>
        <div slot="footer">
          <Button @click="modifierCancel">重置</Button>
          <Button type="primary" @click="subTracTime">提交</Button>
        </div>
      </Modal>
      <Modal v-model="reliveShow" title="手动解封ip" @on-cancel="cancelReleve">
        <div class="container">
          <div class="item">
            <label style="display: inline-block;margin-bottom: 10px;">需要解封的ip</label>
            <i-input v-model="reliveIp" placeholder="请输入要解封的ip"></i-input>
          </div>
        </div>
        <div slot="footer">
          <Button @click="cancelReleve">重置</Button>
          <Button type="primary" @click="subRelive">提交</Button>
        </div>
      </Modal>
    </div>
    <div ref="spin">
      <Spin fix>
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>
  </div>
</template>

<script>
import tableExpand from '.././table-expand/tableExpand'
import axios from 'axios'
export default {
  name: 'realtimeAdmin',
  data () {
    return {
      columns3: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(tableExpand, {
              props: {
                row: params.row,
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
          width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: !this.originData[params.index].status
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showModifierTime(params)
                  }
                }
              }, '修改牵引时间'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: !this.originData[params.index].status
                },
                on: {
                  click: () => {
                    this.reliveIpBut(params)
                  }
                }
              }, '解封ip')
            ])
          }
        }
      ],
      levelMess: {},
      originData: [],
      modifierInd: '',
      modifierTracTime: false,
      inpData: {
        ip: '',
        time: ''
      },
      reliveShow: false,
      reliveIp: '',
      reliveInd: '',
      timing: '',
      expandName: []
    }
  },
  methods: {
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'show'})
        .then(res => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].status === 'true') {
              res[i].status = true
            } else {
              res[i].status = false
            }
            if (this.originData.length === res.length && this.originData[i].idc_name === res[i].idc_name) {
              for (let j = 0; j < this.expandName.length; j++) {
                if (res[i].idc_name === this.expandName[j]) {
                  res[i]._expanded = true
                }
              }
              this.originData.splice(i, 1, res[i])
            } else {
              this.originData.push(res[i])
              this.originData[i]._expanded = false
            }
          }
          this.$refs.spin.style.display = 'none'
        })
        .catch(err => {
          console.log(err)
        })
    },
    expand (row, status) {
      if (status) {
        this.expandName.push(row.idc_name)
      } else {
        for (let i = 0; i < this.expandName.length; i++) {
          if (this.expandName[i] === row.idc_name) {
            this.expandName.splice(i, 1)
          }
        }
      }
    },
    showModifierTime (params) {
      this.modifierTracTime = true
      this.modifierInd = params.index
    },
    modifierCancel () {
      this.inpData.ip = ''
      this.inpData.time = ''
    },
    subTracTime () {
      if (this.inpData.ip === '' || this.inpData.time === '') {
        window.alert('请填写完整资料，再提交！！！')
        return
      }
      if (this.originData[this.modifierInd].data.length !== undefined) {
        debugger
        let id = this.originData[this.modifierInd].data[0].tow_value.idc_id
        let alet = true
        for (let i = 0; i < this.originData[this.modifierInd].data.length; i++) {
          if (this.inpData.ip === this.originData[this.modifierInd].data[i].tow_key) {
            alet = false
            this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'updatetowtime', time: this.inpData.time, ip: this.inpData.ip, idc_id: id})
              .then(res => {
                this.modifierTracTime = false
                this.modifierCancel()
                this.$Message.info('修改成功')
              })
              .catch(err => {
                this.$Message.info('修改失败' + err)
              })
          }
        }
        if (alet) {
          alert('该ip不在机房数据内，请核对！')
        }
      } else {
        window.alert('暂无机房数据，请稍后重试')
        return true
      }
    },
    reliveIpBut (params) {
      this.reliveShow = true
      this.reliveInd = params.index
    },
    cancelReleve () {
      this.reliveIp = ''
    },
    subRelive () {
      console.log(this.originData[this.reliveInd].data)
      if (this.reliveIp === '') {
        alert('请输入ip!')
        return true
      }
      if (this.originData[this.reliveInd].data.length === undefined) {
        alert('暂无机房数据，请稍后重试')
        return true
      }
      let id = this.originData[this.reliveInd].data[0].tow_value.idc_id
      console.log(id)
      this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'remove', ip: this.reliveIp, idc_id: id})
        .then(res => {
          this.$Message.info('提交成功')
          this.cancelReleve()
          this.reliveShow = false
        })
        .catch(err => {
          this.$Message.info('提交失败' + err)
        })
    }
  },
  mounted () {
    this.getData()
    setInterval(() => {
      this.getData()
    }, 6000)
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
        console.log(this.levelMess)
      }
    }
  }
}
</script>

<style scoped>
  .user-container{
    width: 100%;
    padding: 14px 16px;
  }
  .table{
    margin-bottom: 150px;
  }
  .modifierTime .item{
    margin-bottom: 15px;
  }
  .modifierTime label{
    display: inline-block;
    padding-bottom: 8px;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>
