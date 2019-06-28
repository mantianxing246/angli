<!--
 * @author tianjiaru
 * @date 2019/1/14
-->
<template>
  <div class="OfflnCourseAdd">
    <DialogContainer title="新增班教课程" :visible.sync="courseDialog" width="900px" :diglogClass="['']"> 
      <template slot="body">
      <el-form ref="form" :model="form" :rules="rules" inline>
            <el-form-item label="省市" prop="provinceId" label-width="60px">
              <el-select v-model="form.provinceId" clearable placeholder="请选择">
                <el-option
                  v-for="item in provinces"
                  :key="item.provinceId"
                  :label="item.provinceName"
                  :value="item.provinceId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="版本" prop="version" label-width="80px">
              <el-select v-model="form.version" placeholder="请选择">
                <el-option v-for="item in versions" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
            <el-form-item label="年级" prop="gradeId" label-width="95px">
              <el-select v-model="form.gradeId" clearable placeholder="请选择">
                <el-option
                  v-for="item in grades"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId"
                />
              </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="学科" prop="subjectId" label-width="60px">
              <el-select v-model="form.subjectId" clearable placeholder="请选择">
                <el-option
                  v-for="item in subjects"
                  :key="item.subjectId"
                  :label="item.subjectName"
                  :value="item.subjectId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="课程类型" prop="courseType" label-width="80px">
              <el-select v-model="form.courseType" clearable placeholder="请选择">
                <el-option v-for="item in courseTypes" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
        
            <el-form-item label="阶段" prop="coursePeriodId" label-width="95px">
              <el-select v-model="form.coursePeriodId" clearable placeholder="请选择">
                <el-option
                  v-for="item in coursePeriods"
                  :key="item.coursePeriodId"
                  :label="item.coursePeriodName"
                  :value="item.coursePeriodId"
                />
              </el-select>
            </el-form-item>
            <br/>
            <el-form-item label="校区" prop="campusId" label-width="60px">
              <el-select v-model="form.campusId" clearable placeholder="请选择">
                <el-option
                  v-for="item in campuses"
                  :key="item.campusId"
                  :label="item.campusName"
                  :value="item.campusId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="开始日期" prop="beginDate" required label-width="80px">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                clearable
                style="width:180px"
                placeholder="选择日期"
              />
            </el-form-item>

            <el-form-item label="结束日期" prop="endDate" required label-width="95px">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                clearable
                style="width:180px"
                placeholder="选择日期"
              />
            </el-form-item>
            <br/>
            <el-form-item label="课次" prop="times" label-width="60px">
              <el-input v-model="form.times" maxlength="3" style="width:180px" placeholder="请输入" clearable/>
            </el-form-item>
     
            <el-form-item label="课次单价" prop="unitPrice" label-width="80px">
              <Amount-Input money="￥" :amount.sync="form.unitPrice" maxlength="5" placeholder="请输入" clearable  style="width:180px"></Amount-Input>
            </el-form-item>
        
            <el-form-item prop="isPublish">
              <el-checkbox v-model="form.isPublish" :true-label="1" :false-label="0">是否发布</el-checkbox>
              <el-button
                type="primary"
                style="float:right;margin-bottom:20px"
                @click="addCreateClass(form)"
              >加一行</el-button>
            </el-form-item>
            <br/>
      </el-form>

      <el-table
        v-show="creatCourseList.length > 0"
        :data="creatCourseList"
        highlight-current-row
        style="width: 100%;"
        border
        fit
        stripe
      >
        <el-table-column label="版本" align="center" prop="version" width="80"/>
        <el-table-column label="年级" align="center" prop="gradeName" width="80"/>
        <el-table-column label="学科" align="center" prop="subjectName" width="80"/>
        <el-table-column label="阶段" align="center" prop="coursePeriodName" width="80"/>
        <el-table-column label="课程类型" align="center" prop="courseType" width="80"/>
        <el-table-column label="校区" align="center" prop="campusName" width="80"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
        <el-table-column label="开始日期" align="center" prop="beginDate" width="100"/>
        <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
        <el-table-column label="课次" align="center" prop="times" width="60"/>
        <el-table-column label="课次单价" align="center" prop="unitPrice" width="70"/>
        <el-table-column label="课程价格" align="center" prop="totalPrice" width="100"/>
        <el-table-column label="是否发布" align="center" prop="isPublish" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.isPublish?"是":"否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="year" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDelete(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
      <el-col style="text-align:center;margin:20px 0;">
        <el-button @click="courseDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCourse()">确 定</el-button>
      </el-col>
      </el-row>
      </template>
    </DialogContainer>
  </div>
</template>
<script>
import { saveCourse } from "@/api/offline/OfflnCourseMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
import courseType from '@/CourseType/CourseType'
export default {
  name: "OfflnCourseAdd",
  props: {
    createCourseDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listLoading: true,
      creatCourseList: [],
      creatCourseList: [],
      courseList: [],
      form: {
        provinceId: null, // 选中的省市
        gradeId: null, // 选中的年级
        version: null, // 选中的版本
        subjectId: null, // 选中的学科
        courseType: '', // 选中的课程类型
        coursePeriodId: null, //选中的阶段
        campusId: null, // 选中的校区
        beginDate: '', // 课程开始日期
        endDate: '', // 课程结束日期
        times: null,  //课次
        unitPrice: null, //课次单价
        provinceId: 2,
        isPublish: 1
      }, //form表单
      rules: {
        provinceId: [
          { required: true, message: "请选择省市", trigger: "change" }
        ],
        gradeId: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
         version: [
          { required: true, message: "请选择版本", trigger: "change" }
        ],
        campusId: [
          { required: true, message: "请选择校区", trigger: "change" }
        ],
        coursePeriodId: [
          { required: true, message: "请选择时间阶段", trigger: "change" }
        ],
        courseType: [
          { required: true, message: "请选择课程类型", trigger: "change" }
        ],
        subjectId: [
          { required: true, message: "请选择学科", trigger: "change" }
        ],
        times: [
          { required: true, message: "请输入课次", trigger: "blur" },
          {            validator: function (rule, value, callback) {
              if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(Number(value)) == false || Number(value) === 0) {
                // 正则匹配非负数
                callback(new Error("请输入正确的数字"))
              } else {
                callback();
              }
            }, trigger: 'blur'          }
        ],
        unitPrice: [
          { required: true, message: "请输入课次单价", trigger: "blur" },
          {            validator: function (rule, value, callback) {
              if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(Number(value)) == false || Number(value) === 0) {
                // 正则匹配非负数
                callback(new Error("请输入正确的数字"))
              } else {
                callback();
              }
            }, trigger: 'blur'          }
        ],
        beginDate: [
          { required: true, message: "请选择开始日期", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择结束日期", trigger: "change" }
        ]
      },
      versions: [], //年级
      campuses: [], //校区
      coursePeriods: [], //阶段
      courseTypes: courseType.offlineCourseType, //类型，前端设定
      grades: [], //年级
      provinces: [], //省市
      subjects: [] //学科
    }
  },
  computed: {
    courseDialog: {
      get: function () {
        return this.createCourseDialogVisible;
      },
      set: function (val) {
        this.$emit("update:createCourseDialogVisible", val)
        if (val == false) {
          this.creatCourseList = []
        }
      }
    }
  },
  created () {
    this.getHeadInfo()
  },
  methods: {
    // 重置form表单
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    addCreateClass (form) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.$format(this.form.endDate) < this.$format(this.form.beginDate)) {
            this.$message({
              message: '课程结束日期一定要大于课程开始日期',
              type: 'warning'
            })
            return
          }
          var arr = []
          this.provinces.forEach(item => {
            if (item.provinceId == this.form.provinceId) {
              arr.push(item.provinceName)
              form.provinceName = item.provinceName
            }
          })
          // arr.push(this.form.versions)
          this.grades.forEach(item => {
            if (item.gradeId == this.form.gradeId) {
              arr.push(item.gradeName)
              form.gradeName = item.gradeName
            }
          })
          this.subjects.forEach(item => {
            if (item.subjectId == this.form.subjectId) {
              arr.push(item.subjectName)
              form.subjectName = item.subjectName
            }
          })
          // 课程类型
          arr.push(this.form.courseType)
          // 阶段
          this.coursePeriods.forEach(item => {
            if (item.coursePeriodId == this.form.coursePeriodId) {
              arr.push(item.coursePeriodName)
              form.coursePeriodName = item.coursePeriodName
            }
          })
          // 校区
          this.campuses.forEach(item => {
            if (item.campusId == this.form.campusId) {
              arr.push(item.campusName)
              form.campusName = item.campusName
            }
          })
          form.times = Number(form.times)
          form.unitPrice = Number(form.unitPrice)
          form.totalPrice = form.times * form.unitPrice  //总价
          form.courseName = ''
          if (arr.length) {
            form.courseName = arr.join('-')
          }
          if (this.creatCourseList.length) {
            var repeat = false
            for (var i = 0;i < this.creatCourseList.length;i++) {
              if (this.creatCourseList[i].courseName === this.form.courseName) {
                repeat = true
              }
            }
            if (repeat) {
              this.$message({
                message: '该课程已加入列表，请勿重复添加',
                type: 'warning'
              })
              return false
            }
          }
          form.beginDate = this.$format(form.beginDate)
          form.endDate = this.$format(form.endDate)
          form.propertyId = 1
          this.creatCourseList.push(
            JSON.parse(JSON.stringify(form))
          )

        }
      })
    },
    handleDelete (id) {
      this.creatCourseList.splice(id - 1, 1)
    },
    getHeadInfo () {
      getHeadInfo().then(res => {
        this.versions = courseType.versions
        this.campuses = res.data.campuses
        this.coursePeriods = res.data.coursePeriods
        this.grades = res.data.grades
        this.provinces = res.data.provinces
        this.subjects = res.data.subjects
      });
    },
    submitCourse () {
      if (!this.creatCourseList.length) {
        this.$message({
          message: "请先选中添加一行",
          type: "warning"
        })
        return false
      }
      this.creatCourseList.forEach(item => {
        item.propertyId = 1
      })
      var errorInsertCourseArr = []//错误课程的名称数组
      saveCourse(this.creatCourseList).then(res => {
        //如果直接点击添加
        if (res.status == 500) {
          this.$message({
            message: res.message,
            type: "warning"
          })
          return
        }
        res.data.forEach((val, index) => {
          if (val.status == 500) {
            errorInsertCourseArr.push(val.courseName)
          } else {
            this.creatCourseList.splice(index, 1)
            this.creatCourseList.splice(index, 1)
          }
        })
        if (errorInsertCourseArr.length > 0) {
          if (errorInsertCourseArr.length == res.data.length) {
            this.$message({
              message: "课程新增失败，该课程已经存在，请重新添加！",
              type: "warning"
            })
          } else {
            this.$message({
              message: errorInsertCourseArr.join("、") + ",课程新增失败，其余课程新增成功",
              type: "warning"
            })
          }
        } else {
          this.courseDialog = false;
          this.creatCourseList = []
          this.creatCourseList = []
          this.$message({
            message: "课程添加成功",
            type: "success"
          })
        }
      })
    },
    // 选择的年级发生改变
    // changeGrade (val) {
    //   this.form.year = this.$synchroYear(val)
    // }
  }
};
</script>
