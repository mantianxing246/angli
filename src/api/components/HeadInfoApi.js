import request from '@/utils/request'

export function getHeadInfo() {
  return request({
    url: 'head-info/headInfo',
    method: 'GET'
  })
}

// 查询收入类别和报名场合
export function findSourceType(provinceId) {
  return request({
    url: 'common-source-type/findSourceType?provinceId=' + provinceId,
    method: 'get'
  })
}

// 市场手段
export function findMarketType(sourceTypeId) {
  return request({
    url: 'common-source-type/findMarketType?sourceTypeId=' + sourceTypeId,
    method: 'get'
  })
}
