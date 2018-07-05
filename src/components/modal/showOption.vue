<template>
  <div class="modal-cantainer">
    <Modal v-model="showModal" title="新建模板" @on-ok="submitTemData" @on-cancel="cancel">
      <div class="modal-con">
        <div class="tem-name">
          <label>模板名字：</label>
          <i-input :placeholder = "showData.tem_name" v-model="temName"></i-input>
        </div>
        <div class="tem-remarks">
          <label>模板备注：</label>
          <i-input :placeholder = "showData.tem_remarks" v-model="temRemarks"></i-input>
        </div>
        <div class="build-access-tem">
          <Collapse accordion>
            <Panel name="tem_level">
              <span>权限模板</span>
              <div slot="content">
                <Collapse accordion>
                  <Panel v-for="(items, val, index) in showData.tem_level"  :key="val" :name="val">
                    <span>{{val}}</span>
                    <div slot="content" v-for="(list, name) in items" :key="name" class="access-list">
                      <p class="access-text">{{name}}</p>
                      <Checkbox  class="checkbox" :ref="name + index"></Checkbox>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'modal',
  props: {
    showData: {},
    showModal: {
      type: Boolean
    }
  },
  data () {
    return {
      temName: '',
      temRemarks: ''
    }
  },
  methods: {
    submitTemData () {
      let submitObj = this.showData
      if (this.temName === '') {
        this.temName = this.showData.tem_name
      }
      if (this.temRemarks === '') {
        this.temRemarks = this.showData.tem_remarks
      }
      submitObj.tem_name = this.temName
      submitObj.tem_remarks = this.temRemarks
      let keys = Object.keys(submitObj.tem_level)
      console.log(keys)
      Object.keys(submitObj.tem_level).forEach((item, index) => {
        for (let i in submitObj.tem_level[item]) {
          let ind = i + index
          submitObj.tem_level[item][i] = this.$refs[ind][0].currentValue
        }
      })
      console.log(submitObj)
      this.$post('http://113.105.246.233:9100/webapi/template', {key: 'add', content: submitObj})
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          setTimeout(() => {
            this.$Message.info('提交失败：' + err)
          }, 1000)
          console.log(err)
        })
    },
    cancel () {
      this.$emit('changeShowModal', this.showModal)
    }
  }
}
</script>

<style scoped>
  .modal-con label{
    display: inline-block;
    margin: 10px 0;
    font-size: 16px;
    line-height: 20px;
  }
  .build-access-tem{
    margin-top: 15px;
  }
  .build-access-tem .access-list{
    height: 40px;
    line-height: 40px;
  }
  .build-access-tem .access-text{
    display: inline-block;
    font-size: 16px;
    line-height: 40px;
  }
  .build-access-tem .checkbox{
    float: right;
  }
</style>
