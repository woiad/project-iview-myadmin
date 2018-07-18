<template>
  <div class="tem-container">
    <div class="build-tem">
      <Button type="primary" icon="ios-plus-empty" @click="bulidTemplate" :disabled="levelMess['新建'] !== 'true'">添加模板</Button>
    </div>
    <div class="table">
      <i-table :columns="columnsData" :data="temData"></i-table>
    </div>
    <div class="modal">
      <Modal v-model="flag" :title="optionTem" @on-ok="submitBuildTemData" @on-cancel="buildCancel">
        <div class="tem-con">
          <div class="tem-name">
            <label>模板名字：</label>
            <i-input :placeholder = "modalData.tem_name" v-model="temName"></i-input>
          </div>
          <div class="tem-remarks">
            <label>模板备注：</label>
            <i-input :placeholder = "modalData.tem_remarks" v-model="temRemarks"></i-input>
          </div>
          <div class="tem-access-tem">
            <Collapse accordion>
              <Panel name="tem_level">
                <span>权限模板</span>
                <div slot="content">
                  <Collapse accordion>
                    <Panel v-for="(items, val, index) in modalData.tem_level"  :key="val" :name="val">
                      <span>{{val}}</span>
                      <div slot="content" v-for="(list, name) in items" :key="name" class="access-list">
                        <p class="access-text">{{name}}</p>
                        <Checkbox  class="checkbox" :ref="name + index" :value="list"></Checkbox>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div slot="footer">
          <Button @click="buildCancel">重置</Button>
          <Button type="primary" @click="submitBuildTemData">提交</Button>
        </div>
      </Modal>
      <Modal v-model="modifierTemplateShow" title="修改模板" @on-cancel="modifierCancel" @on-ok="modifierSubmit">
          <div class="tem-con">
            <p>
              <label>模板名字：</label>
              <i-input :placeholder = "modifierData.tem_name" v-model="temName"></i-input>
            </p>
            <p>
              <label>模板备注：</label>
              <i-input :placeholder = "modifierData.tem_remarks" v-model="temRemarks"></i-input>
            </p>
            <div class="tem-access-tem">
              <Collapse accordion>
                <Panel name="tem_level">
                  <span>权限模板</span>
                  <div slot="content">
                    <Collapse accordion>
                      <Panel v-for="(items, val, index) in modifierData.tem_level"  :key="val" :name="val">
                        <span>{{val}}</span>
                        <div slot="content" v-for="(list, name) in items" :key="name" class="access-list">
                          <p class="access-text">{{name}}</p>
                          <Checkbox  class="checkbox" :ref="name + index" :value="list"></Checkbox>
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
      </Modal>
      <Modal v-model="delConfirm" width="360">
        <p slot="header" style="color: rgb(255, 102, 0);text-align: center">
          <Icon type="information-circled"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align: center">
          <p>该用户一经删除，无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long @click="confirmDel">删除</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import util from '../.././util/index'
export default {
  name: 'templateAdmin2',
  data () {
    return {
      columnsData: [
        {
          title: '模板名称',
          key: 'tem_name'
        },
        {
          title: '备注',
          key: 'tem_remarks'
        },
        {
          title: '操作',
          key: 'option',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: this.levelMess['修改'] !== 'true'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modifierTemplate(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: this.levelMess['删除'] !== 'true'
                },
                on: {
                  click: () => {
                    this.delTem(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      temData: [], // 表格渲染数据
      originData: {}, //  初始数据，当修改或删除数据时，可通过该数据找到对应的数据，进行相关操作
      modalData: {}, //  新建模板的数据，根据该数据，渲染新建模板的视图
      modifierData: {}, // 修改模板的数据，根据该数据，渲染修改模板的视图，该数据来源于originData
      modifierTemplateShow: false, //  修改对话框的弹出与隐藏
      flag: false, //  新建模板对话框弹出与隐藏
      temName: '', // 模板名字
      temRemarks: '', //  模板备注
      optionTem: '', // 对话框title
      delConfirm: false, //  删除对话框弹出
      delInd: '', //  删除模板的索引
      modifierInd: '', //  修改模板的索引
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
    this.temShow()
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
  methods: {
    // 修改权限模板
    modifierTemplate (item) {
      this.modifierTemplateShow = true
      let ind = item.index
      let modifierData = this.originData[ind]
      if (typeof modifierData.tem_level === 'string') {
        modifierData.tem_level = util.evil(modifierData.tem_level)
      }
      util.chartToBol(modifierData.tem_level)
      this.modifierData = modifierData
    },
    // 提交修改后的权限模板信息
    modifierSubmit () {
      let submitData = this.submitTemData(this.modifierData, this.temName, this.temRemarks)
      let subBol = this.changeTemText(this.modifierData, submitData)
      let submitDataChart = JSON.stringify(submitData)
      this.initModal()
      this.modifierData = {}
      if (subBol) {
        this.$post('http://113.105.246.233:9100/webapi/template', {key: 'update', content: submitDataChart, id: submitData.id})
          .then(res => {
            console.log(res)
            this.$Message.info('修改成功')
            this.temShow()
          })
          .catch(err => {
            console.log(err)
            this.$Message.info('修改失败 &nbsp;' + err)
          })
      } else {
        window.alert('模板信息没有更改，请更改后再确认！')
      }
    },
    // 关闭模板时清空模板数据
    modifierCancel () {
      this.initModal()
      this.modifierData = {}
    },
    // 新建模板
    bulidTemplate () {
      this.initModal()
      this.flag = true
      this.modalData = {}
      this.optionTem = '新建模板'
      this.getBuildTem()
    },
    getBuildTem () {
      this.$post('http://113.105.246.233:9100/webapi/template', {key: 'get_default_tem', content: 'default'})
        .then(res => {
          let buildDefaultData = res
          buildDefaultData[0].tem_level = util.evil(buildDefaultData[0].tem_level)
          util.chartToBol(buildDefaultData[0].tem_level)
          this.modalData = buildDefaultData[0]
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 提交新建模板
    submitBuildTemData () {
      let submitData = this.submitTemData(this.modalData, this.temName, this.temRemarks)
      let buiBol = this.changeTemText(this.modalData, submitData)
      this.modalData = {}
      let chart = JSON.stringify(submitData)
      if (buiBol) {
        this.$post('http://113.105.246.233:9100/webapi/template', {key: 'add', content: chart})
          .then(res => {
            this.$Message.info('提交成功')
            this.temShow()
            this.modalData = {}
          })
          .catch(err => {
            setTimeout(() => {
              this.$Message.info('提交失败：' + err)
            }, 1000)
            this.modalData = {}
          })
      } else {
        window.alert('模板信息没有更改，请更改后提交')
      }
    },
    // 模板信息处理
    submitTemData (submitData, name, remarks) {
      let jsonReplace = JSON.stringify(submitData).replace(/tem_level/g, 'level')
      let submitObj = util.evil(jsonReplace)
      if (name === '') {
        name = submitData.tem_name
      }
      if (remarks === '') {
        remarks = submitData.tem_remarks
      }
      submitObj.tem_name = name
      submitObj.tem_remarks = remarks
      util.changeCurrentValue(submitObj.level, this.$refs)
      return submitObj
    },
    // 新建模板关闭
    buildCancel () {
      this.initModal()
      this.modalData = {}
      this.getBuildTem()
    },
    // 删除模板
    delTem (param) {
      this.delConfirm = true
      this.delInd = param.index
    },
    confirmDel () {
      let delData = this.originData[this.delInd]
      this.$post('http://113.105.246.233:9100/webapi/template', {key: 'del', id: delData.id})
        .then(res => {
          this.$Message.info('删除成功')
          this.temData.splice(this.delInd, 1)
          this.delConfirm = false
        })
        .catch(err => {
          console.log(err)
          this.$Message.info('删除失败：&nbsp;' + err)
          this.delConfirm = false
        })
    },
    // 初始化模板
    initModal () {
      this.temName = ''
      this.temRemarks = ''
    },
    temShow () {
      // 模板查看
      this.$post('http://113.105.246.233:9100/webapi/template', {key: 'show'})
        .then(res => {
          this.temData = []
          this.originData = res
          for (let i = 0; i < res.length; i++) {
            let obj = {
              tem_name: '',
              tem_remarks: ''
            }
            obj.tem_name = res[i].tem_name
            obj.tem_remarks = res[i].tem_remarks
            this.temData.push(obj)
          }
        })
    },
    // 模板中的信息是否更改
    changeTemText (unChangeData, changeData) {
      let unChangeTemName = unChangeData.tem_name
      let unChangeTemRemarks = unChangeData.tem_remarks
      let changeDataTemNane = changeData.tem_name
      let changeDataTemRemarks = changeData.tem_remarks
      let changeFlag = false
      if (unChangeTemName !== changeDataTemNane || unChangeTemRemarks !== changeDataTemRemarks) {
        changeFlag = true
        return changeFlag
      }
      util.changeValue(unChangeData.tem_level, changeData.level)
    }
  }
}
</script>

<style scoped>
  .tem-container{
    width: 100%;
    padding: 14px 16px;
  }
  .tem-container .build-tem{
    margin: 0px 0 10px 0;
  }
  .tem-con label{
    display: inline-block;
    margin: 10px 0;
    font-size: 14px;
    line-height: 20px;
  }
  .tem-access-tem{
    margin-top: 15px;
  }
  .tem-access-tem .access-list{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }
  .tem-access-tem .access-list:last-child{
    border: none;
  }
  .tem-access-tem .access-text{
    display: inline-block;
    font-size: 14px;
    line-height: 40px;
    color: #2d8cf0
  }
  .tem-access-tem .checkbox{
    float: right;
  }
</style>
