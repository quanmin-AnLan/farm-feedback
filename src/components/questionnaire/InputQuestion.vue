<template>
  <input
    v-if="native"
    class="native-field"
    type="text"
    :value="inner"
    :placeholder="placeholder"
    :maxlength="maxLen"
    :inputmode="question.isNum ? 'numeric' : 'text'"
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
export default {
  name: 'InputQuestion',
  props: {
    question: { type: Object, required: true },
    value: { type: [String, Number], default: '' },
    native: { type: Boolean, default: false },
  },
  computed: {
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
      this.onInput(e.target.value)
    },
    onInput(v) {
      if (this.question.isNum) {
        const s = String(v == null ? '' : v).replace(/\D/g, '')
        this.$emit('input', s)
        return
      }
      if (typeof this.maxLen === 'number' && typeof v === 'string') {
        this.$emit('input', v.slice(0, this.maxLen))
        return
      }
      this.$emit('input', v)
    },
  },
}
</script>

<style scoped>
::v-deep .q-field-input .el-input__inner {
  font-size: 16px;
}
</style>
