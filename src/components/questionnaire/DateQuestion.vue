<template>
  <input
    v-if="native"
    class="native-field date-question-native"
    type="datetime-local"
    :value="nativeValue"
    @input="onNativeInput"
  />
  <el-date-picker
    v-else
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
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/utils/dateValue'

export default {
  name: 'DateQuestion',
  props: {
    question: { type: Object, required: true },
    value: { type: String, default: '' },
    native: { type: Boolean, default: false },
  },
  computed: {
    placeholder() {
      return this.question.placeholder || '请选择日期时间'
    },
    inner() {
      return this.value === undefined || this.value === null
        ? ''
        : String(this.value)
    },
    nativeValue() {
      return toDatetimeLocalValue(this.inner)
    },
  },
  methods: {
    onNativeInput(e) {
      this.$emit('input', fromDatetimeLocalValue(e.target.value))
    },
    onInput(v) {
      this.$emit('input', v || '')
    },
  },
}
</script>

<style scoped>
.date-question-native {
  max-width: 360px;
}

.date-question {
  width: 100%;
  max-width: 360px;
}

.date-question ::v-deep .el-input__inner {
  font-size: 16px;
}
</style>
