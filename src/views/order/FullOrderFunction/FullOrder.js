// import { type } from 'os'

// 下一步应该调到那个地方
import payTypeArr from '@/CourseType/ClassType'

export function nextStepPath({
  studentId,
  year,
  orderId,
  page,
  router,
  courseChangeInfoId,
  oldOrderId,
  // opengOnlineCourse,
  TransferFull,
  callback
}) {
  const query = {
    year: year,
    orderId: orderId,
    courseChangeInfoId: courseChangeInfoId,
    oldOrderId: oldOrderId,
    // opengOnlineCourse: opengOnlineCourse,
    TransferFull: TransferFull,
    callback: callback
  }
  switch (page) {
    case 1:
      router.push({
        path: '/OrderMgt/FullOrder/' + studentId + '/OfflnCourseFullOrder',
        query: query
      })
      break
    case 2:
      router.push({
        path: '/OrderMgt/FullOrder/' + studentId + '/RecCourseFullOrder',
        query: query
      })
      break
    case 3:
      router.push({
        path: '/OrderMgt/FullOrder/' + studentId + '/IndividuaCourseFullOrder',
        query: query
      })
      break
    case 4:
      router.push({
        path: '/OrderMgt/FullOrder/' + studentId + '/NonSubjectCourseFullOrder',
        query: query
      })
      break
    case 5:
      router.push({
        path: '/OrderMgt/FullOrder/' + studentId + '/OtherCourseFullOrder',
        query: query
      })
      break
  }
}

// 判断是否有课程重复
export function getSelectCourse(course, choiceCourse, that) {
  for (var i = 0; i < course.length; i++) {
    for (var j = 0; j < choiceCourse.length; j++) {
      if (
        course[i].courseProperty === choiceCourse[j].courseProperty &&
        course[i].courseId === choiceCourse[j].courseId
      ) {
        that.$tipsMessage(
          '你加入的课程有的已经被选中了，请不要重新选择',
          'warning'
        )
        return choiceCourse
      }
    }
    if (j >= choiceCourse.length) {
      choiceCourse.push(course[i])
    }
  }
  return choiceCourse
}
// 日期更改
export function startDateChange(course) {
  const arr = [2, 3, 4] // 录播直播，个性化
  course.forEach(element => {
    if (arr.includes(element.courseProperty)) {
      element.startDateFlag = true
      element.endDateFlag = true
      if (element.courseType === '网络小课程') {
        element.startDate = format(new Date())
        element.endDate = format(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
      } else {
        if (new Date(element.startDate).getTime() <= new Date().getTime()) {
          element.startDate = format(new Date())
        }
      }
    } else {
      element.startDate = format(new Date())
      element.beginDate = format(new Date())
    }
  })
  return course
}

// 得到返回的路径
export function prevClickPath(course, type, studentId) {
  const nowCourseItem = type === -1 ? course.length : course.indexOf(type)
  if (nowCourseItem === 0) {
    return `/OrderMgt/FullOrder/${studentId}/fullOrderStepSelectClass`
  } else {
    switch (course[nowCourseItem - 1]) {
      case 1:
        return `/OrderMgt/FullOrder/${studentId}/OfflnCourseFullOrder`
      case 2:
        return `/OrderMgt/FullOrder/${studentId}/RecCourseFullOrder`
      case 3:
        return `/OrderMgt/FullOrder/${studentId}/IndividuaCourseFullOrder`
      case 4:
        return `/OrderMgt/FullOrder/${studentId}/NonSubjectCourseFullOrder`
      case 5:
        return `/OrderMgt/FullOrder/${studentId}/OtherCourseFullOrder`
    }
  }
}

// 将班教的查询的课程数据重定义
export function listCourseSort(courseData) {
  var listCourse = []
  courseData.forEach(element => {
    element.startTimes = 1
    element.endTimes = element.times
    element.buyTimes = element.times
    element.price = parseFloat(element.price).toLocaleString()
    element.giveAway = 0
    listCourse.push(element)
  })
  return listCourse
}

// fullOrder2页面编写
export function full2CreateNormalOrder(listQuery, isPass, that) {
  // 判断条件
  const numberReg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
  if (
    listQuery.orderDiscount.specDiscountNo &&
    !numberReg.test(listQuery.orderDiscount.specDiscountNo)
  ) {
    that.$tipsMessage('特殊优惠申请单号请填写数字', 'warning')
    return false
  }
  if (!listQuery.registerFormNum) {
    that.$tipsMessage('请查看报名表号是否填写正确', 'warning')
    return false
  }
  if (
    listQuery.orderDiscount.specDiscountAmount &&
    !numberReg.test(listQuery.orderDiscount.specDiscountAmount)
  ) {
    that.$tipsMessage('特殊优惠金额填写数字', 'warning')
    return false
  }
  if (!numberReg.test(listQuery.registerFormNum)) {
    that.$tipsMessage('报名表号请填写数字', 'warning')
    return false
  }
  if (!listQuery.paymentDate) {
    that.$tipsMessage('请选择付费日期', 'warning')
    return false
  }
  if (listQuery.orderMoneys.length === 0) {
    that.$tipsMessage('请至少选择一种付费方式', 'warning')
    return false
  }
  // 实付金额不是数字
  for (let i = 0; i < listQuery.orderMoneys.length; i++) {
    if (
      (listQuery.orderMoneys[i].payTypeId &&
        listQuery.orderMoneys[i].received &&
        !numberReg.test(listQuery.orderMoneys[i].received)) ||
      ((listQuery.orderMoneys[i].payTypeId &&
        !listQuery.orderMoneys[i].received) ||
        (!listQuery.orderMoneys[i].payTypeId &&
          listQuery.orderMoneys[i].received))
    ) {
      that.$tipsMessage('你填入的信息错误，请重新填写', 'warning')
      return false
    } else {
      // 当付费方式选择“银行卡”时会出现 终端号下拉框和银行卡号输入框；银行卡号输入框最多可输入20个字符，不可输入汉字
      if (
        getPayTypeName(listQuery.orderMoneys[i].payTypeId) === '银行卡' &&
        (!listQuery.orderMoneys[i].terminalNo ||
          !listQuery.orderMoneys[i].bankCardNo)
      ) {
        that.$tipsMessage('终端号和银行卡号必填', 'warning')
        return false
      } else if (
        /[\u4e00-\u9fa5]+/.test(listQuery.orderMoneys[i].terminalNo) ||
        /[\u4e00-\u9fa5]+/.test()
      ) {
        that.$tipsMessage('你填入的信息错误，请重新填写', 'warning')
        return false
      }
      // 当付费方式选择“支付宝”、“微信”、“银联商务—支付宝”、“银联商务—微信”时会出现终端号下拉框和订单号输入框
      if (
        (getPayTypeName(listQuery.orderMoneys[i].payTypeId) === '支付宝' ||
          getPayTypeName(listQuery.orderMoneys[i].payTypeId) === '微信' ||
          getPayTypeName(listQuery.orderMoneys[i].payTypeId) ===
            '银联商务-支付宝' ||
          getPayTypeName(listQuery.orderMoneys[i].payTypeId) ===
            '银联商务-微信') &&
        (!listQuery.orderMoneys[i].terminalNo ||
          !listQuery.orderMoneys[i].payNo)
      ) {
        that.$tipsMessage('终端号和订单号必填', 'warning')
        return false
      } else if (
        /[\u4e00-\u9fa5]+/.test(listQuery.orderMoneys[i].terminalNo) ||
        /[\u4e00-\u9fa5]+/.test(listQuery.orderMoneys[i].payNo)
      ) {
        that.$tipsMessage('你填入的信息错误，请重新填写', 'warning')
        return false
      }

      // 当付费方式选择“支付宝在线支付”时会出现 订单号 输入框
      if (
        getPayTypeName(listQuery.orderMoneys[i].payTypeId) ===
          '支付宝在线支付' &&
        !listQuery.orderMoneys[i].payNo
      ) {
        that.$tipsMessage('订单号必填', 'warning')
        return false
      } else if (/[\u4e00-\u9fa5]+/.test(listQuery.orderMoneys[i].payNo)) {
        that.$tipsMessage('你填入的信息错误，请重新填写', 'warning')
        return false
      }
    }
  }
  return true
}

export function getPayTypeName(payTypeId) {
  const payTypeArrs = payTypeArr.payTypeArr
  for (let i = 0; i < payTypeArrs.length; i++) {
    if (payTypeArrs[i].payTypeId === payTypeId) {
      return payTypeArrs[i].payTypeName
    }
  }
  return ''
}

// fullOrder3页面编写
export function full3CreateNormalOrder(listQuery, that) {
  // 判断条件
  if (!listQuery.salesUser) {
    that.$tipsMessage('请填写销售人员', 'warning')
    return false
  }
  if (!listQuery.provinceId) {
    that.$tipsMessage('请选择省市', 'warning')
    return false
  }

  if (!(listQuery.isContinuous === 1 && listQuery.provinceId === 1)) {
    if (!listQuery.sourceType) {
      that.$tipsMessage('请选择收入类别', 'warning')
      return false
    }
  }
  if (!(listQuery.isContinuous === 1 && listQuery.provinceId === 1)) {
    if (!listQuery.marketType) {
      that.$tipsMessage('请选择市场手段', 'warning')
      return false
    }
  }
  if (!listQuery.registerType) {
    that.$tipsMessage('请选择报名场合', 'warning')
    return false
  }
  return true
}

// 得到要加入接口的课程
// 得到相关课程
export function getCourseInfoList(
  offlineListCourse,
  recListCourse,
  individuaListCourse,
  giveCourse,
  nonSubjectCourse,
  otherCourse
) {
  const courseInfoList = []
  if (offlineListCourse.length > 0) {
    for (let i = 0; i < offlineListCourse.length; i++) {
      if (typeof offlineListCourse[i].price === 'string') {
        offlineListCourse[i].price = parseInt(
          offlineListCourse[i].price.replace(/,/g, '')
        )
      }
      offlineListCourse[i].times = offlineListCourse[i].buyTimes
      courseInfoList.push(offlineListCourse[i])
    }
  }
  if (recListCourse.length > 0) {
    for (let i = 0; i < recListCourse.length; i++) {
      if (typeof recListCourse[i].price === 'string') {
        recListCourse[i].price = parseInt(
          recListCourse[i].price.replace(/,/g, '')
        )
      }
      courseInfoList.push(recListCourse[i])
    }
  }
  if (individuaListCourse.length > 0) {
    for (let i = 0; i < individuaListCourse.length; i++) {
      if (typeof individuaListCourse[i].price === 'string') {
        individuaListCourse[i].price = parseInt(
          individuaListCourse[i].price.replace(/,/g, '')
        )
      }
      courseInfoList.push(individuaListCourse[i])
    }
  }
  if (giveCourse.length > 0) {
    for (let i = 0; i < giveCourse.length; i++) {
      if (typeof giveCourse[i].price === 'string') {
        giveCourse[i].price = parseInt(giveCourse[i].price.replace(/,/g, ''))
      }
      courseInfoList.push(giveCourse[i])
    }
  }
  if (nonSubjectCourse.length > 0) {
    for (let i = 0; i < nonSubjectCourse.length; i++) {
      if (typeof nonSubjectCourse[i].price === 'string') {
        nonSubjectCourse[i].price = parseInt(
          nonSubjectCourse[i].price.replace(/,/g, '')
        )
      }
      courseInfoList.push(nonSubjectCourse[i])
    }
  }
  if (otherCourse.length > 0) {
    for (let i = 0; i < otherCourse.length; i++) {
      if (typeof otherCourse[i].price === 'string') {
        otherCourse[i].price = parseInt(otherCourse[i].price.replace(/,/g, ''))
      }
      courseInfoList.push(otherCourse[i])
    }
  }
  return courseInfoList
}

const format = function(time) {
  var y = new Date(time).getFullYear()
  var m = new Date(time).getMonth() + 1
  var d = new Date(time).getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}
