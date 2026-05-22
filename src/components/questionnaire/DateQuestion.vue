<template>
  <el-date-picker
    class="date-question"
    :value="inner"
    type="datetime"
    :placeholder="placeholder"
    value-format="yyyy-MM-dd HH:mm:ss"
    format="yyyy-MM-dd HH:mm:ss"
    clearable
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'DateQuestion',
  props: {
    question: { type: Object, required: true },
    value: { type: String, default: '' },
  },
  computed: {
    placeholder() {
      return this.question.placeholder || '请选择日期时间'
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
      this.$emit('input', v || '')
    },
  },
}
</script>

<style scoped>
.date-question {
  width: 100%;
  max-width: 360px;
}

.date-question ::v-deep .el-input__inner {
  font-size: 16px;
}
</style>
