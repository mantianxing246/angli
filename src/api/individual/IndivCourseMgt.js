import request from '@/utils/request'

export function findIndivCourseList(data) {
  return request({
    url: 'indiv-course-mgt/findIndivCourseList',
    method: 'post',
    data: data
  })
}

export function deleteIndivCourse(id) {
  return request({
    url: '/indiv-course-mgt/deleteIndivCourse/' + id,
    method: 'delete'
  })
}
// 课程管理新增
export function insertIndivCourse(params) {
  return request({
    url: 'indiv-course-mgt/insertIndivCourse',
    method: 'post',
    data: params
  })
}
// 回显要修改的课程管理编辑
export function getSingleCourse(id) {
  return request({
    url: `indiv-course-mgt/findIndivCourseById/${id}`,
    method: 'GET'
  })
}
// 编辑课程
export function updateIndivCourse(data) {
  return request({
    url: 'indiv-course-mgt/updateIndivCourse',
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
export function findIndivStudentList(params) {
  return request({
    url: 'indiv-consumer/findIndivStudentList',
    method: 'get',
    params: params
  })
}
