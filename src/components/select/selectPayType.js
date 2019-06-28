import { getOrderPayTypeList } from '@/api/common/common'

export default {
  data() {
    return {
      form: {
        payType: '' // 付款方式
      },
      payTypes: [] // 付款方式
    }
  },
  // <el-option
  //             v-for="item in payTypes"
  //             :key="item.payTypeId"
  //             :label="item.payTypeName"
  //             :value="item.payTypeId"
  //           />
  mounted() {
    this.getOrderPayTypeList()
  },
  methods: {
    // 获取订单状态
    getOrderPayTypeList() {
      getOrderPayTypeList().then(res => {
        this.payTypes = res.data
      })
    }
  }
}
