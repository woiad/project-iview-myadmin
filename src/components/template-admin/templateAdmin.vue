<template>
  <div class="template-container">
    <Row>
      <Col :lg="10" :md="14" :sm="16" :xs="20">
        <Card>
          <p slot="title">模板管理</p>
          <div class="template-opt">
            <ul>
              <li>
                <Button @click="showTemplate">查看模板</Button>
              </li>
              <li>
                <Button @click="bulidTemplate">新建模板</Button>
              </li>
              <li>
                <Button>修改模板</Button>
              </li>
              <li>
                <Button>删除模板</Button>
              </li>
            </ul>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="showTemplateModal" title="模板查看">
      <ul class="modal">
        <li v-for="(item, key, index) in showTemplateData" :key="index">
          <Collapse accordion>
            <Panel name="tem_name">
              <span>模板名字</span>
              <p slot="content">{{item.tem_name}}</p>
            </Panel>
            <Panel name="tem_remarks">
              <span>模板备注</span>
              <p slot="content">{{item.tem_remarks}}</p>
            </Panel>
            <Panel name="tem_level">
              <span>权限模板</span>
              <div slot="content">
                <Collapse accordion>
                  <Panel v-for="(items, val) in item.tem_level"  :key="val" :name="val">
                    <span>{{val}}</span>
                    <div slot="content" v-for="(list, name) in items" :key="name" class="access-list">
                      <p class="access-text">{{name}}</p>
                      <Radio :value="list" :disabled="!list" class="radio"></Radio>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </Panel>
          </Collapse>
        </li>
      </ul>
    </Modal>
    <Modal v-model="buildTemplate" title="新建模板">
      <div class="build-top">
        <RadioGroup type="button" size="large" @on-change="defaultChose">
          <Radio label="默认模板" ref="def"></Radio>
          <Radio label="新建模板" ref="build"></Radio>
        </RadioGroup>
      </div>
      <div class="build-con">
        <div class="build-default"  v-if="defaultChoseShow">
          <p>模板名字：{{buildDefaultData[0].tem_name}}</p>
          <p>备注：{{buildDefaultData[0].tem_remarks}}</p>
          <div class="build-access-tem">
            <Collapse accordion>
              <Panel name="tem_level">
                <span>权限模板</span>
                <div slot="content">
                  <Collapse accordion>
                    <Panel v-for="(items, val) in buildDefaultData[0].tem_level"  :key="val" :name="val">
                      <span>{{val}}</span>
                      <div slot="content" v-for="(list, name) in items" :key="name" class="access-list">
                        <p class="access-text">{{name}}</p>
                        <Checkbox  class="checkbox"></Checkbox>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'templateAdmin',
  data () {
    return {
      showTemplateData: {},
      buildDefaultData: {},
      defaultChoseShow: false,
      showTemplateModal: false,
      buildTemplate: false
    }
  },
  methods: {
    showTemplate () {
      this.showTemplateModal = true
      this.$post(
        'http://113.105.246.233:9100/webapi/template', {key: 'show'})
        .then((res) => {
          this.showTemplateData = res
          for (let i = 0; i < this.showTemplateData.length; i++) {
            this.showTemplateData[i].tem_level = eval('(' + this.showTemplateData[i].tem_level + ')')
          }
          console.log(this.showTemplateData)
          this.chartToBol()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    chartToBol () {
      for (let i = 0; i < this.showTemplateData.length; i++) {
        for (let j in this.showTemplateData[i].tem_level) {
          for (let k in this.showTemplateData[i].tem_level[j]) {
            this.showTemplateData[i].tem_level[j][k] = this.showTemplateData[i].tem_level[j][k] === 'true' ? true : false
          }
        }
      }
    },
    bulidTemplate () {
      this.buildTemplate = true
    },
    defaultChose () {
      if (this.$refs.def.currentValue === true) {
        this.$post('http://113.105.246.233:9100/webapi/template', {key: 'get_default_tem', content: 'default'})
          .then(res => {
            this.buildDefaultData = res
            this.buildDefaultData[0].tem_level = eval('(' + this.buildDefaultData[0].tem_level + ')')
            console.log(this.buildDefaultData[0].tem_name)
            this.defaultChoseShow = true
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style scoped>
  .template-container{
    margin: 14px 16px;
  }
  .template-opt{
    display: flex;
    justify-content: flex-start;
  }
  .template-opt ul li{
    display: inline-block;
    list-style: none;
  }
  .modal li{
    margin-bottom: 15px;
    list-style: none;
  }
  .modal li p{
    line-height: 20px;
    font-size: 16px;
  }
  .access-list .access-text{
    display: inline-block;
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 20px;
    vertical-align: top;
  }
  .access-list .radio, .checkbox{
    float: right;
  }
</style>
