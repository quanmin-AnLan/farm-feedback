/** 是否开启「仅允许数字」（兼容接口返回 boolean / 1 / "true"） */
export function isInputNumeric(question) {
  const v = question && question.isNum
  return v === true || v === 1 || v === '1' || v === 'true'
}

/** 全角数字转半角后仅保留 0-9 */
export function normalizeDigitsOnly(value) {
  let s = String(value == null ? '' : value)
  s = s.replace(/[０-９]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  )
  return s.replace(/\D/g, '')
}

/** 按题目配置规范化单行输入值 */
export function normalizeInputValue(question, value) {
  let s = String(value == null ? '' : value)
  if (isInputNumeric(question)) {
    s = normalizeDigitsOnly(s)
  }
  const max = question && question.maxLength
  if (typeof max === 'number' && max >= 0) {
    s = s.slice(0, max)
  }
  return s
}

export function isValidNumericInput(value) {
  const s = normalizeDigitsOnly(value)
  return s !== '' && /^\d+$/.test(s)
}
