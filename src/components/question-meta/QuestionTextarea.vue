<template>
  <el-input
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
  name: 'QuestionTextarea',
  props: {
    question: { type: Object, required: true },
    value: { type: String, default: '' },
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
