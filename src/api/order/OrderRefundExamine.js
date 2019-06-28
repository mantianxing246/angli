import request from '@/utils/request'
export function recfundCourse(params) {
  return request({
    url: 'deposit-refund-review/courseReturn',
    method: 'GET',
    params: params
  })
}
// 定金退费审核回显
export function recfundAuditCourse(params) {
  return request({
    url: 'deposit-refund-review/findDeposit',
    method: 'GET',
    params: params
  })
}

export function confirmOrder(data) {
  return request({
    url: 'deposit-refund-review/confirmOrder',
    method: 'post',
    data: data
  })
}

export function orderReturn(data) {
  return request({
    url: 'deposit-refund-review/courseReturn',
    method: 'post',
    data: data
  })
}

export function findDeposit(params) {
  return request({
    url: 'order-refund-review/findDeposit',
    method: 'GET',
    params: params
  })
}
