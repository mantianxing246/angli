import request from '@/utils/request'
// 课程退费审核回显
export function recfundAuditCourse(params) {
  return request({
    url: 'course-refund-review/findRefundCourse',
    method: 'GET',
    params: params
  })
}
export function findRefundCourseEdit(params) {
  return request({
    url: 'course-refund/findRefundCourseEdit',
    method: 'GET',
    params: params
  })
}
export function confirmOrder(data) {
  return request({
    url: 'course-refund-review/courseConfirmOrder',
    method: 'post',
    data: data
  })
}

export function orderReturn(data) {
  return request({
    url: 'course-refund-review/courseReturn',
    method: 'post',
    data: data
  })
}
