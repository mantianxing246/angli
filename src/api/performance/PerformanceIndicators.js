import request from '@/utils/request'

// 上海业绩指标设定查询
export function findShAchievementList(params) {
  return request({
    url: 'sh-performance-report/findShAchievementList',
    method: 'get',
    params
  })
}
// 上海业绩指标设定编辑回显
export function getSingleCourse(id,year) {
  return request({
    url: `/sh-performance-report/findShAchievementListById/${id}/${year}`,
    method: 'GET'
  })
}
// 上海业绩指标设定编辑
export function updateCourseConsumption(data) {
  return request({
    url: 'sh-performance-report/updateShAchievementList',
    method: 'post',
    data: data
  })
}
// 上海产品业绩概况查询
export function findShProductAchievementList(params) {
  return request({
    url: '/sh-product-performance-report/findShProductAchievementList',
    method: 'get',
    params
  })
}
// 业绩总览
export function findLedgerAllList(params) {
  return request({
    url: '/ledger-all/findLedgerAllList',
    method: 'get',
    params
  })
}
