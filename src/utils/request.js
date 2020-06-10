/**
 * 封装axios请求模块：对axios进行二次封装
 * 1、指定基地址
 * 2、通过请求拦截器设置token
 * 3、通过响应拦截器设置大数处理
 */
import store from '@/store/index.js'
import axios from 'axios'
import JSONBig from 'json-bigint'

// 一个项目可能有多个基地址，所以用create方式创建axios实例
const instance1 = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  // 处理请求返回的数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    try {
      // 如果没有遇到错误，就返回 JSONbig处理之后的数据
      return data ? JSONBig.parse(data) : {}
    } catch (err) {
      console.log(data)
      console.log('JSONbig转换出错', err)
      return data
    }
  }]
})

const instance2 = axios.create({
  baseURL: 'https://some-domain.com/api/'
})

// Add a request interceptor ===>  请求拦截器中统一设置token
instance1.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = store.state.tokenInfo.token
  config.headers = {
    Authorization: `Bearer ${token}`
  }
  // console.log(config)
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error);
// });

// 按需导出
export { instance1, instance2 }
// 默认导出
export default instance1
