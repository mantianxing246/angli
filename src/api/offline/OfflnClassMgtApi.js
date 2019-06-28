import request from '@/utils/request'

export function getClassList(param) {
  return request({
    url: 'offln-class-mgt/getClassList',
    method: 'GET',
    params: param
  })
}
// 新增班级
export function addClass(classList) {
  return request({
    url: 'offln-class-mgt/batchInsert',
    method: 'post',
    data: classList
  })
}
// 获取单个班级信息
export function getSingleClass(classId) {
  return request({
    url: 'offln-class-mgt/findOfflnClassById/' + classId,
    method: 'GET'
  })
}
// 编辑班级
export function updateClass(data) {
  return request({
    url: 'offln-class-mgt/updateClass',
    method: 'PUT',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    data: data
  })
}
// 根据班级id查询是否存在学员
export function isExistStudent(classId) {
  return request({
    url: 'offln-class-mgt/checkClassHasStudent/' + classId,
    method: 'GET'
  })
}
// 删除班级
export function deleteClass(id) {
  return request({
    url: 'offln-class-mgt/deleteClass/' + id,
    method: 'DELETE'
  })
}
// 排课查询
export function getClassSchedules(params) {
  return request({
    url: 'offln-schedule-mgt/findSchedule',
    method: 'GET',
    params: params
  })
}
// 排课添加
export function insertClassPk(params) {
  return request({
    url: 'offln-schedule-mgt/addSchedule',
    method: 'post',
    data: params
  })
}
// 排课删除
export function deletePClass(id) {
  return request({
    url: 'offln-schedule-mgt/deleteSchedule/' + id,
    method: 'delete'
  })
}

// 上课老师
export function findTeachList(data) {
  return request({
    url: 'teacher-mgt/findTeacherList',
    method: 'post',
    data: data
  })
}

// 查询班主任
export function findClassTeacher(params) {
  return request({
    url: 'user/findClassTeacher',
    method: 'get',
    params: params
  })
}

// 学院分班查询
export function findStudent(params) {
  return request({
    url: 'order-student/findStudent',
    method: 'get',
    params: params
  })
}

// 改变学生是否分班的状态
export function student2Class(data) {
  return request({
    url: 'offln-class-mgt/student2Class',
    method: 'post',
    data: data
  })
}

// 排课，查看老师的时间是否重复
export function findTeacherCourseTime(params) {
  return request({
    url: 'teacher-mgt/findTeacherCourseTime',
    method: 'get',
    params: params
  })
}

// 换班转出查询
export function findOfflNattendanceNum(params) {
  return request({
    url: 'offln-changeclass-mgt/findOfflNattendanceNum',
    params
  })
}
// 确认排课
export function addScheduleList(data) {
  return request({
    url: 'offln-schedule-mgt/addScheduleList',
    method: 'post',
    data: data
  })
}
// 删除排课

export function deleteSchedule(id) {
  return request({
    url: `offln-schedule-mgt/deleteSchedule/${id}`,
    method: 'DELETE'
  })
}

// 换班查询钱和高考年份和gradeId
export function findUnitPrice(courseId) {
  return request({
    url: `offln-changeclass-mgt/findUnitPrice/${courseId}`,
    method: 'get'
  })
}

// step2查看符合的课程
export function findOfflnChangeClass(params) {
  return request({
    url: `offln-changeclass-mgt/findOfflnChangeClass`,
    method: 'get',
    params
  })
}

// 换班插入查询
export function findOfflnClass(params) {
  return request({
    url: `offln-changeclass-mgt/findOfflnClass`,
    method: 'get',
    params
  })
}
