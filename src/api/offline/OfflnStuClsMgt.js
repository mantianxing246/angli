import request from '@/utils/request'

export function findAllOfflnAttendanceList(params) {
  return request({
    url: '/offln-Attendance-mgt/findAllOfflnAttendanceList',
    method: 'get',
    params: params
  })
}
// 获取考勤签到课程信息
export function getAttendCourse(scheduleId) {
  return request({
    url: `offln-Attendance-mgt/findTimeAttendance/${scheduleId}`,
    method: 'get'
  })
}
// 获取考勤签到班级列表
export function getAttendClass(data) {
  return request({
    url: 'offln-Attendance-mgt/findAttendance',
    method: 'post',
    data: data
  })
}
// 修改考勤状态
export function updataAttendance(data) {
  return request({
    url: '/offln-Attendance-mgt/updateAttendance',
    method: 'post',
    data: data
  })
}
// 获取考勤签到说明
export function getAttendExplain(data) {
  return request({
    url: '/offln-Attendance-mgt/findRemark',
    method: 'post',
    data
  })
}

// 换班转出查询
export function findOfflNattendanceNum(params) {
  return request({
    url: 'offln-changeclass-mgt/findOfflNattendanceNum',
    method: 'get',
    params
  })
}

// 换班查询符合课程
export function findOfflnChangeClass(params) {
  return request({
    url: 'offln-changeclass-mgt/findOfflnChangeClass',
    method: 'get',
    params
  })
}

// 换班查询钱和高考年份和gradeId
export function findUnitPrice(courseId) {
  return request({
    url: 'offln-changeclass-mgt/findUnitPrice/' + courseId,
    method: 'get'
  })
}

// 换班插入
export function findOfflnClass(params) {
  return request({
    url: 'offln-changeclass-mgt/findOfflnClass',
    method: 'get',
    params
  })
}

// 换班确认
export function updateChangClass(data) {
  return request({
    url: 'offln-changeclass-mgt/updateChangClass',
    method: 'post',
    data
  })
}

// 换班班级查询
export function findOfflnAttendance(scheduleId, studentId) {
  return request({
    url: `offln-changeclass-mgt/findOfflnAttendance/${scheduleId}/${studentId}`
  })
}

// 点击说明修改说明
export function updateRemark(data) {
  return request({
    url: 'offln-Attendance-mgt/updateRemark',
    method: 'post',
    data
  })
}
