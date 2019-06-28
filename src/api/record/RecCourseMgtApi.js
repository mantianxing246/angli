import request from '@/utils/request'
/*
   @author wufan
   @date 2019/1/8
*/
export default {
  //获取录播课程列表
  getCourseList(params) {
    return request({
      url: 'rec-course-mgt/findRecCourseList',
      method: 'get',
      params: params
    })
  },
  //删除录播课程
  deleteRecCourse(id) {
    return request({
      url: 'rec-course-mgt/deleteRecCourse/',
      method: 'delete',
      data: { 'courseId': id }
    })
  },
  //更新录播课程发布状态
  updateIsPublish(data) {
    return request({
      url: 'rec-course-mgt/updateIsPublish',
      method: 'put',
      params: data
    })
  }
}
//新增录播课程信息
export function addSingleCourse(data) {
  return request({
    url: 'rec-course-mgt/insertRecCourse',
    method: 'post',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    data: data
  })
}
//获取单个录播课程信息
export function getSingleCourse(courseId) {
  return request({
    url: 'rec-course-mgt/findRecCourseById/'+ courseId,
    method: 'get',
  })
}
//编辑录播课程信息
export function updateSingleCourse(data) {
  return request({
    url: 'rec-course-mgt/updateRecCourse',
    method: 'put',
    data: data
  })
}
