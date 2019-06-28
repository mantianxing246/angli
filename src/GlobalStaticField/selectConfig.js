// 使用方法
//  <el-input
// v-model="listQuery.studentRoleId"
// :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
//  placeholder="学员ID"
//  clearable/>
// selectConfig 已经全局注册了,使用的时候不用import了
export const selectConfig = {
  'studentRoleIdWidth': 175, // 学员ID后台现在用两种字段返回给前台:style="{width:$selectConfig.studentRoleIdWidth+'px'}"
  'userId': 175, //  学员ID后台现在用两种字段返回给前台:style="{width:$selectConfig.userId+'px'}"
  'orderNoWidth': 175, // 订单号:style="{width:$selectConfig.orderNoWidth+'px'}"
  'classNameWidth': 340, // 班级名称:style="{width:$selectConfig.classNameWidth+'px'}"
  'studentNameWidth': 150, // 学员姓名:style="{width:$selectConfig.studentNameWidth+'px'}"
  'orderStatusComWidth': 100, // 审核状态 :style="{width:$selectConfig.orderStatusComWidth+'px'}"
  'campusIdWidth': 100 // 校区:style="{width:$selectConfig.campusIdWidth+'px'}"
}

