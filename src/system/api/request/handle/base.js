/**
 * 请求基础处理器
 * 处理请求前(before),错误回调(error),正确回调(success)
 */
'use strict'
export default {
  /**
   * 请求前
   * @param {string} url url
   * @param {string} params 参数
   */
  before (url, params) {

  },

  /**
   * 请求后正常回调
   * @param {object} res 结果
   */
  success (res) {

  },

  /**
   * 错误回调处理
   * @param {any} err 错误
   */
  error (err) {
    console.log(err)
  }
}
