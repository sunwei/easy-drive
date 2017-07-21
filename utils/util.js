function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDateDiff (dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var year = day * 365;

  var now = new Date();
  console.log('????')
  console.log(now)
  console.log(dateTimeStamp)
  console.log(dateTimeStamp.getTime())

  var diffValue = now.getTime() - dateTimeStamp.getTime();
  if(diffValue < 0){
    //非法操作
    return '数据出错';
  }
  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  if(yearC >= 1){
    result = parseInt(yearC) + '年以前';
  }else if(monthC >= 1){
    result = parseInt(monthC) + '个月前';
  }else if(weekC >= 1){
    result = parseInt(weekC) + '星期前';
  }else if(dayC >= 1){
    result = parseInt(dayC) + '天前';
  }else if(hourC >= 1){
    result = parseInt(hourC) + '小时前';
  }else if(minC >= 5){
    result = parseInt(minC) + '分钟前';
  }else{
    result = '刚刚发表';
  }
  return result;
}

function getDateDistanceOfHours(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;

  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return 0;
  } else {
    var hourC = diffValue / hour;
    return hourC
  }
}

function setTimeReadable(timeStr){
  return this.getDateDiff(new Date(timeStr))
}

function isMobilePhone(phoneStr){
  return /^(\+?0?86\-?)?1[345789]\d{9}$/.test(phoneStr)
}

// 2017-07-21 01:54:26
function newDateFromString(dateStr){
  var dateStrArr = dateStr.split(' ')
  var dateArr = dateStrArr[0].split('-')
  var timeArr = dateStrArr[1].split(':')

  return new Date(parseInt(dateArr[0]), parseInt(dateArr[1]) - 1, parseInt(dateArr[2]), parseInt(timeArr[0]) + 8, parseInt(timeArr[1]), parseInt(timeArr[2]))
}

module.exports = {
  formatTime: formatTime,
  getDateDiff: getDateDiff,
  getDateDistanceOfHours: getDateDistanceOfHours,
  setTimeReadable: setTimeReadable,
  isMobilePhone: isMobilePhone,
  newDateFromString: newDateFromString
}

