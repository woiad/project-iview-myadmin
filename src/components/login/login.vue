<template>
  <div class="login-wrapper" @keydown.enter="handleSubmit">
    <div class="login-bg"></div>
    <div class="form">
      <div class="form-header">
        <p><Icon type="login-in"></Icon><span>欢迎-登录</span></p>
      </div>
      <div class="form-body">
        <template>
          <i-form ref="loginForm" :model="formInline" :rules="ruleInline">
            <Form-item prop="user">
              <i-input type="text" v-model="formInline.user" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </i-input>
            </Form-item>
            <Form-item prop="password">
              <i-input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
              </i-input>
            </Form-item>
            <Form-item>
              <i-button  type="primary" @click="handleSubmit" long>Signin</i-button>
            </Form-item>
          </i-form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import cookies from 'js-cookie'
export default {
  name: 'login',
  data () {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          {required: true, message: 'Please fill in the username', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'Please fill in the password', trigger: 'blur'},
          {type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          cookies.set('user_accounts', this.formInline.user)
          this.$Message.success('Success !')
          this.$router.push({name: 'home'})
        } else {
          this.$Message.error('Fail ！')
        }
      })
    }
  }
}
</script>

<style scoped>
  .login-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .login-wrapper .login-bg{
    position: fixed;
    width: 100%;
    height: 100%;
    background: url(./img/017.jpg) no-repeat;
    background-size: cover;
    background-position: center;
  }
  .form{
    position: absolute;
    margin: 0 auto;
    top: 50%;
    right: 16%;
    width: 300px;
    transform: translateY(-60%);
    background: #fff;
    border-radius: 4px;
  }
  .form .form-header{
    margin-bottom: 15px;
    padding: 14px 16px;
    border: 1px solid #e9eaec;
  }
  .form .from-header p{
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }
  .form .from-header p span {
    padding-left: 5px;
  }
  .form .form-body{
    padding: 0 20px;
  }
  @media screen and (max-width: 500px) {
    .form{
      width: auto;
      right: 18%;
    }
  }
</style>
