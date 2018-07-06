let util = {}

export default util

util.title = function (title) {
  title = title || 'Admin'
  window.document.title = title
}
util.toDefaultPage = function (routers, to, router, next) {
  let len = routers.length
  let handle = true
  for (let i = 0; i < len; i++) {
    if (routers[i].name === to.name && routers[i].children && routers[i].redirect === undefined) {
      router.replace({
        name: routers[i].children[0].name
      })
      handle = false
      next()
      break
    }
  }
  if (handle) {
    next()
  }
}
util.evil = function (fn) {
  let Fn = Function
  return new Fn('return' + fn)()
}
util.chartToBol = function (item) {
  for (let j in item) {
    for (let k in item[j]) {
      if (item[j][k] === 'true' || item[j][k] === true) {
        item[j][k] = true
      } else {
        item[j][k] = false
      }
    }
  }
  return item
}
util.subnitMessProcess = function (data) {
  console.log(data)
}
