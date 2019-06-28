import request from '@/utils/request'

export function findDiscountProgramList(params) {
  return request({
    url: 'discount-program/findDiscountProgramList',
    method: 'get',
    params
  })
}
// 新增满减优惠
export function insertFullReduction(data) {
  return request({
    url: 'full-reduction/insertFullReduction',
    method: 'post',
    data: data
  })
}
// 新增满赠优惠
export function insertFullIncrease(data) {
  return request({
    url: 'fullIncrease-mgt/insertFullIncrease',
    method: 'post',
    data: data
  })
}
// 新增折扣优惠
export function rebate(data) {
  return request({
    url: 'full-rebate/insertFullRebate',
    method: 'post',
    data: data
  })
}

export function deleteDiscountProgram(data) {
  return request({
    url: 'discount-program/deleteDiscountProgram',
    data: data,
    method: 'delete'
  })
}

// 编辑回显
export function findDiscountProgram(params) {
  return request({
    url: 'discount-program/findDiscountProgram',
    method: 'get',
    params
  })
}
// 编辑
export function updateDiscountProgram(data) {
  return request({
    url: 'discount-program/updateDiscountProgram',
    method: 'put',
    data: data
  })
}
