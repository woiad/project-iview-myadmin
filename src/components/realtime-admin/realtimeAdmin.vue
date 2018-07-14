<template>
  <div class="user-container">
    <div class="table">
      <i-table :columns="columns3" :data="originData" @on-expand="expand"></i-table>
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
import util from '../.././util/index'
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
        }
      ],
      levelMess: {},
      originData: [],
      timing: '',
      expandName: []
    }
  },
  methods: {
    getData () {
      this.$post('http://113.105.246.233:9100/webapi/realtimetow', {key: 'show'})
        .then(res => {
          console.log(res)
          this.$refs.spin.style.display = 'none'
          for (let i = 0; i < res.length; i++) {
            if (res[i].status === 'true') {
              res[i].status = true
            } else {
              res[i].status = false
            }
            for (let k = 0; k < res[i].data.length; k++) {
              if (typeof res[i].data[k].tow_value === 'string') {
                res[i].data[k].tow_value = util.evil(res[i].data[k].tow_value)
              }
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
    }
  },
  created () {
    this.getData()
    // setInterval(() => {
    //   this.getData()
    // }, 6000)
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
