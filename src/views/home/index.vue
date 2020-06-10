<template>
  <div class='index'>
    <!-- 通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签 -->
    <van-tabs v-model="activeIndex">
      <van-tab v-for="(item,idx) in channels" :key="idx" :title="item.name">
        <article-list @showMoreAction="hShowMoreAction" :channel="item"></article-list>
        <van-popup v-model="show" :style="{ width: '80%' }" >
          <more-action @dislike="hDislike"></more-action>
        </van-popup>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ArticleList from '@/views/home/articleList'
import MoreAction from '@/views/home/moreAction'
import { getChannels } from '@/api/channels.js'
import { dislikeArticle } from '@/api/article.js'
export default {
  name: 'Home',
  props: [],
  components: { ArticleList, MoreAction },
  data () {
    return {
      activeIndex: 0, // 当前激活标签对应的索引值
      articleId: 0, // 文章id
      show: false, // 是否显示弹层
      channels: [] // 频道列表
    }
  },
  methods: {
    async loadChannels () {
      const result = await getChannels()
      this.channels = result.data.data.channels
    },
    // 接收子组件articleList中抛出的事件
    hShowMoreAction (obj) {
      console.log(obj)
      this.show = true
      this.articleId = obj
    },
    // 处理子组件moreAction抛出的事件
    async hDislike () {
      try {
        // 1、发送请求，调用接口
        await dislikeArticle(this.articleId)
        // 2、关闭弹层
        this.show = false
        // 3、删除本地数据
        // 事件总线处理本地数据删除
        const obj = {
          articleId: this.articleId,
          channelId: this.channels[this.activeIndex].id
        }
        this.$eventBus.$emit('delArticle', obj)
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {},
  created () {
    this.loadChannels()
  },
  mounted () {}
}
</script>

<style scoped lang='less'></style>
