import request from '@/utils/request'
export function recfundCourse(params) {
  return request({
    url: 'course-refund/recfundCourse',
    method: 'GET',
    params: params
  })
}
// 课程退费审核回显
export function findRefundCourse(data) {
  return request({
    url: 'course-refund/findRefundCourse',
    method: 'POST',
    data: data
  })
}

export function confirmOrder(data) {
  return request({
    url: 'course-refund-review/courseConfirmOrder',
    method: 'post',
    data: data
  })
}

export function updateRefundCourse(data) {
  return request({
    url: 'course-refund/updateRefundCourse',
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
