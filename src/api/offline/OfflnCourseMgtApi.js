/**
 * @author zhoucl
 */
import request from '@/utils/request'

export default {
  getCourseList(param) {
    return request({
      url: 'offln-course-mgt/findAllOfflnCourseList',
      method: 'GET',
      headers: { 'Content-type': 'application/json;charset=utf-8' },
      params: param
    })
  },

  // 回显要修改的课程信息
  getSingleCourse(id) {
    return request({
      url: `offln-course-mgt/findOfflnCourseById/${id}`,
      method: 'GET'
    })
  },
  // 新增课程
  addCourse(formAdd) {
    return request({
      url: 'offln-course-mgt/course',
      method: 'post',
      data: 'formAdd'
    })
  },
  //编辑课程
  updateCourse(data) {
    return request({
      url: 'offln-course-mgt/updateOfflnCourse',
      method: 'put',
      data: data
    })
  },
  //根据课程id查询是否存在班级
  isExistClass(courseId) {
    return request({
      url: 'offln-course-mgt/findClassListByCourseId/'+ courseId,
      method: 'GET'
    })
  },
}
export function saveCourse(creatClassIdList) {
  return request({
    url: 'offln-course-mgt/insertOfflnCourse',
    method: 'POST',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    data: creatClassIdList
  })
}
 //删除课程
 export function deleteCourse(id) {
    return request({
      url: 'offln-course-mgt/deleteOfflnCourse/',
      method: 'delete',
      data: { 'courseId': id }
    })
  }  