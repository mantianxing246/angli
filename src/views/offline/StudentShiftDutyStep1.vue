<template>
  <div class="app-container">
    <!-- 课程信息 -->
    <course-info
      style="margin-bottom:20px"
      :info="info"
      @sendCampusId="sendCampusId"
      @sendUserId="sendUserId"
      class="x-block"
    ></course-info>

    <card-container>
      <template slot="body">
        <el-table
          highlight-current-row
          border
          fit
          center
          stripe
          style="width: 100%"
          :data="list"
          @selection-change="selectionChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" align="center" :selectable="selectable"></el-table-column>
          <el-table-column label="课次" align="center" prop="attendanceNum"></el-table-column>
          <el-table-column label="学员姓名" align="center" prop="name"></el-table-column>
          <el-table-column label="上课日期" align="center" prop="date"></el-table-column>
          <el-table-column label="上课时段" align="center" prop="timeGap"></el-table-column>
          <el-table-column label="考勤时间" align="center" prop="attendanceTime"></el-table-column>
          <el-table-column label="考勤状态" align="center" width="250">
            <template slot-scope="scope">
              <ul class="sign-status">
                <!-- 考勤状态非换班、退费、转课时，只显示出勤、请假两个按钮；
                考勤状态是已换班、已退费、已转课时，显示汉字（非按钮）：已换班/已退费/已转课；-->
                <div
                  v-if="attendanceType.includes(scope.row.attendanceTypeId)"
                >{{scope.row.attendanceTypeName}}</div>
                <div v-else>
                  <li
                  >出勤</li>
                  <li
                    :class="[2===scope.row.attendanceTypeId?'focus':'',scope.row.disabled?'disabled':'']"
                  >请假</li>
                </div>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="情况说明" align="center">
            <template slot-scope="scope">
              <ul class="sign-status">
                <div>
                  <li class="focus" @click="attendExplain(scope.row)">说明</li>
                </div>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </card-container>

    <el-steps :active="step" finish-status="success" style="margin-top:20px">
      <el-step title="转出课次"></el-step>
      <el-step title="选择班级"></el-step>
      <el-step title="转入课次"></el-step>
    </el-steps>
    <el-row type="flex" justify="center" style="margin-top:20px">
      <el-col :span="2">
        <el-button @click="back">取消</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </el-col>
    </el-row>

    <dialog-container title="转出课次说明" :visible.sync="explainDialog" width="30%">
      <template slot="body">
        <el-input type="textarea" rows="5" v-model="remark"></el-input>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="explainDialog = false">取消</el-button>
          <el-button type="primary" @click="updateRemark()" :disabled="disabled">确定</el-button>
        </div>
      </template>
    </dialog-container>
  </div>
</template>
<script>
import CourseInfo from "./components/CourseInfo";
import { findOfflNattendanceNum } from "@/api/offline/OfflnClassMgtApi";
import {
  getAttendCourse,
  getAttendClass,
  updateRemark,
  getAttendExplain
} from "@/api/offline/OfflnStuClsMgt";

import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
import { truncate } from "fs";
export default {
  name: "StudentShiftDutyStep1",
  data() {
    return {
      attendanceType: [],
      step: 1,
      explainDialog: false,
      list: [],
      remark: null,
      selectCourse: [],
      campusId: null,
      attendanceId: null,
      attendanceTypeId: 0,
      messageDialog: false,
      disabled: true, //是否能够修改说明
      info: {}, //courseId,classId
      userId: null
    };
  },
  methods: {
    sendUserId(val) {
      this.userId = val;
    },
    //修改说明
    updateRemark() {
      if(!this.remark||(this.remark&&!this.remark.replace(/(^\s*)|(\s*$)/,""))){
        this.$message({
          message: "转出课次说明不能为空",
          type: "warning"
        });
        return;
      }
      if (this.remark.length > 100) {
        this.$message({
          message: "转出课次说明字数不能超过100个汉字",
          type: "warning"
        });
        return;
      }
      updateRemark(
        Object.assign({}, { remark: this.remark.replace(/(^\s*)|(\s*$)/,""), id: this.attendanceId })
      ).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.messageDialog = true;
          this.explainDialog = false;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    //查看说明
    attendExplain(row) {
      this.explainDialog = true;
      this.attendanceId = row.attendanceId;
      this.disabled = !row.disabled;
      if (row.attendanceTypeId) {
        this.attendanceTypeId = row.attendanceTypeId;
      } else {
        this.attendanceTypeId = 0;
      }
      getAttendExplain(
        Object.assign({}, { id: row.attendanceId }, this.info)
      ).then(res => {
        if (res.status === 200) {
          this.remark = res.data.remark;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    //查询学生的所有课次
    findOfflNattendanceNum() {
      findOfflNattendanceNum(this.info).then(res => {
        if (res.status == 200) {
          res.data.forEach((val, index) => {
            let date = new Date();
            let classDate = new Date(
              val.date + "T" + val.timeGap.replace(/-.+/, ":00")
            );
            if (
              val.attendanceTypeId == 1 ||
              val.attendanceTypeId == 4 ||
              val.attendanceTypeId == 3 ||
              date.getTime() - classDate.getTime() > 0
            ) {
              val.disabled = false;
            } else {
              val.disabled = true;
            }
          });
          this.list = res.data;
          //step2返回显示
          this.$nextTick(()=>{
            this.getSelecCourse();
          })
        } else {
          this.$tipsMessage(res.message, "warning");
        }
      });
    },
    //选中选择的课程
    selectionChange(val) {
      this.selectCourse = val;
    },
    //下一步
    nextStep() {
      if (this.selectCourse.length <= 0) {
        this.$tipsMessage("请选择转课课程!", "warning");
        return;
      }
      if (!this.messageDialog) {
        this.$tipsMessage("请填写说明", "warning");
        return;
      }
      // console.log(this.info)
      this.$router.push({
        path: "StudentShiftDutyStep2",
        query: {
          courseId: this.info.courseId,
          campusId: this.campusId,
          retrunCours: this.selectCourse.length,
          studentId: this.info.studentId,
          classId: this.info.classId
        }
      });
      var attendanceIdList = [];
      this.selectCourse.forEach(element => {
        //上海-2019-高三-英语-点睛-全年-徐汇校区-测试2班
        attendanceIdList.push(element.attendanceId);
      });
      localStorage.setItem(
        "attendanceIdList",
        JSON.stringify({
          orderCourseId: this.list[0].orderCourseId,
          orderId: this.list[0].orderId,
          attendanceIdList: attendanceIdList,
          userId: this.userId
        })
      );
      this.$store.dispatch("STUDENTDUTYSELECT", this.selectCourse);
      this.$store.dispatch("SELECTRADIOVALUE",-1)
       this.$store.dispatch("radioRow",{})
    },
    //得到校区
    sendCampusId(campusId) {
      this.campusId = campusId;
    },
    //复选框是否可以勾选
    selectable(row, index) {
      let date = new Date();
      let classDate = new Date(
        row.date + "T" + row.timeGap.replace(/-.+/, ":00")
      );
      if (
        row.attendanceTypeId == 1 ||
        row.attendanceTypeId == 4 ||
        row.attendanceTypeId == 3 ||
        row.attendanceTypeId == 5 ||
        date.getTime() - classDate.getTime() > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    //返回
    back() {
      this.$router.push("/OfflineMgt/StudentMgt");
    },
    getHeadInfo() {
      getHeadInfo().then(res => {
        if (res.status == 200) {
          //得到考勤状态为：非换班、退费、转课的数组
          res.data.attendanceTypes.forEach(element => {
            if (
              element.attendanceTypeName === "换班" ||
              element.attendanceTypeName == "退费" ||
              element.attendanceTypeName == "转课"
            ) {
              this.attendanceType.push(element.attendanceTypeId);
            }
          });
        }
      });
    },
    getSelecCourse() {
      let studentDutySelect = this.$store.getters.studentDutySelect;
      for(let j=0;j<studentDutySelect.length;j++){
         for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].attendanceNum === studentDutySelect[j].attendanceNum) {
            this.$refs.multipleTable.toggleRowSelection(this.list[i], true);
          }
        }
      }
    }
  },
  created() {
    this.info = this.$route.query;
    this.getHeadInfo();
    this.findOfflNattendanceNum();
  },
  //查看是不是从step2返回的
  beforeRouteEnter(to, from, next) {
    if (from.path != "/OfflineMgt/StudentMgt") {
      next(vm => {
        vm.messageDialog = true;
      });
    } else {
      next();
    }
  },
  components: {
    CourseInfo
  }
};
</script>
<style lang="scss" scoped>
.el-col {
  padding: 6px 0;
}
.sign-status {
  padding: 0;
  margin: 0;
  div {
    display: flex;
    justify-content: space-around;
    cursor: pointer;
    list-style: none;
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
}
.disabled {
  pointer-events: none;
}
</style>