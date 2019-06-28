import request from '@/utils/request'

export function findNoticeList(params) {
  return request({
    url: 'findNoticeList',
    method: 'get',
    params: params
  })
}

//  http://xx.com//home-page-data/findGrossSales
export function findGrossSales(params) {
  return request({
    url: 'home-page-data/findGrossSales',
    method: 'get',
    params: params
  })
}

// home-page-data/findSalesRank
export function findSalesRank(params) {
  return request({
    url: 'home-page-data/findSalesRank',
    method: 'get',
    params: params
  })
}
// http://xx.com/home-page-data/accrualCalculation
export function accrualCalculation(params) {
  return request({
    url: 'home-page-data/accrualCalculation',
    method: 'get',
    params: params
  })
}
// http://xx.com/home-page-data/newStudentsEnrollment
export function newStudentsEnrollment(params) {
  return request({
    url: 'home-page-data/newStudentsEnrollment',
    method: 'post',
    data: params
  })
}
