import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
// import Home from '../views/Home.vue'
// import LoginIndex from '../views/login'
const LoginIndex = () => import('@/views/login')
const Layout = () => import('@/views/layout')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: () => import('@/views/home') }, // 二级路由主页
      { path: '/question', component: () => import('@/views/question') }, // 问答
      { path: '/video', component: () => import('@/views/video') }, // 视频
      { path: '/user', component: () => import('@/views/user') } // 个人中心
    ]
  },
  { path: '/login', component: LoginIndex }, // 登录页
  { path: '/user/profile', component: () => import('@/views/user/profile.vue') }, // 编辑资料
  { path: '/user/chat', component: () => import('@/views/user/chat.vue') }, // 小智同学
  { path: '/search', component: () => import('@/views/search') }, // 搜索中心
  { path: '/search/result', component: () => import('@/views/search/result') }, // 搜索结果
  { path: '/article/:id', component: () => import('@/views/article') } // 文章详情
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
/**
 * 路由守卫:
 * 在路由变化时,在跳入到目标路由页之前会执行这个函数
 * http://localhost:8081/#/ ----->  http://localhost:8081/#/user
 *  未登录,跳到登录页   ------>   登录成功之后,跳转到目标页
 * to: 到哪里去
 *  path: /user
 *  fullpath: 包含查询字符串  /user?a=1&b=2
 * from: 从哪里来
 * next: 是一个函数, 用来自行定义路由的跳转
 *  1) next() 直接放行,让路由进入到to这个页面
 *  2) next(其他路由) 不去to的位置, 而是进入指定的路由
 */
router.beforeEach(function (to, from, next) {
  // console.log('==========================')
  // console.log('to=====', to, 'from=====', from)
  // console.log('next===========', next)
  // console.log('==========================')
  if (to.path.startsWith('/user')) {
    // 验证: 未登录, 跳转到登录,登录成功之后跳转到目标页
    // 验证身份:是否携带token 通过: 则next放行  不通过: 跳转到登录页,登录成功之后跳转到目标页
    if (store.state.tokenInfo.token) {
      next()
    } else {
      next({ path: '/login', query: { backto: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router
