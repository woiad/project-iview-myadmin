<template>
  <div class="user-container">
    <div class="user-add">
      <Button type="primary" icon="ios-plus-empty" @click="addUser">新增用户</Button>
    </div>
    <div class="user-list">
      <i-table :columns="columnsData" :data="userData"></i-table>
    </div>
    <div class="modal">
      <Modal v-model="userAddFlag" title="用户新增" @on-cancel="clearUserAddData">
        <div class="user-con">
          <i-form ref="formUser">
            <FormItem label="用户账号：">
              <i-input placeholder = "请输入账号，账号格式是邮箱" v-model="userAddInpData.userAccounts" autocomplete="off"></i-input>
            </FormItem>
            <FormItem label="用户部门：">
              <i-input placeholder = "请输入用户部门" v-model="userAddInpData.userDepartment"></i-input>
            </FormItem>
            <FormItem label="用户名字：">
              <i-input placeholder = "请输入用户名" v-model="userAddInpData.userName"></i-input>
            </FormItem>
            <FormItem label="用户密码：">
              <i-input placeholder = "请输入用户密码" v-model="userAddInpData.userPassword" type="password"></i-input>
            </FormItem>
            <FormItem label="用户备注：">
              <i-input placeholder = "请输入用户备注" v-model="userAddInpData.userRemarks"></i-input>
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
        </div>
        <div slot="footer">
          <Button @click="clearUserAddData">重置</Button>
          <Button type="primary" @click="submitUserAdd">提交</Button>
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
              <i-input :placeholder = "userModifierData.user_department" v-model="userModifierInpData.userModifierDepartment"></i-input>
            </FormItem>
            <FormItem label="用户名字：">
              <i-input :placeholder = "userModifierData.user_name" v-model="userModifierInpData.userModifierName"></i-input>
            </FormItem>
            <FormItem label="用户备注：">
              <i-input :placeholder = "userModifierData.user_remarks" v-model="userModifierInpData.userModifierRemarks"></i-input>
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
      <Modal v-model="modifierPasswordShow" title="修改密码">
        <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
          <!--<FormItem label="原密码" prop="oldPass" :error="oldPassError">-->
            <!--<Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>-->
          <!--</FormItem>-->
          <FormItem label="新密码" prop="newPass">
            <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" type="password"></Input>
          </FormItem>
          <FormItem label="确认新密码" prop="rePass">
            <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" type="password"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancelEditPass">取消</Button>
          <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
        </div>
      </Modal>
      <Modal v-model="userDelShow" width="360">
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
import md5 from 'js-md5'
export default {
  name: 'userAdmin',
  data () {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
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
                    this.modifierPassword(params)
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
                    this.userDel(params)
                  }
                }
              }, '删除用户')
            ])
          }
        }
      ], // table 数据
      userData: [], // 所有用户信息，在table里展示
      userOriginData: {}, // 初始数据，即所有的用户信息
      userAddFlag: false, // 用户添加modal隐藏与显示
      userAddData: {}, // 用户添加的数据
      userAddInpData: {
        userName: '',
        userDepartment: '',
        userPassword: '',
        userRemarks: '',
        userAccounts: ''
      }, // 填写的数据
      levelTypeShow: false, // 选择权限模板的 modal 隐藏与显示
      choseList: [], // 可选择的模板数据
      choseDefault: '默认模板', // 选中默认模板
      temName: '', // 所有的模板名字
      temData: '', // 所有的模板数据
      accessListShow: false, // 刚开始没有选中模板，权限列表隐藏
      accessListData: {}, // 选中的模板的数据
      userModifierFlag: false, // 修改权限的modal隐藏与显示
      userModifierInpData: {
        userModifierDepartment: '',
        userModifierName: '',
        userModifierRemarks: ''
      }, // 修改modal中填写的数据
      userModifierData: '', // 当前修改的原始数据
      modifierPasswordShow: false, // 修改密码的modal的隐藏于显示
      savePassLoading: false, // 提交修改密码后，提交按钮变为加载状态
      oldPassError: '', // 暂时无数据
      passId: '', // 点击修改密码是，获取index,根据index,确定那个用户的密码修改
      editPasswordForm: {
        oldPass: '',
        newPass: '',
        rePass: ''
      }, // 修改密码的数据
      passwordValidate: {
        oldPass: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPass: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
          {max: 32, message: '最多输入32个字符', trigger: 'blur'}
        ],
        rePass: [
          {required: true, message: '请再次输入新密码', trigger: 'blur'},
          {validator: valideRePassword, trigger: 'blur'}
        ]
      }, // 设置表单校验
      userDelShow: false, // 删除用户的modal的隐藏与显示
      delId: '' // 删除的索引
    }
  },
  methods: {
    addUser () { // 添加用户modal 弹出
      this.userAddFlag = true
    },
    levelTypeChose () { // 获取权限模板
      this.levelTypeShow = true
      this.$post('http://113.105.246.233:9100/webapi/template', {key: 'get_default_tem', content: 'all'})
        .then(res => {
          this.temData = res
          this.choseList = []
          for (let i = 0; i < res.length; i++) {
            this.choseList.push(res[i].tem_name)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    choseTemName () { // 选中的权限模板
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
    },
    clearUserAddData () { // 重置用户新增 modal
      this.accessListData = {}
      this.temName = ''
      this.userAddInpData.userName = ''
      this.userAddInpData.userAccounts = ''
      this.userAddInpData.userDepartment = ''
      this.userAddInpData.userPassword = ''
      this.userAddInpData.userRemarks = ''
      if (this.$refs.radio !== undefined && this.$refs.radio !== null) { // 初始化权限选择模板
        for (let i = 0; i < this.$refs.radio.length; i++) {
          this.$refs.radio[i].currentValue = false
        }
        this.$refs.radio[0].currentValue = true
      }
      this.accessListShow = false
    },
    submitUserAdd () { // 提交用户新增数据
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (this.userAddInpData.userName === '' || this.userAddInpData.userAccounts === '' || this.userAddInpData.userDepartment === '' || this.userAddInpData.userRemarks === '' || this.userAddInpData.userPassword === '') {
        window.alert('请填写完整的用户信息！')
      } else if (this.accessListShow === false) {
        window.alert('请选择权限模板')
      } else if (!reg.test(this.userAddInpData.userAccounts)) {
        alert('邮箱格式不正确！')
      } else {
        let obj = this.submitMessOpt(this.accessListData, this.userAddInpData.userName, this.userAddInpData.userPassword, this.userAddInpData.userAccounts, this.userAddInpData.userDepartment, this.userAddInpData.userRemarks)
        let subChart = JSON.stringify(obj)
        this.$post('http://113.105.246.233:9100/webapi/user', {key: 'add', content: subChart})
          .then(res => {
            if (res[1] === 200) {
              this.$Message.info('用户新增成功！')
              this.getUserData()
              this.userAddFlag = false
            }
          })
          .catch(err => {
            this.$Message.info('用户新增失败' + err)
          })
      }
    },
    submitMessOpt (submitData, name, password, accounts, department, remarks) {
      let submitObj = {}
      submitObj.user_accounts = accounts
      submitObj.user_department = department
      submitObj.user_name = name
      submitObj.user_remarks = remarks
      submitObj.user_passwd = md5(password)
      submitObj.user_level = {}
      util.changeCurrentValue(submitData.tem_level, this.$refs)
      submitObj.user_level = submitData.tem_level
      return submitObj
    },
    modifierLevel (params) { // 修改权限模板 modal 弹出
      let ind = params.index
      this.userModifierFlag = true
      this.userModifierData = this.userData[ind]
      if (typeof this.userModifierData.user_level === 'string') {
        this.userModifierData.user_level = util.evil(this.userModifierData.user_level)
      }
      util.chartToBol(this.userModifierData.user_level)
    },
    userModifier () { // 提交修改后的数据
      let modifierChart = JSON.stringify(this.userModifierData) // 此处要把用户修改的初始数据转换后赋值给新变量，
      // 不赋值，那么修改了数据，this.userModifierData 的数据也同步发生变化，则无法判断数据是否发生变化
      let modifierDataObj = this.userModifierDataOpt(JSON.parse(modifierChart))
      delete modifierDataObj.user_times
      let chartSub = JSON.stringify(modifierDataObj)
      let flag = this.userModifierChange(this.userModifierData, modifierDataObj)
      let id = this.userModifierData.id
      if (flag) {
        this.$post('http://113.105.246.233:9100/webapi/user', {key: 'update', type: 'level', content: chartSub, id: id})
          .then(res => {
            if (res[1] === 200) {
              this.$Message.info('修改成功')
              this.getUserData()
            }
          })
          .catch(err => {
            this.$Message.info('修改失败' + err)
          })
      } else {
        window.alert('提交失败，数据没有更改')
      }
      this.clearUserModifierData()
    },
    userModifierDataOpt (optionData) { // 修改后的数据的收集
      if (this.userModifierInpData.userModifierName !== '') {
        optionData.user_name = this.userModifierInpData.userModifierName
      }
      if (this.userModifierInpData.userModifierDepartment !== '') {
        optionData.user_department = this.userModifierInpData.userModifierDepartment
      }
      if (this.userModifierInpData.userModifierRemarks !== '') {
        optionData.user_remarks = this.userModifierInpData.userModifierRemarks
      }
      util.changeCurrentValue(optionData.user_level, this.$refs)
      return optionData
    },
    userModifierCancel () { // 重置修改权限 modal 数据
      this.clearUserModifierData()
    },
    clearUserModifierData () { // 重置修改权限 modal 数据
      this.userModifierInpData.userModifierRemarks = ''
      this.userModifierInpData.userModifierName = ''
      this.userModifierInpData.userModifierDepartment = ''
      this.userModifierData = {}
    },
    userModifierChange (unChangeData, changeData) { // 判断修改权限 modal 里面的数据是否更改
      let changeFlag = false
      let unChangeName = unChangeData.user_name
      let unChangeDepartment = unChangeData.user_department
      let unChangeRemarks = unChangeData.user_remarks
      let changeName = changeData.user_name
      let changeDepartment = changeData.user_department
      let changeRemarks = changeData.user_remarks
      if (unChangeName !== changeName || unChangeDepartment !== changeDepartment || unChangeRemarks !== changeRemarks) {
        changeFlag = true
        return changeFlag
      }
      changeFlag = util.changeValue(unChangeData.user_level, changeData.user_level)
      return changeFlag
    },
    modifierPassword (params) { // 提供修改密码的索引
      this.modifierPasswordShow = true
      this.passId = params.index
    },
    cancelEditPass () { // 取消修改密码
      this.modifierPasswordShow = false
      this.editPasswordForm.newPass = ''
      this.editPasswordForm.rePass = ''
    },
    saveEditPass () { // 保存修改后的密码
      let modifierId = this.userData[this.passId].id
      this.$refs['editPasswordForm'].validate((valid) => {
        if (valid) {
          this.savePassLoading = true
          this.$post('http://113.105.246.233:9100/webapi/user', {key: 'update', type: 'passwd', content: md5(this.editPasswordForm.rePass), id: modifierId})
            .then(res => {
              console.log(res)
              if (res[1] === 200) {
                this.$Message.info('密码修改成功')
                this.savePassLoading = false
                this.modifierPasswordShow = false
                this.editPasswordForm.newPass = ''
                this.editPasswordForm.rePass = ''
              }
            })
            .catch(err => {
              this.$Message.info('修改密码失败' + err)
              console.log(err)
            })
        }
      })
    },
    userDel (params) { // 获取删除的索引
      this.userDelShow = true
      this.delId = params.index
    },
    confirmDel () { // 确认删除
      let id = this.userData[this.delId].id
      this.$post('http://113.105.246.233:9100/webapi/user', {key: 'del', id: id})
        .then(res => {
          if (res[1] === 200) {
            this.$Message.info('删除成功')
            this.getUserData()
            this.userDelShow = false
          }
        })
        .catch(err => {
          this.$Message.info('删除失败' + err)
        })
    },
    getUserData () { // 用户管理界面初始数据
      this.$post('http://113.105.246.233:9100/webapi/user', {key: 'show'})
        .then(res => {
          this.userData = []
          for (let i = 0; i < res.length; i++) {
            // let obj = {
            //   id: '',
            //   user_name: '',
            //   user_department: '',
            //   user_times: '',
            //   user_remarks: '',
            //   user_level: ''
            // }
            // obj.user_name = res[i].user_name
            // obj.user_department = res[i].user_department
            // obj.user_times = res[i].user_times
            // obj.user_remarks = res[i].user_remarks
            // obj.user_level = res[i].user_level
            // obj.id = res[i].id
            this.userData.push(res[i])
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
  .user-con .ivu-form-item{
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
