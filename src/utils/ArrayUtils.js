export function container(array, element) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return true
    }
  }
  return false
}

// 返回arrayA有的arrayB没有的元素(差集)
export function differenceSet(arrayA, arrayB) {
  const arrayc = []
  for (let i = 0; i < arrayA.length; i++) {
    const exist = container(arrayB, arrayA[i])
    if (!exist) {
      arrayc.push(arrayA[i])
    }
  }

  return arrayc
}
// 返回arrayA有的arrayB没有的元素(差集)
export function isInclude(arrayA, key, id) {
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i][key] === id) {
      return true
    }
  }
  return false
}

// 得到需要回显的数据
export function getUnion(arrarA, arrayB) {
  const menuArray = getMenuArray(Object.assign(arrarA))
  // console.log(menuArray)
  for (let i = 0; i < arrayB.length; i++) {
    if (arrayB[i].menuTreeList.length > 0) {
      var menuItemArray = getMenuArrayId(menuArray, arrayB[i])
      for (let j = 0; j < arrayB[i].menuTreeList.length; j++) {
        if (menuItemArray.length <= 0) {
          var menuItemArray = getMenuArrayId(
            menuArray,
            arrayB[i].menuTreeList[j]
          )
        }
        var istrue = isTrue(arrayB[i].menuTreeList, menuItemArray)
        if (!istrue) {
          const index = arrarA.indexOf(arrayB[i].menuId)
          if (index !== -1) {
            // console.log(arrarA.indexOf(arrayB[i].menuId), arrayB[i].menuId)
            arrarA.splice(index, 1)
          }
        } else {
          for (
            let k = 0;
            k < arrayB[i].menuTreeList[j].menuTreeList.length;
            k++
          ) {
            if (menuItemArray.length <= 0) {
              var menuItemArray = getMenuArrayId(
                menuArray,
                arrayB[i].menuTreeList[j].menuTreeList
              )
            }
            var istrue = isTrue(
              arrayB[i].menuTreeList[j].menuTreeList,
              menuItemArray
            )
            if (!istrue) {
              const index = arrarA.indexOf(arrayB[i].menuTreeList[j].menuId)
              if (index !== -1) {
                arrarA.splice(arrarA.indexOf(index), 1)
              }
            }
          }
        }
      }
    }
  }
  return arrarA
}

// 判断上一级是否要删除
function isTrue(menuTreeList, menuItemArray) {
  var menuTreeListArr = []
  menuTreeList.forEach(element => {
    menuTreeListArr.push(element.menuId)
  })
  for (var i = 0; i < menuTreeListArr.length; i++) {
    if (menuItemArray.includes(menuTreeListArr[i])) {
      continue
    } else {
      break
    }
  }
  if (i >= menuTreeListArr.length) {
    return true
  } else {
    return false
  }
}

// 得到划分好数据的第几部分
function getMenuArrayId(menuArray, arrayB) {
  for (let j = 0; j < menuArray.length; j++) {
    if (menuArray[j].includes(arrayB.menuId)) {
      return menuArray[j]
    }
  }
  return []
}

// 将权限回显的数据划分为二维数组
function getMenuArray(arrarA) {
  let menuArray = [],
    jurisdictionArr = [], // 权限数组1000-1006
    productArr = [], // 产品2000-2001
    offlinArr = [], // 班教2100-2104
    recArr = [], // 录播2200-2201
    liveArr = [], // 直播2300-2301
    individualArr = [], // 在线个性化2400-2402
    nonSubjectArr = [], // 非学科2500-2502
    otherArr = [], // 其他2600-2602
    orderArr = [], // 订单3000-3004
    accountingArr = [], // 财务4000-4001
    performanceArr = [], // 业绩统计5000-5004
    activityDiscount = [], // 活动优惠管理1100-1101
    teacher = [] // 教师管理1900-1901
  for (let i = 0; i < arrarA.length; i++) {
    // 权限
    if ([1000, 1001, 1002, 1003, 1004, 1005, 1006].includes(arrarA[i])) {
      jurisdictionArr.push(arrarA[i])
    }
    // 产品
    if ([2000, 2001].includes(arrarA[i])) {
      productArr.push(arrarA[i])
    }
    // 班教
    if ([2100, 2101, 2102, 2103, 2104].includes(arrarA[i])) {
      offlinArr.push(arrarA[i])
    }
    // 录播
    if ([2200, 2201].includes(arrarA[i])) {
      recArr.push(arrarA[i])
    }
    // 直播
    if ([2300, 2301].includes(arrarA[i])) {
      liveArr.push(arrarA[i])
    }
    // 个性化
    if ([2400, 2401, 2402].includes(arrarA[i])) {
      individualArr.push(arrarA[i])
    }
    // 非学科
    if ([2500, 2501, 2502].includes(arrarA[i])) {
      nonSubjectArr.push(arrarA[i])
    }
    // 其他
    if ([2600, 2601, 2602].includes(arrarA[i])) {
      otherArr.push(arrarA[i])
    }
    // 订单
    if ([3000, 3100, 3200, 3300, 3301, 3302].includes(arrarA[i])) {
      orderArr.push(arrarA[i])
    }
    // 财务
    if ([4000, 4001].includes(arrarA[i])) {
      accountingArr.push(arrarA[i])
    }
    // 业绩统计
    if ([5000, 5001, 5002, 5003, 5004].includes(arrarA[i])) {
      performanceArr.push(arrarA[i])
    }
    // 活动优惠管理1100-1101
    if ([1100, 1101].includes(arrarA[i])) {
      activityDiscount.push(arrarA[i])
    }
    // 教师管理1900-1901
    if ([1900, 1901].includes(arrarA[i])) {
      teacher.push(arrarA[i])
    }
  }
  menuArray.push(jurisdictionArr)
  menuArray.push(productArr)
  menuArray.push(offlinArr)
  menuArray.push(recArr)
  menuArray.push(liveArr)
  menuArray.push(individualArr)
  menuArray.push(nonSubjectArr)
  menuArray.push(otherArr)
  menuArray.push(orderArr)
  menuArray.push(accountingArr)
  menuArray.push(performanceArr)
  menuArray.push(activityDiscount)
  menuArray.push(teacher)

  return menuArray
}
