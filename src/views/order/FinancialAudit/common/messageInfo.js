export default {
  data: function() {
    return {
      
    }
  },
  created() {
    
  },
  methods: {
    // 验证
    messageInfo(auditRemark) {
      if (auditRemark == null || auditRemark === '') {
        this.$message({
          message: '请填写订单退回的审核信息！',
          type: 'warning'
        })
        return false
      }
      if (auditRemark.length > 250) {
        this.$message({
          message: '审核信息的字超过250个汉字',
          type: 'warning'
        })
        return false
      }
      return true
    }
  }
}
