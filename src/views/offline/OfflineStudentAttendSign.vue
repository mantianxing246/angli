<template>
  <div class="app-container">
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="OfflineStudentAttendSignDialogs"
      title="考勤签到"
      center
      width="1100px"
    >
      <div class="font-color">课程信息：</div>
      <el-row>
        <el-col :span="12">
          <span>校区：</span>
          <span>{{ courseInfo.campusName }}</span>
        </el-col>
        <el-col :span="12">
          <span>课程名称：</span>
          <span>{{ courseInfo.courseName }}</span>
        </el-col>
        <el-col :span="12">
          <span>班级名称：</span>
          <span>{{ courseInfo.className }}</span>
        </el-col>
        <el-col :span="6">
          <span>班主任：</span>
          <span>{{ courseInfo.userName }}</span>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="list"
        highlight-current-row
        border
        fit
        center
        stripe
        style="width: 100%;"
      >
        <el-table-column label="课次" align="center" prop="attendanceNum" width="80">
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="name" width="150px"/>
        <el-table-column label="上课教师" align="center" prop="teacherName" width="100px"/>
        <el-table-column label="上课日期" align="center" prop="date" width="100px"/>
        <el-table-column label="上课时段" align="center" prop="timeGap" width="100px"/>
        <el-table-column label="考勤时间" align="center" prop="attendanceTime" width="100px"/>
        <el-table-column label="考勤状态" align="center" min-width="250px">
          <template slot-scope="scope">
            <attendance-type-for-button @attendExplain="attendExplain" :scope="scope"/>
          </template>
        </el-table-column>
        <el-table-column label="情况说明" align="center" width="150px">
          <template slot-scope="scope">
            <div class="czSort">
              <el-tooltip effect="light" content="说明" placement="top">
                <i
                  class="el-icon-edit"
                  @click="attendExplain(scope.row.studentId, scope.row.classId, scope.row.id, 5, '', scope.row,'condition')"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="OfflineStudentAttendSignDialogs = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="explainDialog"
      title="考勤情况说明"
      center
      width="30%"
    >
      <el-input type="textarea" rows="5" v-model="remark"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="explainDialog = false">关闭</el-button>
        <el-button :disabled="confirmDisabledFlag" type="primary" @click="updataAttendance">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAttendExplain,
  attendExplain,
  updataAttendance
} from "@/api/offline/OfflnStuClsMgt";
import {
  findAttendance,
  getAttendCourse
} from "@/api/offline/OfflineStudentAttendSign";
import { attendanceType } from "@/CourseType/AttendanceTypes.js";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { constants } from "crypto";
import { updateRemark } from "@/api/offline/OfflnStuClsMgt";
import attendanceTypeForButton from "./components/AttendanceType";
export default {
  name: "OfflineStudentAttendSign",
  props: ["offlineStudentAttendSignDialog"],
  components: {
    attendanceTypeForButton
  },
  data () {
    return {
      confirmDisabledFlag: true,
      attendanceIndex: {},
      list: [],
      listLoading: false,
      explainDialog: false,
      courseInfo: {
        attendanceTime: "",
        time: "",
        campusName: "",
        courseName: "",
        className: "",
        teacher: ""
      },
      // 考勤状态
      attendanceType: [],
      remark: null,
      updateAttendanceExplain: {
        studentId: null,
        remark: null,
        attendanceTypeId: null,
        classId: null,
        attendanceTime: null
      },
      findAttendanceInfo: {}
    };
  },
  created () {
    this.init();
    this.list = [{}, {}];
  },
  computed: {
    OfflineStudentAttendSignDialogs: {
      get () {
        return this.offlineStudentAttendSignDialog;
      },
      set (val) {
        this.$emit("update:offlineStudentAttendSignDialog", val);
      }
    }
  },
  methods: {
    //点击说明修改
    updateRemark (params) {
      updateRemark(params).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.explainDialog = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    init () {
      getHeadInfo().then(res => {
        this.attendanceType = res.data.attendanceTypes;
        console.log(this.attendanceType);
      });
    },
    // 获取课程信息
    getAttendCourse (classId, courseId) {
      getAttendCourse(classId, courseId).then(res => {
        if (res.status === 200) {
          if (!res.data) {
            return;
          }
          this.courseInfo = res.data;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 获取学生信息
    findAttendance (params) {
      this.findAttendanceInfo = params;
      this.list = [];
      findAttendance(params).then(res => {
        if (res.status === 200 && res.data) {
          res.data.forEach((element, index) => {
            if (!element.attendanceTime) {
              res.data[index].attendanceTime = "";
            } else {
            }
          });
          this.list = res.data;
          for (const iterator of this.list) {
            iterator.attendanceTime = this.$format(iterator.attendanceTime.split(" ")[0]);
          }
          // this.list[0].time = this.$format(new Date(res.data.attendanceTime))
          for (var i = 0;i < this.list.length;i++) {
            if (!res.data[i].attendanceTime) {
              this.list[i].time = "";
            } else {
              this.list[i].time = this.$format(
                new Date(res.data[i].attendanceTime.split(" ")[0])
              );
            }
          }
          this.disableBeforeDate();
        }
      });
    },
    confirm () {
      this.OfflineStudentAttendSignDialogs = false;
    },
    // 更新考勤签到状态或说明
    updataAttendance () {
      if (!this.remark) {
        this.$message({
          message: "请输入考勤说明",
          type: "warning"
        });
        return;
      }
      if (this.remark && this.remark.length > 100) {
        this.$message({
          message: "考勤签到说明字数不能超过100个汉字",
          type: "warning"
        });
        return;
      }
      this.updateAttendanceExplain.remark = this.remark;
      this.updateAttendanceExplain.classId = this.findAttendanceInfo.classId;
      this.updateAttendanceExplain.date = this.attendanceIndex.row.date;
      this.updateAttendanceExplain.orderId = this.attendanceIndex.row.orderId;
      this.updateAttendanceExplain.orderCourseId = this.attendanceIndex.row.orderCourseId;
      if (this.updateAttendanceExplain.attendanceTypeId === 5) {
        this.updateRemark(this.updateAttendanceExplain)
      } else {
        updataAttendance(this.updateAttendanceExplain).then(res => {
          if (res.status === 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.explainDialog = false;
            if (this.attendanceIndex.condition === "condition") {

            } else if (this.attendanceIndex.condition === "attendanceType") {
              this.attendanceIndex.row.attendanceTime = this.$format(res.data.attendanceTime)
              this.attendanceIndex.row.attendanceTypeId = this.updateAttendanceExplain.attendanceTypeId
            } else { }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        });
      }
    },
    // 说明弹框
    attendExplain (studentId, classId, id, attendanceTypeId, heightLight, row, condition) {
      if (
        heightLight === "focus" ||
        row.attendanceTypeId === 3 ||
        row.attendanceTypeId === 4
      ) {
        // 不能反复请假或出勤
        this.confirmDisabledFlag = true;
      } else {
        this.confirmDisabledFlag = false;
      }
      this.attendanceIndex = {
        condition,
        row
      }
      this.explainDialog = true;
      row && (this.updateAttendanceExplain.attendanceTime = row.attendanceTime);
      getAttendExplain({ classId, studentId, id }).then(res => {
        if (res.status === 200) {
          this.remark = res.data.remark;
          this.updateAttendanceExplain.studentId = res.data.studentId;
          this.updateAttendanceExplain.attendanceTypeId = attendanceTypeId;
          this.updateAttendanceExplain.id = id;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    disableBeforeDate () {
      var date = new Date();
      if (date.getDay() == 3) {
        for (var i = 0;i < this.list.length;i++) {
          if (
            new Date(this.list[i].attendanceTime).getTime() - date.getTime() <
            0
          ) {
            this.list[i].disabled = true;
          } else {
            this.list[i].disabled = false;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-col {
  padding: 6px 0;
}
.sign-status {
  display: flex;
  justify-content: space-around;
  cursor: pointer;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    color: #fff;
    border: 1px solid #797979;
    border-radius: 3px;
    background: #999999;
    padding: 0 8px;
  }
  li.focus {
    background: #009933;
  }
}
.el-row {
  margin-bottom: 0;
}
</style>
