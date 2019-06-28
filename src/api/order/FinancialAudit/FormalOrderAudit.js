import request from '@/utils/request'
// 正式订单查询回显
export function findProductByOrder(orderId) {
  return request({
    url: 'formal-order-auditing/findFormalOrderByOrderId/' + orderId,
    method: 'get'
  })
}
