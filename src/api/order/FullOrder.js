import request from '@/utils/request'
import qs from 'qs'

// 查找所有符合的产品
export function findAllProduct(params) {
  return request({
    url: 'product-mgt/findProductAndParams',
    method: 'get',
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 按产品查询回显
export function findOrderByOrderId(params) {
  return request({
    url: 'product-mgt/findProductByOrder',
    method: 'get',
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 订单查询回显
export function findProductByOrder(orderId) {
  return request({
    url: 'order-mgt/findOrderByOrderId/' + orderId,
    method: 'get'
  })
}

// 通过高开年份查询自己或者以上的年级
export function getSelectProductParam(year) {
  return request({
    url: 'course-select/getSelectProductParam?year=' + year,
    method: 'get'
  })
}

// 按产品选课
export function findProductById(params) {
  return request({
    url: 'product-mgt/findProductByOrder',
    method: 'get',
    params: params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
//网课试听的历史课程
export function findHistoryCourse(studentId) {
  return request({
    url: 'course-select/findHistoryCourse?studentId=' + studentId,
    method: 'get'
  })
}

// 订单暂存
export function createNormalOrder(data) {
  return request({
    url: 'order-mgt/createNormalOrder',
    method: 'post',
    data: data
  })
}

// 那课程查课
export function getCourse(data) {
  return request({
    url: 'course-select/getCourse',
    method: 'post',
    data: data
  })
}

// 录播直播按报名表选课
export function findCourseByNetEntryForm(data) {
  return request({
    url: 'course-select/findCourseByNetEntryForm',
    method: 'post',
    data
  })
}

// 个性化按报名表选课
export function findCourseByIndivEntryForm(data) {
  return request({
    url: 'course-select/findCourseByIndivEntryForm',
    method: 'post',
    data: data
  })
}

// 班教按报名表选课
export function findCourseByOffInEntryForm(data) {
  return request({
    url: 'course-select/findCourseByOffInEntryForm',
    method: 'post',
    data: data
  })
}

// 非学科按课程查询
export function findCourseByNonsubjFromCourse(data) {
  return request({
    url: 'course-select/findCourseByNonsubjFromCourse',
    method: 'POST',
    data
  })
}

// 非学科按产品查询
export function findCourseByNonsubj(params) {
  return request({
    url: 'course-select/findCourseByNonsubj',
    method: 'get',
    params
  })
}

// 其他按课程选课
export function findCourseByOrtherFromCourse(data) {
  return request({
    url: 'course-select/findCourseByOrtherFromCourse',
    method: 'post',
    data
  })
}

// 其他按产品选课
export function findCourseByOther(params) {
  return request({
    url: 'course-select/findCourseByOther',
    method: 'get',
    params
  })
}
// 赠送课程查询
export function findCourseBySmallOnlineCourses(data) {
  return request({
    url: 'course-select/queryGiveLessons',
    method: 'post',
    data
  })
}

// 红头文件匹配课程
export function discountMatch(data) {
  return request({
    url: 'discount-mgt/discountMatch',
    method: 'post',
    data
  })
}

export function findChangeCourseOrderInfo(changeCourseInfoId) {
  return request({
    url: 'order_course_change/findChangeCourseOrderInfo/' + changeCourseInfoId
  })
}

// step4课程价格分摊
export function coursePriceWentDutch(data) {
  return request({
    url: 'order-mgt/coursePriceWentDutch',
    method: 'post',
    data
  })
}

// 终端机信息查询
export function getTerminalInfo(userId) {
  return request({
    url: `hq-baseInfo/getTerminalInfo/${userId}`
  })
}
