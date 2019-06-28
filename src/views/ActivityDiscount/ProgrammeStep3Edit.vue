
<template>
  <div>
    <el-dialog :close-on-click-modal="false" 
      v-el-drag-dialog
      v-loading="true"
      :visible.sync="dialogShow"
      title="编辑满减优惠"
      width="70%"
      center
      highlight-current-row
      border
      fit
      stripe
      ref="programmeStep3Form"
    >
      <el-form ref="programmeStep3Form" :model="programmeStep3Form" label-position="right" inline :rules="rules">
        <el-form-item label="优惠名称" :label-width="labelWidth" prop="discountProgramName">
          <el-input clearable class="iptWidth" v-model="programmeStep3Form.discountProgramName"/>
        </el-form-item><br>
        <el-form-item label="课程属性" :label-width="labelWidth" prop="discountPropertyList">
          <el-checkbox-group v-model="programmeStep3Form.discountPropertyList">
            <el-checkbox :value="1" :label="1">班教</el-checkbox>
            <el-checkbox :value="2" :label="2">录播、直播</el-checkbox>
            <el-checkbox :value="4" :label="4">在线个性化</el-checkbox>
            <!-- <el-checkbox :value="5" :label="5">咨询类</el-checkbox> -->
            <el-checkbox :value="5" :label="5">非学科</el-checkbox>
          </el-checkbox-group>
        </el-form-item><br>
        <el-form-item label="有效期" :label-width="labelWidth" prop="beginDate">
          <el-date-picker
            type="date"
            placeholder="开始日期"
            class="iptWidth"
            v-model="programmeStep3Form.beginDate"
          />
          <span>-</span>
          <el-date-picker
            type="date"
            placeholder="结束日期"
            class="iptWidth"
            v-model="programmeStep3Form.endDate"
          />
        </el-form-item><br>
        <el-form-item label="满" style="margin-right:0;" :label-width="labelWidth" prop="courseAmount">
              <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="programmeStep3Form.courseAmount"></AmountInput>
        </el-form-item>
        <el-form-item label="减" prop="discountAmount">
              <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="programmeStep3Form.discountAmount"></AmountInput>
        </el-form-item><br>
        <el-form-item label="备注" :label-width="labelWidth">
          <el-input type="textarea" :rows="5" style="width:400px;" v-model="programmeStep3Form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top:20px">
        <el-button @click="dialogShow=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="updateProgramme(programmeStep3Form)">确认</el-button>
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
  name: "ProgrammeStep3Edit",
  props: ["ProgrammeStep3EditDialog", "findDiscountProgramList"],
  data: function() {
    return {
      labelWidth:'80px',
      loading: false,
      programmeStep3Form: {
        discountProgramId: "",
        discountProgramName: "", //优惠方案名称
        discountPropertyList: [], //优惠方案类型
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
        discountAmount: [
          { required: true, message: "请填写满减金额", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    findDiscountProgram,
    updateDiscountProgram
  },
  methods: {
    resetForm() {
      this.$nextTick(() => {
        this.$refs["programmeStep3Form"].resetFields();
      });
    },
    //获取回显信息
    getDiscountProgram(discountProgramId, discountProgramType) {
      this.programmeStep3Form.discountProgramId = discountProgramId;
      findDiscountProgram({
        discountProgramId: discountProgramId,
        discountProgramType: discountProgramType
      }).then(res => {
        if (res.status == 200) {
          this.programmeStep3Form.discountProgramName =
            res.data.discountProgramName;
          this.programmeStep3Form.beginDate = res.data.beginDate;
          this.programmeStep3Form.endDate = res.data.endDate;
          this.programmeStep3Form.discountProgramType =
            res.data.discountProgramType;
          this.programmeStep3Form.courseAmount = res.data.courseAmount;
          this.programmeStep3Form.discountAmount = res.data.discountAmount;
          this.programmeStep3Form.remark = res.data.remark;
          for (var i = 0; i < res.data.discountPropertyList.length; i++) {
            if (res.data.discountPropertyList[i].propertyId !== 3) {
              this.programmeStep3Form.discountPropertyList.push(
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
    updateProgramme(programmeStep3Form) {
      this.$refs.programmeStep3Form.validate(valid => {
        if (valid) {
          if (!this.programmeStep3Form.endDate) {
            this.$message({
              message: "请选择有效结束日期",
              type: "warning"
            });
            return;
          }
          if (
            this.$format(this.programmeStep3Form.endDate) <
            this.$format(this.programmeStep3Form.beginDate)
          ) {
            this.$message({
              message: "有效结束日期一定要大于有效开始日期哦",
              type: "warning"
            });
            return;
          }
          programmeStep3Form.beginDate = this.$format(
            programmeStep3Form.beginDate
          );
          programmeStep3Form.endDate = this.$format(programmeStep3Form.endDate);
          let propertyIds = JSON.parse(
            JSON.stringify(this.programmeStep3Form.discountPropertyList)
          );
          if (propertyIds.includes(2)) {
            propertyIds.push(3);
          }
          let form = {
            discountProgramId: this.programmeStep3Form.discountProgramId,
            discountProgramName: this.programmeStep3Form.discountProgramName, //优惠方案名称
            propertyIds: propertyIds, //优惠方案类型
            beginDate: this.programmeStep3Form.beginDate, //有效开始日期
            endDate: this.programmeStep3Form.endDate, //有效结束日期
            discountProgramType: "满减", //使用条件传参
            courseAmount: this.programmeStep3Form.courseAmount, //满
            discountAmount: this.programmeStep3Form.discountAmount, //减
            remark: this.programmeStep3Form.remark, //备注
            discountProgramId: this.programmeStep3Form.discountProgramId
          };
          this.loading = true;
          updateDiscountProgram(form)
            .then(res => {
              this.loading = false;
              if (res.status == 200) {
                this.$message({
                  message: "编辑满减优惠成功",
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
      set(val) {
        this.$emit("update:ProgrammeStep3EditDialog", val);
      },
      get() {
        return this.ProgrammeStep3EditDialog;
      }
    }
  },
  created() {}
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

