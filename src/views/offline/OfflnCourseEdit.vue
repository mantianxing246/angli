<!--
 * @author wufan
 * @date 2019/1/8
-->
<template>
  <div class="app-container offln-course-edit">
      <DialogContainer title="编辑班教课程" :visible.sync="courseDialog" width="40%" :diglogClass="['']"> 
      <template slot="body">
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" style="width: 300px"/>
        </el-form-item>
        <el-form-item label="开始日期" prop="beginDate">
          <div class="block">
            <span class="demonstration"/>
            <el-date-picker v-model="form.beginDate" type="date" placeholder="选择日期" style="width: 300px"/>
          </div>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <div class="block">
            <span class="demonstration"/>
            <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width: 300px"/>
          </div>
        </el-form-item>

        <el-form-item label="课次" prop="times">
          <el-input v-model="form.times" style="width: 300px"  maxlength="3"/>
        </el-form-item>
        <el-form-item label="课次单价" prop="unitPrice">
          <Amount-Input money="￥" :amount.sync="form.unitPrice" maxlength="5" placeholder="请输入" clearable  style="width:300px"></Amount-Input>
          <!-- <el-input v-model="form.unitPrice" style="width: 300px" maxlength="5"/> -->
        </el-form-item>
        <el-form-item label="是否发布" prop="isPublish">
          <el-checkbox v-model="form.isPublish"/>
        </el-form-item>
      </el-form>
      <el-row>
      <el-col style="text-align:center;margin:20px 0;">
        <el-button @click="courseDialog = false">取消</el-button>
        <el-button type="primary" @click="editCourse(form)">确定</el-button>
      </el-col>
      </el-row>
      </template>
      </DialogContainer>
  </div>
</template>
<script>
import waves from '@/components/directive/waves' // Waves directive
import OfflnCourseMgtApi from '@/api/offline/OfflnCourseMgtApi'

export default {
  name: 'OfflnCourseEdit',
  directives: { waves },
  props: {
    updateCourseDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        courseId: '',   
        courseName: '', //课程名称
        beginDate: '', //开始日期
        endDate: '', //结束日期
        times: null,  //课次
        unitPrice: null, //价格
        isPublish: '' //是否发布
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 0, max: 30, message: '长度在30个字符之内', trigger: 'blur' }
        ],
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
        times: [
          { required: true, message: "请输入课次", trigger: "blur" },
          { validator: function(rule,value,callback){
            if(/^[1-9]*[1-9][0-9]*$/.test(Number(value)) == false){
              // 正则匹配正整数
              callback(new Error("请输入正确的数字"))
            }else{
              callback()
            }
          }, trigger: 'blur'}
        ],
        unitPrice: [
          { required: true, message: "请输入课次单价", trigger: "blur" },
          { validator: function(rule,value,callback){
            if(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(Number(value)) == false || Number(value) == 0){
              // 正则匹配正数
              callback(new Error("请输入正确的数字"))
            }else{
              callback()
            }
          }, trigger: 'blur'}
        ],
        courseType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ]
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  computed: {
    courseDialog: {
      get: function() {
        return this.updateCourseDialogVisible
      },
      set: function(val) {
        this.$emit('update:updateCourseDialogVisible', val)
      }
    }
  },
  methods: {
    // 重置form表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    //获取课程信息
    getSingleCourse(id) {
      OfflnCourseMgtApi.getSingleCourse(id).then(res => {
        this.form.courseId = res.data.courseId
        this.form.courseName = res.data.courseName
        this.form.beginDate = res.data.beginDate
        this.form.endDate = res.data.endDate
        this.form.times = res.data.times
        this.form.unitPrice = res.data.unitPrice
        if (res.data.isPublish === 1) {
          this.form.isPublish = true
        } else {
          this.form.isPublish = false
        }
      })
    },
    editCourse(form) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if(this.$format(this.form.endDate) < this.$format(this.form.beginDate)){
            this.$message({
              message: '课程结束日期一定要大于课程开始日期',
              type: 'warning'
            })
            return
          }
          if (form.isPublish) {
            this.form.isPublish = 1
          } else {
            this.form.isPublish = 0
          }
          if(this.form.beginDate){
            form.beginDate = this.$format(this.form.beginDate)
          }
          if(this.form.endDate){
            form.endDate = this.$format(this.form.endDate)
          }
          form.times = Number(form.times)
          form.unitPrice = Number(form.unitPrice)
          // 修改课程
          OfflnCourseMgtApi.updateCourse(this.form).then(res => {
            if (res.status === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.courseDialog = false
              this.$emit('reloadList')
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
  }
}
</script>
<style lang="scss" scoped>
  .offln-course-edit{
    .el-form{
      width: 400px;
      margin: auto;
    }
  }
</style>
