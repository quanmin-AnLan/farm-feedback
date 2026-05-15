<template>
  <div class="feedback-by-id">
    <div v-if="loading" class="state state-loading">
      <i class="el-icon-loading" />
      <span>加载问卷配置中…</span>
    </div>

    <el-alert
      v-else-if="loadError"
      class="state"
      type="error"
      :title="loadError"
      show-icon
      :closable="false"
    />

    <FeedbackSurvey
      v-else
      :key="surveyKey"
      :questions-override="questions"
      :page-title="pageTitle"
      :page-desc="pageDesc"
    />
  </div>
</template>

<script>
import FeedbackSurvey from '@/views/FeedbackSurvey.vue'
import { fetchSurveyConfigById } from '@/api/farm'

export default {
  name: 'FeedbackById',
  components: { FeedbackSurvey },
  data() {
    return {
      loading: true,
      loadError: '',
      questions: [],
      pageTitle: '反馈',
      pageDesc: '',
    }
  },
  computed: {
    surveyKey() {
      return String(this.$route.params.id || '')
    },
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.loadConfig()
      },
    },
  },
  methods: {
    async loadConfig() {
      const id = this.$route.params.id
      if (id === undefined || id === null || String(id).trim() === '') {
        this.loading = false
        this.loadError = '缺少问卷 id'
        this.questions = []
        return
      }

      this.loading = true
      this.loadError = ''
      this.questions = []

      try {
        const { title, desc, questions } = await fetchSurveyConfigById(id)
        this.pageTitle = title || '反馈'
        this.pageDesc = desc || ''
        this.questions = Array.isArray(questions) ? questions : []
        if (this.questions.length === 0) {
          this.loadError = '未获取到题目配置，请检查接口返回'
        }
      } catch (e) {
        this.loadError =
          (e && typeof e.message === 'string' && e.message) || '加载配置失败'
        this.questions = []
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.feedback-by-id {
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
</style>
