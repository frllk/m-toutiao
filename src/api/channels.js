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
