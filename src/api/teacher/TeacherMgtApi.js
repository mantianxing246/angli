/**
 * @author Lx
 */
import request from '@/utils/request'

export function getTeacherList(param) {
  return request({
    url: 'teacher-mgt/findAllTeacher',
    method: 'GET',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    params: param
  })
}

export function deleteTeacher(id) {
  return request({
    url: 'teacher-mgt/deleteUser/' + id,
    method: 'DELETE',
    headers: { 'Content-type': 'application/json;charset=utf-8' }
  })
}

export function queryTeacher(param) {
  return request({
    url: 'teacher-mgt/queryTeacher/',
    method: 'get',
    params: param
  })
}
export function queryCourseTable() {
  return request({
    // url: 'teacher-mgt/class',
    url: 'teacher-mgt/schedule',
    method: 'get',
    headers: { 'Content-type': 'application/json;charset=utf-8' }
  })
}

export function findTimetable(params) {
  return request({
    url: 'teacher-mgt/findTimetable',
    method: 'get',
    params: params
  })
}

export function findTeacherIsCourse(param) {
  return request({
    url: 'teacher-mgt/findTeacherIsCourse',
    method: 'get',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    params: param
  })
}
// 获取单个老师信息
export function getSingleTeacher(teacherId) {
  return request({
    url: 'teacher-mgt/findTeacherById',
    method: 'GET',
    params: { teacherId: teacherId }
  })
}

export function addteacher(formData) {
  return request({
    url: 'teacher-mgt/insertTeacher',
    method: 'post',
    data: formData,
    headers: { 'Content-type': 'application/json;charset=utf-8' }
  })
}
export function editTeacher(formData) {
  return request({
    url: 'teacher-mgt/updateTeacher',
    method: 'put',
    data: formData,
    headers: { 'Content-type': 'application/json;charset=utf-8' }
  })
}
