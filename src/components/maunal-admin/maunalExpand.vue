<template>
  <div class="expand-container">
    <div class="table-expand">
      <!--<div ref="spin">-->
        <!--<Spin ref="spin">-->
          <!--<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>-->
          <!--<div>Loading</div>-->
        <!--</Spin>-->
      <!--</div>-->
      <i-table :columns="columnsData" :data="ipData"></i-table>
    </div>
    <div class="modal">
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
</template>

<script>
export default {
  name: 'maunalExpand',
  data () {
    return {
      columnsData: [
        {
          title: 'ip',
          key: 'ip'
        },
        {
          title: '用户名',
          key: 'user_name'
        },
        {
          title: '备注',
          key: 'remarks'
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
                size: 'small'
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
      ipData: [],
      confirmShow: false,
      confirmInd: ''
    }
  },
  props: {
    row: {
      type: Object
    },
    name: {
      type: String
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/manualtow', {key: 'show'})
        .then(res => {
          console.log(res)
          this.ipData = []
          res.forEach((item, index) => {
            if (item.idc_name === this.name) {
              this.ipData.push(item)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    confirmClick (params) {
      this.confirmShow = true
      this.confirmInd = params.index
    },
    confirmDec () {
      let id = this.ipData[this.confirmInd].id
      this.$post('http://113.105.246.233:9100/webapi/manualtow', {key: 'del', id: id})
        .then(res => {
          this.$Message.info('解封成功')
          this.getData()
          this.confirmShow = false
        })
        .catch(err => {
          this.$Message.info('解封失败' + err)
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
