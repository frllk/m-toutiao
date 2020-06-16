/**
 * 时间处理
 */
import dayjs from 'dayjs'
import rTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(rTime)
dayjs.locale('zh-cn') // 改变语言配置 (全局)

/**
 * 时间转换
 * @param {*} val 时间
*/
export const formatDate = val => {
  return dayjs(val).format('YYYY-MM-DD')
}
/**
 * 到现在的相对时间
 * @param {*} val 时间
 */
export const relativeTime = val => {
  return dayjs(val).toNow()
}
