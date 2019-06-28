<!--> 满减<-->
<template>
  <div class="app-container">
    <card-container :paddingValue='10'>
      <template slot="body">
    <el-form ref="form" :model="form" inline :rules="rules" label-position="right">
      <el-form-item label="优惠名称" :label-width="labelWidth" prop="discountProgramName">
        <el-input clearable class="iptWidth" v-model="form.discountProgramName"/>
      </el-form-item><br>
      <el-form-item label="课程属性" :label-width="labelWidth" prop="propertyIds">
        <el-checkbox-group v-model="form.propertyIds">
          <el-checkbox :value="1" :label="1">班教</el-checkbox>
          <el-checkbox :value="2" :label="2">录播、直播</el-checkbox>
          <el-checkbox :value="4" :label="4">在线个性化</el-checkbox>
          <!-- <el-checkbox :value="5" :label="5">咨询类</el-checkbox> -->
          <el-checkbox :value="5" :label="5">非学科</el-checkbox>
        </el-checkbox-group>
      </el-form-item><br>
      <el-form-item label="有效期" :label-width="labelWidth" prop="beginDate">
        <el-date-picker type="date" placeholder="开始日期" class="iptWidth" v-model="form.beginDate"/>
        <span>-</span>
        <el-date-picker type="date" placeholder="结束日期" class="iptWidth" v-model="form.endDate"/>
      </el-form-item><br>
      <el-form-item label="满" style="margin-right:0;" :label-width="labelWidth" prop="courseAmount">
          <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="form.courseAmount"></AmountInput>
      </el-form-item>
      <el-form-item label="减" prop="discountAmount">
          <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="form.discountAmount"></AmountInput>
      </el-form-item><br>
      <el-form-item label="备注" :label-width="labelWidth">
        <el-input type="textarea" :rows="5" style="width:400px;" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <el-steps :active="step" finish-status="success" style="margin-top:20px">
      <el-step title="选择优惠类型"></el-step>
      <el-step title="设置优惠内容"></el-step>
    </el-steps>
    <el-row type="flex" justify="center" style="margin-top:20px">
      <el-button style="width:68px;height:29px" @click="goBack">取消</el-button>
      <el-button type="primary" @click="goPrevious">上一步</el-button>
      <el-button
        style="width:68px;height:29px"
        type="primary"
        :loading="loading"
        @click="confirm(form)"
      >确认</el-button>
    </el-row>
    </template>
    </card-container>
  </div>
</template>
<script>
import { insertFullReduction } from "@/api/ActivityDiscount/DiscountMgt";
import { validatorFactory } from "@/utils/async-validator";
export default {
  name: "ProgrammeStep3",
  data() {
    return {
      labelWidth:'80px',
      step: 2,
      loading: false,
      form: {
        discountProgramName: "", //优惠方案名称
        propertyIds: [], //优惠方案类型
        beginDate: "", //有效开始日期
        endDate: "", //有效结束日期
        discountProgramType: "满减", //使用条件传参
        courseAmount: "", //满
        discountAmount: "", //减
        remark: "" //备注
      },
      rules: {
        discountProgramName: [
          { required: true, message: "请填写优惠名称", trigger: "blur" }
        ],
        propertyIds: [
          { required: true, message: "请选择优惠方案类型", trigger: "change" }
        ],
        beginDate: [
          { required: true, message: "请选择有效开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择有效结束日期", trigger: "blur" }
        ],
        courseAmount: [
          { required: true, message: "请填写满减金额", trigger: "blur" },
          validatorFactory("请输入正确的数字")
        ],
        discountAmount: [
          { required: true, message: "请填写满减金额", trigger: "blur" },
          validatorFactory("请输入正确的数字")
        ]
      }
    };
  },
  components: { insertFullReduction },
  methods: {
    //确认
    confirm(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.endDate) {
            this.$message({
              message: "请选择有效结束日期",
              type: "warning"
            });
            return;
          }
          if (
            this.$format(this.form.endDate) < this.$format(this.form.beginDate)
          ) {
            this.$message({
              message: "有效结束日期一定要大于有效开始日期哦",
              type: "warning"
            });
            return;
          }
          this.form.beginDate = this.$format(this.form.beginDate);
          this.form.endDate = this.$format(this.form.endDate);
          let propertyIds = JSON.parse(JSON.stringify(this.form.propertyIds));
          if (propertyIds.includes(2)) {
            propertyIds.push(3);
          }
          let form = {
            discountProgramId: this.form.discountProgramId,
            discountProgramName: this.form.discountProgramName, //优惠方案名称
            propertyIds: propertyIds, //优惠方案类型
            beginDate: this.form.beginDate, //有效开始日期
            endDate: this.form.endDate, //有效结束日期
            discountProgramType: "满减", //使用条件传参
            courseAmount: this.form.courseAmount, //满
            discountAmount: this.form.discountAmount, //减
            remark: this.form.remark, //备注
            discountProgramId: this.form.discountProgramId
          };
          console.log(form);
          this.loading = true;
          insertFullReduction(form)
            .then(res => {
              this.loading = false;
              if (res.status == 200) {
                if (res.data.status === 500) {
                  this.$message({
                    message: res.data.failMessage,
                    type: "error"
                  });
                } else {
                  this.$message({
                    message: "新增满减优惠成功",
                    type: "success"
                  });
                  this.goBack();
                }
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        }
      });
    },
    //返回
    goBack() {
      this.$router.push("/ActivityDiscountMgt/ActivityDiscountMgt");
    },
    //上一步
    goPrevious() {
      this.$router.push("/ActivityDiscountMgt/ProgrammeStep1");
    }
  }
};
</script>
<style scoped>
.iptWidth {
  width: 200px;
}
.span {
  padding-left: 10px;
  font-size: 14px;
  color: #606266;
}
</style>