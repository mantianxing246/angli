import request from '@/utils/request'
// 课程解冻
export function confirmOrder(data) {
  return request({
    url: 'course-unfreeze-review/unCourseConfirm',
    method: 'post',
    data: data
  })
}

export function orderReturn(data) {
  return request({
    url: 'course-unfreeze-review/unCourseRefund',
    method: 'post',
    data: data
  })
}
// 获取课程解冻
export function ThawOrderExamine(params) {
  return request({
    url: 'course-unfreeze-review/courseUnFreezeReview',
    method: 'GET',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    params: params
  })
}
