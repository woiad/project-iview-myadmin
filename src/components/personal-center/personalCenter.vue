<template>
  <div class="personalContainer">
    <Row>
      <Col :sm="12" :xs="20" :lg="8" :md="8">
        <Card>
          <p slot='title'>
            <Icon type="person"></Icon>
            个人信息
          </p>
          <div class="personalWrapper">
            <div class="personalAccount">
              <span class="tip">用户账号: </span>
              <span class="personal account">{{personalMess.user_accounts}}</span>
            </div>
            <div class="personalDepartment">
              <span class="tip">用户部门: </span>
              <span class="personal department">{{personalMess.user_department}}</span>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'personalCenter',
  data () {
    return {
      personalMess: {}
    }
  },
  mounted () {
    axios.get('http://113.105.246.233:9005/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/api/webapi/user').then((response) => {
      this.personalMess = response.data[0]
      console.log(this.personalMess)
    })
  }

}
</script>

<style scoped>
  .personalContainer{
    margin: 10px 0 0 10px;
  }
  .personalAccount{
    margin-bottom: 24px;
  }
  .tip{
    display: inline-block;
    width: 100px;
    text-align: right;
    font-size: 12px;
    color: #495060;
    text-space: 15px;
    padding: 10px 12px 0 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
