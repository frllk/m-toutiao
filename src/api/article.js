/**
 * 文章相关操作
 */

import ajax from '@/utils/request'

/**
 * 频道新闻推荐_V1.1
 * @param {*} channel_id 频道id
 * @param {*} timestamp 时间戳整数 单位毫秒
 */
export const getArticle = (channelId, timestamp) => ajax({
  method: 'get',
  url: '/app/v1_1/articles',
  params: {
    channel_id: channelId,
    timestamp,
    with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
  }
})
