/**
 * Created by lfz on 2019/02/14.
 */

'use strict'

// 选择年级同步高考年份
export function synchroYear(val) {
  var myDate = new Date()
  var year = myDate.getFullYear()
  var mon = myDate.getMonth()+1

  if (typeof val === 'number' && !isNaN(val)) {
    var examYear = null
    if(mon > 8){
      examYear = year + (6 - val + 1)
    }else{
      examYear = year + (6 - val)
    }
    return examYear
  }
}
