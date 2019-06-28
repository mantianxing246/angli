import request from '@/utils/request'

// 学员管理学员信息回显
export function findAttendance(data) {
  return request({
    url: 'offln-Attendance-mgt/findAttendance/',
    method: 'post',
    data: data
  })
}
// 获取考勤签到课程信息
export function getAttendCourse(classId, courseId) {
  return request({
    url: `offln-Attendance-mgt/findOfflnAttendance/${classId}/${courseId}`,
    method: 'get'
  })
}
