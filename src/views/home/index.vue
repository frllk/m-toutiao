<template>
  <div class='index'>
    <!-- 通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签 -->
    <van-tabs v-model="activeIndex">
      <van-tab v-for="(item,idx) in channels" :key="idx" :title="item.name">
        <article-list @showMoreAction="hShowMoreAction" :channel="item"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 频道列表 开关 通过定位 -->
    <div class="bar-btn">
        <van-icon @click="showChannelEdit=!showChannelEdit" name="wap-nav" size="24" />
    </div>
    <!-- 更多操作 -->
    <van-popup v-model="show" :style="{ width: '80%' }" >
      <more-action ref="refMoreAction" @dislike="hDislike" @report="hReport"></more-action>
    </van-popup>
    <!-- 频道组件 -->
    <van-popup v-model="showChannelEdit" :style="{ width: '80%' }" >
      <channel-edit :channels="channels"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from '@/views/home/articleList'
import MoreAction from '@/views/home/moreAction'
import channelEdit from '@/views/home/channelEdit'
import { getChannels } from '@/api/channels.js'
import { dislikeArticle, reportArticle } from '@/api/article.js'
export default {
  name: 'Home',
  props: [],
  components: { ArticleList, MoreAction, channelEdit },
  data () {
    return {
      showChannelEdit: false, // 是否显示频道组件
      activeIndex: 0, // 当前激活标签对应的索引值
      articleId: 0, // 文章id
      show: false, // 是否显示弹层 (更多操作)
      channels: [] // 频道列表
    }
  },
  methods: {
    // 举报文章
    async hReport (reportTypeId) {
      try {
        // 1、发送请求
        await reportArticle(this.articleId, reportTypeId)
        // 2、关闭弹层
        this.show = false
        // 3、删除文章
        this.delArticle()
      } catch (error) {
        console.log(error)
      }
    },
    async loadChannels () {
      const result = await getChannels()
      this.channels = result.data.data.channels
    },
    // 接收子组件articleList中抛出的事件
    hShowMoreAction (obj) {
      // console.log(obj)
      // 1、显示弹层
      this.show = true
      // 2、保存文章编号
      this.articleId = obj
      // 3、确保moreAction组件中的isReport=false
      this.$refs.refMoreAction && (this.$refs.refMoreAction.isReport = false)
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
        this.delArticle()
      } catch (err) {
        console.log(err)
      }
    },
    delArticle () {
      const obj = {
        articleId: this.articleId,
        channelId: this.channels[this.activeIndex].id
      }
      this.$eventBus.$emit('delArticle', obj)
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
