<template>
  <div id="app" class="app-root">
    <header class="app-header">
      <h1 class="title">farm-feedback</h1>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei',
    sans-serif;
  background: #f5f7fa;
}

#app {
  min-height: 100vh;
}

.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.app-main {
  flex: 1;
  padding: 24px;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
}
</style>
