const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const color = function () {
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += (Math.random() * 16 | 0).toString(16);
  }
  return color;
}

module.exports = {
  color: color,
  formatTime: formatTime
}