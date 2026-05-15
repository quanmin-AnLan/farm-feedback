<template>
  <div class="feedback-survey">
    <header class="page-head">
      <h2>{{ pageTitle }}</h2>
      <p v-if="pageDesc" class="page-desc">{{ pageDesc }}</p>
    </header>

    <el-form
      ref="surveyForm"
      class="survey-form"
      :model="answers"
      label-position="top"
      :rules="formRules"
    >
      <div v-for="q in visibleQuestions" :key="String(q.id)" class="q-block">
        <div class="q-title-line">
          <span v-if="q.require" class="req">*</span>
          <span class="q-title-text">{{ q.title }}</span>
        </div>

        <el-form-item class="q-item" :prop="String(q.id)">
          <component
            :is="fieldComponent(q.type)"
            v-if="fieldComponent(q.type)"
            :question="q"
            :value="answers[String(q.id)]"
            @input="(val) => onFieldInput(q, val)"
          />
          <el-alert
            v-else
            :title="`不支持的题型：${q.type}`"
            type="warning"
            :closable="false"
            show-icon
          />
        </el-form-item>
      </div>

      <div class="actions">
        <el-button type="primary" size="medium" @click="submitSurvey">
          提交
        </el-button>
        <el-button size="medium" @click="reset">重置</el-button>
      </div>
    </el-form>

    <el-dialog title="预览提交数据（已去除本地预览字段）" :visible.sync="previewVisible" width="640px">
      <pre class="payload-pre">{{ formattedPayload }}</pre>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="previewVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { resolveQuestionComponent } from '@/constants/questionComponents'
import { shouldShowQuestion } from '@/utils/questionRelation'
import { createQuestionValidator } from '@/utils/validateQuestionAnswer'

const DEMO_QUESTIONS = [
  {
    id: 'q1',
    title: '您的问题类型（单选 demo）',
    type: 'radio',
    placeholder: '',
    require: true,
    options: [
      { label: '类型 A（value=A）', value: 'A', openInput: false },
      {
        label: '类型 B（选了需补充）',
        value: 'B',
        openInput: true,
        openInputPlaceholder: '请简述',
        openInputMaxLength: 50,
      },
      {
        label: '类型 C',
        value: 'C',
        openInput: false,
      },
    ],
  },
  {
    id: 2,
    title: '当上一题选了 C，才会出现的题（条件展示 demo）',
    type: 'input',
    maxLength: 50,
    isNum: false,
    placeholder: '关联题：请输入',
    require: true,
    options: [],
    relation: {
      enabled: true,
      dependOnQuestionId: 'q1',
      showWhenOptionsSelected: ['C'],
    },
  },
  {
    id: 3,
    title: '简短说明（单行输入 + 字数限制 + 仅数字 demo）',
    type: 'input',
    maxLength: 100,
    isNum: true,
    placeholder: '仅输入数字',
    require: false,
  },
  {
    id: 4,
    title: '反馈详情（多行）',
    type: 'textarea',
    maxLength: 300,
    placeholder: '请详细描述',
    require: true,
  },
  {
    id: 5,
    title: '多选 demo',
    type: 'checkbox',
    require: false,
    options: [
      { label: '选项一', value: '1', openInput: false },
      {
        label: '选项二（开放填空）',
        value: '2',
        openInput: true,
        openInputPlaceholder: '补充说明',
        openInputMaxLength: 30,
      },
    ],
  },
  {
    id: 6,
    title: '上传图片 demo',
    type: 'upload',
    placeholder:
      '请上传 JPG/PNG（接口 http://api.anlan.xyz/farm/upload）',
    require: false,
    uploadLimit: 9,
  },
]

function deepCloneQuestions(list) {
  return JSON.parse(JSON.stringify(list || []))
}

function stripUploadMeta(payload) {
  const out = { ...payload }
  Object.keys(out).forEach((k) => {
    const v = out[k]
    if (Array.isArray(v)) {
      const isUploadRow =
        v.length > 0 && v.every((x) => x && typeof x === 'object' && 'url' in x)
      if (!isUploadRow) return
      out[k] = v.map(({ url, name }) => ({ url, name }))
    }
  })
  return out
}

export default {
  name: 'FeedbackSurvey',
  props: {
    /** 传入题目数组则按配置渲染；不传则使用内置 DEMO_QUESTIONS */
    questionsOverride: {
      validator: (v) => v === undefined || Array.isArray(v),
      default: undefined,
    },
    pageTitle: {
      type: String,
      default: '问卷调查 / 反馈',
    },
    pageDesc: {
      type: String,
      default:
        '各题型为元组件拼装；支持输入、多行、单选（含开放项）、多选（含开放项）、图片上传（本地预览）；支持关联条件展示。',
    },
  },
  data() {
    return {
      answers: {},
      previewVisible: false,
      formattedPayload: '',
    }
  },
  computed: {
    questions() {
      if (!Array.isArray(this.questionsOverride)) {
        return deepCloneQuestions(DEMO_QUESTIONS)
      }
      return deepCloneQuestions(this.questionsOverride)
    },
    visibleQuestions() {
      return this.questions.filter((q) =>
        shouldShowQuestion(q, this.questions, this.answers),
      )
    },
    visibleIdsKey() {
      return this.visibleQuestions
        .map((q) => String(q.id))
        .sort()
        .join('|')
    },
    formRules() {
      const ruleMap = {}
      this.visibleQuestions.forEach((q) => {
        const id = String(q.id)
        ruleMap[id] = [
          {
            validator: createQuestionValidator(q),
            trigger: ['change', 'blur'],
          },
        ]
      })
      return ruleMap
    },
  },
  watch: {
    visibleIdsKey: 'onVisibleIdsChange',
    answers: {
      deep: true,
      handler: 'enforceVisibilityAnswers',
    },
  },
  methods: {
    fieldComponent(type) {
      return resolveQuestionComponent(type)
    },
    onFieldInput(q, val) {
      const key = String(q.id)
      this.$set(this.answers, key, val)
    },
    onVisibleIdsChange() {
      this.enforceVisibilityAnswers()
      this.$nextTick(() => {
        const ref = this.$refs.surveyForm
        if (ref) ref.clearValidate()
      })
    },
    enforceVisibilityAnswers() {
      const keep = new Set(this.visibleQuestions.map((q) => String(q.id)))
      Object.keys(this.answers).forEach((k) => {
        if (!keep.has(k)) this.$delete(this.answers, k)
      })
    },
    reset() {
      this.answers = {}
      this.$nextTick(() => {
        const ref = this.$refs.surveyForm
        if (ref) ref.clearValidate()
      })
    },
    buildSubmitPayload() {
      return stripUploadMeta(JSON.parse(JSON.stringify(this.answers)))
    },
    async submitSurvey() {
      try {
        await this.validateFormAsync()
      } catch {
        return
      }
      const payload = this.buildSubmitPayload()
      this.formattedPayload = JSON.stringify(payload, null, 2)
      this.previewVisible = true
      this.$message.success('校验通过')
    },
    validateFormAsync() {
      const ref = this.$refs.surveyForm
      if (!ref) return Promise.reject(new Error('no form'))
      return new Promise((resolve, reject) => {
        ref.validate((valid) => {
          if (valid) resolve()
          else reject(new Error('invalid'))
        })
      })
    },
  },
}
</script>

<style scoped lang="scss">
.feedback-survey {
  padding-bottom: 48px;
}

.page-head {
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px;
    font-size: 22px;
    color: #303133;
    font-weight: 600;
  }
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.q-block {
  margin-bottom: 24px;
}

.q-title-line {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;

  .req {
    color: #f56c6c;
    margin-right: 6px;
    line-height: 1.7;
    font-size: 16px;
  }

  .q-title-text {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    line-height: 1.6;
  }
}

.q-item.el-form-item {
  margin-bottom: 0;

  &::v-deep .el-form-item__label {
    display: none !important;
  }
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px dashed #dcdfe6;
}

.payload-pre {
  max-height: 400px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.45;
}
</style>
