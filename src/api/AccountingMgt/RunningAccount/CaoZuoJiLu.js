import request from '@/utils/request'
export function findLedgerOperationList(params) {
  return request({
    url: 'ledger/findLedgerOperationList/' + params,
    method: 'get',
    params: params
  })
}
