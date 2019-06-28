import request from '@/utils/request'
// 查询
export function findNonsubjCourseList(params) {
  return request({
    url: 'nonsubj-course-mgt/findNonsubjCourseList',
    method: 'get',
    params
  })
}
// 删除
export function deleteNonsubjCourse(id) {
  return request({
    url: 'nonsubj-course-mgt/deleteNonsubjCourse/' + id,
    method: 'delete'
  })
}
// 课程管理新增
export function insertNonsubjCourse(params) {
  return request({
    url: 'nonsubj-course-mgt/insertNonsubjCourse',
    method: 'post',
    data: params
  })
}
// 回显要修改的课程管理编辑
export function getSingleCourse(id) {
  return request({
    url: `nonsubj-course-mgt/findNonsubjCourseById/${id}`,
    method: 'GET'
  })
}
// 编辑课程
export function updateNonsubjCourse(data) {
  return request({
    url: 'nonsubj-course-mgt/updateNonsubjCourse',
    method: 'put',
    data: data
  })
}
// 课耗管理导入
export function impotIndivAccrual(params) {
  return request({
    url: 'indiv_accural/import',
    method: 'post',
    data: params
  })
}
// 课耗管理查询
export function findNonsubjConsumerList(params) {
  return request({
    url: 'nonsubj-consumer/findNonsubjConsumerList',
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
