/**
 * 频道相关操作
 */
import ajax from '@/utils/request'

/**
 * 获取用户频道列表
 */
export const getChannels = () => ajax({
  method: 'get',
  url: '/app/v1_0/user/channels'
})

/**
 * 获取全部频道列表
 */
export const getAllChannels = () => ajax({
  method: 'get',
  url: '/app/v1_0/channels'
})

/**
 * 添加用户频道
 * @param {*} channels 频道信息 数组
 * [{id:1,seq:1},{id:2,seq:2}]
 */
export const addChannel = channels => ajax({
  method: 'put',
  url: '/app/v1_0/user/channels',
  data: {
    channels
  }
})
