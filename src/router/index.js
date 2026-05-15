import Vue from 'vue'
import VueRouter from 'vue-router'
import FeedbackById from '@/views/FeedbackById.vue'
import FeedbackDefault from '@/views/FeedbackDefault.vue'
import NotFound from '@/views/NotFound.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'FeedbackDefault' },
    },
    {
      path: '/feedback/default',
      name: 'FeedbackDefault',
      component: FeedbackDefault,
    },
    {
      path: '/feedback/:id',
      name: 'FeedbackById',
      component: FeedbackById,
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
