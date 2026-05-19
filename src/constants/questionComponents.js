import InputQuestion from '@/components/questionnaire/InputQuestion.vue'
import TextareaQuestion from '@/components/questionnaire/TextareaQuestion.vue'
import RadioQuestion from '@/components/questionnaire/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questionnaire/CheckboxQuestion.vue'
import UploadQuestion from '@/components/questionnaire/UploadQuestion.vue'

export const QUESTION_TYPE_MAP = {
  input: InputQuestion,
  textarea: TextareaQuestion,
  radio: RadioQuestion,
  checkbox: CheckboxQuestion,
  upload: UploadQuestion,
}

export function resolveQuestionComponent(type) {
  return QUESTION_TYPE_MAP[type] || null
}
