/*
@author hongdengru
@date 2019/1/21
*/
import request from '@/utils/request'

// 新增网课试听 查询课程列表
export function getCourseList(params) {
  return request({
    url: 'rec-course-mgt/reccourse',
    method: 'post',
    data: params
  })
}

// 新增网课试听
export function addOnlineCourse(params) {
  return request({
    url: 'order-mgt/createAuditionOrder',
    method: 'post',
    data: params
  })
}

//获取网课试听信息
export function getOnlineCourse(params) {
  return request({
    url: 'rec-course-mgt/reccourse',
    method: 'get',
    params: params
  })
}
//获取付费方式
export function payMoney() {
  return request({
    url: 'order-head/headInfo',
    method: 'get',
  })
}


