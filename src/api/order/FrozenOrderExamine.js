import request from '@/utils/request'
// 获取课程冻结
export function confirmOrder(data) {
  return request({
    url: 'course-freeze-review/courseConfirm',
    method: 'post',
    data: data
  })
}

export function orderReturn(data) {
  return request({
    url: 'course-freeze-review/courseRefund',
    method: 'post',
    data: data
  })
}
export function FrozenOrderExamine(params) {
  return request({
    url: 'course-freeze-review/courseFreezeReviewById',
    method: 'GET',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    params: params
  })
}
