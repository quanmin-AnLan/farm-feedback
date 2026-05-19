<template>
  <div class="q-radio">
    <el-radio-group :value="selected" @input="setSelected">
      <div
        v-for="opt in options"
        :key="String(opt.value)"
        class="q-radio-row"
      >
        <el-radio :label="opt.labelValue">
          {{ opt.label }}
        </el-radio>
        <el-input
          v-if="opt.openInput && selected === opt.labelValue"
          :value="openTexts[opt.labelValue]"
          size="small"
          class="q-radio-open"
          :placeholder="
            opt.openInputPlaceholder ||
            openPlaceholderDefault
          "
          :maxlength="optOpenMax(opt)"
          :show-word-limit="openShowLimit(opt)"
          @input="(v) => setOpen(opt.labelValue, v)"
        />
      </div>
    </el-radio-group>
  </div>
</template>

<script>
function normalizeInbound(question, value) {
  if (typeof value === 'string') {
    return { value, openTexts: {} }
  }
  if (value && typeof value === 'object') {
    const raw = value.value != null ? String(value.value) : ''
    const openTexts = { ...(value.openTexts || {}) }
    return { value: raw, openTexts }
  }
  return { value: '', openTexts: {} }
}

export default {
  name: 'RadioQuestion',
  props: {
    question: { type: Object, required: true },
    value: {
      type: [String, Object],
      default: () => ({
        value: '',
        openTexts: {},
      }),
    },
  },
  data() {
    return {
      openPlaceholderDefault: '请输入',
    }
  },
  computed: {
    options() {
      return (this.question.options || []).map((o) => ({
        ...o,
        labelValue: String(o.value),
      }))
    },
    normalized() {
      return normalizeInbound(this.question, this.value)
    },
    selected() {
      return this.normalized.value
    },
    openTexts() {
      return this.normalized.openTexts
    },
  },
  methods: {
    emitPayload(next) {
      this.$emit('input', next)
      this.$emit('change', next)
    },
    setSelected(v) {
      const nextOpen = { ...this.openTexts }
      Object.keys(nextOpen).forEach((k) => {
        if (k !== String(v)) delete nextOpen[k]
      })
      this.emitPayload({
        value: String(v),
        openTexts: nextOpen,
      })
    },
    setOpen(optionValue, text) {
      const maxLen = this.optOpenMaxByValue(optionValue)
      let t = text == null ? '' : String(text)
      if (typeof maxLen === 'number' && maxLen >= 0) {
        t = t.slice(0, maxLen)
      }
      this.emitPayload({
        value: this.selected,
        openTexts: {
          ...this.openTexts,
          [String(optionValue)]: t,
        },
      })
    },
    optOpenMax(opt) {
      const n = opt.openInputMaxLength
      return typeof n === 'number' && n >= 0 ? n : undefined
    },
    openShowLimit(opt) {
      return this.optOpenMax(opt) !== undefined
    },
    optOpenMaxByValue(optionValue) {
      const opt = this.options.find((o) => o.labelValue === String(optionValue))
      return opt ? this.optOpenMax(opt) : undefined
    },
  },
}
</script>

<style scoped lang="scss">
.q-radio-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.q-radio-open {
  width: 100%;
  max-width: 360px;
  margin: 8px 0 0 24px;
}
</style>
