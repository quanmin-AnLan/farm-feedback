import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/** 按路由拆包，首屏只拉取当前页对应 chunk，减轻解析与执行压力 */
const FeedbackDefault = () =>
  import(
    /* webpackChunkName: "feedback-default" */
    '@/views/FeedbackDefault.vue'
  )
const FeedbackById = () =>
  import(
    /* webpackChunkName: "feedback-by-id" */
    '@/views/FeedbackById.vue'
  )
const NotFound = () =>
  import(
    /* webpackChunkName: "not-found" */
    '@/views/NotFound.vue'
  )

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
