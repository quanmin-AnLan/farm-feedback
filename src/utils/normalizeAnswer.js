/** 将本题答案转成「所选选项 value」列表，便于关联条件匹配 */

export function selectedOptionValues(question, answer) {
  if (answer === undefined || answer === null || answer === '') return []
  const type = question.type
  if (type === 'checkbox') {
    if (Array.isArray(answer)) return answer.map(String)
    if (answer && Array.isArray(answer.values))
      return answer.values.map(String)
    return []
  }
  if (type === 'radio') {
    if (typeof answer === 'string')
      return answer.length ? [String(answer)] : []
    if (
      answer &&
      answer.value !== undefined &&
      answer.value !== null &&
      String(answer.value) !== ''
    ) {
      return [String(answer.value)]
    }
    return []
  }
  return []
}
