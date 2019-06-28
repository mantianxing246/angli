import request from '@/utils/request'
export function findSalesPerformanceList(params) {
  return request({
    url: 'sales-performance/findSalesPerformanceList',
    method: 'get',
    params: params
  })
}
export function findSalesExportList(params) {
  return request({
    url: 'sales-performance/findSalesExportList',
    method: 'get',
    params: params
  })
}
