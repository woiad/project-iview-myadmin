<template>
  <div class="expand-container">
    <div class="table">
      <div ref="spin">
        <Spin ref="spin">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>
      <i-table :columns="columnsData" :data="temData" v-if="loadingShow"></i-table>
    </div>
    <div class="table">
      <Modal v-model="confirmShow" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align: center">
          <p>确定解删除ip?</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDec">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'temporaryExpand',
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
      columnsData: [
        {
          title: 'ip',
          key: 'ip'
        },
        {
          title: '开始时间',
          key: 'start_time'
        },
        {
          title: '结束时间',
          key: 'end_time'
        },
        {
          title: '防护值(单位：mb/s)',
          key: 'idc_ip_bps'
        },
        {
          title: '牵引时间(单位：分钟)',
          key: 'idc_ip_tow_time'
        },
        {
          title: '操作',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: this.level['删除'] !== 'true'
              },
              on: {
                click: () => {
                  this.delClick(params)
                }
              }
            }, '删除')
          }
        }
      ],
      temData: [],
      loadingShow: false,
      confirmShow: false,
      delData: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.temData = []
      console.log(this.row.idc_name)
      this.$post('http://113.105.246.233:9100/webapi/temfwip', {key: 'show'})
        .then(res => {
          for (let i in res) {
            for (let j in res[i]) {
              if (res[i][j] === this.row.idc_name) {
                this.temData.push(res[i])
              }
            }
          }
          setTimeout(() => {
            this.$refs.spin.style.display = 'none'
            this.loadingShow = true
          }, 500)
        })
        .catch(err => {
          console.log(err)
        })
    },
    delClick (params) {
      this.confirmShow = true
      this.delData = params
    },
    confirmDec () {
      console.log(this.delData.row.ip)
      let ip = this.delData.row.ip
      this.$post('http://113.105.246.233:9100/webapi/temfwip', {key: 'del', ip: ip})
        .then(res => {
          this.$Message.info('删除成功')
          this.getData()
          this.confirmShow = false
        })
        .catch(err => {
          this.$Message.info('删除失败' + err)
        })
    }
  }
}
</script>
<style scoped>
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
<style>
  .table td.ivu-table-expanded-cell{
    padding: 20px 10px;
  }
</style>
