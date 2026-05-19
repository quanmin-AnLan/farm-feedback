import http from './http'

/**
 * 监控/上报相关接口，与 anlan-server /report/* 对应
 * 设计参考 game-center 项目的 ApiCommon
 */
export function reportPV(params) {
  return http.get('/report/pv', {
    params,
    // 上报失败不要弹 Message 干扰用户
    silent: true,
  })
}

export default { reportPV }
