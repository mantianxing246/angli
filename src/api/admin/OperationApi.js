import request from '@/utils/request'

export function getOperarion(paramMap) {
  return request({
    url: 'operation/getOperation',
    method: 'GET',
    params: paramMap
  })
}

export function getOperarionById(id) {
  return request({
    url: 'operation/getOperationById/' + id,
    method: 'GET'
  })
}

export function saveOperarion(data) {
  return request({
    url: 'operation/addOperation',
    method: 'POST',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

export function updateOperarion(data) {
  return request({
    url: 'operation/updateOperation',
    method: 'PUT',
    headers: { 'Content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

export function deleteOperation(id) {
  const param = {
    id: id
  }
  return request({
    url: 'operation/deleteOperation',
    method: 'DELETE',
    params: param
  })
}
