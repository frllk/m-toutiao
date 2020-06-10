<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- {{this.channel.name}} -->
      <!--
      1、van-list自带上拉加载更多的效果
      2、原理
          1）数据项在list中
          2）在显示数据时，如果当前的数据内容不够一屏，它会自动调用onLoad去加载数据。
              在onLoad中，通过ajax取回数据
                - 添加到list
                - 把loading手动的设置为false
                - 如果所有的数据全部加载完成，则把finished 设置为true
          3）如果手动向上拉，则也会调用onLoad
      -->
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
      <!-- title  自定义左侧 title 的内容
      label 自定义标题下方 label 的内容 -->
      <van-cell v-for="(item, idx) in list" :key="idx" :title="item.title">
        <div slot="label">
          <!-- 图文.... -->
          <!-- 图片 van-grid
            当前文章有几张图，就用几个宫格
          -->
          <van-grid :column-num="item.cover.images.length">
            <van-grid-item v-for="(item, idx) in item.cover.images" :key="idx">
              <van-image lazy-load :src="item" />
            </van-grid-item>
          </van-grid>
          <!-- 文字说明 -->
          <div class="meta">
            <span>{{item.aut_name}}</span>
            <span>{{item.comm_count}}评论</span>
            <span>{{item.pubdate | relativeTime}}</span>
            <span class="close" @click="hClose(item)" v-if="$store.state.tokenInfo.token"><van-icon name="close" /></span>
          </div>
        </div>
      </van-cell>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
export default {
  name: 'ArticleList',
  props: ['channel'],
  data () {
    return {
      isLoading: false, //  是否下拉刷新加载更多
      list: [],
      loading: false, // 是否上拉刷新
      finished: false, // 是否加载完成状态
      timestamp: null // 在发请求之后，检查这个timestamp，如果有值，则使用 ；如果没有值，则用当前的时间戳
    }
  },
  methods: {
    async onRefresh () {
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
      try {
        // 发请求取回最新的数据
        const result = await getArticle(this.channel.id, this.timestamp)
        // 把数据添加到list中
        // 添加到list的开头!
        const arr = result.data.data.results
        this.list.unshift(...arr)
        // 更新下拉刷新的状态
        this.loading = false
        // 提示
        this.$toast.success('加载成功' + arr.length + '条')
      } catch (err) {
        console.log(err)
        this.$toast.fail('加载失败')
      }
    },
    // onLoad的执行时机：
    // 1、页面打开，不足一屏，会自动调用
    // 2、手动上拉
    async onLoad () {
      try {
        // console.log('当前数据的条数', this.list.length, '加载新数据')
        if (!this.timestamp) {
          this.timestamp = Date.now()
        }
        const result = await getArticle(this.channel.id, this.timestamp)
        //  保存本次请求的回来的数据中的时间戳，以便下次传入
        this.timestamp = result.data.data.pre_timestamp
        const arr = result.data.data.results
        // 1、把请求结果添加到list中
        this.list.push(...arr)
        // 2、加载状态结束
        this.loading = false
        // 3、判断数据是否全部加载完成  如果本次加载不到数据了，则说明所有的数据加载完成
        if (arr.length === 0) {
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('加载失败')
      }
      // // 异步更新数据
      // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
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
      // }, 1000)
    },
    hClose (article) {
      this.$emit('showMoreAction', article.art_id.toString())
    }
  },
  created () {
    this.$eventBus.$on('delArticle', obj => {
      // console.log(obj)
      const { articleId, channelId } = obj
      if (this.channel.id !== channelId) {
        console.log('频道不同，与我无关===', channelId)
        return
      }
      console.log('在list中找出===', articleId)
      // 1、找出索引  2、找到下标之后,删除对应文章
      const idx = this.list.findIndex(item => item.art_id.toString() === articleId)
      if (idx !== -1) {
        this.list.splice(idx, 1)
      }
    })
  }
}
</script>

<style scoped lang='less'>
.meta {
  display: flex;
  span{
    margin-right: 10px;
  }
  .close{
    // 让它在最右边
    // 它的父级容器是flex的，给当前元素设置左外边距为auto，会让这个元素在父级容器
    // 的最右边
    margin-left:auto;
  }
}
</style>
