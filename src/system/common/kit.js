/**
 * 公共方法
 */
'use strict'
import axios from 'axios'
import enquireJs from 'enquire.js'
export const kit = {}
/**
 * axios网络请求
 * @param  {string} url 请求的URL
 * @param  {Object} param 请求的参数
 * @param  {string} method 请求的方法,默认 POST
 * @param  {string} success 正确回调
 * @param  {string} error 错误回调
 */
kit.axios = function (url, param = {}, method = 'post', responseType = 'json', success, error) {
  if (kit.isEmpty(url)) {
    throw new Error('request url is empty')
  }
  param = kit.filter(param)
  axios.request({
    method: method,
    url: url,
    responseType: responseType,
    data: param
  }).then((res) => {
    if (typeof success === 'function') {
      success(res)
    }
  }).catch((err) => {
    if (typeof error === 'function') {
      error(err)
      return false
    }
  })
}

/**
 * 判断是否为空
 * @param {any} obj 需要判断的参数
 */
kit.isEmpty = function (obj) {
  if (obj === undefined || obj === null || obj === '') return true
  if (kit.isRegExp(obj)) {
    return false
  } else if (kit.isDate(obj)) {
    return false
  } else if (kit.isError(obj)) {
    return false
  } else if (kit.isArray(obj)) {
    return obj.length === 0
  } else if (kit.isString(obj)) {
    return obj.length === 0
  } else if (kit.isNumber(obj)) {
    return obj === 0
  } else if (kit.isBoolean(obj)) {
    return !obj
  } else if (kit.isObject(obj)) {
    for (const key in obj) {
      return false && key // only for eslint
    }
    return true
  }
  return false
}

/**
 * 格式化日期
 */
kit.dateTime = function (format, date = new Date()) {
  if (typeof date.format === 'function') {
    return date.format(format)
  }
  if (date && kit.isString(date)) {
    const dateString = date
    date = new Date(Date.parse(date))
    if (isNaN(date.getTime()) && !format) {
      format = dateString
      date = new Date()
    }
  }
  format = format || 'YYYY-MM-DD HH:mm:ss'
  const fn = d => {
    return ('0' + d).slice(-2)
  }
  const d = new Date(date)
  const formats = {
    YYYY: d.getFullYear(),
    MM: fn(d.getMonth() + 1),
    DD: fn(d.getDate()),
    HH: fn(d.getHours()),
    mm: fn(d.getMinutes()),
    ss: fn(d.getSeconds())
  }
  return format.replace(/([a-z])\1+/ig, a => {
    return formats[a] || a
  })
}

/**
 * 判断是否为数组
 */
kit.isArray = function (arg) {
  if (Array.isArray) {
    return Array.isArray(arg)
  }
  return objectToString(arg) === '[object Array]'
}

/**
 * 判断是否为布尔型
 */
kit.isBoolean = function (arg) {
  return typeof arg === 'boolean'
}

/**
 * 判断是否为NULL
 */
kit.isNull = function (arg) {
  return arg === null
}

/**
 * 判断是否为NULL/undefined
 */
kit.isNullOrUndefined = function (arg) {
  return arg == null
}

/**
 * 判断是否为number
 */
kit.isNumber = function (arg) {
  return typeof arg === 'number'
}

/**
 * 判断是否为字符串
 */
kit.isString = function (arg) {
  return typeof arg === 'string'
}

/**
 * 判断是否为undefined
 */
kit.isUndefined = function (arg) {
  return arg === void 0
}

/**
 * 判断是否为正则
 */
kit.isRegExp = function (arg) {
  return objectToString(arg) === '[object RegExp]'
}

/**
 * 判断是否为对象
 */
kit.isObject = function (arg) {
  return typeof arg === 'object' && arg !== null
}

/**
 * 判断是否为时间对象
 */
kit.isDate = function (d) {
  return objectToString(d) === '[object Date]'
}

/**
 * 判断是否为错误对象
 */
kit.isError = function (e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error)
}

/**
 * 判断是否为方法
 */
kit.isFunction = function (arg) {
  return typeof arg === 'function'
}

/**
 * 判断是否为基本类型
 */
kit.isPrimitive = function (arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' || // ES6 symbol
         typeof arg === 'undefined'
}

/**
 * 深拷贝对象，如果 key 相同,那么后面的值会覆盖前面的值。
 */
kit.extend = function (target = {}, ...args) {
  for (const item of args) {
    for (const key in item) {
      target[key] = target[key] && target[key].toString() === '[object Object]' ? kit.extend(target[key], item[key]) : target[key] = item[key]
    }
  }
  return target
}

/**
 * 过滤参数
 */
kit.filter = function (params) {
  for (let key in params) {
    if (typeof params[key] === 'string') {
      params[key] = params[key].trim() // 去空格
    }
    if (params[key] === undefined) {
      console.log(key, params[key])
      delete params[key]
    }
    if (params[key] === null) {
      params[key] = ''
    }
  }
  return params
}

/**
 * 根据规则获取参数
 * @param {string} rule 规则, 如 data.data.token
 */
kit.getRuleParam = function (data = {}, rule = '') {
  if (kit.isEmpty(data)) { // 源数据为空
    return null
  }
  let value
  const ruleArr = rule.split('.')
  for (const item of ruleArr) {
    value = data[item]
  }
  return value
}

/**
 * 解析json
 * @param {string} str json字符串
 */
kit.parseJSON = function (str) {
  if (kit.isObject(str)) {
    return str
  }
  try {
    return JSON.parse(str)
  } catch (e) {

  }
  return null
}

/**
 * 缓存/读取缓存
 * @param {string} key 缓存key
 * @param {string} value 缓存值 默认为 undefined,如果为 null,则是删除该缓存
 */
kit.cache = function (key = '', value = undefined) {
  if (kit.isEmpty(key)) {
    return false // key不存在
  }
  if (kit.isUndefined(value)) {
    // 为读取缓存
    return kit.parseJSON(localStorage.getItem(key))
  }
  if (kit.isNull(value)) {
    // 删除缓存
    return localStorage.removeItem(key)
  }
  // 设置缓存
  return localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 清除所有缓存
 */
kit.clearCache = function () {
  localStorage.clear()
}

/**
 * 查询屏幕
 */
kit.enquireScreen = function (call) {
  const hanlder = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', hanlder)
}

/**
 * 设置tile
 */
kit.setTitle = function (title) {
  window.document.title = title
}

/**
  判断是否有页面权限
 */
kit.isPageAuthority = function (path) {
  const pageBizList = kit.cache('pageBizList') || []
  path = path.replace(/^\/|\/$/g, '')
  if (pageBizList.indexOf(path) > -1) {
    return true // 有权限
  }
  return false
}

/**
 * 下载文件
 */
kit.downloadFile = function (fileName, content, blobOptions = {}) {
  var blob = new Blob([content], blobOptions)
  var a = document.createElement('a')
  a.innerHTML = fileName
  // 指定生成的文件名
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  var evt = document.createEvent('MouseEvents')
  evt.initEvent('click', false, false)
  a.dispatchEvent(evt)
  document.body.removeChild(a)
}

function objectToString (o) {
  return Object.prototype.toString.call(o)
}
