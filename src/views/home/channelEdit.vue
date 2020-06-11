<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
          <van-button  size="mini" type="info">编辑</van-button>
      </van-cell>
      <van-grid>
        <van-grid-item @click="hClickMyChannel(item)" v-for="(item,idx) in channels" :key="item.id">
          <span :class="{cur: activeIndex===idx}">{{item.name}}</span>
          <!-- <van-icon name="cross" class="btn" size="10"></van-icon> -->
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item v-for="item in mRecommendChannels" :key="item.id">
          <span>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels.js'
export default {
  name: 'ChannelEdit',
  props: ['channels', 'activeIndex'],
  data () {
    return {
      allChannels: []
    }
  },
  methods: {
    async hClickMyChannel (channel) {
      try {
        // 1、关闭弹层  2、父组件显示当前点击频道
        this.$emit('updateCurChannel', channel)
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    },
    async loadAllChannels () {
      try {
        const res = await getAllChannels()
        this.allChannels = res.data.data.channels
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    mRecommendChannels () {
      // allChannels - channels   全部频道 - 我的频道
      const arr = this.allChannels.filter(item => {
        const idx = this.channels.findIndex(channel => channel.id !== item.id)
        return idx !== -1
      })
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
  .channel{
    padding:15px;
    font-size:14px;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 24px;
  }
  .cur {
    color: red;
  }
</style>
