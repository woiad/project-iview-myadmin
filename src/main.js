// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store/index'
import {fetch, post} from './util/http'

Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
