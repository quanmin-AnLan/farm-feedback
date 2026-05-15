import { selectedOptionValues } from './normalizeAnswer'

function questionByAnyId(allQuestions, id) {
  const s = String(id)
  return allQuestions.find((q) => String(q.id) === s)
}

/**
 * @param {{ id: *, relation?: object }} question
 * @param {unknown[]} allQuestions 全部题目配置
 * @param {Record<string, unknown>} answers keyed by题目 id（字符串）
 */
export function shouldShowQuestion(question, allQuestions, answers) {
  const rel = question.relation
  if (!rel || !rel.enabled) return true

  const depId = rel.dependOnQuestionId
  const depQ = questionByAnyId(allQuestions, depId)
  if (!depQ) return true

  const depKey = String(depQ.id)
  const ans = answers[depKey]
  const selected = selectedOptionValues(depQ, ans)
  const when = Array.isArray(rel.showWhenOptionsSelected)
    ? rel.showWhenOptionsSelected.map(String)
    : []

  if (when.length === 0) return true

  const setSel = new Set(selected)
  return when.some((v) => setSel.has(String(v)))
}
