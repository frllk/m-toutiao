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
          @click="hShowImage"
          :src="user.photo"
        />
      </van-cell>
      <input type="file" hidden @change="hPhotoChange" ref="refPhoto" />
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
    <!-- 修改生日 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-nav-bar title="修改生日"></van-nav-bar>
      <van-datetime-picker
        @cancel="showBirthday=false"
        @confirm="hSaveBirthday"
        v-model="newDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date-time.js'
import { userGetInfo, updateUserInfo, updateUserPhoto } from '@/api/user.js'
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
    // 隐藏上传文件框,点击头像调用file标签的点击事件
    hShowImage () {
      this.$refs.refPhoto.click()
    },
    async hPhotoChange () {
      try {
        // 1. 获取用户选中的图片文件
        //    this.$refs.refPhoto用来获取对input type="file"的引用
        //    .files[0] :files是input的一个属性，用来保存用户选中的文件
        //          [0] 表示集合中的第一项。
        const files = this.$refs.refPhoto.files[0]
        if (!files) {
          return
        }
        // console.log(files)
        // 2. 调用接口，上传
        // 由于这里是上传文件，所以采用FormData对象来包装参数
        const formData = new FormData()
        formData.append('photo', files)
        const result = await updateUserPhoto(formData)
        // 3. 更新视图
        this.user.photo = result.data.data.photo
        // console.log(result)
        this.$toast.success('修改用户头像成功')
      } catch (error) {
        console.log(updateUserPhoto)
        console.log(error)
        this.$toast('修改用户头像失败')
      }
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (!this.newName) {
          this.$toast('用户名为空')
          done(false)
        } else if (this.user.name === this.newName) {
          this.$toast('用户名与原用户名一致')
          done(false)
        } else if (/^.{1,7}$/.test(this.newName) === false) {
          this.$toast('姓名长度在1-7之间,请重新输入')
          done(false)
        } else {
          done()
        }
      } else {
        done()
      }
    },
    async hSaveBirthday () {
      try {
        const birthday = formatDate(this.newDate)
        await updateUserInfo({
          birthday
        })
        this.user.birthday = birthday
        this.showBirthday = false
      } catch (error) {
        console.log(error)
        this.$toast('修改生日失败')
      }
    },
    async hSaveGender (val) {
      try {
        await updateUserInfo({
          gender: val
        })
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
        await updateUserInfo({
          name: this.newName
        })
        // 更新视图
        this.user.name = this.newName
      } catch (error) {
        console.dir(error)
        this.$toast.fail('修改姓名失败')
        this.showName = false
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
