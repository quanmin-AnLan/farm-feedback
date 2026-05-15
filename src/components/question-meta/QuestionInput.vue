<template>
  <el-input
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
  name: 'QuestionInput',
  props: {
    question: { type: Object, required: true },
    value: { type: [String, Number], default: '' },
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
    inner: {
      get() {
        return this.value === undefined || this.value === null
          ? ''
          : String(this.value)
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
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
