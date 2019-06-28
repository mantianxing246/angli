import request from '@/utils/request'
/*
   @author lfz
   @date 2019/1/18
*/
// 获取直播课程管理列表
export function getCourseList(param) {
    return request({
      url: 'live-course-mgt/findLiveCourseList/',
      method: 'GET',
      params: param
    })
  }
// 删除直播课程
export function deleteLiveCourse(id) {
  return request({
    url: 'live-course-mgt/deleteLiveCourse/',
    method: 'delete',
    data: { 'courseId': id }
  })
}
// 发布
export function updatePublish(id) {
  return request({
    url: 'live-course-mgt/course/' + id,
    method: 'delete'
  })
}
// 新增直播课程信息
export function addSingleCourse(data) {
  return request({
    url: 'live-course-mgt/insertLiveCourse/',
    method: 'POST',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    data: data
  })
}
// 获取单个直播课程信息
export function getSingleCourse(courseId) {
  return request({
    url: 'live-course-mgt/findLiveCourseById/' + courseId,
    method: 'GET'
  })
}
// 编辑直播课程信息
export function updateSingleCourse(data) {
  return request({
    url: 'live-course-mgt/updateLiveCourse/',
    method: 'PUT',
    data: data
  })
}
