import request from '@/utils/request'
export function findCourseIncomeList(params) {
  return request({
    url: 'course-income/findCourseIncomeList',
    method: 'get',
    params: params
  })
}
export function findCourseTotalPrice(params) {
  return request({
    url: 'course-total-price/findCourseTotalPrice',
    method: 'get',
    params: params
  })
}
export function findCourseExportList(params) {
  return request({
    url: 'course-income/findCourseExportList',
    method: 'get',
    params: params
  })
}
