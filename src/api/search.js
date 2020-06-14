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

/**
 * 获取搜索结果
 * @param {*} keyword 搜索关键字
 * @param {*} page 页码
 */
export const getSearchs = (keyword, page) => {
  return ajax({
    method: 'get',
    url: '/app/v1_0/search',
    params: {
      q: keyword,
      page
    }
  })
}
