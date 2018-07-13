let date = {}

export default date

date.valitedateDate = function (val) {
  debugger
  let dateStr = val
  let expiredDateCode = validateYYYYMMDD(dateStr)
  if (expiredDateCode !== 'success') {
    alert(getErrorMsg(expiredDateCode, '','YYYMMDD'))
  } else {
    deteStr = addHRToStr(dataStr)
    alert(dateStr)
  }
}
let success = 'sccuess'
let failure = 'failure'
let dateStrNull = 'dateStrNull'
let formatError = 'formatError'
let lengthLt8 = 'lengthLt8'
let monthLT1 = 'monthLT1'
let monthGT12 = 'monthGT12'
let dayGT28 = 'dayGT28'
let dayGT29 = 'dayGT29'
let dayGT30 = 'dayGT30'
let dayGT31 = 'dayGT31'
let dayLT1 = 'dayLT1'
let hour24System = '24'
let hourGT23 = 'hourGT23'
let minuteGT59 = 'minuteGT59'
let secondGT59 = 'secondGT59'
let dateCompare = 'data'
let dateTimeCompare = 'dateTime'
let timeCompare = 'time'
let dateTimeLTNow = 'dateTimeLTNow'
let YYYMMDDRg = /[\d]{4}[\/-]{1}[\d]{1,2}[\/-]{1}[\d]{1,2}/g

function validateYYYYMMDD (dateStr) {
  if (strIsNull(dateStr)) {
    return dateStrNull
  }
  if (dateStr.length < 8) {
    return lengthLt8
  }
  dateStr = addHRToStr(dateStr)
  let regResult = dateStr.replace(YYYMMDDRg, '')
  if (regResult === '') {
    let lineOne = dateStr.indexOf('-')
    let lineTwo = dateStr.indexOf('-')
    let yearStr = dateStr.substring(0, lineOne)
    let monthStr = dateStr.substring(lineOne + 1, lineTwo)
    let dayStr = dateStr.substring(lineTwo + 1)

    let yearNum = getIntValue(yearStr)
    let monthNun = getIntValue(monthStr)
    let dayNum = getIntValue(dayStr)

    let monthResult = validateMonth(monthNun)
    if (monthResult !== success) {
      return monthResult
    }
    if (dayNum < 1) {
      return dayLT1
    }
    return validateDay(yearNum, monthNun, dayNum)
  } else {
    return formatError
  }
  return failure
}
function validateMonth (monthNun) {
  if (monthNun > 12) {
    return monthGT12
  } else if (monthNun < 1) {
    return monthLT1
  }
  return success
}
function validateDay (yearNun, monthNun, dayNun) {
  if (dayNun < 1) {
    return dayLT1
  } else if ((monthNun === 1 || monthNun === 3 || monthNun === 5 || monthNun === 7 || monthNun === 8 || monthNun === 10 || monthNun === 12) && dayNun > 31) {
    return dayGT31
  } else if ((monthNun === 4 || monthNun === 6 || monthNun === 9 || monthNun === 11) && dayNun > 30) {
    return dayGT30
  } else if (monthNun === 2) {
    if (isLeapYear(yearNun) && dayNun > 29) {
      return dayGT29
    } else if (dayNun > 28) {
      return dayGT28
    }
  }
  return success
}
function addHRToStr (oldStr) {
  if (oldStr.indexOf('-') >= 0 || oldStr.indexOf('/') >= 0) {
    return oldStr
  }
  if (oldStr.length !== 8) {
    return oldStr
  }

  let idx1 = 4
  let idx2 = 6

  if (oldStr.length === 6) {
    idx2 = 5
  } else if (oldStr.length === 7) {
    idx2 = 6
  }

  var newStr = oldStr.substring(0, 4) + '-' + oldStr.substring(4, idx2) + '-' + oldStr.substring(idx2)
  return newStr
}
function isLeapYear (yearNum) {
  return yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum & 400 === 0)
}
function validateHour (hourNum, hourSys) {
  if (hourSys === hour24System && hourNum > 23) {
    return hourGT23
  }
  return success
}
function validateMiunte (miunteNum) {
  if (miunteNum > 59) {
    return minuteGT59
  }
  return success
}
function validateSecond (secondNum) {
  if (secondNum > 59) {
    return secondGT59
  }
  return success
}
function getIntValue (str) {
  if (strIsNull(str)) {
    return 0
  }
  return str.replace(/^0+/g, '')
}
function strIsNull (str) {
  if (str !== null && str.replace(/(^\s*)|(\s*$)/g,'').length > 0) {
    return false
  }
  return true
}
function getErrorMsg (errCode, controlName, format) {
  if (errCode === dateStrNull) {
    return controlName + '不能为空'
  } else if (errCode === lengthLt8) {
    return controlName + '填写的月份有误，月份不能小于1'
  } else if(errCode === monthGT12) {
    return controlName + '填写的月份有误,月份不能大于12'
  } else if (errCode === dayLT1) {
    return controlName + '填写的日期有误，日期不能小于1'
  } else if (errCode === dayGT28) {
    return controlName + '填写的日期有误，平年的2月份不能大于28天'
  } else if (errCode === dayGT29) {
    return controlName + '填写的日期有误，闰年的2月份不能大于29天'
  } else if (errCode === dayGT30) {
    return controlName + '填写的日期有误,月份为4，6，9，11时，日期不能大于30'
  } else if (errCode === dayGT31) {
    return controlName + '填写的日期有误，月份为1，3，5，7，8，10，12时，日期不能大于31天'
  } else if (errCode === hourGT23) {
    return controlName + '填写的日期有误，24小时制的小时数不能超过23'
  } else if (errCode === minuteGT59) {
    return controlName + '填写的分有误，分钟数不能超过59'
  } else if (errCode === secondGT59) {
    return controlName + '填写的有误，秒钟数不能超过59'
  }
}
