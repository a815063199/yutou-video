import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import store from '@/store'

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  //使用uView UI
  //app.use(uviewPlus) （在Vue3中，无法使用全局API的use()来挂载插件，而应该在应用实例上使用use()来挂载插件）
  app.use(store)
  return {
    app
  }
}
// #endif