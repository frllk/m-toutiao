<template>
    <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div ref="refList" class="chat-list">
      <div v-for="(item,idx) in list" :key="idx" class="chat-item" :class="item.name === 'xz' ? 'left' : 'right'">
        <!-- 左侧是机器人小智 -->
        <template v-if="item.name === 'xz'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{item.msg}}</div>
        </template>
        <!-- 右侧是当前用户 -->
        <template v-if="item.name === 'me'">
          <div class="chat-pao">{{item.msg}}</div>
          <van-image  fit="cover" round :src="$store.state.photo" />
        </template>
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <span  @click="hSend()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  name: 'UserChat',
  data () {
    return {
      word: '',
      list: [
        // { name: 'xz', msg: 'aaa', timestamp: Date.now() },
        // { name: 'me', msg: 'bbbbb', timestamp: Date.now() },
        // { name: 'xz', msg: 'xxxxx', timestamp: Date.now() }
      ]
    }
  },
  methods: {
    // bug修复: 在对话时，内容区域滚动条不能自己到达底部
    toBottom () {
      // this.$refs.refList
      // dom
      //     document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight
      // this.$nextTick是vue的一个api
      // 格式： this.$nextTick(()=>{})
      // 作用:让修改数据到dom结构渲染有一个同步的执行效果
      //   本质：让其中回调函数等着当前数据变化而导致的dom变化完成之后，才去执行
      //        类似于setTimeout()的效果
      this.$nextTick(() => {
        this.$refs.refList.scrollTop = this.$refs.refList.scrollHeight
      })
    },
    hSend () {
      try {
        // 1. 简单判断内容是否为空
        if (!this.word) {
          return
        }
        // 2. 向websocket服务器发消息
        const info = { msg: this.word, timestamp: Date.now() }
        this.socket.emit('message', info)
        // 3. 把本次的内容添加到list
        this.list.push({ name: 'me', ...info })
        // 滚动条到底部
        this.toBottom()
        // 4. 清空留言区域
        this.word = ''
      } catch (error) {
        console.log('=============error=============', error)
        console.dir(error)
      }
    }
  },
  created () {
    try {
      // 这里只是把socket当作一个普通的属性名，它不一定非常要写在data数据项中
      this.socket = io('http://ttapi.research.itcast.cn', {
        query: { token: this.$store.state.tokenInfo.token }
      })
      this.socket.on('connect', () => {
        console.log('与WebSocket连接成功')
        this.list.push({ name: 'xz', msg: '我准备好了', timestamp: Date.now() })
      })
      this.socket.on('message', data => {
        this.list.push({ name: 'xz', ...data })
        // 滚动条到底部
        this.toBottom()
      })
    } catch (error) {
      console.log('created=============error=============', error)
      console.dir(error)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
