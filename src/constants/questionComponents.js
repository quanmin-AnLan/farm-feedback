import QuestionInput from '@/components/question-meta/QuestionInput.vue'
import QuestionTextarea from '@/components/question-meta/QuestionTextarea.vue'
import QuestionRadio from '@/components/question-meta/QuestionRadio.vue'
import QuestionCheckbox from '@/components/question-meta/QuestionCheckbox.vue'
import QuestionUpload from '@/components/question-meta/QuestionUpload.vue'

export const QUESTION_TYPE_MAP = {
  input: QuestionInput,
  textarea: QuestionTextarea,
  radio: QuestionRadio,
  checkbox: QuestionCheckbox,
  upload: QuestionUpload,
}

export function resolveQuestionComponent(type) {
  return QUESTION_TYPE_MAP[type] || null
}
