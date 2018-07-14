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
util.evil = function (fn) { // 解决 eval 报错
  let Fn = Function
  return new Fn('return' + fn)()
}
util.chartToBol = function (item) { // 把字符 'true' 或 'false' 转换成布尔值
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
util.changeCurrentValue = function (changeData, ref) { // 把当前选中的权限替换掉之前的权限
  Object.keys(changeData).forEach((item, index) => {
    for (let i in changeData[item]) {
      let ind = i + index
      changeData[item][i] = ref[ind][0].currentValue
    }
  })
  return changeData
}
util.changeValue = function (unchangeData, changeData) { // 检测单签权限的值是否更改
  let changeFlag = false
  for (let i in unchangeData) {
    for (let j in unchangeData[i]) {
      if (unchangeData[i][j] !== changeData[i][j]) {
        changeFlag = true
        return changeFlag
      }
    }
  }
  return changeFlag
}
util.regIp = function (ip) {
  let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (reg.test(ip)) {
    return true
  } else {
    return false
  }
}
