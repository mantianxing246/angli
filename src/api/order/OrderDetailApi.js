import request from '@/utils/request'

export function findOrderDetail(params) {
  return request({
    url: '/order-mgt/getOrderDetail',
    method: 'GET',
    params: params
  })
}

export function crateaOrder(params) {
  return request({
    url: '/order-mgt/createOrder',
    method: 'POST',
    data: params
  })
}

export function getCourse(params) {
  return request({
    url: '/course-select/getCourse',
    method: 'POST',
    data: params
  })
}
// 订金退费
export default {
  getOrderPayTypeList() {
    return request({
      url: 'subscription-returns/orderPayType',
      method: 'GET'
    })
  },
  save(tableList) {
    return request({
      url: 'subscription-returns/insertSubscriptionReturns',
      method: 'post',
      data: tableList
    })
  },
  // 获取订金退费信息
  getList(params) {
    return request({
      url: 'subscription-returns/querySubscriptionReturnsById/',
      method: 'GET',
      params: params
    })
  }
}

// 添加市场信息
export function addMarketing(data) {
  return request({
    url: 'order-mgt/addMarketing',
    method: 'post',
    data: data
  })
}

// 删除暂存的订单
export function deleteOrder(orderId) {
  return request({
    url: `order-mgt/deleteOrder/${orderId}`,
    method: 'DELETE'
  })
}

// 课程撤销
export function courseApplyCancel(orderCourseId) {
  return request({
    url: 'apply-cancel/courseApplyCancel/' + orderCourseId,
    method: 'POST'
  })
}

// 订单撤销
export function orderApplyCancel(orderId) {
  return request({
    url: 'apply-cancel/orderApplyCancel/' + orderId,
    method: 'post'
  })
}

// 获取订单信息
export function getOrderDetail(params) {
  return request({
    url: 'order-mgt/getOrderDetail',
    method: 'get',
    params
  })
}

// 正式订单退费撤回
export function courseApplyCancels(data) {
  return request({
    url: 'course-refund/courseApplyCancel',
    method: 'post',
    data
  })
}
