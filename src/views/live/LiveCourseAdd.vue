<template>
  <el-dialog
    :close-on-click-modal="false"
    v-el-drag-dialog
    :visible.sync="courseAddDialog"
    title="新增直播课程"
    width="75%"
    style="min-width:1000px"
    class="rec-live-course"
    center
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="left"
      class="demo-form"
    >
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="省市" prop="provinceId" label-width="80px">
            <el-select v-model="form.provinceId" placeholder="请选择" clearable class="selectWidth">
              <el-option
                v-for="item in listQuery.provinces"
                :key="item.provinceId"
                :label="item.provinceName"
                :value="item.provinceId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="版本" prop="version" label-width="50px">
            <el-select v-model="form.version" clearable class="selectWidth">
              <el-option
                v-for="item in versions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="学科" prop="subjectId" label-width="50px">
            <el-select v-model="form.subjectId" clearable placeholder="请选择" class="selectWidth">
              <el-option
                v-for="item in listQuery.subjects"
                :key="item.subjectId"
                :label="item.subjectName"
                :value="item.subjectId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="课程类型" prop="courseType" label-width="80px">
            <el-select v-model="form.courseType" clearable placeholder="请选择" class="selectWidth">
              <el-option
                v-for="item in listQuery.courseTypes"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="阶段" prop="coursePeriodId" label-width="50px">
            <el-select v-model="form.coursePeriodId" clearable class="selectWidth">
              <el-option
                v-for="item in listQuery.coursePeriods"
                :key="item.coursePeriodId"
                :label="item.coursePeriodName"
                :value="item.coursePeriodId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="班型" prop="classType" label-width="50px">
            <el-select v-model="form.classType" clearable placeholder="请选择" class="selectWidth">
              <el-option
                v-for="item in listQuery.classTypes"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14" style="min-width:532px">
          <el-form-item label="年级" prop="gradeIds" label-width="50px">
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
        <el-col :span="6">
          <el-form-item label="课程价格" prop="totalPrice" label-width="80px">
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
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="选择日期"
              style="width:100%;min-width:128px"
            />
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
          <el-form-item label="直播老师" prop="teacherId" label-width="110px">
            <el-select
              v-model="form.teacherId"
              disabled
              placeholder="请前往原系统修改"
              style="min-width:140px"
            >
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
          <el-form-item label="助教老师" prop="teacherId" label-width="110px">
            <el-select
              v-model="form.teacherId"
              disabled
              placeholder="请前往原系统修改"
              style="min-width:140px"
            >
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
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="是否发布" class="label-width-80" prop="isPublish">
            <el-checkbox v-model="form.isPublish"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="courseAddDialog = false">取 消</el-button>
      <el-button type="primary" :loading="subLoading" @click="confirmAdd('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import { addSingleCourse } from "@/api/live/LiveCourseMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import courseType from "@/CourseType/CourseType.js";
import classType from "@/CourseType/ClassType.js";
export default {
  name: "LiveCourseAdd",
  props: {
    createClassDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  created(){
    this.versions = courseType.versions;
  },
  data () {
    var validateVersion = (rule, value, callback) => {
      callback();
    };
    var validateEffect = (rule, value, callback) => {
      callback();
    };
    var validateTeacher = (rule, value, callback) => {
      callback();
    };
    var validateDutyDate = (rule, value, callback) => {
      callback();
    };
    var validateIsPublish = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择发布！"));
      }
      callback();
    };
    return {
      versions:[],
      subLoading: false,
      form: {
        provinceId: "", // 选中的省市
        gradeIds: [], // 选中的年级
        year: "", // 选中的高考年份
        subjectId: "", // 选中的学科
        courseType: "", // 选中的课程类型
        classType: "培优", // 选中的班型
        version: "", // 选中的版本
        coursePeriodId: "", //选中的阶段
        totalPrice: "", // 课程价格
        beginDate: "", // 课程开始时间
        endDate: "", // 课程结束时间
        accrulEndDate: "", // 课耗结束时间
        teacherId: "", // 选中的授课教师
        // teacherImgUrl: '', // 教师头像
        // helpTeacherImgUrl: '', // 助教头像
        isPublish: true // 是否发布
      },
      listQuery: {}, //下拉框数据
      editorOption: {},
      rules: {
        provinceId: [
          { required: true, message: "请选择省市", trigger: "change" }
        ],
        gradeIds: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
        year: [{ required: true, message: "请选择", trigger: "change" }],
        subjectId: [
          { required: true, message: "请选择学科", trigger: "change" }
        ],
        courseType: [
          { required: true, message: "请选择课程类型", trigger: "change" }
        ],
        classType: [
          { required: true, message: "请选择班型", trigger: "change" }
        ],
        version: [{ required: true, message: "请选择版本", trigger: "change" }],
        coursePeriodId: [
          { required: true, message: "请选择阶段", trigger: "change" }
        ],
        teacherId: [
          { required: true, validator: validateTeacher, trigger: "change" }
        ],
        beginDate: [
          {
            type: "date",
            required: true,
            message: "请选择课程开始日期",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "请选择课程结束时间",
            trigger: "change"
          }
        ],
        accrulEndDate: [
          {
            type: "date",
            required: true,
            message: "请选择课耗结束时间",
            trigger: "change"
          }
        ],
        totalPrice: [
          { required: true, message: "请填写课程价格", trigger: "blur" },
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入数字",
            trigger: "blur"
          },
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: "请保留两位小数",
            trigger: "blur"
          }
        ],
        picUrl: [
          { required: true, message: "请输入课程图预览地址", trigger: "blur" },
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
            message: "请检查下地址网址是否正确",
            trigger: "blur"
          }
        ],
        isPublish: [
          { required: true, validator: validateIsPublish, trigger: "change" }
        ]
      }
    };
  },
  computed: {
    // 弹窗显示与否
    courseAddDialog: {
      get: function () {
        return this.createClassDialogVisible;
      },
      set: function (val) {
        this.$emit("update:createClassDialogVisible", val);
      }
    }
  },
  methods: {
    // 重置form表单
    resetForm () {
      this.$nextTick(() => {
        // console.log('form--->>',this.$refs['form'])
        this.$refs["form"].resetFields();
      });
    },
    // 图片上传之前
    beforeTeacherImgUpload (file, type) {
      console.log();
      const url = "";
      this.form.teacherImgUrl = URL.createObjectURL(file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    beforeHelpTeacherImgUpload (file, type) {
      const url = "";
      this.form.helpTeacherImgUrl = URL.createObjectURL(file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 失去焦点事件
    onEditorBlur () { },
    // 获得焦点事件
    onEditorFocus () { },
    // 课程描述发生变化
    onEditorChange () { },
    // 获取年级，省市
    getQueryList () {
      getHeadInfo()
        .then(res => {
          console.log(res.data);
          if (res.status == 200) {
            res.data.teachers = [];
            res.data.courseTypes = courseType.liveCourseType; // 课程类型
            res.data.classTypes = classType.resClassType; // 课程类型
            this.listQuery = res.data;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(error => {
          // console.log(error)
        });
    },
    // 确认新增课程
    confirmAdd (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (
            this.$format(this.form.endDate) < this.$format(this.form.beginDate)
          ) {
            this.$message({
              message: "课程结束日期一定要大于课程开始日期哦",
              type: "warning"
            });
            return;
          }
          if (
            this.$format(this.form.beginDate) >
            this.$format(this.form.accrulEndDate)
          ) {
            this.$message({
              message: "课耗结束日期一定要大于课程开始日期哦",
              type: "warning"
            });
            return;
          }
          this.subLoading = true;
          var arr = [];
          arr.push(this.form.version); // 版本
          let gradeName = [];
          this.listQuery.grades.forEach(item => {
            this.form.gradeIds.forEach(gradeIdsItem => {
              if (item.gradeId == gradeIdsItem) {
                gradeName.push(item.gradeName); // 年级
              }
            });
          });
          arr.push(gradeName.join('')); // 年级
          this.listQuery.subjects.forEach(item => {
            if (item.subjectId == this.form.subjectId) {
              arr.push(item.subjectName); // 学科
            }
          });
          arr.push(this.form.courseType); // 课程类型
          this.listQuery.coursePeriods.forEach(item => {
            if (item.coursePeriodId == this.form.coursePeriodId) {
              arr.push(item.coursePeriodName); // 阶段
            }
          });
          arr.push(this.form.classType); // 班型
          this.form.courseName = "";
          if (arr.length) {
            this.form.courseName = arr.join("-"); //“版本-年级-学科-课程类型-阶段-班型”
          }
          // 定义一个新的表单对象
          let newForm = JSON.stringify(this.form);
          newForm = JSON.parse(newForm);

          newForm.beginDate = this.$format(this.form.beginDate);
          newForm.endDate = this.$format(this.form.endDate);
          newForm.accrulEndDate = this.$format(this.form.accrulEndDate);
          // 1为发布，0未发布
          if (this.form.isPublish) {
            newForm.isPublish = 1;
          } else {
            newForm.isPublish = 0;
          }
          // 传属性值固定为3 表示这是直播新增
          newForm.propertyId = 3;
          addSingleCourse(newForm)
            .then(res => {
              this.subLoading = false;
              if (res.data.status == 200) {
                this.$message({
                  message: "新增成功！",
                  type: "success"
                });
                this.courseAddDialog = false;
                this.$emit("reloadList");
              } else if (res.data.status == 500) {
                this.$message({
                  message: res.data.failMessage,
                  type: "warning"
                });
              }
            })
            .catch(error => {
              console.error(error);
              this.subLoading = false;
             });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.selectWidth {
  max-width: 163px;
  min-width: 126px;
}
</style>
