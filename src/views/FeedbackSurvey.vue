<template>
  <div class="feedback-survey">
    <header class="page-head">
      <h2>当前反馈类型：{{ pageTitle }}</h2>
      <p v-if="pageDesc" class="page-desc">{{ pageDesc }}</p>
    </header>

    <el-form
      ref="surveyForm"
      class="survey-form"
      :model="answers"
      label-position="top"
      :rules="formRules"
      :validate-on-rule-change="false"
    >
      <div
        v-for="q in visibleQuestions"
        :key="String(q.id)"
        class="q-block"
        :class="{ 'q-block--group-error': !!groupErrorForQuestion(q) }"
      >
        <div class="q-title-line">
          <span v-if="q.require" class="req">*</span>
          <span v-else-if="isInGroupRequire(q)" class="req-group" title="组合必填">~</span>
          <span class="q-title-text">{{ q.title }}</span>
        </div>

        <el-form-item class="q-item" :prop="String(q.id)">
          <component
            :is="fieldComponent(q.type)"
            v-if="fieldComponent(q.type)"
            :native="useNativeControls"
            :question="q"
            :value="answers[String(q.id)]"
            @input="(val) => onFieldInput(q, val)"
            @blur.native="() => onFieldBlur(q)"
          />
          <el-alert
            v-else
            :title="`不支持的题型：${q.type}`"
            type="warning"
            :closable="false"
            show-icon
          />
        </el-form-item>
        <p v-if="groupErrorForQuestion(q)" class="q-group-error">
          {{ groupErrorForQuestion(q) }}
        </p>
      </div>

      <div class="actions">
        <el-button
          type="primary"
          size="medium"
          :loading="submitting"
          @click="submitSurvey"
        >
          提交
        </el-button>
        <el-button size="medium" :disabled="submitting" @click="reset">
          重置
        </el-button>
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
import InputQuestion from '@/components/questionnaire/InputQuestion.vue'
import TextareaQuestion from '@/components/questionnaire/TextareaQuestion.vue'
import RadioQuestion from '@/components/questionnaire/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questionnaire/CheckboxQuestion.vue'
import UploadQuestion from '@/components/questionnaire/UploadQuestion.vue'
import DateQuestion from '@/components/questionnaire/DateQuestion.vue'
import { resolveQuestionComponentName } from '@/constants/questionComponents'
import { shouldShowQuestion } from '@/utils/questionRelation'
import { createQuestionValidator } from '@/utils/validateQuestionAnswer'
import {
  validateAllGroupRequires,
  getGroupsForQuestion,
  getActiveGroupMembers,
} from '@/utils/groupRequire'
import { preferNativeFormControls, syncMobileRootClass } from '@/utils/mobileClient'
import { submitAnswer } from '@/api/questionnaire'

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
    placeholder: '请上传 JPG/JPEG/PNG，单张不超过 10MB',
    require: false,
    uploadLimit: 9,
  },
  {
    id: 7,
    title: '期望处理时间（日期 demo）',
    type: 'date',
    placeholder: '请选择日期时间',
    require: false,
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
  components: {
    InputQuestion,
    TextareaQuestion,
    RadioQuestion,
    CheckboxQuestion,
    UploadQuestion,
    DateQuestion,
  },
  props: {
    /** 传入题目数组则按配置渲染；不传则使用内置 DEMO_QUESTIONS */
    questionsOverride: {
      validator: (v) => v === undefined || Array.isArray(v),
      default: undefined,
    },
    groupRequiresOverride: {
      validator: (v) => v === undefined || Array.isArray(v),
      default: undefined,
    },
    /** 真实问卷 id；传入则点击提交时调用 /questionnaire/:id/answer；不传则走本地预览 */
    questionnaireId: {
      type: String,
      default: '',
    },
    pageTitle: {
      type: String,
      default: '问卷调查 / 反馈',
    },
    pageDesc: {
      type: String,
      default:
        '各题型为元组件拼装；支持输入、多行、单选（含开放项）、多选（含开放项）、日期时间、图片上传（本地预览）；支持关联条件展示。',
    },
    /** 自定义提交成功文案 */
    successText: {
      type: String,
      default: '',
    },
    /** 提交成功后跳转地址 */
    redirectUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      answers: {},
      submitting: false,
      previewVisible: false,
      formattedPayload: '',
      /** 是否已点击过提交（此后才展示未填必填项错误） */
      submitAttempted: false,
      /** 用户已交互过的题目 id */
      touched: {},
      /** 组合必填错误 { [groupId]: message } */
      groupErrors: {},
      /** 触发窄屏 / 旋转时重新计算是否使用原生控件 */
      viewportKey: 0,
    }
  },
  mounted() {
    const onViewportChange = () => {
      this.viewportKey += 1
      syncMobileRootClass()
    }
    this._onViewportChange = onViewportChange
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('orientationchange', onViewportChange)
    syncMobileRootClass()
  },
  beforeDestroy() {
    if (this._onViewportChange) {
      window.removeEventListener('resize', this._onViewportChange)
      window.removeEventListener('orientationchange', this._onViewportChange)
    }
  },
  computed: {
    useNativeControls() {
      void this.viewportKey
      return preferNativeFormControls()
    },
    questions() {
      if (!Array.isArray(this.questionsOverride)) {
        return deepCloneQuestions(DEMO_QUESTIONS)
      }
      return deepCloneQuestions(this.questionsOverride)
    },
    groupRequires() {
      if (!Array.isArray(this.groupRequiresOverride)) return []
      return JSON.parse(JSON.stringify(this.groupRequiresOverride))
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
            validator: createQuestionValidator(q, {
              shouldShowError: () =>
                this.submitAttempted || !!this.touched[id],
            }),
            trigger: [],
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
      return resolveQuestionComponentName(type)
    },
    markTouched(id) {
      if (!this.touched[id]) {
        this.$set(this.touched, id, true)
      }
    },
    onFieldInput(q, val) {
      const key = String(q.id)
      this.$set(this.answers, key, val)
      this.markTouched(key)
      if (this.submitAttempted) {
        this.$nextTick(() => {
          this.validateField(key)
          this.revalidateGroupsForQuestion(key)
        })
      }
    },
    onFieldBlur(q) {
      this.markTouched(String(q.id))
    },
    onVisibleIdsChange() {
      this.enforceVisibilityAnswers()
      this.pruneTouched()
      this.syncGroupErrors()
      this.$nextTick(() => {
        const ref = this.$refs.surveyForm
        if (ref) ref.clearValidate()
      })
    },
    pruneTouched() {
      const keep = new Set(this.visibleQuestions.map((q) => String(q.id)))
      Object.keys(this.touched).forEach((id) => {
        if (!keep.has(id)) this.$delete(this.touched, id)
      })
    },
    validateField(prop) {
      const ref = this.$refs.surveyForm
      if (!ref) return
      ref.validateField(prop, () => {})
    },
    enforceVisibilityAnswers() {
      const keep = new Set(this.visibleQuestions.map((q) => String(q.id)))
      Object.keys(this.answers).forEach((k) => {
        if (!keep.has(k)) this.$delete(this.answers, k)
      })
    },
    isInGroupRequire(q) {
      return getGroupsForQuestion(this.groupRequires, q.id).length > 0
    },
    groupErrorForQuestion(q) {
      const qid = String(q.id)
      for (let i = 0; i < this.groupRequires.length; i += 1) {
        const g = this.groupRequires[i]
        const msg = this.groupErrors[String(g.id)]
        if (!msg) continue
        const members = getActiveGroupMembers(g, this.questions, this.answers)
        if (members.length && String(members[0].id) === qid) return msg
      }
      return ''
    },
    syncGroupErrors() {
      if (!this.submitAttempted) {
        this.groupErrors = {}
        return
      }
      const errs = validateAllGroupRequires(
        this.groupRequires,
        this.questions,
        this.answers,
      )
      const next = {}
      errs.forEach((e) => {
        next[e.groupId] = e.message
      })
      this.groupErrors = next
    },
    revalidateGroupsForQuestion(questionId) {
      getGroupsForQuestion(this.groupRequires, questionId).forEach((g) => {
        const errs = validateAllGroupRequires(
          [g],
          this.questions,
          this.answers,
        )
        const gid = String(g.id)
        if (errs.length) {
          this.$set(this.groupErrors, gid, errs[0].message)
        } else {
          this.$delete(this.groupErrors, gid)
        }
      })
    },
    validateGroupRequiresAsync() {
      const errs = validateAllGroupRequires(
        this.groupRequires,
        this.questions,
        this.answers,
      )
      const next = {}
      errs.forEach((e) => {
        next[e.groupId] = e.message
        ;(e.questionIds || []).forEach((id) => this.markTouched(String(id)))
      })
      this.groupErrors = next
      return errs.length ? Promise.reject(new Error('group invalid')) : Promise.resolve()
    },
    reset() {
      this.answers = {}
      this.submitAttempted = false
      this.touched = {}
      this.groupErrors = {}
      this.$nextTick(() => {
        const ref = this.$refs.surveyForm
        if (ref) ref.clearValidate()
      })
    },
    buildSubmitPayload() {
      return stripUploadMeta(JSON.parse(JSON.stringify(this.answers)))
    },
    async submitSurvey() {
      this.submitAttempted = true
      try {
        await this.validateFormAsync()
        await this.validateGroupRequiresAsync()
      } catch {
        this.$message.warning('请完善必填项后再提交')
        this.scrollToFirstError()
        return
      }
      const payload = this.buildSubmitPayload()
      // 未指定 questionnaireId：保持原 demo 行为，弹预览
      if (!this.questionnaireId) {
        this.formattedPayload = JSON.stringify(payload, null, 2)
        this.previewVisible = true
        this.$message.success('校验通过')
        return
      }
      // 真实问卷：调用服务端接口
      this.submitting = true
      try {
        await submitAnswer(this.questionnaireId, payload)
        this.$message.success(this.successText || '提交成功，感谢您的参与')
        this.answers = {}
        this.submitAttempted = false
        this.touched = {}
        this.groupErrors = {}
        this.$nextTick(() => {
          const ref = this.$refs.surveyForm
          if (ref) ref.clearValidate()
        })
        if (this.redirectUrl) {
          // 给 Message 留出可见时间再跳转
          setTimeout(() => {
            window.location.href = this.redirectUrl
          }, 800)
        }
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.submitting = false
      }
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
    scrollToFirstError() {
      this.$nextTick(() => {
        const node =
          this.$el.querySelector('.q-block--group-error') ||
          this.$el.querySelector('.el-form-item.is-error')
        if (node && typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
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

.q-block--group-error {
  padding: 8px 10px;
  margin-left: -10px;
  margin-right: -10px;
  border-radius: 4px;
  background: #fef0f0;
}

.q-group-error {
  margin: 6px 0 0;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1.5;
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

  .req-group {
    flex-shrink: 0;
    margin-right: 6px;
    font-size: 16px;
    line-height: 1.7;
    font-weight: 600;
    color: #e6a23c;
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
