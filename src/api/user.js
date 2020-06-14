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

/**
 * 关注用户
 * @param {integer} target 关注目标（被关注的用户id）
 */
export const followUser = target => ajax({
  method: 'POST',
  url: '/app/v1_0/user/followings',
  data: {
    target
  }
})

/**
 * 取消关注用户
 * @param {integer} target 关注目标（被关注的用户id）
 */
export const unFollowUser = target => ajax({
  method: 'DELETE',
  url: '/app/v1_0/user/followings/' + target
})
