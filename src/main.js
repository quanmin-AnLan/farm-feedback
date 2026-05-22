import Vue from 'vue'
import '@/plugins/element'
import '@/styles/mobile-form.scss'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
