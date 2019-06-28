import request from '@/utils/request'

export function findAllOfflnAttendanceList(params) {
  return request({
    url: '/offln-Attendance-mgt/findAllOfflnAttendanceList',
    method: 'get',
    params: params
  })
}

// 学员管理查询
export function findAllOfflnStudentMgtList(params) {
  return request({
    url: 'offln-student-mgt/findAllOfflnStudentMgtList',
    method: 'get',
    params: params
  })
}
// 获取学员管理的班级单个学员信息
export function getSingleStudent(params) {
  return request({
    url: 'offln-student-mgt/findStudentMgt',
    method: 'get',
    params: params
  })
}
// 获取所有班级
export function getClasses(params) {
  return request({
    url: 'offln-student-mgt/findClass',
    method: 'get',
    params: params
  })
}
// 获取所有班主任
export function getClassTeachers(classId) {
  return request({
    url: 'offln-student-mgt/findUserName/' + classId,
    method: 'get'
  })
}
// 更新换班信息
export function updateClass(data) {
  return request({
    url: 'offln-student-mgt/updateClass',
    method: 'post',
    data: data
  })
}

// 学员管理学员信息回显
export function findAttendance(data) {
  return request({
    url: 'offln-Attendance-mgt/findAttendance/',
    method: 'post',
    data: data
  })
}
