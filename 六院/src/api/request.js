/*
 * @Author: kaiback__zgt_1430666237@qq.com
 * @Date: 2018-05-09 14:38:40
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-06-11 17:24:55
 */

// import Vue from 'vue'
import axios from 'axios'

// 创建axios实例
const ajx = axios.create({
  timeout: 1000 * 20,
  withCredentials: true
})

// request拦截器
ajx.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
ajx.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    // Vue.cookie.delete('token')
  }
  if (response.data) {
    return response.data
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default ajx
