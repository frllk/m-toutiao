<template>
  <div class="serach-result">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$route.query.keyword + '的搜索结果'"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.art_id"
        :title="item.title"
        @click="$router.push('/article/'+item.art_id.toString())"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearchs } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  methods: {
    async onLoad () {
      try {
        // 1、发送请求  2、加载状态结束   3、数据全部加载完成   4、更新页码
        const result = await getSearchs(this.$route.query.keyword, this.page)
        this.list.push(...result.data.data.results)
        this.loading = false
        if (result.data.data.results.length === 0) {
          this.finished = true
        }
        this.page++
      } catch (error) {
        console.log(error)
        this.$toast.fail('获取数据失败!')
      }

      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.serach-result {
  height: 100%;
  overflow: auto;
  .article-list {
    margin-top: 39px;
  }
}
</style>
