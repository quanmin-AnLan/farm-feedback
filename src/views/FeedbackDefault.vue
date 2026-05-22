<template>
  <div class="feedback-default">
    <div v-if="loadingTypes" class="state state-loading">
      <i class="el-icon-loading" />
      <span>加载反馈类型…</span>
    </div>

    <el-alert
      v-else-if="typesError"
      class="state"
      type="error"
      :title="typesError"
      show-icon
      :closable="false"
    />

    <template v-else>
      <div class="type-toolbar">
        <select
          v-if="useNativeSelect"
          v-model="selectedValue"
          class="type-select type-select--native"
          @change="onTypeChange(selectedValue)"
        >
          <option
            v-for="opt in typeOptions"
            :key="String(opt.value)"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <el-select
          v-else
          v-model="selectedValue"
          class="type-select"
          filterable
          placeholder="请选择反馈类型"
          @change="onTypeChange"
        >
          <el-option
            v-for="opt in typeOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>

      <div v-if="loadingSurvey" class="state state-loading survey-loading">
        <i class="el-icon-loading" />
        <span>加载问卷题目…</span>
      </div>

      <el-alert
        v-else-if="surveyError"
        class="state"
        type="error"
        :title="surveyError"
        show-icon
        :closable="false"
      />

      <FeedbackSurvey
        v-else-if="questions.length > 0"
        :key="surveyKey"
        :questionnaire-id="questionnaireId"
        :questions-override="questions"
        :group-requires-override="groupRequires"
        :page-title="pageTitle"
        :page-desc="pageDesc"
        :success-text="successText"
        :redirect-url="redirectUrl"
      />
    </template>
  </div>
</template>

<script>
import FeedbackSurvey from '@/views/FeedbackSurvey.vue'
import { fetchDefaultConfig, fetchSurveyConfigById } from '@/api/questionnaire'
import { preferNativeFormControls } from '@/utils/mobileClient'

export default {
  name: 'FeedbackDefault',
  components: { FeedbackSurvey },
  data() {
    return {
      loadingTypes: true,
      typesError: '',
      typeOptions: [],
      selectedValue: '',
      loadingSurvey: false,
      surveyError: '',
      questionnaireId: '',
      questions: [],
      groupRequires: [],
      pageTitle: '反馈',
      pageDesc: '',
      successText: '',
      redirectUrl: '',
      loadSurveySeq: 0,
      useNativeSelect: preferNativeFormControls(),
    }
  },
  mounted() {
    this._onResize = () => {
      this.useNativeSelect = preferNativeFormControls()
    }
    window.addEventListener('resize', this._onResize)
    window.addEventListener('orientationchange', this._onResize)
  },
  beforeDestroy() {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize)
      window.removeEventListener('orientationchange', this._onResize)
    }
  },
  computed: {
    surveyKey() {
      return String(this.selectedValue)
    },
  },
  async created() {
    await this.initTypes()
  },
  methods: {
    async initTypes() {
      this.loadingTypes = true
      this.typesError = ''
      this.typeOptions = []
      this.selectedValue = ''

      try {
        const list = await fetchDefaultConfig()
        this.typeOptions = Array.isArray(list) ? list : []
        if (this.typeOptions.length === 0) {
          this.typesError = '暂无可选的反馈类型'
          return
        }
        const first = this.typeOptions[0]
        this.selectedValue = first.value
        await this.loadSurveyForValue(first.value)
      } catch (e) {
        this.typesError =
          (e && typeof e.message === 'string' && e.message) ||
          '加载反馈类型失败'
      } finally {
        this.loadingTypes = false
      }
    },

    async onTypeChange(val) {
      await this.loadSurveyForValue(val)
    },

    async loadSurveyForValue(id) {
      if (id === undefined || id === null || String(id).trim() === '') {
        this.surveyError = ''
        this.questions = []
        return
      }

      const seq = (this.loadSurveySeq += 1)

      this.loadingSurvey = true
      this.surveyError = ''
      this.questions = []

      try {
        const detail = await fetchSurveyConfigById(id)
        if (seq !== this.loadSurveySeq) return
        const { questionnaireId, title, description, questions, groupRequires, success } =
          detail
        this.questionnaireId = questionnaireId || String(id)
        this.pageTitle = title || '反馈'
        this.pageDesc = description || ''
        this.questions = Array.isArray(questions) ? questions : []
        this.groupRequires = Array.isArray(groupRequires) ? groupRequires : []
        const sc = success || {}
        this.successText = sc.textMode === 'custom' ? sc.customText || '' : ''
        this.redirectUrl = sc.redirectUrl || ''
        if (this.questions.length === 0) {
          this.surveyError = '未获取到题目配置，请检查接口返回'
        }
      } catch (e) {
        if (seq !== this.loadSurveySeq) return
        this.surveyError =
          (e && typeof e.message === 'string' && e.message) ||
          '加载问卷配置失败'
      } finally {
        if (seq === this.loadSurveySeq) {
          this.loadingSurvey = false
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.feedback-default {
  min-height: 200px;
}

.state {
  margin: 24px 0;
}

.state-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;

  .el-icon-loading {
    font-size: 18px;
  }
}

.survey-loading {
  margin-top: 16px;
}

.type-toolbar {
  margin-bottom: 8px;
}

.type-select {
  width: 100%;
  max-width: 420px;
}

.type-select--native {
  padding: 10px 36px 10px 12px;
  font-size: 16px;
  line-height: 1.5;
  color: #606266;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  appearance: auto;
  -webkit-appearance: menulist;

  &:focus {
    border-color: #409eff;
    outline: none;
  }
}
</style>
