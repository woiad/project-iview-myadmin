<template>
  <div class="home-container">
    <Row>
      <Col span="8" :xs="{span: 20}" :sm="{span: 12}" :md="{span: 8}" :lg="{span: 8}">
        <Card>
          <Row type="flex" class="user-info">
            <Col span="10">
              <Row class-name="made-child-con-middle" type="flex" align="middle">
                <img class="avator-img" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg">
              </Row>
            </Col>
            <Col span="12" style="padding-left:6px">
              <Row class-name="made-child-con-middle" type="flex" align="middle">
                <div>
                  <b class="card-user-infor-name">{{user.user_name}}</b>
                  <p>super admin</p>
                </div>
              </Row>
            </Col>
          </Row>
          <div class="line-gray"></div>
          <Row class="margin-top-8">
            <Col span="10"><p class="notwrap">上次登录时间:</p></Col>
            <Col class="padding-left-8 load-time" :xs="14" :md="14" :sm="14" :lg="12">2017.09-12-13:32:30</Col>
          </Row>
          <Row class="margin-top-8">
            <Col span="10"><p class="norwrap">上次登陆地点:</p></Col>
            <Col span="12" class="padding-left-8 load-site" :xs="14" :md="14" :sm="14" :lg="12">北京</Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import cookies from 'js-cookie'
export default {
  name: 'home',
  data () {
    return {
      userName: cookies.get('user_accounts'),
      user: {}
    }
  },
  mounted () {
    this.$post('/webapi/user', {key: 'level'})
      .then(res => {
        this.user = res
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
  .home-container{
    margin: 10px 0 0 10px;
  }
  .user-info{
    height: 135px;
    align-items: center;
  }
  .user-info .avator-img{
    display: block;
    width: 80%;
    max-width: 100px;
    height: auto;
  }
  .user-info .card-user-infor-name{
    font-size: 2em;
    color: #2b8cf0
  }
  .line-gray{
    height: 0;
    border-bottom: 2px solid #dcdcdc;
  }
  .margin-top-8{
    margin-top: 8px;
  }
</style>
