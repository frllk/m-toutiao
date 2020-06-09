<template>
  <div class='index'>
    <van-tabs>
      <van-tab v-for="(item,idx) in channels" :key="idx" :title="item.name">
        <article-list></article-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ArticleList from '@/views/home/articleList'
import { getChannels } from '@/api/channels.js'
export default {
  name: 'Home',
  props: [],
  components: { ArticleList },
  data () {
    return {
      channels: [] // 频道列表
    }
  },
  methods: {
    async loadChannels () {
      const result = await getChannels()
      this.channels = result.data.data.channels
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
