import request from '@/utils/request'

export function findStudent(param) {
  return request({
    url: '/students/getStudent',
    method: 'GET',
    params: param
  })
}
//新增订金订单
export function addSubscriptionOrder(params) {
  return request({
    url: '/order-mgt/createSubscriptionOrder',
    method: 'POST',
    data: params
  })
}
//获取审核的订单信息
export function getAuditOrderInfo(params){
  return request({
    url: '/students/getStudent',
    method: 'GET',
    params: params
  })
}
