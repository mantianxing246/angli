import request from '@/utils/request'
export function findLedgerList(params) {
  return request({
    url: 'ledger/findLedgerList',
    method: 'get',
    params: params
  })
}
export function findLedgeTotalPrice(params) {
  return request({
    url: 'total-price/findLedgeTotalPrice',
    method: 'get',
    params: params
  })
}
// excle导出
export function findLedgerExportList(params) {
  return request({
    url: 'ledger/findLedgerExportList',
    method: 'get',
    params: params
  })
}
