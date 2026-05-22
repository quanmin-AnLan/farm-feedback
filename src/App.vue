<template>
  <div id="app" class="app-root">
    <disclaimer-dialog :visible.sync="disclaimerVisible" />

    <header class="app-header">
      <h1 class="title">安澜的农场反馈</h1>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
import DisclaimerDialog from '@/components/DisclaimerDialog.vue'
import { hasAcceptedDisclaimer } from '@/constants/disclaimer'
import { syncMobileRootClass } from '@/utils/mobileClient'

export default {
  name: 'App',
  components: { DisclaimerDialog },
  data() {
    return {
      disclaimerVisible: false,
    }
  },
  created() {
    this.disclaimerVisible = !hasAcceptedDisclaimer()
  },
  mounted() {
    syncMobileRootClass()
    this._onResize = () => syncMobileRootClass()
    window.addEventListener('resize', this._onResize)
    window.addEventListener('orientationchange', this._onResize)
  },
  beforeDestroy() {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize)
      window.removeEventListener('orientationchange', this._onResize)
    }
  },
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
  color: #8f0bbb;
}

.app-main {
  flex: 1;
  padding: 24px;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
}
</style>
