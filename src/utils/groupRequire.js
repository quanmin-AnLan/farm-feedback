import { shouldShowQuestion } from '@/utils/questionRelation'
import { isQuestionAnswered } from '@/utils/isQuestionAnswered'

export function formatQuestionIndexes(questions, ids) {
  const indexMap = new Map(questions.map((q, i) => [String(q.id), i + 1]))
  return ids
    .map((id) => indexMap.get(String(id)))
    .filter((n) => n != null)
    .sort((a, b) => a - b)
}

export function defaultGroupRequireMessage(questions, group) {
  const nums = formatQuestionIndexes(questions, group.questionIds || [])
  const min = group.minFill || 1
  if (nums.length === 0) return `请至少完成 ${min} 项`
  if (nums.length === 1) return `第 ${nums[0]} 题为必填`
  const range =
    nums.length === 2
      ? `第 ${nums[0]}、${nums[1]} 题`
      : `第 ${nums.slice(0, -1).join('、')}、${nums[nums.length - 1]} 题`
  return `${range}至少填写 ${min} 项`
}

/** 组内当前可见且计入组合的题目 */
export function getActiveGroupMembers(group, allQuestions, answers) {
  const idSet = new Set((group.questionIds || []).map(String))
  return allQuestions.filter(
    (q) =>
      idSet.has(String(q.id)) &&
      shouldShowQuestion(q, allQuestions, answers),
  )
}

export function countGroupFilled(group, allQuestions, answers) {
  const members = getActiveGroupMembers(group, allQuestions, answers)
  return members.filter((q) =>
    isQuestionAnswered(q, answers[String(q.id)]),
  ).length
}

export function validateGroupRequire(group, allQuestions, answers) {
  const members = getActiveGroupMembers(group, allQuestions, answers)
  if (members.length === 0) return null

  const minFill = Math.max(1, Number(group.minFill) || 1)
  const filled = countGroupFilled(group, allQuestions, answers)
  if (filled >= minFill) return null

  const message =
    (group.message && String(group.message).trim()) ||
    defaultGroupRequireMessage(allQuestions, group)
  return message
}

export function validateAllGroupRequires(groups, allQuestions, answers) {
  if (!Array.isArray(groups) || !groups.length) return []
  return groups
    .map((group) => {
      const message = validateGroupRequire(group, allQuestions, answers)
      if (!message) return null
      return { groupId: String(group.id), message, questionIds: group.questionIds || [] }
    })
    .filter(Boolean)
}

export function getGroupsForQuestion(groups, questionId) {
  const qid = String(questionId)
  return (groups || []).filter((g) =>
    (g.questionIds || []).some((id) => String(id) === qid),
  )
}
