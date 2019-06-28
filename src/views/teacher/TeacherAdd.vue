<!--
 * @author tianjiaru
 * @date 2019/1/10
-->
<template>
  <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="teacherAddComputed" title="新增教师" width="650px" center>
    <el-form
      ref="addForm"
      :model="formData"
      :rules="addRules"
      class="demo-ruleForm"
      inline
      label-width="80px"
    >
      <el-form-item label="教师姓名" prop="teacherName">
        <el-input v-model="formData.teacherName" class="inputWidth" clearable maxlength="120"/>
      </el-form-item>
      <el-form-item label="教师类型" prop="teacherType">
        <el-select
          v-model="formData.teacherType"
          class="inputWidth"
          placeholder="请选择教师类型"
          clearable
        >
          <el-option
            v-for="item in addForm.teacherTypes"
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
          clearable
          @change="findRoleById"
        >
          <el-option
            v-for="item in getAllRoleFilter(addForm.roles)"
            :label="item.roleName"
            :key="item.roleId"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="userId">
        <el-select v-model="formData.userId" class="inputWidth" placeholder="选择账号" clearable>
          <el-option
            v-for="item in addForm.users"
            :label="item.userName"
            :key="item.userId"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="授课学科" prop="subjects" class="margin-bottom0">
        <div style="width:504px;">
            <el-checkbox-group v-model="formData.subjects">
              <el-checkbox
                v-for="item in addForm.subjects"
                :label="item.subjectId"
                :key="item.subjectId"
                :value="item.subjectId"
                style="margin-left:0;margin-right:20px;"
              >{{ item.subjectName }}</el-checkbox>
            </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="授课年级" prop="grades" class="margin-bottom0">
        <el-checkbox-group v-model="formData.grades">
          <el-checkbox
            v-for="item in addForm.grades"
            :key="item.gradeId"
            :label="item.gradeId"
            :value="item.gradeId"
          >{{ item.gradeName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="校区" prop="campuses" class="margin-bottom0">
        <el-checkbox-group v-model="formData.campuses">
          <el-checkbox
            v-for="item in addForm.campuses"
            :key="item.campusId"
            :label="item.campusId"
            :value="item.campusId"
          >{{ item.campusName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="备注" class="remark" prop="remark">
        <el-input v-model="formData.remark" rows="4" type="textarea"/>
      </el-form-item>
      <br>
      <el-form-item label="是否有效" prop="isEffective">
        <el-checkbox-group v-model="formData.isEffective">
          <el-checkbox :true-label="0" :false-label="1" label name="type" checked="checked"/>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="teacherAddComputed = false">取 消</el-button>
      <el-button type="primary" @click="addtea('addForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addteacher, getTeacherList } from "@/api/teacher/TeacherMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { getAllRoleTeacherMgt, findRoleById } from "@/api/admin/RoleApi";
import { validatorFactory } from "@/utils/async-validator";
import getAllRoleFilter from "./filterTeacher.js";
export default {
  name: "TeacherAdd",
  props: {
    addTeacherDialogVisible: {
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
    return {
      value5: "",
      total: 1,
      listLoading: false,
      addForm: {
        teacherName: "",
        teacherTypes: [{ teacherTypeName: "" }],
        roles: [],
        users: [],
        subjects: [],
        grades: [],
        campuses: [],
        isEffective: "",
        remark: ""
      },
      formData: {
        teacherName: "", //教师姓名
        teacherType: "", //教师类型
        userId: "", //账号
        roleId: "", //角色
        subjects: [],
        grades: [],
        campuses: [],
        isEffective: "",
        remark: ""
      },
      addRules: {
        teacherName: [
          validatorFactory("请输入教师姓名", "text", null, true),
          validatorFactory("教师姓名超出限制", "text", 20, true)
        ],
        remark: [validatorFactory("备注超出限制", "text", 100, false)],
        teacherType: [
          {
            required: true,
            message: "请选择一种教师类型",
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
        subjects: [
          {
            type: "array",
            required: true,
            message: "请至少选择一门学科",
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
    teacherAddComputed: {
      get: function() {
        return this.addTeacherDialogVisible;
      },
      set: function(val) {
        this.$emit("update:addTeacherDialogVisible", val);
      }
    }
  },
  created(){
    this.headinfo();
    this.getAllRole();
  },
  mounted() {
  },
  methods: {
    // 重置form表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs["addForm"].resetFields();
      });
    },
    resetCreateClassTemp() {
      this.createClassTemp = {
        province: ""
      };
    },
    // 教师添加
    addtea(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          var isEffective = 0;
          if (formData.isEffective) {
            isEffective = 0;
          } else {
            isEffective = 1;
          }
          addteacher(
            Object.assign({}, this.formData, { isEffective: isEffective })
          )
            .then(res => {
              if (res.status == 500) {
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }else if (res.data.status == 200) {
                this.$message({
                  message: "新增成功！",
                  type: "success"
                });
                this.teacherAddComputed = false;
                this.$emit("reloadList");
              } else if (res.data.status == 500) {
                this.$message({
                  message: res.data.failMessage,
                  type: "warning"
                });
              }else{

              }
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    },
    // 添加教师页面渲染
    headinfo() {
      getHeadInfo().then(res => {
        this.addForm.grades = res.data.grades;
        this.addForm.campuses = res.data.campuses;
        this.addForm.subjects = res.data.subjects;
        this.addForm.teacherTypes = res.data.teacherTypes;
      });
    },
    // 所有角色
    getAllRole() {
      getAllRoleTeacherMgt(2).then(res => {
        this.addForm.roles = res.data;
      });
    },
    // 角色对应的用户
    findRoleById(id) {
      var _this = this;
      this.addForm.users = []; //管理员切换时，清空账号
      this.formData.userId = "";
      findRoleById(id).then(res => {
        _this.addForm.users = res.data.filter(item => {
          return item !== null;
        });
      });
    }
  }
};
</script>
<style scoped>
.margin-bottom0 {
  margin-bottom: 0px;
}
.inputWidth {
  width: 163px;
}
.marginLeft {
  margin-left: 80px;
  margin-top: -28px;
}
</style>
<style lang="scss">
.remark {
  .el-textarea__inner {
    width: 350px;
  }
}
</style>
