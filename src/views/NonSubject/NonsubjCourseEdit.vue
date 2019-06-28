<!--
 * @author jiakun
 * @date 2019/4/5
-->
<template>
  <div class="app-container offln-course-edit">
     <DialogContainer title="编辑非学科类课程" :visible.sync="courseDialog" width="900px" :diglogClass="['']"> 
      <template slot="body">
      <el-form ref="form" :model="form" :rules="rules" inline label-width="80px">
            <el-form-item label="省市" prop="provinceId">
              <el-select
                v-model="form.provinceId"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item,index) in headInfo.provinces"
                  :value="item.provinceId"
                  :label="item.provinceName"
                  :key="index"
                >{{ item.provinceName }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本" prop="version">
              <el-select
                v-model="form.version"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item,index) in headInfo.versions"
                  :value="item"
                  :label="item"
                  :key="index"
                >{{ item }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程类型" prop="courseType">
              <el-select
                v-model="form.courseType"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in courseTypes"
                  :key="item.index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
             <br/>
            <el-form-item label="上课形式" prop="isOnline">
              <el-select
                v-model="form.isOnline"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in courseFroms"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="form.courseName" :maxlength="50" style="width: 180px"/>
            </el-form-item>
            <el-form-item label="课程总价" prop="totalPrice">
               <Amount-Input money="￥" :amount.sync="form.totalPrice" maxlength="10" placeholder="请输入" clearable  style="width:180px"></Amount-Input>
              <!-- <el-input v-model="form.totalPrice" :maxlength="10" style="width: 180px"/> -->
            </el-form-item>
             <br/>
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                placeholder="选择日期"
                class="width200"
                clearable
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="选择日期"
                class="width200"
                clearable
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item prop="isPublish">
              <el-checkbox v-model="form.isPublish" :true-label="1" :false-label="0">是否发布</el-checkbox>
            </el-form-item>
             <br/>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              style="width:455px;"
              :maxlength="150"
              placeholder="请输入内容"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
      </el-form>
      <el-row>
      <el-col style="text-align:center;margin:20px 0;">
        <el-button @click="courseDialog = false">取消</el-button>
        <el-button type="primary" :loading="sunLoading" @click="editCourse(form)">确定</el-button>
      </el-col>
      </el-row>
      </template>
     </DialogContainer>
  </div>
</template>
<script>
import waves from '@/components/directive/waves' // Waves directive
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { getSingleCourse, updateNonsubjCourse } from "@/api/nonsubject/NonsubjCourseMgt"
import courseType from '@/CourseType/CourseType.js'
export default {
  name: 'NonsubjCourseEdit',
  directives: { waves },
  props: {
    updateCourseDialogVisible: {
      type: Boolean,
      default: false
    },
    findIndivCourseList: {
      type: Function,
      default: function () { }
    }
  },
  data () {
    return {
      sunLoading: false,
      courseTypes: courseType.nonSubjectCourseType,
      courseFroms: courseType.formCourseType,
      headInfo: {},
      form: {
        courseId: '',
        provinceId: '',//省市
        version:"",//版本
        courseName: '', //课程名称
        beginDate: '', //开始日期
        endDate: '', //结束日期
        courseType: '',//课程类型
        totalPrice: '', //总价格
        isOnline: '',//上课形式
        isPublish: 1, //是否发布
        remark: ''//备注
      },
      rules: {
        provinceId: [
          { required: true, message: '请选择省市', trigger: 'change' }
        ],
        courseType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        courseName: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        version: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ],
        isOnline: [
          { required: true, message: '请选择上课形式', trigger: 'change' }
        ],
        totalPrice: [
          { required: true, message: '请填写课程总价', trigger: 'blur' },
          { pattern: /^\d+\.?\d?\d?$/, message: '数字格式不对，请判断是否保留2位', trigger: 'blur' },
          { pattern: /^\d+(\.\d{0,2})?$/, message: '请保留两位小数', trigger: 'blur' }
        ],
        beginDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
      },
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
    getHeadInfo () {
      getHeadInfo().then((res) => {
        if (res.status == 200) {
          this.headInfo = res.data;
        }
      })
    },
    // 重置form表单
    resetForm () {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.classForms = courseType.formCourseType
        this.courseTypes = courseType.nonSubjectCourseType
      })
    },
    //获取课程信息
    getSingleCourse (courseId) {
      getSingleCourse(courseId).then(res => {
        this.form.courseId = res.data.courseId
        this.form.courseName = res.data.courseName
        this.form.beginDate = res.data.beginDate
        this.form.endDate = res.data.endDate
        this.form.version = res.data.version
        this.form.provinceId = res.data.provinceId
        this.form.courseType = res.data.courseType
        this.form.isOnline = res.data.isOnline
        this.form.totalPrice = res.data.totalPrice
        this.form.remark = res.data.remark
        if (res.data.isPublish === 1) {
          this.form.isPublish = true
        } else {
          this.form.isPublish = false
        }
      })
    },
    editCourse (form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.$format(this.form.endDate) < this.$format(this.form.beginDate)) {
            this.$message({
              message: '结束日期一定要大于开始日期哦',
              type: 'warning'
            })
            return
          }
          this.sunLoading = true;
          if (form.isPublish) {
            this.form.isPublish = 1
          } else {
            this.form.isPublish = 0
          }
          if (this.form.beginDate) {
            form.beginDate = this.$format(this.form.beginDate)
          }
          if (this.form.endDate) {
            form.endDate = this.$format(this.form.endDate)
          }
          form.totalPrice = Number(form.totalPrice)
          // 修改课程
          updateNonsubjCourse(this.form).then(res => {
            this.sunLoading = false;
            if (res.status === 200) {
              this.$message({
                message: '修改非学科类课程成功',
                type: 'success'
              })
              this.$parent.findNonsubjCourseList()
              this.courseDialog = false
            } else if (res.status === 500) {
              this.$message({
                message: res.message,
                type: 'warning'
              })
              return
            } else {
              this.$message({
                message: '修改失败，稍后重试',
                type: 'warning'
              })
            }
          })
        }
      })
    }
  },
  created () {
    this.getHeadInfo();
  },
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
