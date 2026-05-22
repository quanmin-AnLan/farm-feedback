/** localStorage 键；升级免责条款时递增 DISCLAIMER_VERSION 可要求用户重新确认 */
export const DISCLAIMER_STORAGE_KEY = 'farm_feedback_disclaimer_accepted'
export const DISCLAIMER_VERSION = 1

export const DISCLAIMER_TITLE = '免责声明'

export const DISCLAIMER_INTRO =
  '本网页为安澜(以下简称"我")个人维护的非官方页面'

export const DISCLAIMER_SECTIONS = [
  {
    title: '1. 非官方性质',
    body: '本网页（以下简称“本平台”）由我个人出于方便收集玩家反馈意见之目的自行搭建与管理，与“QQ经典农场”及其所属公司、关联方、运营团队无任何隶属、代理或官方合作关系。本平台并非QQ经典农场的官方反馈渠道。',
  },
  {
    title: '2. 使用目的',
    body: '本平台仅用于协助我个人整理、查看玩家在游戏过程中遇到的问题与建议，不构成任何官方承诺、服务保证或正式投诉处理通道。所有提交的内容不代表官方立场，官方亦无义务依据本平台收集的信息作出响应或处理。',
  },
  {
    title: '3. 信息收集与使用',
    body: '您在本平台提交的问题描述、联系方式等信息，仅用于我后续进行问题整理、统计及可能的主动联系（如需）。不会将您的个人信息向任何第三方公开、出售或用于其他商业目的。但因网络传输、黑客攻击等不可控因素导致的信息泄露，本平台不承担法律责任。',
  },
  {
    title: '4. 无保证声明',
    body: '本平台按“现状”提供，我会尽力维护其正常运行，但不对服务的持续性、无差错性、安全性作任何明示或暗示的保证。因使用本平台（包括但不限于提交信息、页面无法访问、数据丢失）而导致的任何直接或间接损失，不承担赔偿责任。',
  },
  {
    title: '5. 官方渠道优先',
    body: '如您遇到涉及账号安全、财产损失、重大游戏漏洞等紧急或重要问题，请务必通过QQ经典农场的官方客服渠道进行反馈，切勿仅依赖本平台提交。本平台不替代官方处理流程。',
  },
  {
    title: '6. 同意条款',
    body: '一旦您在本平台提交任何信息，即视为您已阅读、理解并完全同意本免责声明的全部内容。如果您不同意上述任何条款，请勿使用本平台提交信息。',
  },
]

export const DISCLAIMER_FOOTER = [
  '最终解释权归安澜所有',
  '最后更新日期：2026.5.22',
]

export function hasAcceptedDisclaimer() {
  if (typeof localStorage === 'undefined') return false
  try {
    const raw = localStorage.getItem(DISCLAIMER_STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return !!(data && data.v === DISCLAIMER_VERSION && data.accepted)
  } catch {
    return false
  }
}

export function saveDisclaimerAccepted() {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(
    DISCLAIMER_STORAGE_KEY,
    JSON.stringify({
      v: DISCLAIMER_VERSION,
      accepted: true,
      acceptedAt: new Date().toISOString(),
    }),
  )
}
