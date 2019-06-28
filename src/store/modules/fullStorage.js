const fullStorage = {
  state: {
    info: {},
    TransferCourse: [],
    CourseRefund:[],
    resSelectListArr:{},//录播，直播选中的课程列表
    offlinSelectListArr:[],//班教选中的课程列表
  individualSelectListArr:{},//个性化选中的课程列表
  },
  mutations: {
    INFO(state, info) {
      state.info = info
    },
    TRANSFERCOURSE(state, TransferCourse) {
      state.TransferCourse = TransferCourse
    },
    COURSEREFUND(state, CourseRefund) {
      state.CourseRefund = CourseRefund
    },
    RESSELECTLISTARR(state,resSelectListArr){
      state.resSelectListArr=resSelectListArr
    },
    OFFLINSELECTLISTARR(state,offlinSelectListArr){
      state.offlinSelectListArr=offlinSelectListArr
    },
    INDIVIDUALSELECTLISTARR(state,individualSelectListArr){
      state.individualSelectListArr=individualSelectListArr
    }
  },
  actions: {
    // 正式订单step3数据存储
    INFO({ commit }, info) {
      commit('INFO', info)
    },
    // 转课选中的课程
    TRANSFERCOURSE({ commit }, TransferCourse) {
      commit('TRANSFERCOURSE', TransferCourse)
    },
    COURSEREFUND({ commit }, CourseRefund) {
      commit('COURSEREFUND', CourseRefund)
    },
    RESSELECTLISTARR({commit},resSelectListArr){
      commit("RESSELECTLISTARR",resSelectListArr)
    },
    OFFLINSELECTLISTARR({commit},offlinSelectListArr){
      commit("OFFLINSELECTLISTARR",offlinSelectListArr)
    },
    INDIVIDUALSELECTLISTARR({commit},individualSelectListArr){
      commit("INDIVIDUALSELECTLISTARR",individualSelectListArr)
    }
  }
}

export default fullStorage
