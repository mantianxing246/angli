<!--
 * @author hongdengru
 * @date 2019/1/15
-->
<template>
  <div>
    <el-dialog :close-on-click-modal="false" 
      v-el-drag-dialog
      v-loading="true"
      :visible.sync="dialogShow"
      title="编辑折扣优惠"
      width="70%"
      center
      highlight-current-row
      border
      fit
      stripe
    >
      <el-form ref="programmeStep4Form" :inline="true" :model="form" label-position="right" :rules="rules">
        <el-form-item label="优惠名称" :label-width="labelWidth" prop="discountProgramName">
          <el-input clearable class="iptWidth" v-model="form.discountProgramName"/>
        </el-form-item>
        <br>
        <el-form-item label="课程类型" :label-width="labelWidth" prop="discountPropertyList">
          <el-checkbox-group v-model="form.discountPropertyList">
            <el-checkbox :value="1" :label="1">班教</el-checkbox>
            <el-checkbox :value="2" :label="2">录播、直播</el-checkbox>
            <el-checkbox :value="4" :label="4">在线个性化</el-checkbox>
            <!-- <el-checkbox :value="5" :label="5">咨询类</el-checkbox> -->
            <el-checkbox :value="5" :label="5">非学科</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <br>
        <el-form-item label="有效期" :label-width="labelWidth" prop="beginDate">
          <el-date-picker placeholder="开始日期" class="iptWidth" v-model="form.beginDate"/>
          <span>-</span>
          <el-date-picker placeholder="结束日期" class="iptWidth" v-model="form.endDate"/>
        </el-form-item>
        <br> 
        <el-form-item label="满" style="margin-right:0;" :label-width="labelWidth" prop="courseAmount">
            <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="form.courseAmount"></AmountInput>
        </el-form-item>
        <el-form-item label="折扣" prop="discountRatio">
          <el-select placeholder="请选择" clearable class="iptWidth" v-model="form.discountRatio">
            <el-option :key="1" label="98%" :value="98"/>
            <el-option :key="2" label="95%" :value="95"/>
            <el-option :key="3" label="92%" :value="92"/>
            <el-option :key="4" label="90%" :value="90"/>
            <el-option :key="5" label="88%" :value="88"/>
            <el-option :key="6" label="80%" :value="80"/>
          </el-select>
        </el-form-item>
         <br>
        <el-form-item label="备注" :label-width="labelWidth">
          <el-input type="textarea" :rows="5" style="width:400px;" v-model="form.remark"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top:20px">
        <el-button @click="dialogShow=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="updateProduct(form)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findDiscountProgram,
  updateDiscountProgram
} from "@/api/ActivityDiscount/DiscountMgt";
export default {
  name: "ProgrammeStep4Edit",
  props: ["ProgrammeStep4EditDialog", "findDiscountProgramList"],
  components: {
    findDiscountProgram,
    updateDiscountProgram
  },
  data: function () {
    return {
      labelWidth:'80px',
      loading: false,
      form: {
        discountProgramId: "",
        discountProgramName: "", //优惠方案名称
        discountPropertyList: [], //优惠方案类型
        beginDate: "", //有效开始日期
        endDate: "", //有效结束日期
        discountRatio: "", //折扣
        discountProgramType: "折扣", //使用条件传参
        remark: "", //备注
        courseAmount: ""
      },
      rules: {
        discountProgramName: [
          { required: true, message: "请填写优惠名称", trigger: "blur" }
        ],
        discountPropertyList: [
          { required: true, message: "请选择优惠方案类型", trigger: "change" }
        ],
        beginDate: [
          { required: true, message: "请选择有效开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择有效结束日期", trigger: "blur" }
        ],
        courseAmount: [
          { required: true, message: "请填写满减金额", trigger: "blur" }
        ],
        discountRatio: [
          { required: true, message: "请选择折扣", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    resetForm () {
      this.$nextTick(() => {
        this.$refs["programmeStep4Form"].resetFields();
      });
    },
    //获取回显信息
    getDiscountProgram (discountProgramId, discountProgramType) {
      this.form.discountProgramId = discountProgramId;
      findDiscountProgram({
        discountProgramId: discountProgramId,
        discountProgramType: discountProgramType
      }).then(res => {
        if (res.status == 200) {
          this.form.discountProgramName = res.data.discountProgramName;
          this.form.beginDate = res.data.beginDate;
          this.form.endDate = res.data.endDate;
          this.form.discountProgramType = res.data.discountProgramType;
          this.form.discountRatio = res.data.discountRatio;
          this.form.remark = res.data.remark;
          this.form.courseAmount = res.data.courseAmount;
          for (var i = 0;i < res.data.discountPropertyList.length;i++) {
            if (res.data.discountPropertyList[i].propertyId !== 3) {
              this.form.discountPropertyList.push(
                res.data.discountPropertyList[i].propertyId
              );
            }
          }
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    //确认
    updateProduct (programmeStep4Form) {
      this.$refs["programmeStep4Form"].validate(valid => {
        if (valid) {
          if (!programmeStep4Form.endDate) {
            this.$message({
              message: "请选择有效结束日期",
              type: "warning"
            });
            return;
          }
          if (
            this.$format(programmeStep4Form.endDate) <
            this.$format(programmeStep4Form.beginDate)
          ) {
            this.$message({
              message: "有效结束日期一定要大于有效开始日期哦",
              type: "warning"
            });
            return;
          }
          programmeStep4Form.beginDate = this.$format(
            programmeStep4Form.beginDate
          );
          programmeStep4Form.endDate = this.$format(programmeStep4Form.endDate);
          let propertyIds = JSON.parse(JSON.stringify(this.form.discountPropertyList))
          if (propertyIds.includes(2)) {
            propertyIds.push(3)
          }
          let form = {
            discountProgramId: this.form.discountProgramId,
            discountProgramName: this.form.discountProgramName, //优惠方案名称
            propertyIds: propertyIds, //优惠方案类型
            beginDate: this.form.beginDate, //有效开始日期
            endDate: this.form.endDate, //有效结束日期
            discountRatio: this.form.discountRatio, //折扣
            discountProgramType: "折扣", //使用条件传参
            remark: this.form.remark, //备注
            courseAmount: this.form.courseAmount,
            discountProgramId: this.form.discountProgramId
          };
          this.loading = true;
          updateDiscountProgram(form)
            .then(res => {
              this.loading = false;
              if (res.status == 200) {
                this.$message({
                  message: "编辑折扣优惠成功",
                  type: "success"
                });
                this.dialogShow = false;
                this.findDiscountProgramList();
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
    }
  },
  computed: {
    dialogShow: {
      set (val) {
        this.$refs.programmeStep4Form.resetFields();
        this.$emit("update:ProgrammeStep4EditDialog", val);
      },
      get () {
        return this.ProgrammeStep4EditDialog;
      }
    }
  },
  created () { }
};
</script>
<style scoped>
.iptWidth {
  width: 200px;
}
span {
  padding-left: 10px;
  font-size: 14px;
  color: #606266;
}
</style>
