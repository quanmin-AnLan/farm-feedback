/**
 * 移动端 / iOS 检测（用于原生表单控件、防 iOS 输入放大等）
 */

export function isIos() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/i.test(ua)) return true
  // iPadOS 13+ 桌面 UA
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export function isNarrowViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px)').matches
}

/** 是否优先使用原生表单控件（避免 el-select 双击、iOS 输入框放大） */
export function preferNativeFormControls() {
  if (isIos()) return true
  return isNarrowViewport()
}

export function syncMobileRootClass() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const mobile = preferNativeFormControls()
  root.classList.toggle('farm-mobile', mobile)
  root.classList.toggle('farm-ios', isIos())
}
