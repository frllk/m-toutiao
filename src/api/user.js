/**
 * 封装用户相关操作
 */
import ajax from '@/utils/request.js'

/**
 * 登录
 * @param {*} userinfo 登录信息 { mobile, code }  手机号，验证码
 */
export const userLogin = userinfo => {
  return ajax({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data: userinfo
  })
}

/**
 * 获取用户个人信息
 */
export const userGetInfo = () => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/user/profile'
  })
}
