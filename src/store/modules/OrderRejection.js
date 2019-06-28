
const OrderRejection = {
  state: {
    orderRejectionNumber: {
      number: 0,
      showFlag: false
    }
  },
  mutations: {
    UPDATE_ORDERR_EJECTION_SHOWFLAG: (state, showFlag) => {
      state.orderRejectionNumber.showFlag = showFlag
    },
    UPDATE_ORDERR_EJECTION_NUMBER: (state, number) => {
      state.orderRejectionNumber.number = number
    }
  },
  actions: {
    orderRejectionNumber: ({ commit }, number) => {
      commit('UPDATE_ORDERR_EJECTION_NUMBER', number)
    },
    orderRejectionNumberShowFlag: ({ commit }, showFlag) => {
      commit('UPDATE_ORDERR_EJECTION_SHOWFLAG', showFlag)
    }
  }
}

export default OrderRejection
