import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import menu from './modules/menu'
import fullStorage from './modules/fullStorage'
import OrderRejection from './modules/OrderRejection'
import StudentDuty from './modules/StudentDuty'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    menu,
    fullStorage,
    OrderRejection,
    StudentDuty
  },
  getters
})
export default store
