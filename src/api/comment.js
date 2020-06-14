/**
 * 文章评论相关方法
 */
import ajax from '@/utils/request'

/**
 * 获取评论或评论回复
 * @param {object} params 参数对象
 * type 是 a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
 * source 是 源id，文章id或评论id
 * offset 否 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
 * limit 否 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
 */
export const getComments = params => ajax({
  method: 'get',
  url: '/app/v1_0/comments',
  params
})

/**
 * 添加评论或评论回复
 * @param {*} data 参数对象
 * target integer  评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
 * content string 评论内容
 * art_id  integer 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
 */
export const addComment = data => ajax({
  method: 'post',
  url: '/app/v1_0/comments',
  data
})

/**
 * 对评论或评论回复点赞
 * @param {integer} target 点赞的评论id
 */
export const addCommentLike = target => ajax({
  method: 'POST',
  url: '/app/v1_0/comment/likings',
  data: {
    target
  }
})

/**
 * 取消对评论或评论回复点赞
 * @param {integer} target 点赞的评论id
 */
export const deleteCommentLike = target => ajax({
  method: 'DELETE',
  url: '/app/v1_0/comment/likings/' + target
})
