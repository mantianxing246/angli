
<template>
  <div class="IndivCourseAdd">
    <DialogContainer title="新增非学科类课程" :visible.sync="createCourseDialogVisibleComputed" width="900px" :diglogClass="['']"> 
      <template slot="body">
      <el-form
        ref="createCourseTemp"
        :model="createCourseTemp"
        :rules="createCourseRule"
        label-width="80px"
        inline
      >
            <el-form-item label="省市" prop="provinceId">
              <el-select
                v-model="createCourseTemp.provinceId"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in provinces"
                  :key="item.provinceId"
                  :label="item.provinceName"
                  :value="item.provinceId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="版本" prop="version">
              <el-select
                v-model="createCourseTemp.version"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in versions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类型" prop="courseType">
              <el-select
                v-model="createCourseTemp.courseType"
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
                v-model="createCourseTemp.isOnline"
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
              <el-input
              placeholder="请输入"
                v-model.trim="createCourseTemp.courseName"
                :maxlength="50"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="课程总价" prop="totalPrice">
               <Amount-Input money="￥" :amount.sync="createCourseTemp.totalPrice" maxlength="10" placeholder="请输入" clearable  style="width:180px"></Amount-Input>
              <!-- <el-input v-model="createCourseTemp.totalPrice" placeholder="请输入" :maxlength="10" style="width: 180px"/> -->
            </el-form-item>
             <br/>
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker
                v-model="createCourseTemp.beginDate"
                type="date"
                placeholder="选择日期"
                class="width200"
                clearable
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="createCourseTemp.endDate"
                type="date"
                placeholder="选择日期"
                class="width200"
                clearable
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item prop="isPublish" label-width="0px">
              <el-checkbox
                v-model="createCourseTemp.isPublish"
                :true-label="1"
                :false-label="0"
              >是否发布</el-checkbox>
            </el-form-item>
             <br/>
        
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              :maxlength="150"
              style="width:455px"
              v-model="createCourseTemp.remark"
            ></el-input>
          </el-form-item>
      </el-form>
      <el-row>
      <el-col style="text-align:center;margin:20px 0;">
        <el-button @click="createCourseDialogVisibleComputed = false">取 消</el-button>
        <el-button
          :loading="sunLoading"
          type="primary"
          @click="submitCourse('createCourseTemp')"
        >确 定</el-button>
       </el-col>
    </el-row>
      </template>
    </DialogContainer>
  </div>
</template>
<script>
import { insertNonsubjCourse } from '@/api/nonsubject/NonsubjCourseMgt'
import { getHeadInfo } from '@/api/components/HeadInfoApi' // 获取下拉框内容接口
import courseType from '@/CourseType/CourseType.js'
export default {
  name: 'IndivCourseAdd',
  props: {
    createCourseDialogVisible: {
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
      creatCourseList: [], // 新加一行数据
      creatCourseIdList: [],
      years: [], // 高考年份列表
      courseTypes: courseType.nonSubjectCourseType,
      courseFroms: courseType.formCourseType,
      versions:[],//版本列表
      provinces: [ // 省市列表
        {
          provinceId: '',
          provinceName: ''
        }
      ],

      createCourseTemp: {
        provinceId: '', // 省
        version:'',//版本
        isPublish: 1, // 是否发布
        isOnline: '',//上课形式
        courseType: '', // 课程类型
        courseCode: '', // 课程码
        courseTypeseName: '', // 课程类型
        courseName: '', // 课程名
        beginDate: '', // 开始日期
        endDate: '', // 结束日期
        totalPrice: '', // 课程总价
        remark: ''//备注
      },
      courseCodes: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 课程码列表
      createCourseRule: {
        provinceId: [
          { required: true, message: '请选择省市', trigger: 'change' }
        ],
        courseType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        courseId: [
          { required: true, message: '请选择课程码', trigger: 'change' }
        ],
         version: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ],
        isOnline: [
          { required: true, message: '请选择上课形式', trigger: 'change' }
        ],
        courseName: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
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
        ]
      }
    }
  },
  computed: {
    createCourseDialogVisibleComputed: {
      get: function () {
        return this.createCourseDialogVisible
      },
      set: function (val) {
        this.$refs.createCourseTemp.resetFields()
        this.$emit('update:createCourseDialogVisible', val)
        if (val == false) {
          this.creatCourseList = []
        }
      }
    }
  },
  created () {
    this.addCourse()
  },
  methods: {
    addCourse () { // 获取基础下拉框列表
      getHeadInfo().then(res => {
        this.provinces = res.data.provinces
        this.versions = courseType.versions
        this.subjects = res.data.subjects
      })
    },
    submitCourse (createCourseTemp) {
      this.$refs['createCourseTemp'].validate(valid => {
        if (valid) {
          if (
            this.$format(this.createCourseTemp.endDate) < this.$format(this.createCourseTemp.beginDate)
          ) {
            this.$message({
              message: "课程结束日期不能小于课程开始日期哦",
              type: "warning"
            });
            return;
          }
          // 定义一个新的表单对象
          let newForm = JSON.stringify(this.createCourseTemp);
          newForm = JSON.parse(newForm);

          newForm.beginDate = this.$format(this.createCourseTemp.beginDate);
          newForm.endDate = this.$format(this.createCourseTemp.endDate);
          // 1为发布，0未发布
          if (this.createCourseTemp.isPublish) {
            newForm.isPublish = 1;
          } else {
            newForm.isPublish = 0;
          }
          // 传属性值固定为3 表示这是直播新增
          newForm.propertyId = 3;
          insertNonsubjCourse(newForm).then(res => {
            if (res.status == 200) { // 新增成功
              this.createCourseDialogVisibleComputed = false
              this.$message({
                message: '新增成功',
                type: "success"
              });
              this.$parent.findNonsubjCourseList()
            } else if (res.status == 500) {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          })
            .catch(error => { });
        } else {
          return false;
        }
      })
    },
  }
}
</script>
<style scoped>
.el-row {
  margin-bottom: 0;
}
.width200 {
  width: 180px;
}
</style>

