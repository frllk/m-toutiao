import Vue from 'vue'
import Vuex from 'vuex'

import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 保存公共数据: 设置初始值的时候首先查看本地存储中是否有token信息，如果没有则设初值为{}
    tokenInfo: getItem('tokenInfo') || {}
  },
  mutations: {
    // 设置token信息：补充一个mutation来设置token
    mSetTokenInfo (state, tokenObj) {
      state.tokenInfo = tokenObj
      // 把这个token信息做持久化
      setItem('tokenInfo', tokenObj)
    }
  }
})
