/**
 * 封装本地存储：使用localStorage实现持久化
 */

/**
  * 向localStorage中添加一项数据
  * @param {*} name 属性名
  * @param {*} obj 对象。保存信息
  */
export const setItem = (name, obj) => {
  localStorage.setItem(name, JSON.stringify(obj))
}

/**
 * 从localStorage中获取数据
 * @param {*} name 属性名
 */
export const getItem = name => {
  return JSON.parse(localStorage.getItem(name))
}

/**
 * 从localStorage中移除一项数据
 * @param {*} name 属性名
 */
export const removeItem = name => {
  localStorage.removeItem(name)
}
