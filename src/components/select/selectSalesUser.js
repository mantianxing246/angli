import {
  getUserList
} from '@/api/common/common.js'
export default {
  data() {
    return {
      salesUsers: '',
      form: {
        salesUser: null // 销售人员
      }
    }
  },
  created() {
    this.getUserListDiv('', '', 'salesUsers')
  },
  methods: {
    // 获取人员列表
    getUserListDiv(Dep, role, key) {
      getUserList(Dep, role).then(res => {
        this.salesUsers = res.data // 获取人员列表
      })
    }
  }
}
