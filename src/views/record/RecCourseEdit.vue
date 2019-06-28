<template>
  <el-dialog :close-on-click-modal="false" 
    v-el-drag-dialog
    :visible.sync="courseEditDialog"
    title="编辑录播课程"
    width="75%"
    class="rec-live-course margin"
    center
  >
    <el-scrollbar style="height:500px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
        label-position="left"
        class="demo-form"
      >
        <el-form-item label="年级" prop="gradeIds" label-width="80px">
          <el-checkbox-group v-model="form.gradeIds">
            <el-checkbox
              v-for="item in listQuery.grades"
              :key="item.gradeId"
              :label="item.gradeId"
              :value="item.gradeId"
            >{{ item.gradeName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName" label-width="80px">
          <el-input v-model="form.courseName" clearable/>
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
        <el-form-item label="课程描述" label-width="80px">
          <quill-editor
            ref="myQuillEditor"
            v-model="form.courseDescribe"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="课程价格" prop="totalPrice" label-width="80px">
              <AmountInput money="￥" placeholder="" style="width:100px;" :amount.sync="form.totalPrice"></AmountInput>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序" prop="orderByNum" label-width="50px">
              <el-input v-model="form.orderByNum" clearable maxlength="3"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程图预览地址" prop="picUrl">
              <el-input v-model="form.picUrl" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="课程开始日期" prop="beginDate" label-width="110px">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                placeholder="选择日期"
                style="width:100%;min-width:128px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程结束日期" prop="endDate" label-width="110px">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="选择日期"
                style="width:100%;min-width:128px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课耗结束日期" prop="accrulEndDate" label-width="110px">
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
          <el-col :span="4">
            <el-form-item label="是否前台显示" class="label-width-100">
              <el-checkbox v-model="form.isIndication"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否显示课程设置">
              <el-checkbox v-model="form.isShow"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="是否发布" class="label-width-80">
              <el-checkbox v-model="form.isPublish"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <el-button @click="courseEditDialog = false">取 消</el-button>
      <el-button type="primary" :loading="subLoading" @click="confirmEdit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import {
  getSingleCourse,
  updateSingleCourse
} from "@/api/record/RecCourseMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi";

export default {
  name: "RecCourseEdit",
  props: {
    updateClassDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateTeacher = (rule, value, callback) => {
      callback();
    };
    var checkCourseName = (rule, value, callback) => {
        let str = value;
        if (!str.replace(/\s+/g, "")) {
          return callback(new Error("请输入课程名称"));
        } else {
        }
        callback();
    };
    return {
      subLoading: false, //确认修改
      form: {
        courseName: "", // 课程名称
        teacherId: null, // 选中的授课教师
        courseDescribe: "", // 课程描述
        totalPrice: "", // 课程价格
        orderByNum: "", // 排序
        picUrl: "", // 课程预览图地址
        beginDate: "", // 课程开始时间
        endDate: "", // 课程结束时间
        accrulEndDate: "", // 权责结束时间d
        isIndication: false, // 是否前台显示
        isShow: false, // 是否显示课程设置
        isPublish: false, // 是否发布
        addBy: JSON.parse(localStorage.states).user.name //添加人
      },
      listQuery: {},
      editorOption: {
        // 富文本编辑器设置
        placeholder: "请输入课程描述..."
      },
      rules: {
        gradeIds: [
          { required: true, message: "请选择年级", trigger: "change" }
        ],
        courseName: [
          { required: true, validator: checkCourseName, trigger: "blur" },
          { min: 0, max: 30, message: "长度在30个字符之内", trigger: "blur" }
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
          } // 正则匹配正数
        ],
        picUrl: [
          {
            pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
            message: "请检查下地址是否正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    // 弹窗显示与否
    courseEditDialog: {
      get: function() {
        // console.log(this.updateClassDialogVisible)
        return this.updateClassDialogVisible;
      },
      set: function(val) {
        this.$emit("update:updateClassDialogVisible", val);
      }
    }
  },
  methods: {
    // 重置form表单
    resetForm() {
      this.$nextTick(() => {
        // console.log('form--->>',this.$refs['form'])
        this.$refs["form"].resetFields();
      });
    },
    // 失去焦点事件
    onEditorBlur() {},
    // 获得焦点事件
    onEditorFocus() {},
    // 课程描述发生变化
    onEditorChange() {},
    // 获取年级，省市
    getQueryList() {
      this.form = {};
      getHeadInfo()
        .then(res => {
          // console.log(res.data)
          if (res.status == 200) {
            res.data.teachers = [];
            this.listQuery = res.data;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取单个课程信息
    getSingleCourse(courseId) {
      this.courseId = courseId;
      getSingleCourse(courseId)
        .then(res => {
          if (res.status == 200) {
            if (res.data.status == 200) {
            // 1为前台不显示，0为前台显示
            if (res.data.isIndication === 1) {
              res.data.isIndication = true;
            } else {
              res.data.isIndication = false;
            }
            // 1为不显示课程设置，0为显示课程设置
            if (res.data.isShow === 1) {
              res.data.isShow = true;
            } else {
              res.data.isShow = false;
            }
            // 1为发布，0为不发布
            if (res.data.isPublish === 1) {
              res.data.isPublish = true;
            } else {
              res.data.isPublish = false;
            }
            if (res.data.beginDate) {
              res.data.beginDate = new Date(res.data.beginDate);
            }
            if (res.data.endDate) {
              res.data.endDate = new Date(res.data.endDate);
            }
            if (res.data.accrulEndDate) {
              res.data.accrulEndDate = new Date(res.data.accrulEndDate);
            }
            this.form = res.data;
            // console.log(this.form.provinceId)
            }else{
              this.$message({
                  message: res.data.failMessage,
                  type: "warning"
                });
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 确认编辑课程
    confirmEdit(form) {
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
          // 定义一个新的表单对象
          let newForm = JSON.stringify(this.form);
          newForm = JSON.parse(newForm);

          newForm.beginDate = this.$format(this.form.beginDate);
          newForm.endDate = this.$format(this.form.endDate);
          newForm.accrulEndDate = this.$format(this.form.accrulEndDate);
          //
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
          // 当前确认需要修改的录播课程Id
          newForm.courseId = this.courseId;
          updateSingleCourse(newForm)
            .then(res => {
              this.subLoading = false;
              if (res.data.status == 200) {
                this.$message({
                  message: "编辑成功！",
                  type: "success"
                });
                this.courseEditDialog = false;
                this.$emit("reloadList");
              } else {
                this.$message({
                  message: res.data.failMessage,
                  type: "warning"
                });
              }
            })
            .catch(error => {
              // console.log(error)
            });
        } else {
          // console.log('error submit!!')
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>
