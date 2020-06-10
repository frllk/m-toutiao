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

// 事件总线
// Vue是一个构造器，它有一个原型对象prototype
// Vue.prototype.$eventBus 给Vue的原型对象补充一个名为$eventBus的属性
//      属性名是$eventBus，值是一个全新的Vue的实例：用它当做事件对象

// 如果给prototype上添加属性，则所有的实例都拥有$eventBus这个属性
// 也就是所有的组件（组件也是Vue的实例）中都可以访问this$eventBus
Vue.prototype.$eventBus = new Vue()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
