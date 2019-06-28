// console.log(menuList)
// for (let i = 0; i < menuList.length; i++) {
//   if ('/' + pathArr[1] === menuList[i].url) {
//     if (!pathArr[2]) {
//       isMenu = true
//     }
//     if ('/' + pathArr[1] === '/OrderMgt' && pathArr[2] !== 'OrderAudit') {
//       isMenu = true
//       break
//     }
//     for (let j = 0; j < menuList[i].menuTreeList.length; j++) {
//       if (pathArr[2] === menuList[i].menuTreeList[j].url) {
//         if (!pathArr[3]) {
//           isMenu = true
//         }
//         for (
//           let k = 0;
//           k < menuList[i].menuTreeList[j].menuTreeList.length;
//           k++
//         ) {
//           if (
//             pathArr[3] === menuList[i].menuTreeList[j].menuTreeList[k].url
//           ) {
//             isMenu = true
//           }
//         }
//       }
//     }
//   }
// }

// if ('/' + pathArr[1] === '/dashboard') {
//   isMenu = true
// }

// if (JSON.parse(localStorage.getItem('states'))) {
//   // 后台返回的菜单list
//   var menuList = JSON.parse(localStorage.getItem('states')).menu.menus
//   var menuListArray = []
//   //  console.log(menuList)
//   // 若订单审核有权限，将各子订单审核路由放入
//   for (var i = 0; i < menuList.length; i++) {
//     if (
//       menuList[i].url == '/OrderMgt' &&
//       menuList[i].menuTreeList.length > 0
//     ) {
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '订单详情',
//         menuTreeList: Array(0),
//         url: 'OrderDetail'
//       })
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '全额订单',
//         menuTreeList: Array(0),
//         url: 'FullOrder'
//       })
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '新增定金订单',
//         menuTreeList: Array(0),
//         url: 'DepositOrder'
//       })
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '新增网课试听',
//         menuTreeList: Array(0),
//         url: 'AddOnlineAudition'
//       })
//       for (var j = 0; j < menuList[i].menuTreeList.length; j++) {
//         if (menuList[i].menuTreeList[j].url === 'OrderAudit') {
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '网课试听审核',
//             menuTreeList: Array(0),
//             url: 'OnlineAuditions'
//           })
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '定金订单审核',
//             menuTreeList: Array(0),
//             url: 'EarnestMoneyAuditions'
//           })
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '正式订单审核',
//             menuTreeList: Array(0),
//             url: 'FormalOrderAudit'
//           })
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '课程冻结审核',
//             menuTreeList: Array(0),
//             url: 'FrozenOrder'
//           })
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '课程解冻审核',
//             menuTreeList: Array(0),
//             url: 'ThawOrderExamine'
//           })
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '课程退费审核',
//             menuTreeList: Array(0),
//             url: 'RefundExamine'
//           })
//           menuList[i].menuTreeList[j].menuTreeList.push({
//             menuId: '',
//             menuName: '定金订单退费审核',
//             menuTreeList: Array(0),
//             url: 'OrderFundExamine'
//           })
//         }
//       }
//     }
//     if (menuList[i].url == '/OfflineMgt') {
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '学员换班1',
//         menuTreeList: Array(0),
//         url: 'StudentShiftDutyStep1'
//       })
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '学员换班2',
//         menuTreeList: Array(0),
//         url: 'StudentShiftDutyStep2'
//       })
//       menuList[i].menuTreeList.push({
//         menuId: '',
//         menuName: '学员换班3',
//         menuTreeList: Array(0),
//         url: 'StudentShiftDutyStep3'
//       })
//     }
//   }
//   menuListArray.push('/dashboard')
//   // 拼出可见权限菜单
//   for (var i = 0; i < menuList.length; i++) {
//     menuListArray.push(menuList[i].url)
//     if (menuList[i].menuTreeList) {
//       for (var j = 0; j < menuList[i].menuTreeList.length; j++) {
//         menuListArray.push(
//           `${menuList[i].url}/${menuList[i].menuTreeList[j].url}`
//         )
//         if (menuList[i].menuTreeList[j].menuTreeList) {
//           for (
//             var k = 0;
//             k < menuList[i].menuTreeList[j].menuTreeList.length;
//             k++
//           ) {
//             menuListArray.push(
//               `${menuList[i].url}/${menuList[i].menuTreeList[j].url}/${
//                 menuList[i].menuTreeList[j].menuTreeList[k].url
//               }`
//             )
//           }
//         }
//       }
//     }
//   }
//   let isMenu = false
//   // console.log(menuListArray)
//   // console.log(to.path)
//   // 取得to中的菜单，进行比较，如果权限中有，则可以跳转
//   var pathAddress = to.path.split('/').slice(1)
//   for (var i = 0; i < menuListArray.length; i++) {
//     if (
//       pathAddress[0] == 'TeacherMgt' &&
//       menuListArray[i] == '/TeacherMgt'
//     ) {
//       // 教师管理下有子菜单查看课表
//       isMenu = true
//     } else if (
//       pathAddress[0] == 'OrderMgt' &&
//       pathAddress[1] == 'OrderAudit' &&
//       pathAddress[2] != 'FinancialAudit' &&
//       pathAddress[2] != 'GeneralAuditMgt'
//     ) {
//       // 订单审核下各订单审核子页面
//       isMenu = true
//     } else if (
//       pathAddress[0] == 'OrderMgt' &&
//       pathAddress[1] == 'FullOrder'
//     ) {
//       // 新增正式订单
//       isMenu = true
//     } else if (pathAddress[0] == 'ActivityDiscountMgt') {
//       // 优惠方案
//       isMenu = true
//     } else if (to.path == menuListArray[i]) {
//       isMenu = true
//     }
//   }
//   // console.log(isMenu)
//   if (isMenu) {
//     // 若存在，继续访问
//     next()
//   } else {
//     if (to.path === '/404') {
//       next()
//     } else {
//       next('/404')
//     }
//   }
// } else {
//   next()
// }
