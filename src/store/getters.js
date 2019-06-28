const getters = {
  sidebar: state => state.app.sidebar,
  orderRejectionNumber: state => state.OrderRejection.orderRejectionNumber,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.menu.userId,
  roles: state => state.user.roles,
  menus: state => {
    return state.menu.menus
  },
  dept: state => state.user.dept,
  info: state => state.fullStorage.info,
  TransferCourse: state => state.fullStorage.TransferCourse,
  CourseRefund: state => state.fullStorage.CourseRefund,
  resSelectListArr:state=>state.fullStorage.resSelectListArr,
  offlinSelectListArr:state=>state.fullStorage.offlinSelectListArr,
  individualSelectListArr:state=>state.fullStorage.individualSelectListArr,
  studentDutySelect:state=>state.StudentDuty.studentDutySelect,
  selectRadioValue:state=>state.StudentDuty.selectRadioValue,
  radioRow:state=>state.StudentDuty.radioRow
}
export default getters
