<template>
  <textarea
    v-if="native"
    class="native-field native-field--textarea"
    :value="inner"
    :placeholder="placeholder"
    :maxlength="maxLen"
    rows="4"
    @input="onNativeInput"
  />
  <el-input
    v-else
    class="q-field-textarea"
    :value="inner"
    type="textarea"
    :rows="4"
    resize="vertical"
    :show-word-limit="hasLimit"
    :maxlength="maxLen"
    :placeholder="placeholder"
    @input="emitInput"
  />
</template>

<script>
export default {
  name: 'TextareaQuestion',
  props: {
    question: { type: Object, required: true },
    value: { type: String, default: '' },
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
      this.emitInput(e.target.value)
    },
    emitInput(v) {
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
::v-deep .q-field-textarea .el-textarea__inner {
  font-size: 16px;
}
</style>
