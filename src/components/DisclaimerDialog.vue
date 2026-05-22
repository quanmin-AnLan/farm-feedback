<template>
  <el-dialog
    :title="title"
    :visible.sync="innerVisible"
    width="92%"
    top="8vh"
    custom-class="disclaimer-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
  >
    <div class="disclaimer-dialog__scroll">
      <p class="disclaimer-dialog__intro">{{ intro }}</p>
      <section
        v-for="(sec, idx) in sections"
        :key="idx"
        class="disclaimer-dialog__section"
      >
        <h4 class="disclaimer-dialog__section-title">{{ sec.title }}</h4>
        <p class="disclaimer-dialog__section-body">{{ sec.body }}</p>
      </section>
      <p
        v-for="(line, idx) in footer"
        :key="'f-' + idx"
        class="disclaimer-dialog__footer-line"
      >
        {{ line }}
      </p>
    </div>
    <span slot="footer" class="disclaimer-dialog__footer">
      <el-button type="primary" class="disclaimer-dialog__btn" @click="onAccept">
        我已阅读并同意
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  DISCLAIMER_TITLE,
  DISCLAIMER_INTRO,
  DISCLAIMER_SECTIONS,
  DISCLAIMER_FOOTER,
  saveDisclaimerAccepted,
} from '@/constants/disclaimer'

export default {
  name: 'DisclaimerDialog',
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      title: DISCLAIMER_TITLE,
      intro: DISCLAIMER_INTRO,
      sections: DISCLAIMER_SECTIONS,
      footer: DISCLAIMER_FOOTER,
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },
  methods: {
    onAccept() {
      saveDisclaimerAccepted()
      this.innerVisible = false
      this.$emit('accepted')
    },
  },
}
</script>

<style lang="scss">
.disclaimer-dialog {
  max-width: 560px;
  margin: 0 auto;

  .el-dialog__body {
    padding: 12px 20px 8px;
  }

  .el-dialog__footer {
    padding: 12px 20px 16px;
  }
}

.disclaimer-dialog__scroll {
  max-height: 58vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  font-size: 14px;
  line-height: 1.65;
  color: #606266;
}

.disclaimer-dialog__intro {
  margin: 0 0 14px;
  font-weight: 600;
  color: #303133;
}

.disclaimer-dialog__section {
  margin-bottom: 12px;
}

.disclaimer-dialog__section-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.disclaimer-dialog__section-body {
  margin: 0;
  text-align: justify;
}

.disclaimer-dialog__footer-line {
  margin: 8px 0 0;
  font-size: 13px;
  color: #909399;
  text-align: right;
}

.disclaimer-dialog__footer {
  display: block;
  width: 100%;
  text-align: center;
}

.disclaimer-dialog__btn {
  width: 100%;
  max-width: 320px;
  font-size: 16px;
}
</style>
