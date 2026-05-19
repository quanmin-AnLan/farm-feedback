import http from './http'

/**
 * farm-feedback 用到的"问卷"相关接口
 * 全部走 /questionnaire 前缀，与 feedback-admin 拉齐
 * 拦截器已剥离 { code, success, data, msg } 外壳，下方直接拿到业务数据
 */

function normalizeTypeOptions(raw) {
  const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.list) ? raw.list : []
  return arr
    .map((item, idx) => {
      if (!item || typeof item !== 'object') return null
      const label = item.label != null ? String(item.label) : `选项${idx + 1}`
      const value = item.value != null ? item.value : ''
      return { label, value }
    })
    .filter(Boolean)
}

/** GET /questionnaire/defaultConfig → { label, value }[] */
export async function fetchDefaultConfig() {
  const data = await http.get('/questionnaire/defaultConfig')
  return normalizeTypeOptions(data)
}

/**
 * 把服务端返回的问卷详情格式化为页面可用结构
 * 服务端返回（已剥壳）:
 *   { questionnaireId, title, description, anonymous, questions, success, status }
 */
export function parseSurveyConfig(detail) {
  if (!detail || typeof detail !== 'object') {
    return {
      questionnaireId: '',
      title: '反馈',
      description: '',
      anonymous: false,
      questions: [],
      success: { textMode: 'default', customText: '', redirectUrl: '' },
    }
  }
  return {
    questionnaireId: String(detail.questionnaireId || detail.id || ''),
    title: detail.title || '反馈',
    description: detail.description || detail.desc || '',
    anonymous: !!detail.anonymous,
    questions: Array.isArray(detail.questions) ? detail.questions : [],
    success: detail.success || {
      textMode: 'default',
      customText: '',
      redirectUrl: '',
    },
  }
}

/**
 * GET /questionnaire/:id
 * @returns {Promise<ReturnType<typeof parseSurveyConfig>>}
 */
export async function fetchSurveyConfigById(id) {
  const data = await http.get(`/questionnaire/${encodeURIComponent(id)}`)
  return parseSurveyConfig(data)
}

/**
 * POST /questionnaire/:id/answer
 * @param {string} id 问卷 questionnaireId
 * @param {object} answers 答案对象，键为题目 id
 * @returns {Promise<{ answerId: string }>}
 */
export async function submitAnswer(id, answers) {
  return http.post(`/questionnaire/${encodeURIComponent(id)}/answer`, { answers })
}
