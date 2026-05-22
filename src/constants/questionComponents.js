import InputQuestion from '@/components/questionnaire/InputQuestion.vue'
import TextareaQuestion from '@/components/questionnaire/TextareaQuestion.vue'
import RadioQuestion from '@/components/questionnaire/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questionnaire/CheckboxQuestion.vue'
import UploadQuestion from '@/components/questionnaire/UploadQuestion.vue'
import DateQuestion from '@/components/questionnaire/DateQuestion.vue'

export const QUESTION_TYPE_MAP = {
  input: InputQuestion,
  textarea: TextareaQuestion,
  radio: RadioQuestion,
  checkbox: CheckboxQuestion,
  upload: UploadQuestion,
  date: DateQuestion,
}

/** 规范化题型（兼容接口大小写、首尾空格） */
export function normalizeQuestionType(type) {
  return String(type == null ? '' : type).trim().toLowerCase()
}

export function resolveQuestionComponent(type) {
  return QUESTION_TYPE_MAP[normalizeQuestionType(type)] || null
}

/** 组件名映射，供 FeedbackSurvey 本地注册后 :is 使用 */
export const QUESTION_COMPONENT_NAME = {
  input: 'InputQuestion',
  textarea: 'TextareaQuestion',
  radio: 'RadioQuestion',
  checkbox: 'CheckboxQuestion',
  upload: 'UploadQuestion',
  date: 'DateQuestion',
}

export function resolveQuestionComponentName(type) {
  return QUESTION_COMPONENT_NAME[normalizeQuestionType(type)] || null
}
