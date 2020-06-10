import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入移动端组件库 Vant
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
// 它会根据的手机尺寸来调整rem的基准值：html标签上的font-size。
import 'amfe-flexible'
// 引入全局样式
import '@/styles/index.less'
// 时间处理
import { relativeTime } from './utils/date-time'

Vue.use(Vant)
// 图片懒加载
Vue.use(Lazyload)

// 时间处理
Vue.filter('relativeTime', relativeTime)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
