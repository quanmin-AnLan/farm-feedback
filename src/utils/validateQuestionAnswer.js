/**
 * Element UI validator：根据题目配置校验答案
 * @param {object} question
 * @param {{ shouldShowError?: () => boolean }} [options]
 *   shouldShowError 为 false 时不展示错误（用于未触碰且未提交时的必填项）
 */
export function createQuestionValidator(question, options = {}) {
  const q = question
  const shouldShowError =
    typeof options.shouldShowError === 'function'
      ? options.shouldShowError
      : () => true

  return (_, value, callback) => {
    if (!shouldShowError()) return callback()

    const require = !!q.require
    let empty = false

    switch (q.type) {
      case 'input':
        empty = value == null || String(value).trim() === ''
        if (empty && !require) return callback()
        if (empty) return callback(new Error('请填写该题'))
        if (typeof q.maxLength === 'number' && q.maxLength >= 0) {
          if (String(value).length > q.maxLength)
            return callback(new Error(`最多 ${q.maxLength} 个字`))
        }
        if (q.isNum && !/^\d+$/.test(String(value)))
          return callback(new Error('仅允许填写数字'))
        break
      case 'textarea':
        empty = value == null || String(value).trim() === ''
        if (empty && !require) return callback()
        if (empty) return callback(new Error('请填写该题'))
        if (typeof q.maxLength === 'number' && q.maxLength >= 0) {
          if (String(value).length > q.maxLength)
            return callback(new Error(`最多 ${q.maxLength} 个字`))
        }
        break
      case 'radio': {
        const v =
          typeof value === 'string'
            ? value
            : value && value.value != null
              ? String(value.value)
              : ''
        empty = v === ''
        if (empty && !require) return callback()
        if (empty) return callback(new Error('请选择一项'))
        const openTexts =
          value && typeof value === 'object' && value.openTexts
            ? value.openTexts
            : {}
        const opt = (q.options || []).find((o) => String(o.value) === v)
        if (opt && opt.openInput) {
          const t = (openTexts[v] != null ? String(openTexts[v]) : '').trim()
          if (t === '')
            return callback(new Error('请补充填写说明'))
        }
        break
      }
      case 'checkbox': {
        const vals = Array.isArray(value)
          ? value
          : value && Array.isArray(value.values)
            ? value.values
            : []
        const openTexts =
          value && typeof value === 'object' && value.openTexts
            ? value.openTexts
            : {}
        empty = vals.length === 0
        if (empty && !require) return callback()
        if (empty) return callback(new Error('请至少选择一项'))
        for (let i = 0; i < vals.length; i += 1) {
          const val = String(vals[i])
          const opt = (q.options || []).find((o) => String(o.value) === val)
          if (opt && opt.openInput) {
            const t = (openTexts[val] != null ? String(openTexts[val]) : '').trim()
            if (t === '')
              return callback(new Error('请补充填写说明'))
          }
        }
        break
      }
      case 'upload': {
        const list = Array.isArray(value) ? value : []
        empty = list.length === 0
        if (empty && !require) return callback()
        if (empty) return callback(new Error('请上传至少一张图片'))
        break
      }
      case 'date':
        empty = value == null || String(value).trim() === ''
        if (empty && !require) return callback()
        if (empty) return callback(new Error('请选择日期时间'))
        break
      default:
        break
    }
    callback()
  }
}
