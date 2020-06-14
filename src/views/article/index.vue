<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading v-if="loading" class="article-loading" />
    <!-- /加载中 loading -->
    <div class="error"  v-if="is404">
      文章不见了~~~
    </div>
    <!-- 文章详情 -->
    <div class="detail" v-else>
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relativeTime}}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="hSwitchFollow"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">
      </div>
      <van-divider>END</van-divider>
      <div class="zan">
        <van-button round size="small" hairline type="primary" plain @click="hSwitchLike" :icon="article.attitude === 1?'good-job':'good-job-o'">{{article.attitude === 1?'取消点赞':'点赞'}}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" plain @click="hSwitchDisLike" icon="delete">{{article.attitude === 0?'取消不喜欢':'不喜欢'}}</van-button>
      </div>
      <!-- 文章回复 -->
      <article-comment :articleId='$route.params.id'></article-comment>
      <!-- /文章回复 -->
    </div>
    <!-- /文章详情 -->
  </div>
</template>

<script>
import articleComment from './comment'
import { getArticleInfo, addLike, deleteLike, addDisLike, deleteDisLike } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: { },
      is404: false
    }
  },
  components: { articleComment },
  methods: {
    // 关注/取消关注
    async hSwitchFollow () {
      try {
        if (this.article.is_followed) {
          // 取消关注
          await unFollowUser(this.article.aut_id)
        } else {
          // 添加关注
          await followUser(this.article.aut_id)
        }
        this.$toast.success('操作成功')
        // 更新视图
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        console.log(error)
        this.$toast.success('操作失败')
      }
    },
    // 点赞/取消点赞
    async hSwitchLike () {
      try {
        if (this.article.attitude === 1) {
          // 取消点赞
          await deleteLike(this.article.art_id)
          this.article.attitude = -1
        } else {
          // 点赞
          await addLike(this.article.art_id)
          this.article.attitude = 1
        }
        this.$toast.success('操作成功')
        // 更新视图
      } catch (error) {
        console.log(error)
        this.$toast.success('操作失败')
      }
    },
    // 不喜欢/取消不喜欢
    async hSwitchDisLike () {
      try {
        if (this.article.attitude === 0) {
          // 取消不喜欢
          await deleteDisLike(this.article.art_id)
          this.article.attitude = -1
        } else {
          // 不喜欢
          await addDisLike(this.article.art_id)
          this.article.attitude = 0
        }
        this.$toast.success('操作成功')
        // 更新视图
      } catch (error) {
        console.log(error)
        this.$toast.success('操作失败')
      }
    },
    async loadArticle () {
      try {
        const result = await getArticleInfo(this.$route.params.id)
        this.article = result.data.data
        this.loading = false
      } catch (error) {
        console.dir(error)
        if (error && error.response && error.response.status === 404) {
          this.is404 = true
          this.loading = false
        }
      }
    }
  },
  created () {
    this.loadArticle()
  }
}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    font-size:14px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
