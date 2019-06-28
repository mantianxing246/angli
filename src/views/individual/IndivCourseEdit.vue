<!--
 * @author wufan
 * @date 2019/1/8
-->
<template>
  <div class="app-container offln-course-edit">
    <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="courseDialog" title="编辑在线个性化课程" center width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="开始日期" prop="beginDate">
          <div class="block">
            <span class="demonstration"/>
            <el-date-picker
              v-model="form.beginDate"
              type="date"
              placeholder="选择日期"
              style="width: 300px"
            />
          </div>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <div class="block">
            <span class="demonstration"/>
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="选择日期"
              style="width: 300px"
            />
          </div>
        </el-form-item>

        <el-form-item label="课时数" prop="hours" required>
          <el-input v-model="form.hours" maxlength="3" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="课时单价" prop="unitPrice">
              <AmountInput money="￥" placeholder="" style="width: 300px" :amount.sync="form.unitPrice"></AmountInput>
        </el-form-item>
        <el-form-item label="是否发布" prop="isPublish">
          <el-checkbox v-model="form.isPublish"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="courseDialog = false">取消</el-button>
        <el-button type="primary" :loading="sunLoading" @click="editCourse(form)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import {
  getSingleCourse,
  updateIndivCourse
} from "@/api/individual/IndivCourseMgt";
import { validatorFactory } from "@/utils/async-validator";
export default {
  name: "IndivCourseEdit",
  directives: { waves },
  props: {
    updateCourseDialogVisible: {
      type: Boolean,
      default: false
    },
    findIndivCourseList: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      sunLoading: false,
      form: {
        courseId: "",
        courseName: "", //课程名称
        beginDate: "", //开始日期
        endDate: "", //结束日期
        hours: "", //课次
        unitPrice: "", //价格
        isPublish: "", //是否发布
        totalPrice: "" //总价
      },
      rules: {
        provinceId: [
          { required: true, message: "请选择省市", trigger: "change" }
        ],
        courseType: [
          { required: true, message: "请选择课程类型", trigger: "change" }
        ],
        isOnline: [
          { required: true, message: "请选择上课形式", trigger: "change" }
        ],
        courseName: [
          { required: true, message: "请选择课程名称", trigger: "change" }
        ],
        unitPrice: [
          { required: true, message: "请填写课程单价", trigger: "blur" },
          {
            pattern: /^\d+\.?\d?\d?$/,
            message: "数字格式不对，请判断是否保留2位",
            trigger: "blur"
          },
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: "请保留两位小数",
            trigger: "blur"
          }
        ],
        beginDate: [
          { required: true, message: "请选择开始日期", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "change" }
        ],
        hours: [validatorFactory("请输入正确的数字")]
      }
    };
  },
  computed: {
    courseDialog: {
      get: function() {
        return this.updateCourseDialogVisible;
      },
      set: function(val) {
        this.$emit("update:updateCourseDialogVisible", val);
      }
    }
  },
  methods: {
    // 重置form表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    //获取课程信息
    getSingleCourse(courseId) {
      getSingleCourse(courseId).then(res => {
        this.form.courseId = res.data.courseId;
        this.form.courseName = res.data.courseName;
        this.form.beginDate = res.data.beginDate;
        this.form.endDate = res.data.endDate;
        this.form.hours = res.data.hours;
        this.form.unitPrice = res.data.unitPrice;
        if (res.data.isPublish === 1) {
          this.form.isPublish = true;
        } else {
          this.form.isPublish = false;
        }
      });
    },
    editCourse(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (
            this.$format(this.form.endDate) < this.$format(this.form.beginDate)
          ) {
            this.$message({
              message: "结束日期一定要大于开始日期哦",
              type: "warning"
            });
            return;
          }
          this.sunLoading = true;
          if (form.isPublish) {
            this.form.isPublish = 1;
          } else {
            this.form.isPublish = 0;
          }
          if (this.form.beginDate) {
            form.beginDate = this.$format(this.form.beginDate);
          }
          if (this.form.endDate) {
            form.endDate = this.$format(this.form.endDate);
          }
          form.hours = Number(form.hours);
          form.unitPrice = Number(form.unitPrice);
          form.totalPrice = this.form.unitPrice * this.form.hours;
          // 修改课程
          updateIndivCourse(this.form).then(res => {
            this.sunLoading = false;
            if (res.status === 200) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.$parent.findIndivCourseList();
              this.courseDialog = false;
            } else {
              this.$message({
                message: "修改失败，稍后重试",
                type: "warning"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.offln-course-edit {
  .el-form {
    width: 400px;
    margin: auto;
  }
}
</style>
