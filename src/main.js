import Vue from 'vue'
import '@/plugins/element'
import '@/styles/mobile-form.scss'
import '@/styles/native-field.scss'
import { syncMobileRootClass } from '@/utils/mobileClient'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 构建版本打入入口包，保证每次 build 产物 hash 随构建更新（见 vite.config.js / build-meta.json）
if (typeof __FARM_BUILD_ID__ !== 'undefined') {
  window.__FARM_FEEDBACK_BUILD__ = {
    id: __FARM_BUILD_ID__,
    at: typeof __FARM_BUILT_AT__ !== 'undefined' ? __FARM_BUILT_AT__ : '',
  }
}

syncMobileRootClass()

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
