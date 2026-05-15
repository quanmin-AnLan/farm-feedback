import axios from 'axios'

/** API 基础域名（业务请求与上传同源） */
export const API_BASE_URL = 'http://api.anlan.xyz'

/**
 * @param {import('axios').AxiosInstance} instance
 * @param {{ unwrapResponse?: boolean }} [options]
 */
export function setupInterceptors(instance, options = {}) {
  const { unwrapResponse = true } = options

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
    (response) => (unwrapResponse ? response.data : response),
    (error) => {
      const payload = error.response?.data
      let msg =
        error.message ||
        (typeof payload === 'string' ? payload : '') ||
        '请求失败'
      if (payload && typeof payload === 'object') {
        msg =
          payload.message ||
          payload.msg ||
          payload.error ||
          msg
      }
      const wrapped = new Error(msg)
      wrapped.raw = error
      wrapped.response = error.response
      return Promise.reject(wrapped)
    },
  )
}
