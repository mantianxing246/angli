import request from '@/utils/request'
// 驳回的条数
export function findRejectNumber(params) {
  return request({
    url: 'order-finance/findRejectNumber',
    method: 'get',
    params
  })
}
// 选择人员
export function getUserList(deptId, roleId) {
  const params = {
    deptId: deptId,
    roleId: roleId
  }
  return request({
    url: 'user/findUser',
    method: 'get',
    params: params
  })
}
// 正式订单选择人员
export function findUser(params) {
  return request({
    url: 'user/findUser',
    method: 'get',
    params
  })
}
// 销售角色
export function deptAndRoleInfo() {
  return request({
    url: `head-info/deptAndRoleInfo`,
    method: 'get'
  })
}
// 查询收入类别
export function findSourceType(provinceId) {
  return request({
    url: 'common-source-type/findSourceType?provinceId=' + provinceId,
    method: 'get'
  })
}
// 查询市场手段
export function findMarketType(sourceTypeId) {
  return request({
    url: 'common-source-type/findMarketType?sourceTypeId=' + sourceTypeId,
    method: 'get'
  })
}
// 获取付费方式
export function getOrderPayTypeList() {
  return request({
    url: 'subscription-returns/orderPayType',
    method: 'GET'
  })
}
