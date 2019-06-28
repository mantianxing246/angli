import request from '@/utils/request'
export function findBusinessList(params) {
  return request({
    url: 'business/findBusinessList',
    method: 'get',
    params: params
  })
}
export function findBusinessTotalPrice(params) {
  return request({
    url: 'total-price/findBusinessTotalPrice',
    method: 'get',
    params: params
  })
}
export function findBusinessExportList(params) {
  return request({
    url: 'business/findBusinessExportList',
    method: 'get',
    params: params
  })
}

