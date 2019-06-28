import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },

  {
    path: '/SystemMgt',
    component: Layout,
    name: 'systemMgt',
    meta: { title: '系统管理', icon: 'nested' },
    children: [
      {
        path: 'PermissionMgt',
        name: 'PermissionMgt',
        meta: { title: '权限管理', icon: 'link' },
        component: () => import('@/views/admin/permission/index'),
        children: [
          {
            path: 'userMgt',
            name: 'userMgt',
            meta: { title: '用户管理', icon: 'link' },
            component: () => import('@/views/admin/permission/user.vue')
          },
          {
            path: 'deptMgt',
            name: 'deptMgt',
            meta: { title: '部门管理', icon: 'link' },
            component: () => import('@/views/admin/permission/dept.vue')
          },
          {
            path: 'roleMgt',
            name: 'roleMgt',
            meta: { title: '角色管理', icon: 'link' },
            component: () => import('@/views/admin/permission/role.vue')
          },
          {
            path: 'menuMgt',
            name: 'menuMgt',
            meta: { title: '菜单管理', icon: 'link' },
            component: () => import('@/views/admin/permission/menu.vue')
          },
          {
            path: 'operationMgt',
            name: 'operationMgt',
            meta: { title: '功能管理', icon: 'link' },
            component: () => import('@/views/admin/permission/operation/index')
          }
        ]
      }
    ]
  },
  {
    path: '/TeacherMgt',
    component: Layout,
    name: 'TeacherMgt',
    meta: { title: '教师管理', icon: 'link' },
    children: [
      {
        path: 'TeacherMgt',
        name: 'TeacherMgts',
        meta: { title: '教师管理', icon: 'link' },
        component: () => import('@/views/teacher/TeacherMgt.vue')
      },
      {
        path: 'CourseTimeTableLook/:teacherId',
        name: 'CourseTimeTableLook',
        meta: { title: '课表查看', icon: 'link' },
        component: () => import('@/views/teacher/CourseTimeTableLook.vue'),
        props: true
      }
    ]
  },
  {
    path: '/ProductMgt',
    component: Layout,
    name: 'ProductMgt',
    meta: { title: '产品管理', icon: 'nested' },
    children: [
      {
        path: 'ProductMgt',
        name: 'ProductMgts',
        meta: { title: '课程组合', icon: 'link' },
        component: () => import('@/views/product/ProductMgt.vue')
      }
    ]
  },
  {
    path: '/OfflineMgt',
    component: Layout,
    name: 'OfflineMgt',
    meta: { title: '班教管理', icon: 'nested' },
    children: [
      {
        path: 'OfflnCourseMgt',
        name: 'OfflnCourseMgt',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/offline/OfflnCourseMgt.vue')
      },
      {
        path: 'OfflnClassMgt',
        name: 'OfflnClassMgt',
        meta: { title: '班级及排课管理', icon: 'link' },
        component: () => import('@/views/offline/OfflnClassMgt.vue')
      },
      {
        path: 'OfflnStuClsMgt',
        name: 'OfflnStuClsMgt',
        meta: { title: '考勤管理', icon: 'link' },
        component: () => import('@/views/offline/OfflnStuClsMgt.vue')
      },
      {
        path: 'StudentMgt',
        name: 'StudentMgt',
        meta: { title: '学员管理', icon: 'link' },
        component: () => import('@/views/offline/StudentMgt.vue')
      },
      {
        path: 'StudentShiftDutyStep1',
        name: 'StudentShiftDutyStep1',
        meta: { title: '学员换班', icon: 'link' },
        component: () => import('@/views/offline/StudentShiftDutyStep1.vue')
      },
      {
        path: 'StudentShiftDutyStep2',
        name: 'StudentShiftDutyStep2',
        meta: {
          title: '学员换班',
          icon: 'link'
        },
        component: () => import('@/views/offline/StudentShiftDutyStep2.vue')
      },
      {
        path: 'StudentShiftDutyStep3',
        name: 'StudentShiftDutyStep3',
        meta: {
          title: '学员换班',
          icon: 'link'
        },
        component: () => import('@/views/offline/StudentShiftDutyStep3.vue')
      }
    ]
  },
  {
    path: '/RecordMgt',
    component: Layout,
    name: 'RecordMgt',
    meta: { title: '录播课管理', icon: 'nested' },
    children: [
      {
        path: 'RecCourseMgt',
        name: 'RecCourseMgt',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/record/RecCourseMgt.vue')
      }
    ]
  },
  {
    path: '/LiveMgt',
    component: Layout,
    name: 'LiveMgt',
    meta: { title: '直播课管理', icon: 'nested' },
    children: [
      {
        path: 'LiveCourseMgt',
        name: 'LiveCourseMgt',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/live/LiveCourseMgt.vue')
      }
    ]
  },
  {
    path: '/ActivityDiscountMgt',
    component: Layout,
    name: 'ActivityDiscountMgt',
    meta: { title: '活动优惠管理', icon: 'nested' },
    children: [
      {
        path: 'ActivityDiscountMgt',
        name: 'ActivityDiscountMgt',
        meta: { title: '活动列表管理', icon: 'link' },
        component: () => import('@/views/ActivityDiscount/DiscountMgt.vue')
      },
      {
        path: 'ProgrammeStep1',
        name: 'ProgrammeStep1',
        meta: { title: '新增优惠方案', icon: 'link' },
        component: () => import('@/views/ActivityDiscount/ProgrammeStep1.vue')
      },
      {
        path: 'ProgrammeStep2',
        name: 'ProgrammeStep2',
        meta: { title: '新增优惠方案', icon: 'link' },
        component: () => import('@/views/ActivityDiscount/ProgrammeStep2.vue')
      },
      {
        path: 'ProgrammeStep3',
        name: 'ProgrammeStep3',
        meta: { title: '新增优惠方案', icon: 'link' },
        component: () => import('@/views/ActivityDiscount/ProgrammeStep3.vue')
      },
      {
        path: 'ProgrammeStep4',
        name: 'ProgrammeStep4',
        meta: { title: '新增优惠方案', icon: 'link' },
        component: () => import('@/views/ActivityDiscount/ProgrammeStep4.vue')
      }
    ]
  },
  {
    path: '/IndividualMgt',
    component: Layout,
    name: 'IndividualMgt',
    meta: { title: '在线个性化管理', icon: 'nested' },
    children: [
      {
        path: 'IndivCourseMgt',
        name: 'IndivCourseMgt',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/individual/IndivCourseMgt.vue')
      },
      {
        path: 'IndivAccrualMgt',
        name: 'IndivAccrualMgt',
        meta: { title: '课耗管理', icon: 'link' },
        component: () => import('@/views/individual/IndivAccrualMgt.vue')
      }
    ]
  },
  {
    path: '/NonSubjectMgt',
    component: Layout,
    name: 'NonSubjectMgt',
    meta: { title: '非学科类科目管理', icon: 'nested' },
    children: [
      {
        path: 'NonSubjCourseMgt',
        name: 'NonSubjCourseMgt',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/NonSubject/NonsubjCourseMgt.vue')
      },
      {
        path: 'NonsubjAccrualMgt',
        name: 'NonsubjAccrualMgt',
        meta: { title: '课耗管理', icon: 'link' },
        component: () => import('@/views/NonSubject/NonsubjAccrualMgt.vue')
      }
    ]
  },
  {
    path: '/ConsultationMgt',
    component: Layout,
    name: 'ConsultationMgt',
    meta: { title: '咨询类课程管理', icon: 'nested' },
    children: [
      {
        path: 'ConsulCourseMgt',
        name: 'ConsulCourseMgt',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/consultation/ConsulCourseMgt.vue')
      }
    ]
  },
  {
    path: '/OrderMgt',
    component: Layout,
    name: 'OrderMgt',
    meta: { title: '订单管理', icon: 'nested' },
    children: [
      {
        path: 'StudentOrderDeal',
        name: 'StudentOrderDeal',
        meta: { title: '学员开单', icon: 'link' },
        component: () =>
          import('@/views/order/OrderProcessing/StudentOrderDeal.vue')
      },
      {
        path: 'OrderDetail',
        name: 'OrderDetail',
        meta: { title: '订单处理', icon: 'link' },
        component: () => import('@/views/order/OrderProcessing/OrderDetail.vue')
      },
      {
        path: 'TransferCourse',
        name: 'TransferCourse',
        meta: { title: '转课', icon: 'link' },
        component: () =>
          import('@/views/order/OrderProcessing/TransferCourse.vue'),
        props: true
      },
      {
        path: 'CourseRefund',
        name: 'CourseRefund',
        meta: { title: '课程退费', icon: 'link' },
        component: () =>
          import('@/views/order/OrderProcessing/CourseRefund.vue'),
        props: true
      },
      {
        path: 'RefundModification',
        name: 'RefundModification',
        meta: { title: '课程退费修改', icon: 'link' },
        component: () =>
          import('@/views/order/OrderProcessing/RefundModification.vue'),
        props: true
      },
      {
        path: 'FullOrder/:studentId',
        name: 'FullOrder',
        meta: { title: '全额订单', icon: 'link' },
        component: () => import('@/views/order/OrderProcessing/FullOrder.vue'),
        children: [
          {
            path: 'FullOrderStepSelectClass',
            component: () =>
              import('@/views/order/OrderProcessing/FullOrderStepSelectClass.vue'),
            meta: { title: '选择课程属性', icon: 'link' },
            name: 'FullOrderStepSelectClass',
            props: true
          },
          {
            path: 'OfflnCourseFullOrder',
            component: () =>
              import('@/views/order/OrderProcessing/OfflnCourseFullOrder.vue'),
            meta: { title: '班教订单', icon: 'link' },
            name: 'OfflnCourseFullOrder',
            props: true
          },
          {
            path: 'RecCourseFullOrder',
            component: () =>
              import('@/views/order/OrderProcessing/RecCourseFullOrder.vue'),
            meta: { title: '录播、直播订单', icon: 'link' },
            name: 'RecCourseFullOrder',
            props: true
          },
          {
            path: 'IndividuaCourseFullOrder',
            component: () =>
              import('@/views/order/OrderProcessing/IndividuaCourseFullOrder.vue'),
            meta: { title: '个性化订单', icon: 'link' },
            name: 'IndividuaCourseFullOrder',
            props: true
          },
          {
            path: 'NonSubjectCourseFullOrder',
            component: () =>
              import('@/views/order/OrderProcessing/NonSubjectCourseFullOrder.vue'),
            meta: { title: '非学科', icon: 'link' },
            name: 'NonSubjectCourseFullOrder',
            props: true
          },
          {
            path: 'OtherCourseFullOrder',
            component: () =>
              import('@/views/order/OrderProcessing/OtherCourseFullOrder.vue'),
            meta: { title: '其他', icon: 'link' },
            name: 'OtherCourseFullOrder',
            props: true
          },
          {
            path: 'FullOrderStep2',
            component: () =>
              import('@/views/order/OrderProcessing/FullOrderStep2.vue'),
            meta: { title: '新增正式订单', icon: 'link' },
            name: 'FullOrderStep2',
            props: true
          },
          {
            path: 'FullOrderStep3',
            component: () =>
              import('@/views/order/OrderProcessing/FullOrderStep3.vue'),
            meta: { title: '新增正式订单', icon: 'link' },
            name: 'FullOrderStep3',
            props: true
          },
          {
            path: 'GiveCourse',
            component: () =>
              import('@/views/order/OrderProcessing/GiveCourse.vue'),
            meta: { title: '课程赠送', icon: 'link' },
            name: 'GiveCourse',
            props: true
          }
        ],
        props: true
      },
      {
        path: 'DepositOrder',
        name: 'DepositOrder',
        meta: { title: '新增订金订单', icon: 'link' },
        component: () =>
          import('@/views/order/OrderProcessing/DepositOrder.vue'),
        props: true
      },
      {
        path: 'AddOnlineAudition',
        name: 'AddOnlineAudition',
        meta: { title: '新增网课试听', icon: 'link' },
        component: () =>
          import('@/views/order/OrderProcessing/AddOnlineAudition.vue')
      },
      {
        path: 'OrderAudit',
        name: 'OrderAudit',
        meta: { title: '订单审核', icon: 'link' },
        component: () => import('@/views/order/FinancialAudit/index'),
        children: [
          {
            path: 'FinancialAudit',
            name: 'FinancialAudit',
            meta: { title: '财务审核', icon: 'link' },
            component: () =>
              import('@/views/order/FinancialAudit/FinancialAudit.vue')
          },
          {
            path: 'OnlineAuditions/:orderId',
            name: 'OnlineAuditions',
            meta: {
              title: '网课试听审核',
              icon: 'link'
            },

            component: () =>
              import('@/views/order/FinancialAudit/OnlineAuditions.vue')
          },
          {
            path: 'EarnestMoneyAuditions/:orderId',
            name: 'EarnestMoneyAuditions',
            meta: {
              title: '订金订单审核',
              icon: 'link'
            },
            component: () =>
              import('@/views/order/FinancialAudit/EarnestMoneyAuditions.vue')
          },
          {
            path: 'FormalOrderAudit/:orderId',
            name: 'FormalOrderAudit',
            meta: {
              title: '正式订单审核',
              icon: 'link'
            },
            component: () =>
              import('@/views/order/FinancialAudit/FormalOrderAudit.vue'),
            props: true
          },
          {
            path: 'OfficeAudit',
            name: 'GeneralAuditMgt',
            meta: { title: '总办审核', icon: 'link' },
            component: () =>
              import('@/views/order/GeneralAudit/GeneralAuditMgt.vue')
          },
          {
            path: 'FrozenOrder',
            name: 'FrozenOrder',
            meta: { title: '课程冻结订单审核', icon: 'link' },
            component: () =>
              import('@/views/order/FinancialAudit/FrozenOrderExamine.vue'),
            props: true
          },
          {
            path: 'ThawOrderExamine',
            name: 'ThawOrderExamine',
            meta: { title: '课程解冻订单审核', icon: 'link' },
            component: () =>
              import('@/views/order/FinancialAudit/ThawOrderExamine.vue'),
            props: true
          },
          {
            path: 'RefundExamine',
            name: 'RefundExamine',
            meta: { title: '课程退费订单审核', icon: 'link' },
            component: () =>
              import('@/views/order/FinancialAudit/RefundExamine.vue'),
            props: true
          },
          {
            path: 'OrderFundExamine',
            name: 'OrderFundExamine',
            meta: { title: '订金订单退费审核', icon: 'link' },
            component: () =>
              import('@/views/order/FinancialAudit/OrderFundExamine.vue'),
            props: true
          }
        ]
      }
    ]
  },
  {
    path: '/AccountingMgt',
    component: Layout,
    name: 'AccountingMgt',
    meta: { title: '财务管理', icon: 'nested' },
    children: [
      {
        path: 'AccrualSearch',
        name: 'AccrualSearch',
        meta: { title: '权责查询', icon: 'link' },
        component: () =>
          import('@/views/AccountingMgt/AccrualSearch/AccrualSearch.vue')
      },
      {
        path: 'BusinessEnquiry',
        name: 'BusinessEnquiry',
        meta: { title: '业务查询', icon: 'link' },
        component: () =>
          import('@/views/AccountingMgt/BusinessEnquiry/BusinessEnquiry.vue')
      },
      {
        path: 'RunningAccount',
        name: 'RunningAccount',
        meta: { title: '流水账(总览)', icon: 'link' },
        component: () =>
          import('@/views/AccountingMgt/RunningAccount/RunningAccount.vue')
      },
      {
        path: 'EnrollmentRevenueByCourse',
        name: 'EnrollmentRevenueByCourse',
        meta: { title: '招生收入(按课程属性)', icon: 'link' },
        component: () =>
          import('@/views/AccountingMgt/EnrollmentRevenueByCourse/EnrollmentRevenueByCourse.vue')
      },
      {
        path: 'EnrollmentRevenueByPay',
        name: 'EnrollmentRevenueByPay',
        meta: { title: '招生收入(按付费方式)', icon: 'link' },
        component: () =>
          import('@/views/AccountingMgt/EnrollmentRevenueByPay/EnrollmentRevenueByPay.vue')
      }
    ]
  },
  {
    path: '/OtherMgt',
    component: Layout,
    name: 'OtherMgt',
    meta: {
      title: '其他类课程管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'OtherCourseMgt',
        name: '课程管理',
        meta: { title: '课程管理', icon: 'link' },
        component: () => import('@/views/others/OtherCourseMgt.vue')
      },
      {
        path: 'OtherAccrualMgt',
        name: '课耗管理',
        meta: { title: '课耗管理', icon: 'link' },
        component: () => import('@/views/others/OtherAccrualMgt.vue')
      }
    ]
  },
  {
    path: '/PerformanceMgt',
    component: Layout,
    name: 'PerformanceMgt',
    meta: { title: '业绩统计', icon: 'nested' },
    children: [
      {
        path: 'PerformanceOverview',
        name: 'PerformanceOverview',
        meta: { title: '总业绩概览', icon: 'link' },
        component: () => import('@/views/performance/PerformanceOverview.vue')
      },
      {
        path: 'SalesPerformance',
        name: 'SalesPerformance',
        meta: { title: '上海产品业绩概览', icon: 'link' },
        component: () => import('@/views/performance/SalesPerformance.vue')
      },
      {
        path: 'PerformanceIndicators',
        name: 'PerformanceIndicators',
        meta: { title: '上海业绩指标设定', icon: 'link' },
        component: () => import('@/views/performance/PerformanceIndicators.vue')
      },
      {
        path: 'RenewalFees',
        name: 'RenewalFees',
        meta: { title: '上海新签续费概览', icon: 'link' },
        component: () => import('@/views/performance/RenewalFees.vue')
      },
      {
        path: 'PerformanceQuality',
        name: 'PerformanceQuality',
        meta: { title: '上海业绩质量概览', icon: 'link' },
        component: () => import('@/views/performance/PerformanceQuality.vue')
      },
      {
        path: 'SalesPerformanceStatistics',
        name: 'SalesPerformanceStatistics',
        meta: { title: '销售业绩统计', icon: 'link' },
        component: () =>
          import('@/views/performance/SalesPerformanceStatistics/SalesPerformanceStatistics.vue')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
