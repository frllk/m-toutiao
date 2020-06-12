/**
 * 搜索模块
 */
import ajax from '@/utils/request.js'

/**
 * 获取搜索联想建议
 * @param {String} keyword 关键字
 */
export const getSuggestion = keyword => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q: keyword
    }
  })
}
