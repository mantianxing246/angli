<!--
 * @author wufan
 * @date 2019/1/8
-->
<template>
  <div class="app-container">
    <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="classDialog" title="新增班级" width="65%" center>
      <el-form ref="form" :model="form" :rules="rules" inline>
        <div style="margin-left:9px;">
          <el-form-item label="课程名称">{{ form.courseName }}</el-form-item>
        </div>
        <el-form-item label="班级名称" prop="className">
          <el-input
            v-model="form.className"
            maxlength="50"
            :style="{width:$selectConfig.classNameWidth+'px'}"
          />
        </el-form-item>
        <el-form-item label="招生人数" prop="maxNum">
          <el-input v-model="form.maxNum" maxlength="4"/>
        </el-form-item>
        <el-button type="primary" @click="addRowClass(form)">加一行</el-button>
      </el-form>
      <el-table
        v-show="classList.length > 0"
        :data="classList"
        highlight-current-row
        border
        fit
        stripe
        style="width: 100%;"
      >
        <el-table-column
          v-loading="listLoading"
          label="班级名称"
          align="center"
          prop="className"
          min-width="310px"
        />
        <el-table-column label="招生人数" align="center" prop="maxNum" width="100px"/>
        <el-table-column label="操作" align="center" prop="className" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="deleteClass(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="classDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive'
import { addClass } from "@/api/offline/OfflnClassMgtApi";
import OfflnCourseMgtApi from "@/api/offline/OfflnCourseMgtApi";
// import { getCourse } from "@/api/offline/OfflnCourseMgtApi"
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口

export default {
  name: "OfflnClassAdd",
  directives: { waves },
  props: {
    createClassDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listLoading: false,
      form: {
        courseName: "", // 课程名称
        className: "", // 班级名称
        maxNum: null // 招生人数
      },
      classList: [], // 班级列表
      rules: {
        className: [
          { required: true, message: "请填写班级名称", trigger: "blur" }
        ],
        maxNum: [
          { required: true, message: "请填写招生人数", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              if (/^[1-9]*[1-9][0-9]*$/.test(Number(value)) == false) {
                // 正则匹配正整数
                callback(new Error("请输入正确的数字"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    classDialog: {
      get: function () {
        return this.createClassDialogVisible;
      },
      set: function (val) {
        this.$emit("update:createClassDialogVisible", val);
      }
    }
  },
  methods: {
    // 重置表单验证
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    // 获取单个课程信息
    getSingleCourse (courseId) {
      this.courseId = courseId;
      OfflnCourseMgtApi.getSingleCourse(courseId).then(res => {
        this.form.courseName = res.data.courseName;
        this.form.className = res.data.courseName + "-X班";
      });
    },
    // 加入一行班级信息
    addRowClass (form) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var repeat = false;
          form.maxNum = Number(form.maxNum);
          for (var i = 0;i < this.classList.length;i++) {
            if (this.classList[i].className == this.form.className) {
              repeat = true;
            }
          }
          if (repeat) {
            this.$message({
              message: "该班级已加入列表，请勿重复添加",
              type: "warning"
            });
            return false;
          }
          this.classList.push(Object.assign({}, this.form));
        }
      });
    },
    // 删除班级
    deleteClass (index) {
      this.classList.splice(index, 1);
    },
    // 确认新增
    confirm () {
      if (!this.classList.length) {
        this.$message({
          message: "请先加入行！",
          type: "warning"
        });
        return false;
      }
      for (var i = 0;i < this.classList.length;i++) {
        this.classList[i].courseId = this.courseId;
      }
      addClass(this.classList)
        .then(res => {
          // 关闭弹窗

          var repeatRes = [];
          if (res.status === 200) {
            for (var i = 0;i < res.data.length;i++) {
              if (res.data[i].status == 500) {
                // 重复课程
                repeatRes.push(res.data[i].className);
              }
            }
            if (repeatRes.length) {
              repeatRes.join("、");
              this.$message({
                message:
                  repeatRes + "和已有班级重复，新增失败。其余班级新增成功",
                type: "warning"
              });
            } else {
              this.classDialog = false;
              this.classList = []; //添加成功以后清空
              this.$message({
                message: "新增成功",
                type: "success"
              });
            }
          } else {
            this.$message({
              message: "新增失败，稍后重试!",
              type: "warning"
            });
          }
        })
        .catch(err => {
          // console.log(err)
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
