<template>
  <div class="q-upload">
    <p v-if="hint" class="q-upload-hint">{{ hint }}</p>
    <el-upload
      class="pic-uploader"
      list-type="picture-card"
      :file-list="fileList"
      :auto-upload="true"
      :http-request="onRequest"
      :on-remove="onRemove"
      accept="image/*"
      multiple
      :limit="limit"
      :on-exceed="onExceed"
    >
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
import { uploadFarmImage } from '@/api/upload'

export default {
  name: 'UploadQuestion',
  props: {
    question: { type: Object, required: true },
    /** 每一项 { url: string, name?: string, uid?: string } */
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      limit: this.question.uploadLimit ?? 10,
      uidSeed: 1,
    }
  },
  computed: {
    hint() {
      return this.question.placeholder || ''
    },
    fileList() {
      const rows = Array.isArray(this.value) ? this.value : []
      return rows.map((item, idx) => {
        if (!item || typeof item !== 'object') {
          return { name: String(idx), url: '' }
        }
        const url = item.url || ''
        return {
          uid: item.uid != null ? item.uid : `u-${idx}`,
          name: item.name || `图片_${idx + 1}`,
          url,
        }
      })
    },
  },
  methods: {
    emitNext(list) {
      this.$emit('input', list)
      this.$emit('change', list)
    },
    async onRequest(option) {
      const { file, onSuccess, onError } = option
      try {
        const url = await uploadFarmImage(file)
        const prev = Array.isArray(this.value) ? this.value : []
        const row = {
          uid: `up-${Date.now()}-${this.uidSeed++}`,
          name: file.name,
          url,
        }
        this.emitNext([...prev, row])
        if (typeof onSuccess === 'function') {
          onSuccess({ url }, file)
        }
      } catch (err) {
        const msg =
          err && typeof err.message === 'string'
            ? err.message
            : '上传失败'
        this.$message.error(msg)
        if (typeof onError === 'function') {
          onError(err)
        }
      }
    },
    onRemove(file) {
      const uid = file.uid
      const prev = Array.isArray(this.value) ? this.value : []
      const row = prev.find((r) => r && r.uid === uid)
      if (row && row.url && String(row.url).startsWith('blob:')) {
        try {
          URL.revokeObjectURL(row.url)
        } catch {
          /* ignore */
        }
      }
      this.emitNext(prev.filter((r) => !r || r.uid !== uid))
    },
    onExceed() {
      this.$message.warning(`最多上传 ${this.limit} 张图片`)
    },
  },
}
</script>

<style scoped lang="scss">
.q-upload-hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.pic-uploader {
  line-height: 1;
}
</style>
