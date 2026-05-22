<template>
  <div class="q-cb">
    <el-checkbox-group :value="selected" @input="setSelected">
      <div v-for="opt in options" :key="String(opt.value)" class="q-cb-row">
        <el-checkbox :label="opt.labelValue">{{ opt.label }}</el-checkbox>
        <el-input
          v-if="opt.openInput && selected.includes(opt.labelValue)"
          :value="openTexts[opt.labelValue]"
          size="small"
          class="q-cb-open"
          :placeholder="opt.openInputPlaceholder || defaultOpenPh"
          :maxlength="optOpenMax(opt)"
          :show-word-limit="openShowLimit(opt)"
          @input="(v) => setOpen(opt.labelValue, v)"
        />
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
function normalizeInbound(value) {
  if (Array.isArray(value))
    return { values: [...value].map(String), openTexts: {} }
  if (value && typeof value === 'object' && Array.isArray(value.values)) {
    return {
      values: value.values.map(String),
      openTexts: { ...(value.openTexts || {}) },
    }
  }
  return { values: [], openTexts: {} }
}

export default {
  name: 'CheckboxQuestion',
  props: {
    question: { type: Object, required: true },
    native: { type: Boolean, default: false },
    value: {
      type: [Array, Object],
      default: () => ({
        values: [],
        openTexts: {},
      }),
    },
  },
  data() {
    return {
      defaultOpenPh: '请输入',
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
      return normalizeInbound(this.value)
    },
    selected() {
      return this.normalized.values
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
    setSelected(arr) {
      const nextSel = (arr || []).map(String)
      const nextOpen = { ...this.openTexts }
      Object.keys(nextOpen).forEach((k) => {
        if (!nextSel.includes(k)) delete nextOpen[k]
      })
      this.emitPayload({
        values: nextSel,
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
        values: [...this.selected],
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
.q-cb-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.q-cb-open {
  width: 100%;
  max-width: 360px;
  margin: 8px 0 0 28px;
}
</style>
