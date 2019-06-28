import request from '@/utils/request'

// 获取订单审核的列表
export function getOrderAuditList(params) {
  return request({
    url: 'order-finance/findAllOrderList',
    method: 'post',
    data: params
  })
}
// 获取单个订单信息
export function getSingleOrder(orderId) {
  return request({
    url: 'orderfinance/review/' + orderId,
    method: 'GET'
  })
}
// 获取单个订单报名课程列表
export function getCourseList(orderId) {
  return request({
    url: 'orderfinance/course/' + orderId,
    method: 'GET'
  })
}
// 订单通过
export function auditPass(data) {
  return request({
    url: 'orderfinance/review',
    method: 'put',
    params: data
  })
}
// 获取获取试听订单审核内容
export function findOrderAuditionById(orderId) {
  return request({
    url: 'online-course-audition-apply/findOrderAuditionById/' + orderId,
    method: 'GET'
  })
}
// 获取试听订单审核课程列表
export function findOnlineCourseById(orderId) {
  return request({
    url: 'online-course-audition-apply/findOnlineCourseById/' + orderId,
    method: 'GET'
  })
}
// 试听审核（审核通过）
export function upDateOnlineCourseAuditionTrue(data) {
  return request({
    url: 'online-course-audition-apply/upDateOnlineCourseAuditionTrue/',
    method: 'put',
    data: data
  })
}
// 试听审核（审核驳回）
export function upDateOnlineCourseAuditionFalse(data) {
  return request({
    url: 'online-course-audition-apply/upDateOnlineCourseAuditionFalse/',
    method: 'put',
    data: data
  })
}
// 获取定金订单审核课程列表
export function findDepositOrderAuditingById(orderId) {
  return request({
    url: 'Deposit-Order-Auditing/findDepositOrderAuditingById/' + orderId,
    method: 'GET'
  })
}
// 获取定金订单审核内容
export function findDepositOrderById(orderId) {
  return request({
    url: 'Deposit-Order-Auditing/findDepositOrderById/' + orderId,
    method: 'GET'
  })
}
// 定金订单审核（审核通过）
export function upDateDepositOrderAuditingTrue(data) {
  return request({
    url: 'Deposit-Order-Auditing/upDateDepositOrderAuditingTrue/',
    method: 'put',
    data: data
  })
}
// 定金订单审核（审核驳回）
export function upDateDepositOrderAuditingFalse(data) {
  return request({
    url: 'Deposit-Order-Auditing/upDateDepositOrderAuditingFalse/',
    method: 'put',
    data: data
  })
}
// 获取正式订单审核课程列表
export function findFormalOrderAuditingById(orderId) {
  return request({
    url: 'formal-order-auditing/findFormalOrderAuditingById/' + orderId,
    method: 'GET'
  })
}
// 获取正式订单审核内容
export function findFormalOrderDetailById(orderId) {
  return request({
    url: 'formal-order-auditing/findFormalOrderDetailById/' + orderId,
    method: 'GET'
  })
}
// 正式订单审核（审核通过）
export function upDateFormalOrderAuditingTrue(data) {
  return request({
    url: 'formal-order-auditing/upDateFormalOrderAuditingTrue/',
    method: 'put',
    data: data
  })
}
// 正式订单审核（审核驳回）
export function upDateFormalOrderAuditingFalse(data) {
  return request({
    url: 'formal-order-auditing/upDateFormalOrderAuditingFalse/',
    method: 'put',
    data: data
  })
}
