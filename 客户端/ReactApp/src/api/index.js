import axios from 'axios'
// 创建axios实例
const ajx = axios.create({
  baseURL: 'http://192.168.30.50:3366',
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
  if (response.data) {
    return response.data
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default ajx