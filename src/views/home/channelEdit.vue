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
        <van-grid-item @click="hAddChannel(item)" v-for="item in mRecommendChannels" :key="item.id">
          <span>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels, addChannel } from '@/api/channels.js'
export default {
  name: 'ChannelEdit',
  props: ['channels', 'activeIndex'],
  data () {
    return {
      allChannels: []
    }
  },
  methods: {
    // 用户在推荐频道上点击了某一项
    async hAddChannel (channel) {
      try {
        let curChannels = [...this.channels, channel]
        curChannels.splice(0, 1)
        // 组装数据，改造成接口参数要求的格式
        curChannels = curChannels.map((item, idx) => {
          return { id: item.id, seq: idx }
        })
        console.log(curChannels)
        // 1、调用接口
        await addChannel(curChannels)
        // 2、更新视图：修改已订阅的频道
        // 直接在channels的后面添加当前这一项
        this.channels.push(channel)
        // (1) 它给 我的频道中添加了 一项。导致视图的变化。
        // (2) 由于可选频道是一个计算属性，所以 我的频道 多了一次，则可选频道就会少一项。
        // (3) 它会直接修改父组件中的频道列表。
        //     原因：父组件把channels当作prop传入的。由于这个prop的值是一个数组，它是一个引用数据类型。
        //          所以在子组件中修改会直接影响到父组件中的数据。
      } catch (error) {
        console.log(error)
      }
    },
    // 我的订阅  点击频道
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
        // 只保留  没有在  已订阅的频道中出现的频道
        const idx = this.channels.findIndex(channel => channel.id === item.id)
        // 如果找到，idx肯定不是-1 如果找不到，idx就是-1
        return idx === -1
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
