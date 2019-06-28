<template>
<DialogContainer title="新增录播课程" :visible.sync="courseAddDialog" width="1200px" :diglogClass="['rec-live-course']"> 
    <template slot="body">
        <el-scrollbar style="height:500px;">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
        label-position="left"
        class="demo-form"
        inline
      >
        <el-form-item label="省市" prop="provinceId" label-width="80px">
          <el-select v-model="form.provinceId" placeholder="请选择" clearable style="width:90px;">
            <el-option
              v-for="item in listQuery.provinces"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="version" label-width="50px">
          <el-select v-model="form.version" placeholder="请选择" clearable style="width:90px;">
            <el-option v-for="item in versions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subjectId" label-width="80px">
          <el-select v-model="form.subjectId" placeholder="请选择" clearable style="width:90px;">
            <el-option
              v-for="item in listQuery.subjects"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType" label-width="80px">
          <el-select v-model="form.courseType" placeholder="请选择" clearable>
            <el-option
              v-for="item in listQuery.courseTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程作用" prop="courseFunctionId" label-width="80px">
          <el-select v-model="form.courseFunctionId" clearable>
            <el-option
              v-for="item in listQuery.courseFunctions"
              :key="item.courseFunctionId"
              :label="item.courseFunctionName"
              :value="item.courseFunctionId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="gradeIds" label-width="50px" class="dialog-class">
          <el-checkbox-group v-model="form.gradeIds" clearable>
            <el-checkbox
              v-for="item in listQuery.grades"
              :key="item.gradeId"
              :label="item.gradeId"
              :value="item.gradeId"
            >{{ item.gradeName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="授课老师" prop="teacherId" label-width="80px">
          <el-select v-model="form.teacherId" disabled placeholder="请前往原系统修改">
            <el-option
              v-for="item in listQuery.teachers"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程描述" prop="courseDescribe" label-width="80px">
          <quill-editor
            ref="myQuillEditor"
            v-model="form.courseDescribe"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
        </el-form-item>
        <el-form-item label="课程价格" prop="totalPrice" label-width="100px">
              <AmountInput money="￥" placeholder="" style="width:100px;" :amount.sync="form.totalPrice"></AmountInput>
        </el-form-item>
        <el-form-item label="排序" prop="orderByNum" label-width="50px">
          <el-input v-model="form.orderByNum" maxlength="3" style="width:100px;" clearable/>
        </el-form-item>
        <el-form-item label="课程图预览地址" prop="picUrl">
          <el-input v-model="form.picUrl" clearable style="width:500px;"/>
        </el-form-item>
        <el-form-item label="课程开始日期" prop="beginDate" label-width="110px">
          <el-date-picker
            v-model="form.beginDate"
            type="date"
            placeholder="选择日期"
            style="width:140px"
          />
        </el-form-item>
        <el-form-item label="课程结束日期" prop="endDate" label-width="110px">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择日期"
            style="width:140px"
          />
        </el-form-item>
        <el-form-item label="课耗结束日期" prop="accrulEndDate" label-width="110px">
          <el-date-picker
            v-model="form.accrulEndDate"
            type="date"
            placeholder="选择日期"
            style="width:140px"
          />
        </el-form-item>
        <br>
        <el-form-item label="是否前台显示" label-position="right" label-width="110px">
          <el-checkbox v-model="form.isIndication" style="width:20px;"/>
        </el-form-item>
        <el-form-item label="是否显示课程设置">
          <el-checkbox v-model="form.isShow"/>
        </el-form-item>
        <br>
        <el-form-item label="是否发布" label-width="80px" prop="isPublish">
          <el-checkbox v-model="form.isPublish"/>
        </el-form-item>
      </el-form>
    </el-scrollbar>
     <el-row>
      <el-col style="text-align:center;margin:20px 0;">
        <el-button @click="courseAddDialog = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="confirmAdd('form')">确 定</el-button>
      </el-col>
    </el-row>
    </template>
  </DialogContainer>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import { addSingleCourse } from "@/api/record/RecCourseMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import courseType from "@/CourseType/CourseType.js";
export default {
  name: "RecCourseAdd",
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
    var validateTeacher = (rule, value, callback) => {
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
        provinceId: null, // 选中的省市
        version: "", // 选中的版本
        courseFunctionId: null, // 选中的课程作用
        courseType: "", // 选中的课程类型
        gradeIds: [], // 选中的年级
        subjectId: null, // 选中的学科
        teacherId: null, // 选中的授课教师
        courseDescribe: "", // 课程描述
        totalPrice: "", // 课程价格
        orderByNum: "", // 排序
        picUrl: "", // 课程预览图地址
        beginDate: "", // 课程开始时间
        endDate: "", // 课程结束时间
        accrulEndDate: "", // 权责结束时间
        isIndication: false, // 是否前台显示
        isShow: false, // 是否显示课程设置
        isPublish: true, // 是否发布
        propertyId: 2, //propertyId固定传2 录播课属性
        addBy: JSON.parse(localStorage.states).user.name //添加人
      },
      listQuery: {},
      editorOption: {
        // 富文本编辑器设置
        placeholder: "请输入课程描述..."
      },
      rules: {
        provinceId: [
          { required: true, message: "请选择省市", trigger: "change" }
        ],
        version: [{ required: true, message: "请选择版本", trigger: "change" }],
        courseFunctionId: [
          { required: true, message: "请选择课程作用", trigger: "change" }
        ],
        courseType: [
          { required: true, message: "请选择课程类型", trigger: "change" }
        ],
        gradeIds: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
        subjectId: [
          { required: true, message: "请选择学科", trigger: "change" }
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
            message: "请选择课程结束日期",
            trigger: "change"
          }
        ],
        accrulEndDate: [
          {
            type: "date",
            required: true,
            message: "请选择课耗结束日期",
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
        orderByNum: [
          { required: true, message: "请输入排序", trigger: "blur" },
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        picUrl: [
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
            message: "请检查下地址是否正确",
            trigger: "blur"
          }
        ],
        isPublish: [
          { validator: validateIsPublish, trigger: "change" }
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
    },
    // 计算属性的 getter
    courseName: function () {
      // `this` 指向 vm 实例
          var arr = [];
          arr.push(this.form.version);
          this.listQuery.grades.forEach(item => {
            if (item.gradeId == this.form.gradeIds && this.form.gradeIds.length === 1 ) {
              arr.push(item.gradeName);
            }
          });
          this.listQuery.subjects.forEach(item => {
            if (item.subjectId == this.form.subjectId) {
              arr.push(item.subjectName);
            }
          });
          arr.push(this.form.courseType);
      return  arr.join('-')
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
          // console.log(res.data)
          res.data.teachers = [];
          res.data.courseTypes = courseType.recCourseType; // 课程类型
          this.listQuery = res.data;
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
          this.form.courseName = this.courseName
          // 定义一个新的表单对象
          let newForm = JSON.stringify(this.form);
          newForm = JSON.parse(newForm);

          // console.log(this.format(new Date(this.form.beginDate)))
          newForm.beginDate = this.$format(this.form.beginDate);
          newForm.endDate = this.$format(this.form.endDate);
          newForm.accrulEndDate = this.$format(this.form.accrulEndDate);
          if (this.form.isIndication) {
            newForm.isIndication = 1;
          } else {
            newForm.isIndication = 0;
          }
          // 1为显示课程设置，0为不显示课程设置
          if (this.form.isShow) {
            newForm.isShow = 1;
          } else {
            newForm.isShow = 0;
          }
          // 1为发布，0为不发布
          if (this.form.isPublish) {
            newForm.isPublish = 1;
          } else {
            newForm.isPublish = 0;
          }
          addSingleCourse(newForm)
            .then(res => {
              this.subLoading = false;
              if (res.data.status == 200) {
                this.$message({
                  message: "新增成功",
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
              this.subLoading = false;
              // console.log(error)
            });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>
