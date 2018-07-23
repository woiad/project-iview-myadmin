import Vue from 'vue'
import Router from 'vue-router'
import {routers} from './router'
import cookies from 'js-cookie'
import iView from 'iview'
import util from '.././util/index'
Vue.use(Router)
Vue.use(iView)
export const router = new Router({
  routes: routers
})
let isIndex = false
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  util.title(to.meta.title)
  next()
  // let login = cookies.get('user_accounts')
  // if (!isIndex && login === undefined) {
  //   if (to.path !== '/home' && login) {
  //     isIndex = true
  //     next({name: 'home'})
  //   } else if (to.path === '/home' || login === undefined) {
  //     isIndex = true
  //     next({name: 'login'})
  //   }
  // } else {
  //   util.toDefaultPage(routers, to, router, next)
  // }
  // if (login === undefined && to.name !== 'login') {
  //   next(false)
  // } else {
  //   next()
  // }
})
router.afterEach((to) => {
  iView.LoadingBar.finish()
})
