<template>
  <div class="user-container">
    <div class="table">
      <i-table :columns="columns3" :data="dataColumns" @on-expand="expand" ref="table" @on-row-click="rowClick"></i-table>
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
              },
              ref: 'myref'
            })
          }
        },
        {
          title: '机房名称',
          key: 'idc_name',
          _expanded: true
        }
      ],
      levelMess: {},
      originData: [],
      rowIndex: ''
    }
  },
  methods: {
    getData () {
      this.$post('/webapi/realtimetow', {key: 'show'})
        .then(res => {
          this.$refs.spin.style.display = 'none'
          for (let i = 0; i < res.length; i++) {
            for (let k = 0; k < res[i].data.length; k++) {
              if (typeof res[i].data[k].tow_value === 'string') {
                res[i].data[k].tow_value = util.evil(res[i].data[k].tow_value)
              }
            }
            if (this.originData.length === res.length && this.originData[i].idc_name === res[i].idc_name) {
              this.originData.splice(i, 1, res[i])
            } else {
              this.originData.push(res[i])
              this.originData[i]._expanded = true
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    rowClick (data, index) {
      this.rowIndex = index
    },
    expand (row, status) {
      this.originData.forEach((item, index) => {
        if (row.idc_name === item.idc_name && index === 0) {
          for (let i = 0; i < this.originData.length; i++) {
            this.originData[i]._expanded = true
          }
        }
      })
    }
  },
  mounted () {
    let level = {}
    level = this.$store.state.userLevel
    if (level !== undefined && JSON.stringify(level) !== '{}') {
      for (let i in level) {
        if (i === this.$route.name) {
          this.levelMess = level[i]
        }
      }
    }
    this.getData()
  },
  computed: {
    a () {
      return this.$store.state.userLevel
    },
    dataColumns () {
      return this.originData
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
