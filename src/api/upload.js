import http from './http'

/** POST /farm/upload → http://api.anlan.xyz/farm/upload，仅 multipart 字段 file */
export const FARM_UPLOAD_PATH = '/farm/upload'

function pickRemoteUrl(payload) {
  if (payload == null) return ''
  if (typeof payload === 'string') return payload.trim()
  if (typeof payload !== 'object') return ''

  const direct =
    payload.url ||
    payload.path ||
    payload.link ||
    payload.src ||
    payload.result ||
    ''
  if (direct) return String(direct)

  const inner = payload.data
  if (typeof inner === 'string') return inner.trim()
  if (inner && typeof inner === 'object') {
    const u = inner.url || inner.path || inner.link
    if (u) return String(u)
  }

  return ''
}

/**
 * @param {File | Blob} file
 * @returns {Promise<string>} 服务端返回的图片地址
 */
export async function uploadFarmImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const data = await http.post(FARM_UPLOAD_PATH, fd, {
    timeout: 120000,
  })
  const url = pickRemoteUrl(data)
  if (!url) {
    throw new Error('上传成功但未解析到图片地址')
  }
  return url
}
