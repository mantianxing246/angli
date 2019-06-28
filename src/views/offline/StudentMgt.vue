<template >
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-select v-model="listQuery.gradeId" placeholder="年级" clearable style="width:75px">
          <el-option
            v-for="item in grades"
            :value="item.gradeId"
            :key="item.gradeId"
            :label="item.gradeName"
            class="width80"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.subjectId" placeholder="学科" clearable style="width: 75px">
          <el-option
            v-for="item in subjects"
            :value="item.subjectId"
            :key="item.subjectId"
            :label="item.subjectName"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.courseType" placeholder="课程类型" clearable style="width: 95px">
          <el-option v-for="item in courseTypes" :key="item" :value="item" :label="item"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.campusId"
          :style="{width:$selectConfig.campusIdWidth+'px'}"
          placeholder="校区"
          clearable
        >
          <el-option
            v-for="item in campuses"
            :value="item.campusId"
            :key="item.campusId"
            :label="item.campusName"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          v-model="listQuery.className"
          placeholder="班级名称"
          :style="{width:$selectConfig.classNameWidth+'px'}"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.studentName" placeholder="学员姓名" clearable class="width120"/>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.studentRoleId"
          :style="{width:$selectConfig.studentRoleIdWidth +'px'}"
          placeholder="学员ID"
          clearable
          class="width80"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="selectTimer"
          type="daterange"
          range-separator="-"
          start-placeholder="课表开始日期"
          end-placeholder="课表结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="findAllOfflnStudentMgtList"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
          <el-table :data="list" border fit stripe>
            <el-table-column label="学生姓名" align="center" prop="studentName" width="100"/>
            <el-table-column label="学生ID" align="center" prop="studentRoleId" width="100"/>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
            <el-table-column label="班级名称" align="center" prop="className" min-width="310"/>
            <el-table-column label="班主任" align="center" prop="userName" width="100"/>
            <!-- <el-table-column label="当前考勤" align="center" prop="attendanceTypeName"></el-table-column> -->
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <div class="czSort">
                  <el-tooltip
                    v-if="!scope.row.isDisable"
                    effect="light"
                    content="换班"
                    placement="top"
                  >
                    <i class="el-icon-plus" click="shiftDuty" @click="changeClass(scope.row)"/>
                  </el-tooltip>
                  <el-tooltip v-else content="不能换班" placement="top">
                    <i class="el-icon-minus"/>
                  </el-tooltip>
                  <el-tooltip effect="light" content="查看考勤" placement="top">
                    <i class="el-icon-view" @click="viewAttend(scope.row)"/>
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
    <OfflnClassAdjust
      ref="offlnClassAdjust"
      :class-adjust-dialog.sync="classAdjustDialog"
      @reload="findAllOfflnStudentMgtList"
    />

    <OfflineStudentAttendSign
      ref="OfflineStudentAttendSign"
      :offline-student-attend-sign-dialog.sync="OfflineStudentAttendSignDialog"
    />
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
import OfflnClassAdjust from "./OfflnClassAdjust";
import { findAllOfflnStudentMgtList } from "@/api/offline/StudentMgt";
import OfflineStudentAttendSign from "./OfflineStudentAttendSign";
import courseType from "@/CourseType/CourseType.js";

export default {
  name: "StudentMgt",
  components: {
    OfflineStudentAttendSign,
    OfflnClassAdjust
  },
  data () {
    return {
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        attendanceTypeId: null,
        attendanceTypeName: null,
        studentRoleId: null,
        studentName: null,
        studentId: null,
        classId: null,
        className: null,
        courseId: null,
        courseType: null,
        courseName: null,
        userId: null,
        userName: null,
        teacherId: null,
        teacherName: null,
        date: null,
        timeGap: null,
        beginTime: null,
        endTime: null
      },
      selectTimer: '',
      endTime: null,
      list: [],
      total: 0,
      grades: [], // 年级
      courseTypes: [],
      campuses: [],
      subjects: [],
      classAdjustDialog: false,
      loading: false,
      OfflineStudentAttendSignDialog: false // 学生出勤弹出框
    };
  },
  mounted () {
    this.getClassList();
  },
  created () {
    this.getHeadInfo();
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then(res => {
        if (res.status === 200) {
          this.grades = res.data.grades;
          this.courseTypes = courseType.offlineCourseType;
          this.campuses = res.data.campuses;
          this.subjects = res.data.subjects;
        }
      });
    },
    getClassList () {
      this.findAllOfflnStudentMgtList();
    },
    findAllOfflnStudentMgtList () {
      this.listQuery.endTime = this.selectTimer ? this.selectTimer[1] : null;
      this.listQuery.beginTime = this.selectTimer ? this.selectTimer[0] : null;
      this.loading = true;
      findAllOfflnStudentMgtList(this.listQuery).then(res => {
        this.loading = false;
        this.list = [];
        if (res.data) {
          this.list = res.data.list;
          this.total = res.data.total;
          this.duty();
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    // 换班允许吗
    duty () {
      // console.log(this.list);
      for (var i = 0;i < this.list.length;i++) {
        if (this.list[i].date && this.list[i].timeGap) {
          var year = parseInt(this.list[i].date.split("-")[0]);
          var month = parseInt(this.list[i].date.split("-")[1]);
          var date = parseInt(this.list[i].date.split("-")[2]);
          var hour = parseInt(this.list[i].timeGap.split("-")[0].split(":")[0]);
          var min = parseInt(this.list[i].timeGap.split("-")[0].split(":")[1]);
          var date = new Date(year, month - 1, date, hour, min);
          if (new Date().getTime() - date.getTime() < 0) {
            this.list[i].isDisable = false;
          } else {
            this.list[i].isDisable = true;
          }
        }
      }
    },

    // 查看考勤
    viewAttend (row) {
      var params = {
        classId: row.classId,
        courseId: row.courseId
      };

      this.$refs.OfflineStudentAttendSign.getAttendCourse(row.classId, row.studentId);

      this.$refs.OfflineStudentAttendSign.findAttendance({
        studentId: row.studentId,
        classId: row.classId
        // studentId: 49,
        // classId: 3
      });
      this.OfflineStudentAttendSignDialog = true;
    },
    // 换班
    changeClass (row) {
      //this.classAdjustDialog = true
      var params = {
        studentId: row.studentId,
        classId: row.classId,
        courseId: row.courseId,
        scheduleId: row.scheduleId
      };
      this.$router.push({
        path: "/OfflineMgt/StudentShiftDutyStep1",
        query: params
      });
      this.$store.dispatch("STUDENTDUTYSELECT", []);
      // this.$refs.offlnClassAdjust.getClasses()
      // this.$refs.offlnClassAdjust.getSingleStudent(params)
    }
  }
};
</script>
<style scoped>
.width80 {
  width: 85px;
}
.width120 {
  width: 120px;
}
.width160 {
  width: 160px;
}
.el-form-item--mini {
  padding-right: 0;
}
.el-form-item {
  margin-right: 0;
}
</style>
