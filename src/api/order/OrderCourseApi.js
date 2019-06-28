import request from '@/utils/request'

export function findOrderDetail(params) {
  return request({
    url: '/order-mgt/order',
    method: 'GET',
    params: params
  })
}

export function crateaOrder(params) {
  return request({
    url: '/order-mgt/order',
    method: 'POST',
    data: params
  })
}
export default {
  getOrderPayTypeList() {
    return request({
      url: 'subscription-returns/orderPayType',
      method: 'GET'
    })
  },
  save(tableList) {
    return request({
      url: 'course-refund/updateRefundCourse',
      method: 'post',
      data: tableList
    })
  },
  // getList(id) {
  //   return request({
  //     url: `refund/recfundCourse/${id}`,
  //     method: 'GET'
  //   })
  // }
  getList(params) {
    return request({
      url: 'refund/recfundCourse',
      method: 'GET',
      params: params
    })
  }
}
// 点击课程冻结回显
export function getFreezeCourse(params) {
  return request({
    url: 'course-freezes/findOrderCourseById',
    method: 'GET',
    params: params
  })
}
export function courseFreezeReviewById(params) {
  return request({
    url: 'course-freeze-review/courseFreezeReviewById',
    method: 'GET',
    params: params
  })
}
// 冻结的确认
export function updateFreezeCourse(data) {
  return request({
    url: 'course-freezes/updateOrderCourseById',
    method: 'post',
    data: data
  })
}
// 点击课程解冻回显
export function queryOrderCourseById(params) {
  return request({
    url: 'course-unfreeze/queryOrderCourseById',
    method: 'GET',
    params: params
  })
}
// 点击课程解冻回显
export function getUnFreezeCourse(params) {
  return request({
    url: 'course-unfreeze-review/courseUnFreezeReview',
    method: 'GET',
    params: params
  })
}
// 解冻的确认
export function updateUnFreezeCourse(data) {
  return request({
    url: 'course-unfreeze/orderCourse',
    method: 'put',
    data: data
  })
}

// 课程解冻信息
export function refundCourseFees(data) {
  return request({
    url: 'refund/refund',
    method: 'put',
    data: data
  })
}
