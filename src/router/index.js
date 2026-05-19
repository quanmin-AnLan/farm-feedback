import Vue from 'vue'
import VueRouter from 'vue-router'
import { reportPV } from '@/api/monitor'

Vue.use(VueRouter)

/** 项目名作为 spm 中段，与 game-center 风格保持一致 */
const SPM_PROJECT = 'farm-feedback'

function isIdSegment(seg) {
  if (!seg) return false
  if (/^\d+$/.test(seg) && seg !== '404') return true
  if (/^(wj|ans)_/i.test(seg)) return true
  if (/^[0-9a-f]{8}-[0-9a-f-]+$/i.test(seg)) return true
  return false
}

function pathToSpmC(path) {
  if (!path || path === '/') return 'home'
  const segs = path.split('/').filter(Boolean)
  if (segs.length && isIdSegment(segs[segs.length - 1])) segs.pop()
  return segs.join('-') || 'home'
}

function pad2(n) {
  return n < 10 ? `0${n}` : String(n)
}

function reportRouteEnter(to) {
  try {
    const now = new Date()
    const setDate = `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}`
    const spm = `smpc.${SPM_PROJECT}.${pathToSpmC(to.path)}`
    reportPV({ setDate, spm })
  } catch {
    /* 上报失败静默：不影响业务 */
  }
}

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

router.beforeEach((to, from, next) => {
  reportRouteEnter(to)
  next()
})

export default router
