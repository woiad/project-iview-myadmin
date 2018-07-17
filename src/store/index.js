import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    active: '',
    userLevel: {},
    scrollLeft: 0,
    flag: false,
    currentPath: [
      {
        title: '首页',
        path: '/home'
      }
    ],
    pageOpenList: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ]
  },
  mutations: {
    changeActive (state, name) {
      state.active = name
    },
    setCurrentPath (state, item) {
      let obj = {}
      if (state.currentPath.length === 2) {
        state.currentPath.splice(1, 1)
      }
      obj.title = item.name
      obj.path = item.path
      state.currentPath.push(obj)
      if (item.name === 'home_index' && state.currentPath.length === 2) {
        state.currentPath.splice(1, 1)
      }
      for (let i = 0; i < state.currentPath.length; i++) {
        if (item.path === state.currentPath[i].path) {
          state.currentPath[i].path = ''
        }
      }
      if (state.currentPath.length !== 1) {
        state.currentPath[0].path = '/'
      } else if (state.currentPath.length === 1 && item.name === 'home_index') {
        state.currentPath[0].path = ''
      }
    },
    pageOpenedList (state, get) {
      let openedPage = state.pageOpenList.pageOpenedList[get.index]
      if (get.argu) {
        openedPage.argu = get.argu
      }
      if (get.query) {
        openedPage.query = get.query
      }
      state.pageOpenList.splice(get.index, 1, openedPage)
      localStorage.pageOpenList = JSON.stringify(state.pageOpenList)
    },
    increatteTage (state, tagObj) {
      let obj = {}
      obj.title = tagObj.name
      obj.path = tagObj.path
      obj.name = tagObj.name
      for (let i = 0; i < state.pageOpenList.length; i++) {
        if (obj.name === state.pageOpenList[i].name) {
          return false
        }
      }
      state.pageOpenList.push(obj)
      localStorage.pageOpenList = JSON.stringify(state.pageOpenList)
    },
    setOpenList (state) {
      state.pageOpenList = JSON.parse(localStorage.pageOpenList)
    },
    removeTag (state, name) {
      state.pageOpenList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenList.splice(index, 1)
        }
      })
    },
    clearAllTags (state) {
      state.pageOpenList.splice(1)
      localStorage.pageOpenList = JSON.stringify(state.pageOpenList)
    },
    clearOtherTags (state, vm) {
      let currentName = vm.$route.name
      let currentIndex = 0
      state.pageOpenList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
        }
      })
      if (currentIndex === 0) {
        state.pageOpenList.splice(1)
      } else {
        state.pageOpenList.splice(currentIndex + 1)
        state.pageOpenList.splice(1, currentIndex - 1)
      }
      localStorage.pageOpenList = JSON.stringify(state.pageOpenList)
    },
    autoShowTag (name, itemName) {
      if (name === itemName) {
        console.log(this.$refs)
      }
    }
  },
  actions: {},
  modules: {}
})
export default store
