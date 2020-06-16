/**
 * 封装axios请求模块：对axios进行二次封装
 * 1、指定基地址
 * 2、通过请求拦截器设置token
 * 3、通过响应拦截器设置大数处理
 */
import store from '@/store/index.js'
import axios from 'axios'
import JSONBig from 'json-bigint'
import router from '@/router/index.js'
// 一个项目可能有多个基地址，所以用create方式创建axios实例
const instance1 = axios.create({
  // baseURL: 'http://api-toutiao-web.itheima.net',
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

// 添加一个响应拦截器  ---  token过期处理
instance1.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, async function (error) {
  // Do something with response error
  // 判断状态码
  // console.dir('interceptors.response===========', error)
  if (error.response.status === 401) {
    try {
      const refreshToken = store.state.tokenInfo.refresh_token
      // console.log('refreshToken===========', refreshToken)
      if (refreshToken) {
        // 有refresh_token,发送请求,重新获取有效期2小时的token,更新vuex
        // 1.1 发送请求使用axios发送,不能使用instance1,instance1会自动添加token信息
        const result = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        // 1.2 获取到新的token,更新vuex
        const newToken = result.data.data.token
        // console.log('newToken========', newToken)
        store.commit('mUpdateToken', newToken)
        // 1.3 重新发送请求
        // console.log(error.config)
        return instance1(error.config)
      } else {
        // 如果没有refresh_token,跳转到登录,登录成功跳转目标页
        console.log('如果没有refresh_token,跳转到登录,登录成功跳转目标页')
        // console.log('router', router.currentRoute)
        router.push({ path: '/login', query: { backto: router.currentRoute.fullPath } })
      }
    } catch (error) {
      // refresh_token失效,直接跳转登录
      console.log('catch=============')
      router.push({ path: '/login', query: { backto: router.currentRoute.fullPath } })
    }
  } else {
    return Promise.reject(error)
  }
})

// 按需导出
export { instance1, instance2 }
// 默认导出
export default instance1
