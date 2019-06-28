import request from '@/utils/request'

export function findShPerformanceList(params) {
  return request({
    url: 'sh-performance-view/findShPerformanceList',
    method: 'get',
    params
  })
}
