<template>
  <div class="container">
    <!-- 1、顶部导航条 -->
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"></van-nav-bar>
    <!-- 2、具体修改项 -->
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName=true"/>
      <van-cell is-link title="性别" :value="user.gender === 1?'男':'女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true"/>
    </van-cell-group>

    <!-- 修改姓名 -->
    <!-- 关闭前的回调函数，调用 done() 后关闭弹窗，调用 done(false) 阻止弹窗关闭 (action, done) => void -->
    <van-dialog v-model="showName" :beforeClose="beforeClose" @confirm="hSaveName" title="修改姓名" show-cancel-button>
        <van-field
          v-model="newName"
          right-icon="edit"
          placeholder="请输入用户名"
        />
    </van-dialog>
    <!-- 修改性别 -->
    <van-popup v-model="showGender" position="bottom">
      <van-nav-bar
          title="修改性别"
          left-text="取消"
          @click-left="showGender=false"
      >
      </van-nav-bar>

      <van-cell is-link title="男" @click="hSaveGender(1)" />
      <van-cell is-link title="女" @click="hSaveGender(0)" />
    </van-popup>
  </div>
</template>

<script>
import { userGetInfo, updateUserInfo } from '@/api/user.js'
export default {
  name: 'userProfile',
  data () {
    return {
      // 控制弹层
      showName: false,
      showGender: false,
      showBirthday: false,

      // 当前用户的信息
      user: {},

      // 修改后的新名字
      newName: '',
      // 修改后新生日
      newDate: new Date(),
      minDate: new Date(1965, 0, 10), // dateTime-picker中最小时间
      maxDate: new Date() // 当前时间
    }
  },
  methods: {
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (!this.newName) {
          this.$toast('用户名为空')
        }
        if (this.user.name === this.newName) {
          this.$toast('用户名与原用户名一致')
        }
        if (/^.{1,7}$/.test(this.newName) === false) {
          this.$toast('姓名长度在1-7之间,请重新输入')
        }
        done(false)
      } else {
        done()
      }
    },
    async hSaveGender (val) {
      try {
        const result = await updateUserInfo({
          gender: val
        })
        console.log(result)
        this.user.gender = val
        this.showGender = false
      } catch (error) {
        console.log(error)
        this.$toast('修改性别失败')
      }
    },
    async hSaveName () {
      try {
        if (!this.newName || this.user.name === this.newName || /^.{1,7}$/.test(this.newName) === false) {
          return
        }
        const result = await updateUserInfo({
          name: this.newName
        })
        console.log(result)
        // 更新视图
        this.user.name = this.newName
      } catch (error) {
        console.dir(error)
        this.$toast.fail('修改姓名失败')
      }
    },
    async loadUserInfo () {
      try {
        const result = await userGetInfo()
        this.user = result.data.data
        this.newName = this.user.name
      } catch (error) {
        console.log(error.message)
        this.$toast.fail('获取数据失败')
      }
    }
  },
  created () {
    this.loadUserInfo()
  }
}
</script>

<style lang="less">
.van-nav-bar__text{
  color:#fff;
}
</style>
