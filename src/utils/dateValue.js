/** 与 DateQuestion / el-date-picker 约定：yyyy-MM-dd HH:mm:ss */

export function toDatetimeLocalValue(value) {
  if (value == null || value === '') return ''
  const s = String(value).trim()
  if (!s) return ''
  return s.replace(' ', 'T').slice(0, 16)
}

export function fromDatetimeLocalValue(value) {
  if (value == null || value === '') return ''
  const s = String(value).trim()
  if (!s) return ''
  const base = s.replace('T', ' ')
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(base)) return base
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(base)) return `${base}:00`
  return base
}
