<template>
  <div class='login'>
    <!-- NavBar 导航栏 -->
    <van-nav-bar title="登录" />
    <!-- 表单部分 -->
    <van-form :validate-first="true" @submit="hLogin">
      <van-field
        v-model="userInfo.mobile"
        label="手机号"
        placeholder="手机号"
        :rules="rules.mobile"
      />
      <van-field
        v-model="userInfo.code"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="rules.code"
      />
      <div class="btn-wrap">
        <!-- <van-button round block type="info" native-type="submit">
          提交
        </van-button> -->
        <van-button round type="info" class="btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { userLogin } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  props: [],
  components: {},
  data () {
    return {
      userInfo: {
        mobile: '13912345678',
        code: '246810'
      },
      rules: {
        mobile: [
          { required: true, message: '请填写手机号', 'validate-trigger': 'blur' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号格式不正确', 'validate-trigger': 'blur' }
        ],
        code: [
          { required: true, message: '请填写密码' },
          { pattern: /^\d{6}$/, message: '密码格式不正确' }
        ]
      }
    }
  },
  methods: {
    async hLogin () {
      try {
        const res = await userLogin(this.userInfo)
        console.log(res)
        // 登录成功保存token信息到vuex，并跳转到主页
        this.$store.commit('mSetTokenInfo', res.data.data)
        this.$toast.success('登录成功')
        this.$router.push('/')
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败')
      }
    }
    // hLogin () {
    //   const res = userLogin(this.userInfo)
    //   console.log(res)
    // }
  },
  computed: {},
  created () {},
  mounted () {}
}
</script>

<style scoped lang='less'>
.login{
  .btn-wrap{
    padding: 20px;
    .btn{
      width: 100%;
      background-color: #6db4fb;
    }
  }
}
</style>
