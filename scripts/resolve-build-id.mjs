import { execSync } from 'child_process'

/**
 * 构建版本号：用于打入 bundle，确保每次构建产物 hash 会更新。
 * 优先级：BUILD_ID 环境变量 > git 短提交 > 时间戳
 */
export function resolveBuildId() {
  if (process.env.BUILD_ID) {
    return String(process.env.BUILD_ID).trim()
  }
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return String(Date.now())
  }
}
