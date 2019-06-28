<!--
 * @author tianjiaru
 * @date 2019/1/8
-->
<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <search-head
          :teacher-name.sync="listQuery.teacherName"
          :teacher-type-id.sync="listQuery.teacherTypeId"
          :grade-id.sync="listQuery.gradeId"
          :subject-id.sync="listQuery.subjectId"
          style="display:inline-block"
        />
        <el-checkbox v-model="listQuery.isEffectives">是否有效</el-checkbox>
        <el-button
          v-waves
          icon="el-icon-search"
          type="primary"
          @click="getTeacherList()"
          :loading="loading"
        >搜索</el-button>
        <el-button
          v-waves
          icon="el-icon-edit"
          style="margin-left: 10px;"
          type="primary"
          @click="addTeacher"
        >新增教师</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%;"
      highlight-current-row
      border
      fit
      stripe
    >
      <el-table-column label="教师姓名" align="center" prop="teacherName" width="150"/>
      <el-table-column label="教师类型" align="center" prop="teacherTypeName" width="100"/>
      <el-table-column label="关联账号" align="center" prop="userName" width="150"/>
      <el-table-column label="授课学科" align="center" prop="subjectName"/>
      <el-table-column label="授课年级" align="center" width="80" prop="gradeName"/>
      <el-table-column label="校区" align="center" width="80" prop="campusName"/>
      <!-- <el-table-column label="添加时间" align="center" prop="addTime" width="150px"/> -->
      <el-table-column label="备注" align="center" prop="remark" width="310"/>
      <!-- <el-table-column label="是否有效" align="center" prop="year" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isEffective==1?"✔":"✖" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" prop="year" width="150">
        <template slot-scope="scope">
          <div class="czSort">
            <el-tooltip class="item" effect="light" content="编辑" placement="top">
              <i class="el-icon-edit" size="large" @click="editTeacher(scope.row.teacherId)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="查看课表" placement="top">
              <i class="el-icon-tickets" size="large" @click="viewCourseTimeTable(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <i class="el-icon-delete pointer" @click="deleteTeacher(scope.row.teacherId)"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="getTeacherList"
    />
     </div>
      </template>
    </Card-Container>
    <TeacherAdd
      ref="TeacherAdd"
      :add-teacher-dialog-visible.sync="addTeacherDialogVisible"
      :get-teacher-list="getTeacherList"
      @reloadList="getTeacherList()"
    />
    <TeacherEdit
      ref="TeacherEdit"
      :edit-teacher-dialog-visible.sync="editTeacherDialogVisible"
      :get-teacher-list="getTeacherList"
    />
  </div>
</template>
<script>
import {
  getTeacherList,
  deleteTeacher,
  findTeacherIsCourse
} from "@/api/teacher/TeacherMgtApi";
import waves from "@/components/directive/waves"; // Waves directive
import SearchHead from "@/views/teacher/components/TeaSearchHead";
import TeacherAdd from "@/views/teacher/TeacherAdd";
import TeacherEdit from "@/views/teacher/TeacherEdit";

export default {
  name: "TeacherMgt",
  components: {
    SearchHead,
    TeacherAdd,
    TeacherEdit
  },
  directives: { waves },
  data() {
    return {
      teacherMsg: false,
      teacherEdit: false,
      value5: "",
      total: 1,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        teacherTypeId: null,
        gradeId: null,
        subjectId: null,
        teacherName: "",
        isEffective: 1,
        isEffectives: true
      },
      list: [{ year: "2019" }],
      addTeacherDialogVisible: false,
      editTeacherDialogVisible: false,
      createClassTemp: {
        teacherName: "",
        year: "",
        grade: "",
        campus: "",
        timeType: "",
        subjectType: "",
        subject: "",
        teacher: "",
        className: "",
        maxNum: ""
      },
      createClassRule: {
        teacherType: [
          { required: true, message: "请选择教师类型", trigger: "change" }
        ],
        grade: [{ required: true, message: "请选择年级", trigger: "change" }],
        subject: [
          { required: true, message: "请选择课程名称", trigger: "change" }
        ],
        teacherName: [
          { required: true, message: "请填写教师名称", trigger: "blur" }
        ]
      },
      creatClassList: [],
      titleMap: {
        addTeacher: "新增教师",
        editTeacher: "编辑教师"
      },
      loading: false
    };
  },
  mounted() {
    this.getTeacherList();
  },
  methods: {
    addTeacher() {
      this.addTeacherDialogVisible = true;
      this.$refs.TeacherAdd.resetForm();
    },
    editTeacher(teacherId) {
      this.$refs.TeacherEdit.getSingleTeacher(teacherId);
      this.editTeacherDialogVisible = true;
      this.$refs.TeacherEdit.resetForm();
    },
    getTeacherList() {
      this.listQuery.isEffectives === false
        ? (this.listQuery.isEffective = 0)
        : (this.listQuery.isEffective = 1);
      this.loading = true;
      getTeacherList(this.listQuery)
        .then(response => {
          this.loading = false;
          if (response.status === 200) {
            this.list = response.data.list;
            this.total = response.data.total;
          } else {
            this.$message({
              message: response.message,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteTeacher(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTeacher(id).then(res => {
          if (res.status == 200) {
            this.$tipsMessage("删除成功", "success");
            this.getTeacherList();
          } else if (res.status == 500) {
            this.$message({
              message: res.message,
              type: "warning"
            });
          } else {
            this.$tipsMessage("删除失败", "warning");
          }
        });
      });
    },

    getList() {
      this.list.push({ year: "2019" });
      this.total = 2;
    },
    /*
      handleCreateClass() {
        this.resetCreateClassTemp();
        // this.createClassDialogVisible = true
        this.$nextTick(() => {
          this.$refs["createClassForm"].clearValidate();
        });
      },
      */

    resetCreateClassTemp() {
      this.createClassTemp = {
        province: ""
      };
    },
    addCreateClass() {
      this.$refs["createClassForm"].validate(valid => {
        if (valid) {
          this.creatClassList.push(this.createClassTemp);
        }
      });
    },
    renderEdit(data) {
      this.$refs.TeacherEdit.teachEdit(data);
    },
    lookTable(data) {
      this.$refs.OfflnCourseTable.courTable(data);
    },
    viewCourseTimeTable(row) {
      var teacherId = row.teacherId;
      sessionStorage.teacherName = row.teacherName;
      this.$router.push({
        path: "/TeacherMgt/CourseTimeTableLook/" + teacherId
      });
      console.log(this.$router);
    }
  }
};
</script>
<style scoped>
.pointer {
  cursor: pointer;
}
.search-head {
  margin-bottom: 10px;
}
</style>
