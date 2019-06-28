import request from '@/utils/request'

export function getHeadInfo() {
  return request({
    url: '/order-head/headInfo',
    method: 'GET'
  })
}
