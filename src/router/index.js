import Vue from 'vue'
import VueRouter from 'vue-router'
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
  { path: '/article', component: () => import('@/views/article') } // 文章详情
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

export default router
