<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item style="margin-right:0;">
        <search-condition
          :version.sync="listQuery.version"
          :grade-id.sync="listQuery.gradeId"
          :course-period-id.sync="listQuery.coursePeriodId"
          :course-type.sync="listQuery.courseType"
          :subject-id.sync="listQuery.subjectId"
          :campus-id.sync="listQuery.campusId"
        />
      </el-form-item>
      <el-form-item style="margin-right:0;">
        <el-input
          v-model="listQuery.className"
          :style="{width:$selectConfig.classNameWidth+'px'}"
          clearable
          placeholder="班级名称"
          :maxlength="50"
        />
      </el-form-item>
      <el-form-item style="margin-right:0;">
        <el-input
          v-model="listQuery.courseName"
          :style="{width:$selectConfig.classNameWidth+'px'}"
          clearable
          placeholder="课程名称"
          :maxlength="50"
        />
      </el-form-item>
      <el-form-item>
        <el-button
        v-waves
        :loading="listLoading"
        icon="el-icon-search"
        type="primary"
        @click="getClassList"
      >查询</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            v-loading="listLoading"
            :data="list"
            highlight-current-row
            border
            fit
            center
            stripe
          >
            <el-table-column label="校区" align="center" prop="campusName" width="80"/>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
            <el-table-column label="班级名称" align="center" prop="className" min-width="310"/>
            <el-table-column label="上课次数" align="center" prop="times" width="70"/>
            <el-table-column label="招生人数" align="center" prop="maxNum" width="70"/>
            <el-table-column label="班级人数" align="center" prop="actualNum" width="70"/>
            <el-table-column label="操作" align="center" prop="classId" min-width="150">
              <template slot-scope="scope">
                <div class="czSort">
                  <el-tooltip effect="light" content="编辑班级信息" placement="top">
                    <i class="el-icon-edit" @click="editClass(scope.row.classId)"/>
                  </el-tooltip>
                  <el-tooltip effect="light" content="班级排课" placement="top">
                    <i class="el-icon-date" @click="scheduleClass(scope.row)"/>
                  </el-tooltip>
                  <el-tooltip effect="light" content="学员分班" placement="top">
                    <i class="el-icon-c-scale-to-original" @click="studentPlacement(scope.row)"/>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除班级" placement="top">
                    <i class="el-icon-delete" @click="deleteClass(scope.row.classId)"/>
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
            @pagination="getClassList"
          />
        </div>
      </template>
    </Card-Container>
    <!-- 班级排课 -->
    <OfflnSchedule
      :schedule-class-dialog-visible.sync="scheduleClassDialogVisible"
      :show-message="showMessage"
    />
    <!-- 编辑班级 -->
    <OfflnClassEdit
      ref="OfflnClassEdit"
      :update-class-dialog-visible.sync="updateClassDialogVisible"
      @reloadList="getClassList"
    />

    <!-- 学员分班 -->
    <StudentPlacement
      :student-placement-dialog.sync="studentPlacementDialog"
      ref="StudentPlacement"
      :show-message="StudentPlacementMessage"
      :getClassList="getClassList"
    ></StudentPlacement>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import SearchCondition from "@/views/offline/components/SearchCondition";
import {
  getClassList,
  isExistStudent,
  deleteClass,
  getClassSchedules
} from "@/api/offline/OfflnClassMgtApi";
import OfflnSchedule from "@/views/offline/OfflnSchedule";
import OfflnClassEdit from "@/views/offline/OfflnClassEdit";
import StudentPlacement from "./StudentPlaceMent";

export default {
  name: "OfflnClassMgt", // 班级及排课管理
  components: {
    SearchCondition,
    OfflnSchedule,
    OfflnClassEdit,
    StudentPlacement
  },
  directives: { waves },
  data () {
    return {
      scheduleClassDialogVisible: false, // 班级排课弹窗显示与否
      updateClassDialogVisible: false, // 编辑班级弹窗显示与否
      studentPlacementDialog: false, //学员分班
      gridData: [],
      showMessage: {
        courseName: "",
        times: "", // 这个会让弹出框出现
        courseId: "",
        classId: "",
        className: "",
        campusId: ""
      },
      //学员分班信息
      StudentPlacementMessage: {
        courseName: "",
        campusName: ""
      },
      list: [], // 班级列表
      total: 0, // 列表条数
      listLoading: false, // loading加载
      listQuery: {
        // 查询条件
        pageNum: 1,
        pageSize: 20,
        provinceId: null,
        version: null,
        gradeId: null,
        coursePeriodId: null,
        courseType: null,
        subjectId: null,
        campusId: null,
        className: null
      }
    };
  },
  mounted () {
    this.getClassList();
  },
  methods: {
    // 获取班级列表
    getClassList () {
      this.listLoading = true;
      getClassList(this.listQuery).then(res => {
        if (res.status === 200) {
          this.list = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        } else {
          this.listLoading = false;
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 编辑班级
    editClass (classId) {
      this.updateClassDialogVisible = true;
      this.$refs.OfflnClassEdit.resetForm(); // 重置新增弹窗form表单
      this.$refs.OfflnClassEdit.getSingleClass(classId);
    },
    // 班级排课
    scheduleClass (msg) {
      console.log(msg);
      this.scheduleClassDialogVisible = true;
      this.showMessage = {
        courseName: msg.courseName,
        times: msg.times, // 这个会让弹出框出现
        courseId: msg.courseId,
        classId: msg.classId,
        className: msg.className,
        campusId: msg.campusId,
        gradeId: msg.gradeId,
        subjectId: msg.subjectId
      };
      // console.log(msg)
    },
    // 删除班级
    deleteClass (classId) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        isExistStudent(classId).then(res => {
          if (res.status === 200) {
            if (res.data) {
              this.$confirm("该班级下面存在学员，是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                this.confirmDeleteClass(classId);
              });
            } else {
              this.confirmDeleteClass(classId);
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        });
      });
    },

    studentPlacement (msg) {
      this.studentPlacementDialog = true;
      this.$refs.StudentPlacement.findClassTeacher(msg.campusName, msg.className)
      this.$refs.StudentPlacement.findStudent(msg.courseId, msg.classId)
      // this.$refs.StudentPlacement.resetForm();
      // this.StudentPlacementMessage = {
      //   campusName: msg.campusName,
      //   courseId: msg.courseId,
      //   classId: msg.classId,
      //   className: msg.className
      // };
    },
    confirmDeleteClass (classId) {
      deleteClass(classId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getClassList();
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.el-form-item--mini {
  padding-right: 0;
}
</style>
