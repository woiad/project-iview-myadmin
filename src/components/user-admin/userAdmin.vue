<template>
  <div class="user-container">
    <div class="user-add">
      <Button type="primary" icon="ios-plus-empty" @click="addUser">新增用户</Button>
    </div>
    <div class="user-list">
      <i-table :columns="columnsData" :data="userData"></i-table>
    </div>
    <div class="modal">
      <Modal v-model="userAddFlag" title="用户新增" @on-ok="userAddOk" @on-cancel="userAddCancel">
        <div class="user-con">
          <i-form ref="formUser">
            <FormItem label="用户账号：">
              <i-input placeholder = "请输入账号，账号格式是邮箱" v-model="userAccounts" autocomplete="off"></i-input>
            </FormItem>
            <FormItem label="用户部门：">
              <i-input placeholder = "请输入用户部门" v-model="userDepartment"></i-input>
            </FormItem>
            <FormItem label="用户名字：">
              <i-input placeholder = "请输入用户名" v-model="userName"></i-input>
            </FormItem>
            <FormItem label="用户密码：">
              <i-input placeholder = "请输入用户密码" v-model="userPassword" type="password"></i-input>
            </FormItem>
            <FormItem label="用户备注：">
              <i-input placeholder = "请输入用户备注" v-model="userRemarks"></i-input>
            </FormItem>
          </i-form>
          <div class="level-type">
            <Button type="primary" @click="levelTypeChose">
              选择权限模板
            </Button>
          </div>
          <div class="user-access-tem" v-if="accessListShow">
            <Collapse accordion>
              <Panel name="user_level">
                <span>{{temName}}权限列表</span>
                <div slot="content">
                  <Collapse accordion>
                    <Panel v-for="(items, val, index) in accessListData.tem_level"  :key="val" :name="val">
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
          <div class="btn">
            <Button type="success" long @click="submitUserAdd">提交</Button>
          </div>
        </div>
      </Modal>
      <Modal v-model="levelTypeShow" title="权限模板" style="{zIndex: '100'}" @on-ok="choseTemName">
        <div class="radio">
          <RadioGroup v-model="choseDefault">
            <Radio :label="name" v-for="(name, index) in choseList" :key="index" ref="radio"></Radio>
          </RadioGroup>
        </div>
      </Modal>
      <Modal v-model="userModifierFlag" title="用户修改" @on-ok="userModifier" @on-cancel="userModifierCancel">
        <div class="user-con">
          <i-form ref="formUserModifier">
            <FormItem label="用户部门：">
              <i-input :placeholder = "userModifierData.user_department" v-model="userModifierDepartment"></i-input>
            </FormItem>
            <FormItem label="用户名字：">
              <i-input :placeholder = "userModifierData.user_name" v-model="userModifierName"></i-input>
            </FormItem>
            <FormItem label="用户备注：">
              <i-input :placeholder = "userModifierData.user_remarks" v-model="userModifierRemarks"></i-input>
            </FormItem>
          </i-form>
          <div class="user-access-tem">
            <Collapse accordion>
              <Panel name="user_level">
                <span>权限列表</span>
                <div slot="content">
                  <Collapse accordion>
                    <Panel v-for="(items, val, index) in userModifierData.user_level"  :key="val" :name="val">
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
    </div>
  </div>
</template>

<script>
import util from '../.././util/index'
import md5 from 'js-md5'
export default {
  name: 'userAdmin',
  data () {
    return {
      columnsData: [
        {
          title: '用户名称',
          key: 'user_name'
        },
        {
          title: '用户部门',
          key: 'user_department'
        },
        {
          title: '用户创建时间',
          key: 'user_times'
        },
        {
          title: '用户备注',
          key: 'user_remarks'
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
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modifierLevel(params)
                  }
                }
              }, '修改权限'),
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    alert(2)
                  }
                }
              }, '修改密码'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    alert(3)
                  }
                }
              }, '删除用户')
            ])
          }
        }
      ],
      userData: [],
      userOriginData: {},
      userAddFlag: false,
      userAddData: {},
      userName: '',
      userDepartment: '',
      userPassword: '',
      userRemarks: '',
      userAccounts: '',
      levelTypeShow: false,
      choseList: [],
      choseDefault: '默认模板',
      temName: '',
      temData: '',
      accessListShow: false,
      accessListData: {},
      userModifierFlag: false,
      userModifierDepartment: '',
      userModifierName: '',
      userModifierRemarks: '',
      userModifierData: ''
    }
  },
  methods: {
    addUser () {
      this.userAddFlag = true
    },
    levelTypeChose () {
      this.levelTypeShow = true
      this.$post('http://113.105.246.233:9100/webapi/template', {key: 'get_default_tem', content: 'all'})
        .then(res => {
          this.temData = res
          this.choseList = []
          for (let i = 0; i < res.length; i++) {
            this.choseList.push(res[i].tem_name)
          }
          console.log(this.temData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    choseTemName () {
      let len = this.$refs.radio.length
      for (let i = 0; i < len; i++) {
        if (this.$refs.radio[i].currentValue === true) {
          this.temName = this.$refs.radio[i].label
        }
      }
      this.temData.forEach((item, index) => {
        if (item.tem_name === this.temName) {
          this.accessListData = item
        }
      })
      this.accessListData.tem_level = util.evil(this.accessListData.tem_level)
      util.chartToBol(this.accessListData.tem_level)
      this.accessListShow = true
      console.log(this.accessListData)
    },
    userAddOk () {
      this.clearUserAddData()
    },
    userAddCancel () {
      this.clearUserAddData()
    },
    submitUserAdd () {
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (this.userName === '' || this.userAccounts === '' || this.userDepartment === '' || this.userRemarks === '' || this.userPassword === '') {
        window.alert('请填写完整的用户信息！')
      } else if (this.accessListShow === false) {
        window.alert('请选择权限模板')
      } else if (!reg.test(this.userAccounts)) {
        alert('邮箱格式不正确！')
      } else {
        console.log(this.accessListData)
        let obj = this.submitMessOpt(this.accessListData, this.userName, this.userPassword, this.userAccounts, this.userDepartment, this.userRemarks)
        let subChart = JSON.stringify(obj)
        this.$post('http://113.105.246.233:9100/webapi/user', {key: 'add', content: subChart})
          .then(res => {
            this.$Message.info('用户新增成功！')
            this.getUserData()
            console.log(res)
          })
          .catch(err => {
            this.$Message.info('用户新增失败' + err)
            console.log(err)
          })
      }
    },
    submitMessOpt (submitData, name, password, accounts, department, remarks) {
      debugger
      let submitObj = {}
      submitObj.user_accounts = accounts
      submitObj.user_department = department
      submitObj.user_name = name
      submitObj.user_remarks = remarks
      submitObj.user_passwd = md5(password)
      submitObj.user_level = {}
      Object.keys(submitData.tem_level).forEach((item, index) => {
        for (let i in submitData.tem_level[item]) {
          let ind = i + index
          submitData.tem_level[item][i] = this.$refs[ind][0].currentValue
        }
      })
      submitObj.user_level = submitData.tem_level
      return submitObj
    },
    modifierLevel (params) {
      let ind = params.index
      this.userModifierFlag = true
      this.userModifierData = this.userData[ind]
      if (typeof this.userModifierData.user_level === 'string') {
        this.userModifierData.user_level = util.evil(this.userModifierData.user_level)
      }
      util.chartToBol(this.userModifierData.user_level)
    },
    userModifier () {
      if (this.userModifierName !== '') {
        this.userModifierData.user_name = this.userModifierName
      }
      if (this.userModifierDepartment !== '') {
        this.userModifierData.user_department = this.userModifierDepartment
      }
      if (this.userModifierRemarks !== '') {
        this.userModifierData.user_remarks = this.userModifierRemarks
      }
      Object.keys(this.userModifierData.user_level).forEach((item, index) => {
        for (let i in this.userModifierData.user_level[item]) {
          let ind = i + index
          this.userModifierData.user_level[item][i] = this.$refs[ind][0].currentValue
        }
      })
      let chartSub = JSON.stringify(this.userModifierData)
      let id = this.userModifierData.id
      this.$post('http://113.105.246.233:9100/webapi/user', {key: 'update', type: 'level', content: chartSub, id: id})
        .then(res => {
          this.$Message.info('修改成功')
          console.log(res)
        })
        .catch(err => {
          this.$Message.info('修改失败' + err)
          console.log(err)
        })
      console.log(this.userModifierData)
      this.clearUserAddData()
    },
    userModifierCancel () {
      alert(2)
    },
    clearUserAddData () {
      this.accessListData = {}
      this.temName = ''
      this.userName = ''
      this.userAccounts = ''
      this.userDepartment = ''
      this.userPassword = ''
      this.userRemarks = ''
      if (this.$refs.radio !== undefined && this.$refs.radio !== null) {
        for (let i = 0; i < this.$refs.radio.length; i++) {
          this.$refs.radio[i].currentValue = false
        }
        this.$refs.radio[0].currentValue = true
      }
      this.accessListShow = false
    },
    getUserData () {
      this.$post('http://113.105.246.233:9100/webapi/user', {key: 'show'})
        .then(res => {
          console.log(res)
          this.userData = []
          for (let i = 0; i < res.length; i++) {
            let obj = {
              user_name: '',
              user_department: '',
              user_times: '',
              user_remarks: '',
              user_level: ''
            }
            obj.user_name = res[i].user_name
            obj.user_department = res[i].user_department
            obj.user_times = res[i].user_times
            obj.user_remarks = res[i].user_remarks
            obj.user_level = res[i].user_level
            this.userData.push(obj)
          }
          this.userOriginData = res
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getUserData()
  }
}
</script>

<style scoped>
  .user-container{
    width: 100%;
    padding: 14px 16px;
  }
  .user-container .user-add{
    margin-bottom: 10px;
  }
  .ivu-form-item{
    margin-bottom: 10px;
  }
  .user-access-tem .access-list{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }
  .user-access-tem .access-list:last-child{
    border: none;
  }
  .user-access-tem .access-text{
    display: inline-block;
    font-size: 14px;
    line-height: 40px;
    color: #2d8cf0
  }
  .user-access-tem .checkbox{
    float: right;
  }
  .level-type{
    margin: 15px 0 20px 0;
  }
  .btn{
    margin-top: 20px;
  }
</style>
