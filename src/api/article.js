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

/**
 * 对文章不喜欢
 * @param {*} articleId 文章id
 */
export const dislikeArticle = articleId => ajax({
  method: 'POST',
  url: '/app/v1_0/article/dislikes',
  data: {
    target: articleId
  }
})

/**
 * 举报文章
 * @param {*} articleId 文章id
 * @param {*} type 举报类型
 * @param {*} remark 其他文字说明
 */
export const reportArticle = (articleId, type, remark = '') => ajax({
  method: 'POST',
  url: '/app/v1_0/article/reports',
  data: {
    target: articleId,
    type,
    remark
  }
})

/**
 * 获取文章详情
 * @param {*} articleId 文章编号
 */
export const getArticleInfo = articleId => ajax({
  method: 'get',
  url: '/app/v1_0/articles/' + articleId
})

/**
 * 对文章点赞
 * @param {*} articleId 文章编号
 */
export const addLike = target => ajax({
  method: 'post',
  url: '/app/v1_0/article/likings',
  data: {
    target
  }
})

/**
 * 取消对文章点赞
 * @param {integer} target 文章id
 */
export const deleteLike = target => ajax({
  method: 'delete',
  url: '/app/v1_0/article/likings/' + target
})

/**
 * 对文章不喜欢
 * @param {*} articleId 文章编号
 */
export const addDisLike = target => ajax({
  method: 'post',
  url: '/app/v1_0/article/dislikes',
  data: {
    target
  }
})

/**
 * 取消对文章不喜欢
 * @param {integer} target 文章id
 */
export const deleteDisLike = target => ajax({
  method: 'delete',
  url: '/app/v1_0/article/dislikes/' + target
})
