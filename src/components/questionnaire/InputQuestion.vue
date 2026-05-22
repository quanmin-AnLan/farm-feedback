<template>
  <input
    v-if="native"
    class="native-field"
    type="text"
    :value="inner"
    :placeholder="placeholder"
    :maxlength="maxLen"
    :inputmode="numericOnly ? 'numeric' : 'text'"
    :pattern="numericOnly ? '[0-9]*' : undefined"
    @input="onNativeInput"
  />
  <el-input
    v-else
    class="q-field-input"
    :value="inner"
    :show-word-limit="hasLimit"
    :maxlength="maxLen"
    type="text"
    :placeholder="placeholder"
    clearable
    @input="onInput"
  />
</template>

<script>
import {
  isInputNumeric,
  normalizeInputValue,
} from '@/utils/inputNumeric'

export default {
  name: 'InputQuestion',
  props: {
    question: { type: Object, required: true },
    value: { type: [String, Number], default: '' },
    native: { type: Boolean, default: false },
  },
  computed: {
    numericOnly() {
      return isInputNumeric(this.question)
    },
    placeholder() {
      return this.question.placeholder || '请输入'
    },
    maxLen() {
      const n = this.question.maxLength
      return typeof n === 'number' && n >= 0 ? n : undefined
    },
    hasLimit() {
      return this.maxLen !== undefined
    },
    inner() {
      return this.value === undefined || this.value === null
        ? ''
        : String(this.value)
    },
  },
  methods: {
    onNativeInput(e) {
      const el = e.target
      const next = normalizeInputValue(this.question, el.value)
      // iOS 原生 input：仅 emit 而 DOM 不刷新时，会出现仍可输入非数字的假象
      if (el.value !== next) {
        el.value = next
      }
      this.$emit('input', next)
    },
    onInput(v) {
      this.$emit('input', normalizeInputValue(this.question, v))
    },
  },
}
</script>

<style scoped>
::v-deep .q-field-input .el-input__inner {
  font-size: 16px;
}
</style>
