<template>
  <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="courseEditDialog" title="编辑直播课程" width="70%" style="min-width:1000px" center class="rec-live-course">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="left"
      class="demo-form"
    >
      <el-row>
        <el-col>
          <el-form-item label="年级" prop="gradeIds">
            <el-checkbox-group v-model="form.gradeIds">
              <el-checkbox
                v-for="item in listQuery.grades"
                :key="item.gradeId"
                :label="item.gradeId"
                :value="item.gradeId"
              >{{ item.gradeName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="form.courseName" style="width:400px" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>  
            <el-form-item label="课程价格" prop="totalPrice">
              <AmountInput money="￥" placeholder="" class="selectWidth" :amount.sync="form.totalPrice"></AmountInput>
            </el-form-item>
        </el-col>
      </el-row>
       <el-row :gutter="20">
        <el-col :span="7">  
          <el-form-item label="课程开始日期" prop="beginDate">
            <el-date-picker
              v-model="form.beginDate"
              type="date"
              placeholder="选择日期"
              style="width:100%;min-width:128px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">  
          <el-form-item label="课程结束日期" prop="endDate">
            <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width:100%;min-width:128px"/>
          </el-form-item>
        </el-col>
         <el-col :span="7">  
          <el-form-item label="课耗结束日期" prop="accrulEndDate">
            <el-date-picker
              v-model="form.accrulEndDate"
              type="date"
              placeholder="选择日期"
              style="width:100%;min-width:128px"
            />
          </el-form-item>
         </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="直播老师" prop="teacherId">
            <el-select v-model="form.teacherId" disabled placeholder="请前往原系统修改" clearable  class="selectWidth">
              <el-option
                v-for="item in listQuery.teachers"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item.teacherId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="助教老师" prop="teacherId">
            <el-select v-model="form.teacherId" disabled placeholder="请前往原系统修改"  class="selectWidth">
              <el-option
                v-for="item in listQuery.teachers"
                :key="item.teacherId"
                :label="item.teacherName"
                :value="item.teacherId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否发布">
        <el-checkbox v-model="form.isPublish"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="courseEditDialog = false">取 消</el-button>
      <el-button type="primary" :loading="subLoading" @click="confirmEdit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getSingleCourse,
  updateSingleCourse
} from '@/api/live/LiveCourseMgtApi'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
export default {
  name: 'LiveCourseEdit',
  props: {
    updateClassDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      subLoading:false,
      form: {
        courseName: '', // 课程名称
        coursePeriodId: '', //选中的阶段
        totalPrice: '', // 课程价格
        beginDate: '', // 课程开始时间
        endDate: '', // 课程结束时间
        accrulEndDate: '', // 课耗结束时间
        teacherId: '', // 选中的授课教师
        isPublish: false // 是否发布
      },
      listQuery: {}, //下拉框数据
      rules: {
        gradeIds: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 0, max: 30, message: '长度在30个字符之类', trigger: 'blur' }
        ],
        // coursePeriodId: [{ required: true, message: '请选择阶段', trigger: 'change' }],
        beginDate: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        endDate: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        accrulEndDate: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        totalPrice: [
          { required: true, message: '请填写课程价格', trigger: 'blur' },
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: '请输入数字',
            trigger: 'blur'
          },
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: '请保留两位小数',
            trigger: 'blur'
          } 
        ]
      }
    }
  },
  computed: {
    // 弹窗显示与否
    courseEditDialog: {
      get: function () {
        // console.log(this.updateClassDialogVisible)
        return this.updateClassDialogVisible
      },
      set: function (val) {
        this.$emit('update:updateClassDialogVisible', val)
      }
    }
  },
  methods: {
    // 重置form表单
    resetForm () {
      this.$nextTick(() => {
        // console.log('form--->>',this.$refs['form'])
        this.$refs['form'].resetFields()
      })
    },
    // 图片上传之前
    beforeTeacherImgUpload (file, type) {
      console.log()
      const url = ''
      this.form.teacherImgUrl = URL.createObjectURL(file)
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    beforeHelpTeacherImgUpload (file, type) {
      const url = ''
      this.form.helpTeacherImgUrl = URL.createObjectURL(file)
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    getQueryList () {
      this.form = {}
      getHeadInfo()
        .then(res => {
          // console.log(res.data)
          if (res.status == 200) {
            res.data.teachers = []
            this.listQuery = res.data
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
        .catch(error => {
          // console.log(error)
        })
    },
    // 获取单个课程信息
    getSingleCourse (courseId) {
      this.courseId = courseId
      getSingleCourse(courseId)
        .then(res => {
          if (res.status == 200) {
            // 1为不发布，0为发布
            if (res.data.isPublish == 1) {
              res.data.isPublish = true
            } else {
              res.data.isPublish = false
            }
            if (res.data.beginDate) {
              res.data.beginDate = new Date(res.data.beginDate)
            }
            if (res.data.endDate) {
              res.data.endDate = new Date(res.data.endDate)
            }
            if (res.data.accrulEndDate) {
              res.data.accrulEndDate = new Date(res.data.accrulEndDate)
            }
            this.form = res.data
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        })
        .catch(res => { })
    },
    // 确认编辑课程
    confirmEdit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if(this.$format(this.form.endDate) < this.$format(this.form.beginDate)){
            this.$message({
              message: '课程结束日期一定要大于课程开始日期哦',
              type: 'warning'
            })
            return
          }
           if(this.$format(this.form.beginDate) > this.$format(this.form.accrulEndDate)){
            this.$message({
              message: '课耗结束日期一定要大于课程开始日期哦',
              type: 'warning'
            })
            return
          }
          this.subLoading=true;
          // 定义一个新的表单对象
          let newForm = JSON.stringify(this.form)
          newForm = JSON.parse(newForm)

          newForm.beginDate = this.$format(this.form.beginDate)
          newForm.endDate = this.$format(this.form.endDate)
          newForm.accrulEndDate = this.$format(this.form.accrulEndDate)

          // 1为发布，0为不发布
          if (this.form.isPublish) {
            newForm.isPublish = 1
          } else {
            newForm.isPublish = 0
          }
          // 当前确认需要修改的录播课程Id
          newForm.courseId = this.courseId
          updateSingleCourse(newForm)
            .then(res => {
              this.subLoading=false;
              if (res.data.status == 200) {
                this.$message({
                  message: '编辑成功！',
                  type: 'success'
                })
                this.courseEditDialog = false
                this.$emit('reloadList')
              } else {
                this.$message({
                  message: res.data.failMessage,
                  type: 'warning'
                })
              }
            })
            .catch(error => {
              // console.log(error)
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  margin: auto;
}
.selectWidth{min-width:130px}
</style>
