<template>
<div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="total_count+'条回复'">
      <van-icon slot="left" name="cross" @click="hClose" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px;"
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
      <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
      <div slot="label">
        <p style="color: #363636;">{{comment.content}}</p>
        <p>
          <span style="margin-right: 10px;">{{comment.pubdate|relativeTime}}</span>
          <van-button
            size="mini"
            type="default"
          >回复 {{total_count}}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->
    <van-divider>全部回复</van-divider>

    <!-- 对当前评论 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
     >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate|relativeTime}}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        v-model.trim="content"
        placeholder="请输入回复内容"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
          @click="hAddCommentReply"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
</div>

</template>
<script>
import { getComments, addComment } from '@/api/comment'
export default {
  name: 'CommentReply',
  data () {
    return {
      content: '', // 评论回复内容
      total_count: 0, // 评论回复总数
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },
  props: ['comment', 'articleId'],
  methods: {
    // 向父组件抛出事件，关闭弹层
    hClose () {
      this.$emit('close')
    },
    // 添加评论回复
    async hAddCommentReply () {
      try {
        if (!this.content) {
          return
        }
        const result = await addComment({
          target: this.comment.com_id,
          content: this.content,
          art_id: this.articleId
        })
        console.log(result)
        this.list.unshift(result.data.data.new_obj)
        this.total_count++
        this.content = ''
        this.$toast.success('发布成功')
      } catch (error) {
        console.dir(error)
        this.$toast.fail('发布失败')
      }
    },
    async onLoad () {
      try {
        const result = await getComments({
          type: 'c',
          source: this.comment.com_id.toString(),
          offset: this.offset
        })
        console.log(result)
        this.list.push(...result.data.data.results)
        this.offset = result.data.data.last_id
        this.total_count = result.data.data.total_count
        this.loading = false
        if (result.data.data.results.length === 0) {
          this.finished = true
        }
      } catch (error) {
        console.dir(error)
        this.$toast.fail('获取评论回复数据失败！')
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
// 发表评论的区域是固定在下端的
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
// 给发表评论区空出地方
.van-list {
  margin-bottom: 45px;
}
</style>
