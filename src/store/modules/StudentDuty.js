const studentDuty = {
    state: {
        studentDutySelect: [],
        selectRadioValue:-1,
        radioRow:{}
    },
    mutations: {
        STUDENTDUTYSELECT(state, studentDutySelect){
            state.studentDutySelect = studentDutySelect
        },
        SELECTRADIOVALUE(state,selectRadioValue){
            state.selectRadioValue = selectRadioValue
        },
        radioRow(state,row) { 
            state.radioRow=row
        } 
    },
    actions: {
        STUDENTDUTYSELECT({commit}, studentDutySelect) {
            commit('STUDENTDUTYSELECT', studentDutySelect)
          },
          SELECTRADIOVALUE({commit}, selectRadioValue){
           commit("SELECTRADIOVALUE",selectRadioValue)
        },
        radioRow({commit},row) {
            commit("radioRow",row)
        }
    }
}

export default studentDuty
  