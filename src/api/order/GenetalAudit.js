import request from '@/utils/request'

// 获取总办审核列表
export function getAuditList(params) {
  return request({
    url: 'office-audit/findOfficeAudit',
    method: 'post',
    data: params
  })
}
// 获取单个总办审核信息
export function getSingleAudit(orderId) {
  return request({
    url: 'office-audit/findOrder/' + orderId,
    method: 'get'
  })
}
// 编辑更新总办审核信息
export function editSingleAudit(params) {
  return request({
    url: 'office-audit/updateOfficeAudit',
    method: 'put',
    data: params
  })
}
// excel导出
export function exportOfficeAudit(params) {
  return request({
    url: 'office-audit/exportOfficeAudit',
    method: 'post',
    data: params
  })
}
