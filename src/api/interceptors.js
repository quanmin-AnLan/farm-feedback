import { Message } from 'element-ui'

/**
 * API 基础域名
 * - 优先读取 VITE_API_BASE_URL（构建/运行期注入）
 * - 缺省回退到生产域名，避免本地调试忘记配置时直接报错
 */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  'http://api.anlan.xyz'

/**
 * @param {import('axios').AxiosInstance} instance
 * @param {{ unwrapResponse?: boolean, silent?: boolean }} [options]
 *   - silent: 关闭统一错误提示（部分静默接口可单独传 true）
 */
export function setupInterceptors(instance, options = {}) {
  const { unwrapResponse = true, silent = false } = options

  instance.interceptors.request.use(
    (config) => {
      if (!(config.data instanceof FormData)) {
        const method = (config.method || 'get').toLowerCase()
        if (method !== 'get' && method !== 'head') {
          config.headers = config.headers || {}
          if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8'
          }
        }
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => {
      const payload = response.data
      // 服务端统一格式：{ code, success, data, msg }
      if (
        unwrapResponse &&
        payload &&
        typeof payload === 'object' &&
        'code' in payload
      ) {
        if (payload.code === 200) return payload.data
        const msg = payload.msg || payload.message || '请求失败'
        if (!silent && response.config && !response.config.silent) {
          Message.error(msg)
        }
        const wrapped = new Error(msg)
        wrapped.code = payload.code
        wrapped.response = response
        return Promise.reject(wrapped)
      }
      return unwrapResponse ? payload : response
    },
    (error) => {
      const payload = error.response?.data
      let msg =
        error.message ||
        (typeof payload === 'string' ? payload : '') ||
        '请求失败'
      if (payload && typeof payload === 'object') {
        msg = payload.msg || payload.message || payload.error || msg
      }
      if (!silent && error.config && !error.config.silent) {
        Message.error(msg)
      }
      const wrapped = new Error(msg)
      wrapped.raw = error
      wrapped.response = error.response
      return Promise.reject(wrapped)
    },
  )
}
