<template>
  <div class="app-container">
    <card-container :paddingValue='10'>
      <template slot="body">
    <p style="text-align:center">选择优惠方案</p>
    <div style="text-align:center">
        <span class="selectCourse">
          <el-radio-group v-model="discount">
            <el-radio :value="1" :label="1">满赠</el-radio>
            <el-radio :value="2" :label="2">满减</el-radio>
            <el-radio style="margin-right:30px;" :value="3" :label="3">折扣</el-radio>
          </el-radio-group>
        </span>
    </div>
    <el-steps :active="step" finish-status="success" style="margin-top:20px">
      <el-step title="选择优惠类型"></el-step>
      <el-step title="设置优惠内容"></el-step>
    </el-steps>
    <el-row type="flex" justify="center" style="margin-top:20px">
        <el-button style="width:68px;height:29px" @click="goBack">取消</el-button>
        <el-button style="width:68px;height:29px" type="primary" @click="stepClick">下一步</el-button>
    </el-row>
    </template>
    </card-container>
  </div>
</template>
<script>
export default {
  name: "ProgrammeStep1",
  data () {
    return {
      step: 1,
      discount: null
    }
  },
  methods: {
    //返回
    goBack () {
      this.$router.push("/ActivityDiscountMgt/ActivityDiscountMgt")
    },
    stepClick () {
      if (!this.discount) {
        this.$tipsMessage("请选择优惠方案类型", "warning")
        return
      }
      if(this.discount==1){
        this.$router.push("/ActivityDiscountMgt/ProgrammeStep2")
      }else if(this.discount==2){
        this.$router.push("/ActivityDiscountMgt/ProgrammeStep3")
      }else if(this.discount==3){
        this.$router.push("/ActivityDiscountMgt/ProgrammeStep4")
      }
      
    }
  }
}
</script>
<style scoped>
.selectCourse {
  display: inline-block;
  width: 100px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
.el-radio {
  margin-left: 0px;
  margin-bottom: 6px;
}
</style>