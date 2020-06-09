<template>
  <div class='container'>
    <van-nav-bar
      title="黑马头条"
      right-text="搜索"
      left-arrow
      @click-left="$router.push('/login')"
      @click-right="$router.push('/search')"
    />
    <!-- 二级路由入口 -->
    <router-view></router-view>
    <van-tabbar>
    <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
    <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
    <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
  </div>
</template>

<script>
import { userGetInfo } from '@/api/user.js'
export default {
  name: 'Layout',
  props: [],
  components: {},
  data () {
    return {}
  },
  methods: {

  },
  computed: {},
  async created () {
    await userGetInfo()
  },
  mounted () {}
}
</script>

<style scoped lang='less'></style>
