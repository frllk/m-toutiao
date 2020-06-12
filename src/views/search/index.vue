<template>
<div>
    <!-- 搜索组件一级路由   $router.back()返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <van-search
      show-action
      placeholder="请输入搜索关键词" shape="round" v-model.trim="keyword"
      @input="hSuggestion"
      >
      <div slot="action" >搜索</div>
    </van-search>

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell v-for="(item, idx) in suggestion" :key="idx" :title="item" icon="search" />
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group>
      <van-cell title="历史记录">
      </van-cell>
      <van-cell title="单元格">
        <van-icon name="close" />
      </van-cell>
      <van-cell title="单元格">
        <van-icon name="close" />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search.js'
export default {
  name: 'Search',
  data () {
    return {
      suggestion: [],
      keyword: '' // 搜索关键字
    }
  },
  methods: {
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
  }
}
</script>

<style lang="" scoped>

</style>
