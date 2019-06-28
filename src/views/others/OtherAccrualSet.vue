<!--
 * @author jiakun
 * @date 2019/4/5
-->
<template>
  <div class="app-container offln-course-edit">
    <DialogContainer title="课耗" :visible.sync="courseDialog" width="25%" :diglogClass="['']">
      <template slot="body">
        <el-form ref="createCourseForm" :model="form" label-position="left" label-width="80px">
          <el-col>
            <el-form-item label="课程价格" prop="totalPrice">
              ￥<span>{{form.totalPrice}}</span> 
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="剩余课耗" prop="residueAmount">
              ￥<span>{{form.residueAmount}}</span> 
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="本次消耗" prop="currentCourseConsumption">
               <Amount-Input money="￥" :amount.sync="form.currentCourseConsumption"  style="width:150px"></Amount-Input>
            </el-form-item>
          </el-col>
        </el-form>
      </template>
      <template slot="footer">
        <el-button @click="courseDialog = false">取 消</el-button>
        <el-button :loading="sunLoading" type="primary" @click="editCourse()">确 定</el-button>
      </template>
    </DialogContainer>
  </div>
</template>
<script>
import waves from '@/components/directive/waves' // Waves directive
// import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { findCourseConsumption, updateCourseConsumption } from "@/api/other/OtherCourseMgt"
import courseType from '@/CourseType/CourseType.js'
export default {
  name: 'NonsubjAccrualSet',
  directives: { waves },
  props: {
    updateCourseDialogVisible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      sunLoading: false,
      form: {
        orderCourseId: "",
        courseId: "",
        orderId: "",
        propertyId: "",
        studentId: "",
        totalPrice: "",//课程价格
        modifyBy: "",
        modifyTime: "",
        accrualDate: "",
        accruedRevenue: "",//权责
        currentCourseConsumption: "",//本次课耗
        remainCourseConsumption: "",//剩余课耗
      },
      // rule: {
      //   currentCourseConsumption: [
      //     { required: true, message: '请填写课时数', trigger: 'blur' },
      //     { pattern: /^\d+$/, message: '必须是数字', trigger: 'blur' }
      //   ],
      // }
    }
  },
  computed: {
    courseDialog: {
      get: function () {
        return this.updateCourseDialogVisible
      },
      set: function (val) {
        this.$emit('update:updateCourseDialogVisible', val)
      }
    }
  },
  methods: {
    resetForm () {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    findCourseConsumption (orderCourseId) {
      findCourseConsumption(orderCourseId).then(res => {
        this.sunLoading = false;
        if (!res.data) {
          this.$message({
            message: '数据获取失败',
            type: 'warning'
          })
          return;
        }
        this.form = res.data
        this.form.totalPrice = res.data.totalPrice
        this.form.currentCourseConsumption = res.data.currentCourseConsumption
        this.form.remainCourseConsumption = res.data.remainCourseConsumption
      })
    },
    editCourse (form) {
      if (this.form.currentCourseConsumption == null || this.form.currentCourseConsumption == "") {
        this.$message({
          message: '请输入本次消耗金额',
          type: 'warning'
        })
        return;
      }
      if (this.form.currentCourseConsumption > this.form.residueAmount) {
        this.$message({
          message: '本次消耗大于剩余课耗',
          type: 'warning'
        })
        return
      }
      if (this.form.currentCourseConsumption != Number(this.form.currentCourseConsumption)) {
        this.$message({
          message: '请输入数字',
          type: 'warning'
        })
        return;
      }
      this.sunLoading = true;
      this.form.totalPrice = Number(this.form.totalPrice)
      // 消课
      updateCourseConsumption(this.form).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '消课成功',
            type: 'success'
          })
          this.$parent.findOtherConsumerList()
          this.courseDialog = false
        } else {
          this.$message({
            message: '修改失败，稍后重试',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 0;
}
.width200 {
  width: 180px;
}
</style>
