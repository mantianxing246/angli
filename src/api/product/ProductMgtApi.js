// <!--
//  * @author hongdengru
//  * @date 2019/1/14
// -->

import request from '@/utils/request'

// 产品查询
export function findAllProduct(params) {
  return request({
    url: 'product-mgt/findAllProduct',
    method: 'get',
    params: params
  })
}

// 课程查询
export function productCourse(paramMap) {
  return request({
    url: 'offln-course-mgt/productCourse',
    method: 'GET',
    params: paramMap
  })
}

// 产品添加
export function insertProduct(data) {
  return request({
    url: 'product-mgt/insertProduct',
    method: 'post',
    data: data
  })
}

// // 编辑回显
export function findProductById(id) {
  return request({
    url: 'product-mgt/findProductById?' + `productId=${id}`,
    method: 'get'
  })
}

// 产品跟新
export function updateProduct(data) {
  return request({
    url: 'product-mgt/updateProduct',
    method: 'post',
    data: data
  })
}

export function deleteProduct(id) {
  return request({
    url: 'product-mgt/deleteProduct/' + id,
    method: 'delete'
  })
}
