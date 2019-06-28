import request from '@/utils/request'
export function findPayFlowTotalPrice(params) {
  return request({
    url: 'pay-flow-total-price/findPayFlowTotalPrice',
    method: 'get',
    params: params
  })
}
export function findPayFlowList(params) {
  return request({
    url: 'pay-flow/findPayFlowList',
    method: 'get',
    params: params
  })
}
export function findPayFlowExportList(params) {
  return request({
    url: 'pay-flow/findPayFlowExportList',
    method: 'get',
    params: params
  })
}

