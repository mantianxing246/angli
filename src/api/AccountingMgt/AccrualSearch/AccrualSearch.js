import request from '@/utils/request'
/**
 *权责查询主页面table数据获取
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findConsumer(params) {
  return request({
    url: 'find-consumer/findConsumer',
    method: 'get',
    params: params
  })
}
/**
 *查询录播课耗
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findRecConsumer(params) {
  return request({
    url: 'find-consumer/findRecConsumer',
    method: 'get',
    params: params
  })
}
/**
 *查询直播课耗
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findLiveConsumer(params) {
  return request({
    url: 'find-consumer/findLiveConsumer',
    method: 'get',
    params: params
  })
}
/**
 *班教课耗
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findOfflnConsumer(params) {
  return request({
    url: 'find-consumer/findOfflnConsumer',
    method: 'get',
    params: params
  })
}
/**
 *个性化课耗
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findIndivConsumer(params) {
  return request({
    url: 'find-consumer/findIndivConsumer',
    method: 'get',
    params: params
  })
}
/**
 *非学科类
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findNonSubjectConsumer(params) {
  return request({
    url: 'find-consumer/findNonSubjectConsumer',
    method: 'get',
    params: params
  })
}
/**
 *其他类
 * @param {*} params 请求参数
 *        orderId: row.orderId,
          courseId: row.courseId,
          propertyId: row.propertyId,
          studentId: row.studentId
 */
export function findOtherConsumer(params) {
  return request({
    url: 'find-consumer/findOtherConsumer',
    method: 'get',
    params: params
  })
}
