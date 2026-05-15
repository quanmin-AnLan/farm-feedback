import http from './http'

function pickQuestions(root) {
  if (root == null) return []
  if (Array.isArray(root)) return root
  const direct = root.questions || root.list || root.items
  if (Array.isArray(direct)) return direct
  if (root.data != null) {
    if (Array.isArray(root.data)) return root.data
    if (typeof root.data === 'object') {
      const inner = root.data.questions || root.data.list || root.data.items
      if (Array.isArray(inner)) return inner
    }
  }
  return []
}

/**
 * @param {unknown} raw 接口原始 body（拦截器已取 response.data）
 */
export function normalizeTypeOptions(raw) {
  let arr = []
  if (Array.isArray(raw)) arr = raw
  else if (raw && Array.isArray(raw.data)) arr = raw.data
  else if (raw && Array.isArray(raw.list)) arr = raw.list
  else if (raw && raw.data && Array.isArray(raw.data.list)) arr = raw.data.list
  else return []

  return arr
    .map((item, idx) => {
      if (!item || typeof item !== 'object') return null
      const label =
        item.label != null ? String(item.label) : `选项${idx + 1}`
      const valueRaw = item.value
      const value =
        valueRaw !== undefined && valueRaw !== null ? valueRaw : ''
      return { label, value }
    })
    .filter(Boolean)
}

/**
 * GET /farm/defaultConfig → { label, value }[]
 */
export async function fetchDefaultConfig() {
  const raw = await http.get('/farm/defaultConfig')
  return normalizeTypeOptions(raw)
}

/**
 * 将接口 body 解析为页面可用的标题、说明与题目列表（兼容多种常见结构）
 * @param {unknown} body
 */
export function parseSurveyConfig(body) {
  if (body == null) return { title: '反馈', desc: '', questions: [] }
  if (Array.isArray(body))
    return { title: '反馈', desc: '', questions: [...body] }

  const questions = pickQuestions(body)
  const nested =
    body.data && typeof body.data === 'object' && !Array.isArray(body.data)
      ? body.data
      : null

  const title =
    body.title ||
    body.name ||
    (nested && (nested.title || nested.name)) ||
    '反馈'
  const desc =
    body.desc ||
    body.description ||
    body.subtitle ||
    (nested && (nested.desc || nested.description || nested.subtitle)) ||
    ''

  return { title, desc, questions }
}

/**
 * @param {string|number} id
 * @returns {Promise<{ title: string, desc: string, questions: object[] }>}
 */
export async function fetchSurveyConfigById(id) {
  const raw = await http.get('/farm/getConfigById', {
    params: { id },
  })
  return parseSurveyConfig(raw)
}
