<!--
 * @author wufan
 * @date 2019/2/22
-->
<template>
  <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="teacherEditComputed" title="编辑教师" width="50%" center>
    <el-form
      ref="editForm"
      :model="formData"
      :rules="addRules"
      class="demo-ruleForm"
      inline
      label-width="80px"
    >
      <el-form-item label="教师姓名" prop="teacherName">
        <el-input
          v-model="formData.teacherName"
          class="inputWidth"
          placeholder="教师姓名"
          clearable
          maxlength="120"
        />
      </el-form-item>
      <el-form-item label="教师类型" prop="teacherType">
        <el-select
          v-model="formData.teacherType"
          class="inputWidth"
          placeholder="请选择教师类型"
          clearable
        >
          <el-option
            v-for="item in editForm.teacherTypes"
            :label="item.teacherTypeName"
            :key="item.teacherTypeId"
            :value="item.teacherTypeId"
          />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="关联账号" prop="roleId">
        <el-select
          v-model="formData.roleId"
          placeholder="选择角色"
          class="inputWidth"
          @change="findRoleById"
          clearable
        >
          <el-option
            v-for="item in getAllRoleFilter(editForm.roles)"
            :label="item.roleName"
            :key="item.roleId"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="userId">
        <el-select clearable v-model="formData.userId" placeholder="选择账号">
          <el-option
            v-for="item in editForm.users"
            :label="item.userName"
            :key="item.userId"
            :value="item.userId"
            clearable
            class="inputWidth"
          />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="授课学科" prop="subjects">
        <el-checkbox-group v-model="formData.subjects">
          <el-checkbox
            v-for="item in subjects5(editForm.subjects)"
            :label="item.subjectId"
            :key="item.subjectId"
            :value="item.subjectId"
            style="margin-left:0;margin-right:20px;"
          >{{ item.subjectName }}</el-checkbox>
        </el-checkbox-group>
        <el-form-item style="margin:0;padding:0;">
          <el-checkbox-group v-model="formData.subjects">
            <el-checkbox
              v-for="item in subjectsNo5(editForm.subjects)"
              :label="item.subjectId"
              :key="item.subjectId"
              :value="item.subjectId"
              style="margin-left:0;margin-right:20px;"
            >{{ item.subjectName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <br>
      <el-form-item label="授课年级" prop="grades">
        <el-checkbox-group v-model="formData.grades">
          <el-checkbox
            v-for="item in editForm.grades"
            :key="item.gradeId"
            :label="item.gradeId"
            :value="item.gradeId"
          >{{ item.gradeName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <br>
      <el-form-item label="校区" prop="campuses">
        <el-checkbox-group v-model="formData.campuses">
          <el-checkbox
            v-for="item in editForm.campuses"
            :key="item.campusId"
            :label="item.campusId"
            :value="item.campusId"
          >{{ item.campusName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <br>
      <el-form-item label="备注" class="remark">
        <el-input v-model="formData.remark" rows="4" type="textarea"/>
      </el-form-item>
      <el-row style="margin-bottom:0">
        <el-col>
          <el-form-item label="是否有效" prop="isEffective">
            <!-- <el-checkbox-group v-model="formData.isEffective"> -->
            <el-checkbox
              v-model="formData.isEffective"
              :true-label="1"
              :false-label="0"
              label
              name="type"
              checked="checked"
            />
            <!-- </el-checkbox-group> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="teacherEditComputed = false">取 消</el-button>
      <el-button type="primary" @click="editTeacher('editForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editTeacher, getSingleTeacher } from "@/api/teacher/TeacherMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { getAllRoleTeacherMgt, findRoleById } from "@/api/admin/RoleApi";
import getAllRoleFilter from "./filterTeacher.js";
export default {
  name: "TeacherAdd",
  props: {
    editTeacherDialogVisible: {
      type: Boolean,
      default: false
    },
    getTeacherList: {
      type: Function,
      default: function() {}
    }
  },
  mixins:[getAllRoleFilter],
  data() {
    var teacherName = (rule, value, callback) => {
      let str = value;
      if (!str.replace(/\s+/g, "")) {
        return callback(new Error("请输入教师姓名"));
      } else {
      }
      if (str.replace(/[\u4e00-\u9fa5]/g, "aa").length > 120) {
        return callback(new Error("教师名称超出限制"));
      } else {
      }
      callback();
    };
    var subjects = (rule, value, callback) => {
      if (this.formData.subjects.length === 0) {
        callback(new Error("请至少选择一门学科"));
      } else {
        callback();
      }
    };
    return {
      value5: "",
      total: 1,
      listLoading: false,
      editForm: {
        teacherName: "",
        teacherTypes: [],
        roles: [],
        users: [],
        subjects: [],
        grades: [],
        campuses: [],
        isEffective: "",
        remark: ""
      },
      formData: {
        //编辑数据
        teacherName: "", //教师姓名
        teacherType: "", //教师类型
        userId: "", //账号
        roleId: "", //角色
        subjects: [], //学科
        grades: [], //年级
        campuses: [], //校区
        isEffective: "", //是否有效
        remark: "" //备注
      },
      addRules: {
        teacherName: [{  required: true,validator: teacherName, trigger: "blur" }],
        teacherType: [
          {
            required: true,
            message: "请选择一种教师类型",
            trigger: "change"
          }
        ],
        subjects: [
          {
            type: "array",
            required: true,
            validator: subjects,
            trigger: "change"
          }
        ],
        userId: [
          {
            required: false,
            message: "请选择账号",
            trigger: "change"
          }
        ],
        grades: [
          {
            type: "array",
            required: false,
            message: "请至少选择一个年级",
            trigger: "change"
          }
        ],
        campuses: [
          {
            type: "array",
            required: false,
            message: "请至少选择一个校区",
            trigger: "change"
          }
        ],
        isEffective: [
          {
            required: true,
            message: "请选择有效",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    teacherEditComputed: {
      get: function() {
        return this.editTeacherDialogVisible;
      },
      set: function(val) {
        this.$emit("update:editTeacherDialogVisible", val);
      }
    }
  },
  mounted() {
    this.headinfo();
    this.getAllRole();
  },
  methods: {
    resetForm() {
      this.$nextTick(() => {
        this.$refs["editForm"].resetFields();
      });
    },
    resetCreateClassTemp() {
      this.createClassTemp = {
        province: ""
      };
    },
    subjects5: function(subjects) {
      let obj = { 1: true, 2: true, 3: true, 4: true, 5: true };
      return subjects.filter(function(subjectsItem) {
        return obj[subjectsItem.subjectId];
      });
    },
    subjectsNo5: function(subjects) {
      let obj = { 1: true, 2: true, 3: true, 4: true, 5: true };
      return subjects.filter(function(subjectsItem) {
        return !obj[subjectsItem.subjectId];
      });
    },
    // 教师修改
    editTeacher(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.formData.subjectNameList = [];
          for (let i = 0; i < this.formData.subjects.length; i++) {
            for (let j = 0; j < this.editForm.subjects.length; j++) {
              if (
                this.formData.subjects[i] ===
                this.editForm.subjects[j].subjectId
              ) {
                this.formData.subjectNameList.push(
                  this.editForm.subjects[j].subjectName
                );
              }
            }
          }
          console.log(this.formData);
          editTeacher(Object.assign({}, this.formData)).then(res => {
            if (res.status === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.teacherEditComputed = false;
              this.getTeacherList();
            } else {
              this.$message({
                message: "修改失败",
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 添加教师页面渲染
    headinfo() {
      getHeadInfo().then(res => {
        this.editForm.grades = res.data.grades;
        this.editForm.campuses = res.data.campuses;
        this.editForm.subjects = res.data.subjects;
        this.editForm.teacherTypes = res.data.teacherTypes;
      });
    },
    // 所有角色
    getAllRole() {
      getAllRoleTeacherMgt(2).then(res => {
        this.editForm.roles = res.data;
      });
    },
    // 角色对应的用户
    findRoleById(id) {
      var _this = this;
      this.editForm.users = []; //管理员切换时，清空账号
      this.formData.userId = "";
      if(!id){
          id = "";
      }
      findRoleById(id).then(res => {
        _this.editForm.users = res.data.filter(item => {
          return item !== null;
        });
      });
    },
    // 获取单个老师信息
    getSingleTeacher(teacherId) {
      this.teacherId = teacherId;
      getSingleTeacher(teacherId).then(res => {
        this.formData = res.data;
        if(!res.data.roleId){
            res.data.roleId = "";
        }
        findRoleById(res.data.roleId).then(res => {
          if (!res.data) {
            return;
          }
          this.editForm.users = res.data.filter(item => !!item);
        });
      });
    }
  }
};
</script>
<style scoped>
.inputWidth {
  width: 163px;
}
.marginLeft {
  margin-left: 80px;
  margin-top: -28px;
}
.el-form-item__error {
  margin-left: 80px;
}
</style>
<style lang="scss">
.remark {
  .el-textarea__inner {
    width: 350px;
  }
}
</style>
