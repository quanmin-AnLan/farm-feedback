<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link class="link" :to="{ name: 'FeedbackDefault' }">
      返回默认反馈页
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped lang="scss">
.not-found {
  padding: 48px 24px;
  text-align: center;
  color: #303133;
}

.not-found h1 {
  margin: 0 0 12px;
  font-size: 48px;
  font-weight: 600;
}

.not-found p {
  margin: 0 0 24px;
  color: #606266;
}

.link {
  color: #409eff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
