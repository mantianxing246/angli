import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import store from './store/index'
import getters from './store/getters'
import Vue from 'vue'
import { isArray } from 'util'
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  // console.log(from.path)
  // console.log(to.path)
  if (getToken()) {
    if (from.path === '/login') {
      if (to.path == '/dashboard') {
        next()
      } else {
        next({ path: '/' })
      }
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      var menuList = JSON.parse(localStorage.getItem('states')).menu.menus
      const pathArr = to.path.split('/')

      const isMenu = getIsMenu(
        '/' + pathArr[1],
        pathArr[2],
        pathArr[3],
        menuList
      )
      // console.log(isMenu)
      if (isMenu) {
        next()
      } else {
        if (to.path === '/404') {
          next()
        } else {
          next('/404')
        }
      }
      // next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

// 得到路由是否能够通过，通过返回true，否则返回false
function getIsMenu(path1, path2, path3, menuList) {
  // path1是主路径,path2:path1下的路径,path3是path1/path2/的路径
  //! path2,!path3是如果路径不存在，就不往下遍历了
  let isMenu = false
  for (let i = 0; i < menuList.length; i++) {
    if (path1 === menuList[i].url) {
      if (!path2) {
        isMenu = true
      }
      if (path1 === '/OrderMgt' && path2 !== 'OrderAudit') {
        isMenu = true
        break
      }
      if (
        path1 === '/ActivityDiscountMgt' &&
        (path2 === 'ProgrammeStep1' ||
          path2 === 'ProgrammeStep2' ||
          path2 === 'ProgrammeStep3' ||
          path2 === 'ProgrammeStep4')
      ) {
        isMenu = true
        break
      }
      if (
        path1 === '/OfflineMgt' &&
        (path2 === 'StudentShiftDutyStep1' ||
          path2 === 'StudentShiftDutyStep2' ||
          path2 === 'StudentShiftDutyStep3')
      ) {
        isMenu = true
        break
      }

      if (
        path1 === '/OfflineMgt' &&
        (path2 === 'StudentShiftDutyStep1' ||
          path2 === 'StudentShiftDutyStep2' ||
          path2 === 'StudentShiftDutyStep3')
      ) {
        isMenu = true
        break
      }
      for (let j = 0; j < menuList[i].menuTreeList.length; j++) {
        if (path2 === 'CourseTimeTableLook') {
          // 老师按课表查课路径除外
          isMenu = true
          break
        }
        if (
          path2 === 'StudentShiftDutyStep1' ||
          path2 === 'StudentShiftDutyStep2' ||
          path2 === 'StudentShiftDutyStep3'
        ) {
          isMenu = true
          break
        }
        if (path2 === 'CourseRefund') {
          // 老师按课表查课路径除外
          isMenu = true
          break
        }
        if (path2 === menuList[i].menuTreeList[j].url) {
          // path3 === 'EarnestMoneyAuditions'排除财务审核中OrderMgt/OrderAudit/EarnestMoneyAuditions/341这个路径
          if (
            !path3 ||
            (path3 === 'OnlineAuditions' ||
              path3 === 'EarnestMoneyAuditions' ||
              path3 === 'FormalOrderAudit' ||
              path3 === 'OrderFundExamine' ||
              path3 === 'frozenOrder' ||
              path3 === 'ThawOrderExamine' ||
              path3 === 'RefundExamine')
          ) {
            isMenu = true
          }
          for (
            let k = 0;
            k < menuList[i].menuTreeList[j].menuTreeList.length;
            k++
          ) {
            if (path3 === menuList[i].menuTreeList[j].menuTreeList[k].url) {
              isMenu = true
            }
          }
        }
      }
    }
  }

  // 因为登录成功的页面没有在menuList菜单中，所以单独除外
  if (path1 === '/dashboard') {
    isMenu = true
  }

  // 排除登录页面
  if (path1 === '/login?redirect=%2F') {
    isMenu = true
  }

  if (path1 === '/AccountingMgt') {
    isMenu = true
  }

  return isMenu
}
