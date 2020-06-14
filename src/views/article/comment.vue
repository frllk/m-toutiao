<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.art_id"
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
            <span style="margin-right: 10px;">{{item.pubdata|relativeTime}}</span>
            <van-button size="mini" type="default" @click="hReply">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" :name="item.is_liking?'like':'like-o'" @click="hSwitchLike(item)" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model.trim="content"
      >
        <van-button slot="button" size="mini" type="info" @click="hAddComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments, addComment, addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'ArticleComment',
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      content: '',
      offset: null, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },

  methods: {
    // 回复评论
    hReply () {

    },
    async hSwitchLike (item) {
      try {
        if (item.is_liking) {
          // 取消评论点赞
          await addCommentLike(item.com_id)
        } else {
          // 评论点赞
          await deleteCommentLike(item.com_id)
        }
        item.is_liking = !item.is_liking
        this.$toast.success('操作成功')
      } catch (error) {
        console.dir(error)
        this.$toast.fail('发布评论失败')
      }
    },
    // 添加评论
    async hAddComment () {
      try {
        if (!this.content) {
          return
        }
        const result = await addComment({
          target: this.articleId,
          content: this.content
        })
        console.log(result)
        this.list.unshift(result.data.data.new_obj)
        this.content = ''
      } catch (error) {
        console.dir(error)
        this.$toast.fail('发布评论失败')
      }
    },
    async onLoad () {
      try {
        const result = await getComments({
          type: 'a',
          source: this.articleId,
          offset: this.offset
        })
        console.log(result)
        this.list.push(...result.data.data.results)
        this.offset = result.data.data.last_id
        this.loading = false
        if (result.data.data.results.length === 0) {
          this.finished = true
        }
      } catch (error) {
        console.dir(error)
        this.$toast.fail('获取评论数据失败！')
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

<style scoped lang='less'>
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
