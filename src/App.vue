<template>
  <div id="app" class="app-root">
    <disclaimer-dialog
      :visible.sync="disclaimerVisible"
      :dismissible="disclaimerReviewMode"
      @closed="onDisclaimerClosed"
    />

    <header class="app-header">
      <div class="app-header__row">
        <h1 class="title">安澜的农场反馈</h1>
        <button
          type="button"
          class="disclaimer-link"
          aria-label="查看免责声明"
          @click="openDisclaimer"
        >
          免责声明
        </button>
      </div>
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
      disclaimerReviewMode: false,
    }
  },
  created() {
    if (!hasAcceptedDisclaimer()) {
      this.disclaimerReviewMode = false
      this.disclaimerVisible = true
    }
  },
  methods: {
    openDisclaimer() {
      this.disclaimerReviewMode = hasAcceptedDisclaimer()
      this.disclaimerVisible = true
    },
    onDisclaimerClosed() {
      this.disclaimerReviewMode = false
    },
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

.app-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #8f0bbb;
}

.disclaimer-link {
  flex-shrink: 0;
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  line-height: 1.4;
  color: #606266;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;

  &:hover {
    color: #8f0bbb;
    border-color: #c9a0d9;
    background: #faf5fc;
  }

  &:active {
    background: #f3ebf8;
  }
}

.app-main {
  flex: 1;
  padding: 24px;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
}
</style>
