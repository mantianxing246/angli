// 班教课程类型
const offlineCourseType = [
  '博学',
  '笃行',
  '致远',
  '点睛',
  '周中1V1',
  'mini小班',
  'EOS存量'
]
// 版本
var year = new Date().getFullYear()
const newcalss2019 = []
// 补当前年份到2019之间的年份
for (let i = 0; i < year - 2019; i++) {
  newcalss2019.push(2019 + i)
}
const versions = [2014].concat(newcalss2019).concat([year, year + 1, year + 2, year + 3])
// 录播，直播课程类型
const resCourseType = [
  '高考名师', // 1
  '高二名师', // 2
  '高一名师', // 3
  '初升高名师', // 4
  '学业水平等级考', // 5
  '学业水平等级考-基础', // 6
  '学业水平等级考-强化', // 7
  '中考名师', // 8
  '示范性高中提前录取', // 9
  '初二名师', // 10
  '初二自招预备', // 11
  '网络小课程', // 12
  '主题课堂', // 13
  '竞赛1v1', // 14
  '火箭提分课-宝盒',
  '火箭提分课-线上',
  'EOS存量' // 15
]
// 直播课程类型
const liveCourseType = [
  '高考名师',
  '高二名师',
  '高一名师',
  '初升高名师',
  '学业水平等级考',
  '中考名师',
  '示范性高中提前录取',
  '初二名师',
  '初二自招预备',
  '网络小课程',
  '主题课堂',
  'EOS存量'
]
// 录播课程类型
const recCourseType = [
  '高考名师',
  '高二名师',
  '高一名师',
  '初升高名师',
  '学业水平等级考-基础',
  '学业水平等级考-强化',
  '中考名师',
  '示范性高中提前录取',
  '初二名师',
  '初二自招预备',
  '网络小课程',
  '竞赛1v1',
  '火箭提分课-宝盒',
  '火箭提分课-线上',
  'EOS存量'
]
// 在线个性化
const individualCourseType = [
  '名师1V1',
  '名师1V2',
  '名师1V3',
  '名师1V4',
  '名师1V5',
  '名师1V6',
  '冲刺1v1',
  '冲刺1v2',
  '冲刺1v3',
  '竞赛1V1',
  'EOS存量'
]
// 其他课程类型
const otherCourseType = ['全国渠道加盟费', '代报名课程-昂立智立方']

// 非学科类课程
const nonSubjectCourseType = [
  {
    id: 1,
    name: '志愿填报'
  },
  {
    id: 2,
    name: '综合评价'
  },
  {
    id: 3,
    name: '课题研学'
  },
  {
    id: 4,
    name: '规划自招'
  },
  {
    id: 5,
    name: '科创竞赛'
  }
]
const formCourseType = [
  {
    id: 0,
    name: '线下'
  },
  {
    id: 1,
    name: '线上'
  },
  {
    id: 2,
    name: '线下+线上'
  }
]
const classhour = [40, 60, 80]
const classhours = [20, 24, 28, 40, 60, 80]

// 直播的班型
const courseType = {
  versions,
  offlineCourseType,
  resCourseType,
  liveCourseType,
  recCourseType,
  individualCourseType,
  formCourseType,
  classhour,
  classhours,
  otherCourseType,
  nonSubjectCourseType
}
export default courseType
