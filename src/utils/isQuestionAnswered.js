/**
 * 判断单题是否已有「有效作答」（与 validateQuestionAnswer 空值逻辑一致）
 */
export function isQuestionAnswered(question, value) {
  const q = question
  if (!q) return false

  switch (q.type) {
    case 'input':
    case 'textarea':
      return value != null && String(value).trim() !== ''
    case 'radio': {
      const v =
        typeof value === 'string'
          ? value
          : value && value.value != null
            ? String(value.value)
            : ''
      if (v === '') return false
      const opt = (q.options || []).find((o) => String(o.value) === v)
      if (opt && opt.openInput) {
        const openTexts =
          value && typeof value === 'object' && value.openTexts
            ? value.openTexts
            : {}
        const t = (openTexts[v] != null ? String(openTexts[v]) : '').trim()
        return t !== ''
      }
      return true
    }
    case 'checkbox': {
      const vals = Array.isArray(value)
        ? value
        : value && Array.isArray(value.values)
          ? value.values
          : []
      if (vals.length === 0) return false
      for (let i = 0; i < vals.length; i += 1) {
        const val = String(vals[i])
        const opt = (q.options || []).find((o) => String(o.value) === val)
        if (opt && opt.openInput) {
          const openTexts =
            value && typeof value === 'object' && value.openTexts
              ? value.openTexts
              : {}
          const t = (openTexts[val] != null ? String(openTexts[val]) : '').trim()
          if (t === '') return false
        }
      }
      return true
    }
    case 'upload':
      return Array.isArray(value) && value.length > 0
    case 'date':
      return value != null && String(value).trim() !== ''
    default:
      return false
  }
}
