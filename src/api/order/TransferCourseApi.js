import request from '@/utils/request'

export function findOrderCourse(data) {
  return request({
    url: 'course-select/findOrderCourse',
    method: 'POST',
    data: data
  })
}

export function changeCourse(data) {
  return request({
    url: 'order_course_change/changeCourse',
    method: 'POST',
    data: data
  })
}
export function findCourseChangeInfoByNewOrderId(newOrderId) {
  return request({
    url: 'order_course_change/findCourseChangeInfoByNewOrderId/' + newOrderId,
    method: 'get'
  })
}
