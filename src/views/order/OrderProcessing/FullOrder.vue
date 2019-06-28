/*
@author Andy
@date 2019/1/18
*/ 
<template>
  <div class="app-container top">
    <div
      style="margin-bottom:20px;margin-top:20px"
      v-if="this.auditRemark"
    >审核信息:{{this.auditRemark}}</div>
    <student-info :student-id="studentId" style="margin-top:20px;"/>
    <router-view></router-view>
  </div>
</template>
<script>
import StudentInfo from '@/views/order/components/StudentInfo'
import { findProductByOrder } from '@/api/order/FullOrder'
import { crateaOrder } from '@/api/order/OrderDetailApi'

export default {
  name: 'FullOrder',
  components: { StudentInfo },
  props: {
    studentId: {
      type: String
    }
  },
  data () {
    return {
      auditRemark: '',
      orderId: this.$route.query.orderId
    }
  },
  created () {
    this.findProductByOrder()
  },
  methods: {
    //回显
    findProductByOrder () {
      let course = []
      if (this.orderId) {
        findProductByOrder(this.orderId).then((res) => {
          this.auditRemark = res.data.auditRemark
        })
      }
    }
  }
}
</script>
<style>
.marginTop20px {
  margin: 20px 0px 0px 0px;
  color: #909399;
}
.product {
  margin: 20px 20px 20px 20px;
  color: #909399;
}

.course {
  margin: 20px 20px 20px 20px;
  color: #909399;
}
.font-size-thick {
  font-weight: bold;
  color: #909399;
}
.top {
  margin-top: -20px !important;
}
</style>
