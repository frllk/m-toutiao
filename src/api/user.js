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

/**
 * 获取用户自己的信息
 */
export const getUserInfo = () => ajax({
  method: 'get',
  url: '/app/v1_0/user'
})
/**
 * 修改用户信息
 * @param {*} obj 参数对象
 * name 昵称
 * gender 性别，0-男，1-女
 * birthday 生日，格式'2018-12-20'
 */
export const updateUserInfo = obj => ajax({
  method: 'PATCH',
  url: '/app/v1_0/user/profile',
  data: obj
})

/**
 * 编辑用户照片资料（头像、身份证照片）
 * @param {*} data 修改对象
 * photo  file  头像
 */
export const updateUserPhoto = data => ajax({
  method: 'PATCH',
  url: '/app/v1_0/user/photo',
  data
})
