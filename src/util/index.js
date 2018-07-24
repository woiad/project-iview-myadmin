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
util.changeCurrentValue = function (changeData, ref, name) { // 把当前选中的权限替换掉之前的权限
  Object.keys(changeData).forEach((item, index) => {
    for (let i in changeData[item]) {
      let ind = name + i + index
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
util.timeTransform = function (date) {
  let year = date.getFullYear()
  let month = util.addZero(date.getMonth() + 1)
  let data = util.addZero(date.getDate())
  return year + '-' + month + '-' + data
}
util.time = function (date) {
  let year = date.getFullYear()
  let month = util.addZero(date.getMonth() + 1)
  let data = util.addZero(date.getDate())
  let hour = util.addZero(date.getHours())
  let miunte = util.addZero(date.getMinutes())
  let second = util.addZero(date.getSeconds())
  return year + '-' + month + '-' + data + ' ' + hour + ':' + miunte + ':' + second
}
util.addZero = function (time) {
  if (time < 10) {
    return '0' + time
  } else {
    return time
  }
}
util.addDat = function (date, days, flag) {
  let dat = new Date(date)
  dat.setDate(dat.getDate() + days)
  if (flag) {
    return util.timeTransform(dat)
  }
  return util.time(dat)
}
util.dateProces = function (dateStart, dateEnd, timeStart, timeEnd, ip) {
  let obj = {}
  let allDate = {}
  if (dateStart === '' && timeEnd === '' && ip !== '') {
    allDate.time_start = util.time(new Date())
    allDate.time_end = util.addDat(allDate.time_start, 1)
    allDate.ip = ip
    return allDate
  }
  if (dateStart !== '' && dateEnd !== '') {
    obj.date_start = util.timeTransform(dateStart)
    obj.date_end = util.timeTransform(dateEnd)
  }
  if (dateStart === '' && dateEnd === '') {
    allDate.time_start = util.timeTransform(new Date()) + ' ' + '00:00:00'
    allDate.time_end = util.addDat(allDate.time_start, 1, true) + ' ' + '23:59:59'
    return allDate
  }
  if (timeStart === '') {
    allDate.time_start = obj.date_start + ' ' + '00:00:00'
  } else {
    allDate.time_start = obj.date_start + ' ' + timeStart
  }
  if (timeEnd === '') {
    allDate.time_end = obj.date_end + ' ' + '23:59:59'
  } else {
    allDate.time_end = obj.date_end + ' ' + timeEnd
  }
  return allDate
}
