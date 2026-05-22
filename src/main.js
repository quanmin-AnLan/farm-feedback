import Vue from 'vue'
import '@/plugins/element'
import '@/styles/mobile-form.scss'
import { syncMobileRootClass } from '@/utils/mobileClient'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

syncMobileRootClass()

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
