
<template>
  <div class="IndivCourseAdd">
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="createCourseDialogVisibleComputed"
      title="新增在线个性化课程"
      width="70%"
      style="min-width:1000px"
      center
    >
      <el-form
        ref="createCourseForm"
        :model="createCourseTemp"
        :rules="createCourseRule"
        label-position="left"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省市" prop="provincesName">
              <el-select
                v-model="createCourseTemp.provincesName"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in provinces"
                  :key="item.provinceId"
                  :label="item.provinceName"
                  :value="item.provinceName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年级" prop="gradeseName">
              <el-select
                v-model="createCourseTemp.gradeseName"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in grades"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本" prop="version">
              <el-select
                v-model="createCourseTemp.version"
                class="filter-item width200"
                placeholder="版本"
                clearable
              >
                <el-option v-for="item in versions" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="学科" prop="subjectseName">
              <el-select
                v-model="createCourseTemp.subjectseName"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in subjects"
                  :key="item.subjectId"
                  :label="item.subjectName"
                  :value="item.subjectName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程类型" prop="courseTypeseName">
              <el-select
                v-model="createCourseTemp.courseTypeseName"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option v-for="item in courseTypes" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程码" prop="courseCode">
              <el-select
                v-model="createCourseTemp.courseCode"
                class="filter-item width200"
                placeholder="请选择"
                clearable
              >
                <el-option v-for="item in courseCodes" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="开始日期" prop="beginDate" required>
              <el-date-picker
                v-model="createCourseTemp.beginDate"
                type="date"
                placeholder="选择日期"
                class="width200"
                clearable
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期" prop="endDate" required>
              <el-date-picker
                v-model="createCourseTemp.endDate"
                type="date"
                placeholder="选择日期"
                class="width200"
                clearable
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课时数" prop="hours">
              <el-input v-model="createCourseTemp.hours" maxlength="3" class="width200" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="课时单价" prop="unitPrice" label-width="80px">
                <AmountInput money="￥" placeholder="" class="width200" :amount.sync="createCourseTemp.unitPrice"></AmountInput>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="isPublish" required>
              <el-checkbox
                v-model="createCourseTemp.isPublish"
                :true-label="1"
                :false-label="0"
              >是否发布</el-checkbox>
              <!-- <el-button
                type="primary"
                style="float:right;margin-bottom:20px"
                @click="addCreateClass(createCourseTemp)"
              >加一行</el-button>-->
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="isPublish">
              <el-button
                type="primary"
                style="float:right;margin-bottom:20px"
                @click="addCreateClass(createCourseTemp)"
              >加一行</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
        <el-table-column label="版本" align="center" prop="version" width="80px"/>
        <el-table-column label="年级" align="center" prop="gradeseName" width="80px"/>
        <el-table-column label="课程类型" align="center" prop="courseTypeseName" width="100px"/>
        <el-table-column label="学科" align="center" prop="subjectseName" width="80px"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310px"/>
        <el-table-column label="开始日期" align="center" prop="beginDate" width="100px"/>
        <el-table-column label="结束日期" align="center" prop="endDate" width="100px"/>
        <el-table-column label="课时数" align="center" prop="hours" width="80px"/>
        <el-table-column label="课次单价" align="center" prop="unitPrice" width="100px"/>
        <el-table-column label="课程价格" align="center" prop="totalPrice" width="100px"/>
        <el-table-column label="操作" align="center" prop="year" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createCourseDialogVisibleComputed = false">取 消</el-button>
        <el-button :loading="sunLoading" type="primary" @click="submitCourse()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { insertIndivCourse } from "@/api/individual/IndivCourseMgt";
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
import courseType from "@/CourseType/CourseType.js";
export default {
  name: "IndivCourseAdd",
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
      versions: [], // 版本列表
      courseTypes: courseType.individualCourseType,
      individualCourseType: courseType.individualCourseType,
      grades: [
        // 年级列表
        {
          gradeId: "",
          gradeName: ""
        }
      ],
      provinces: [
        // 省市列表
        {
          provinceId: "",
          provinceName: ""
        }
      ],
      subjects: [
        // 科目列表
        {
          subjectId: "",
          subjectName: ""
        }
      ],
      createCourseTemp: {
        provincesName: "上海", // 省
        isPublish: 1, // 是否发布
        version: "", // 版本
        gradeseName: "", // 年级
        courseCode: "", // 课程码
        courseTypeseName: "", // 课程类型
        subjectseName: "", // 学科
        courseName: "", // 课程名
        beginDate: "", // 开始日期
        endDate: "", // 结束日期
        hours: "", // 课时数
        unitPrice: "", // 课时单价
        totalPrice: "" // 总价
      },
      courseCodes: ["a", "b", "c", "d", "e", "f", "g"], // 课程码列表
      createCourseRule: {
        provincesName: [
          { required: true, message: "请选择省市", trigger: "change" }
        ],
        gradeseName: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
        courseTypeseName: [
          { required: true, message: "请选择课程类型", trigger: "change" }
        ],
        courseCode: [
          { required: true, message: "请选择课程码", trigger: "change" }
        ],
        subjectseName: [
          { required: true, message: "请选择学科", trigger: "change" }
        ],
        courseName: [
          { required: true, message: "请选择课程名称", trigger: "change" }
        ],
        version: [
          { required: true, message: "请选择版本", trigger: "change" }
        ],
        hours: [
          { required: true, message: "请填写课时数", trigger: "blur" },
          { pattern: /^\d+$/, message: "必须是数字", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "请填写课时单价", trigger: "blur" },
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
        ]
      }
    };
  },
  computed: {
    createCourseDialogVisibleComputed: {
      get: function () {
        return this.createCourseDialogVisible;
      },
      set: function (val) {
        this.$refs.createCourseForm.resetFields();
        this.$emit("update:createCourseDialogVisible", val);
        if (val == false) {
          this.creatCourseList = [];
        }
      }
    }
  },
  created () {
    this.addCourse();
    this.courseTypes = this.individualCourseType
  },
  methods: {
    addCreateClass (createCourseTemp) {
      var _this = this;
      this.$refs["createCourseForm"].validate(valid => {
        if (valid) {
          var bdate = new Date(this.createCourseTemp.beginDate);
          var edate = new Date(this.createCourseTemp.endDate);
          this.createCourseTemp.beginDate = this.$format(bdate);
          this.createCourseTemp.endDate = this.$format(edate);
          this.createCourseTemp.propertyId = 4; // 个性化课程新增的课程属性为4
          if (this.$format(edate) < this.$format(bdate)) {
            this.$message({
              message: "课程结束日期不能小于课程开始日期哦",
              type: "warning"
            });
            return;
          }
          // 结束时间大于开始时间
          if (bdate.getTime() > edate.getTime()) {
            this.$tipsMessage("试听超过7天", "warning");
            return;
          }
          // 年级id
          this.grades.forEach((val, index) => {
            if (val.gradeName == this.createCourseTemp.gradeseName) {
              this.createCourseTemp.gradeId = val.gradeId;
            }
          });

          // 课程类型
          this.createCourseTemp.courseType = this.createCourseTemp.courseTypeseName;
          // 学科
          this.subjects.forEach((val, index) => {
            if (val.subjectName == _this.createCourseTemp.subjectseName) {
              _this.createCourseTemp.subjectId = val.subjectId;
            }
          });
          // 省市
          this.provinces.forEach((val, index) => {
            if (val.provinceName == _this.createCourseTemp.provincesName) {
              _this.createCourseTemp.provinceId = val.provinceId;
            }
          });
          // 总价
          createCourseTemp.totalPrice =
            createCourseTemp.hours * createCourseTemp.unitPrice;
          // 课程名称 =版本-年级-学科-课程类型-课程码
          createCourseTemp.courseName =
            createCourseTemp.version +
            "-" +
            createCourseTemp.gradeseName +
            "-" +
            createCourseTemp.subjectseName +
            "-" +
            createCourseTemp.courseTypeseName +
            "-" +
            createCourseTemp.courseCode;
          var isReplace = false;
          if (_this.creatCourseList.length > 0) {
            for (var i = 0;i < _this.creatCourseList.length;i++) {
              if (
                _this.creatCourseList[i].provinceId ==
                createCourseTemp.provinceId &&
                _this.creatCourseList[i].version == createCourseTemp.version &&
                _this.creatCourseList[i].gradeId == createCourseTemp.gradeId &&
                _this.creatCourseList[i].subjectId ==
                createCourseTemp.subjectId &&
                _this.creatCourseList[i].courseTypeseName ==
                createCourseTemp.courseTypeseName &&
                _this.creatCourseList[i].courseCode ==
                createCourseTemp.courseCode
              ) {
                this.$message({
                  message: "存在重复数据，添加失败",
                  type: "warning"
                });
                isReplace = true;
              }
            }
            if (!isReplace) {
              this.creatCourseList.push(
                JSON.parse(JSON.stringify(createCourseTemp))
              );
            }
          } else {
            this.creatCourseList.push(
              JSON.parse(JSON.stringify(createCourseTemp))
            );
          }
        }
      });
    },
    handleDelete (index) {
      this.creatCourseList.splice(index, 1);
    },
    addCourse () {
      // 获取基础下拉框列表
      getHeadInfo().then(res => {
        this.versions = courseType.versions;
        this.grades = res.data.grades;
        this.provinces = res.data.provinces;
        this.subjects = res.data.subjects;
      });
    },
    submitCourse () {
      this.$refs["createCourseForm"].validate(pass => {
        if (pass && this.creatCourseList.length > 0) {
          this.sunLoading = true;
          this.creatCourseIdList = JSON.parse(
            JSON.stringify(this.creatCourseList)
          );
          this.creatCourseIdList.propertyId = 1;
          var errorInsertCourseArr = []; // 错误课程的名称数组
          insertIndivCourse(this.creatCourseIdList).then(res => {
            this.sunLoading = false;
            if (res.status == 200) {
              // 新增成功
              this.createCourseDialogVisibleComputed = false;
              this.creatCourseIdList = [];
              this.creatCourseList = [];
              this.$message({
                message: res.message,
                type: "success"
              });
              this.$parent.findIndivCourseList();
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        } else if (pass && this.creatCourseList.length == 0) {
          this.$alert("请至少添加一行课程！", {
            confirmButtonText: "确定"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.el-row {
  margin-bottom: 0;
}
.width200 {
  width: 180px;
}
</style>

