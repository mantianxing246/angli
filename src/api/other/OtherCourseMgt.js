import request from '@/utils/request'

// 查询
export function findOtherCourseList(params) {
  return request({
    url: 'other-course/findOtherCourseList',
    method: 'get',
    params
  })
}

// 删除
export function deleteOtherCourse(id) {
  return request({
    url: 'other-course/deleteOtherCourse/' + id,
    method: 'delete'
  })
}
// 新增
export function insertOtherCourse(params) {
  return request({
    url: 'other-course/insertOtherCourse',
    method: 'post',
    data: params
  })
}
// 编辑课程
export function updateOtherCourse(data) {
  return request({
    url: 'other-course/updateOtherCourse',
    method: 'put',
    data: data
  })
}
// 回显要修改的课程管理编辑
export function getSingleCourse(id) {
  return request({
    url: `other-course/findOtherCourse/${id}`,
    method: 'GET'
  })
}

// 课耗管理查询
export function findOtherConsumerList(params) {
  return request({
    url: 'other-consumer/findOtherConsumerList',
    method: 'get',
    params: params
  })
}
// 课耗回显
export function findCourseConsumption(id) {
  return request({
    url: `course_consumption/findCourseConsumption/${id}`,
    method: 'get'
  })
}
// 消课
export function updateCourseConsumption(data) {
  return request({
    url: 'course_consumption/updateCourseConsumption',
    method: 'put',
    data: data
  })
}
