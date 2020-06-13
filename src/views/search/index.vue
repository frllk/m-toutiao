<template>
<div>
    <!-- 搜索组件一级路由   $router.back()返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <van-search
      show-action
      placeholder="请输入搜索关键词" shape="round" v-model.trim="keyword"
      @input="hGetSuggestion_with_throttle"
      >
      <div slot="action" @click="hSearch">搜索</div>
    </van-search>

    <!-- 联想建议 -->
    <van-cell-group v-if="keyword">
      <van-cell v-for="(item, idx) in mSuggestions" :key="idx">
        <div @click="hSearchSuggestion(idx)" v-html="item"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell v-for="(item, idx) in history" :key="idx" :title="item">
        <van-icon @click="hDelHistory(idx)" name="cross" />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storage'
import { getSuggestion } from '@/api/search.js'
// 代码简洁之道： 消除  魔术数
const LOCALSTROAGE_SEARCH_NAME = 'searchHistory'

export default {
  name: 'Search',
  data () {
    return {
      timer: null, // 定时器
      history: getItem(LOCALSTROAGE_SEARCH_NAME) || [], // 搜索 历史记录 初始值设置：先从本地数据获取，如果没有则为[]
      suggestion: [],
      keyword: '' // 搜索关键字
    }
  },
  methods: {
    /**
     * 搜索优化：
     * 防抖：可能就执行第一次调用和最后一次调用
     * 节流：会执行多次，只是频率降低了
     */
    // 防抖：
    hGetSuggestion_with_anti_shake () {
      // 以间隔2s为例，如果在2s之内,在当前时间点在加2s
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        console.log('防抖', this.keyword)
        this.hSuggestion()
      }, 0.5 * 1000)
    },
    // 节流
    hGetSuggestion_with_throttle () {
      // 以间隔2s为例
      // 如果这个函数距离上一次被调用的时间之间相隔不到2s，则本次调用不执行代码
      //  只有this.timer是null，才会去开启下一个定时器
      console.log(Date.now(), '关键字变了', this.keyword)
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.timer = null
          console.log('节流', this.keyword)
          this.hSuggestion()
        }, 0.5 * 1000)
      }
    },
    // 删除历史记录
    hDelHistory (idx) {
      this.history.splice(idx, 1)
      setItem(LOCALSTROAGE_SEARCH_NAME, this.history)
    },
    // 点击搜索
    hSearch () {
      this.addHistory(this.keyword)
    },
    // 点击搜索联想建议
    hSearchSuggestion (idx) {
      // 不能传入item，因为item是经过正则替换过的内容。所以直接传入索引，map是映射关系，一一对应
      this.addHistory(this.suggestion[idx])
    },
    addHistory (str) {
      // 1、新加入的数据要放到数组的最前面
      // 2、不能有重复的数据
      const idx = this.history.findIndex(item => item === str)
      if (idx !== -1) {
        // 如果找到下标，表示里面已经有数据str，直接删掉
        this.history.splice(idx, 1)
      }
      this.history.unshift(str)
      setItem(LOCALSTROAGE_SEARCH_NAME, this.history)
    },
    async hSuggestion () {
      try {
        if (!this.keyword) {
          this.suggestion = []
          return
        }
        const res = await getSuggestion(this.keyword)
        this.suggestion = res.data.data.options
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    mSuggestions () {
      return this.suggestion.map(item => item.replace(new RegExp(this.keyword, 'gi'), `<span style="color:red">${this.keyword}</span>`))
    }
  }
}
</script>

<style lang="" scoped>

</style>
