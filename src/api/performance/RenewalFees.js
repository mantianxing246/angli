import request from '@/utils/request'

export function findNewSignperformanceList(params) {
  return request({
    url: 'sh-newsign-performance-report/findNewSignperformanceList',
    method: 'get',
    params
  })
}
