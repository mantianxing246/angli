<!--
 * @author hongdengru
 * @date 2019/1/14
-->
<template>
  <div>
    <!--班级排课-->
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="classDialog"
      width="1202px"
      title="班级排课"
      center
      fit
      stripe
    >
      <!-- 2019高三尖子暑假语文1班（徐汇）   上课次数：16 -->
      <div class="classTitle margin-bottom18">
        {{ "班级名称："+showMessage.className }}
        <span
          style="margin-left:20px"
        >{{' 上课次数：'+ showMessage.times }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" class="demo-form" inline>
        <el-form-item label="上课日期" prop="time">
          <el-date-picker
            ref="classDate1"
            v-model="form.time"
            type="dates"
            placeholder="选择日期"
            style="width: 170px"
          />
        </el-form-item>
        <el-form-item label="上课时间" prop="startTime" style="margin-right:0;">
          <el-time-select
            style="width:110px;"
            placeholder="起始时间"
            v-model="form.startTime"
            :picker-options="{
            start: '08:00',
            step: '00:10',
            end: '22:00'
            }"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="" prop="endTime">
          <el-time-select
           style="width:110px;"
          placeholder="结束时间"
          v-model="form.endTime"
          :picker-options="{
            start: '08:00',
            step: '00:10',
            end: '22:00',
            minTime: form.startTime
          }"></el-time-select>
        </el-form-item>
        <el-form-item label="上课老师" prop="teacherId">
          <el-select style="width:110px;" v-model="form.teacherId" placeholder="请选择" clearable class="selTeacher">
            <el-option
              v-for="item in teacherList"
              :label="item.teacherName"
              :value="item.teacherId"
              :key="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上课教室" prop="classroom">
          <el-input v-model="form.classroom" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">添加排课</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="gridDatas" highlight-current-row border fit center stripe>
        <el-table-column property="indexId" label="课次" align="center" width="60px"/>
        <el-table-column property="className" label="班级名称" min-width="310px" align="center"/>
        <el-table-column property="time" label="上课日期" align="center" min-width="100px"/>
        <el-table-column property="duan" label="上课时段" align="center" min-width="100px"/>
        <el-table-column property="teacherName" label="上课老师" align="center" width="150px"/>
        <el-table-column property="classroom" label="上课教室" align="center" min-width="100px"/>
        <el-table-column label="操作" width="50px" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.isDisable"
              effect="dark"
              content="已上完课次不可删除"
              placement="top"
            >
              <i class="el-icon-delete"></i>
            </el-tooltip>
            <i v-else class="el-icon-delete" @click="delClick(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="classDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitClass" :loading="subLoading">确认</el-button>
      </div>
    </el-dialog>
    <!--确定删除对话框-->
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%"
    >
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delClass()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/components/directive/waves"; // Waves directive
import {
  getClassSchedules,
  insertClassPk,
  deletePClass,
  findTeachList,
  findTeacherCourseTime,
  addScheduleList,
  deleteSchedule
} from "@/api/offline/OfflnClassMgtApi";

export default {
  name: "OfflnSchedule",
  directives: {
    waves: waves
  },
  props: ["scheduleClassDialogVisible", "showMessage"],
  data: function() {
    return {
      subLoading: false,
      dialogVisible: false,
      repeatTime: false, //重复日期
      num: 0,
      numId: 0,
      courseId: "",
      teacherList: [],
      form: {
        teacherId: "",
        teacherName: "",
        classroom: "",
        time: "",
        startTime: "",
        endTime: "",
        classNum: "上课次数： 16"
      },
      rules: {
        teacherId: [
          { required: true, message: "请输入上课老师", trigger: "change" }
        ],
        classroom: [
          { required: true, message: "请选择上课教室", trigger: "blur" }
        ],
        time: [{ required: true, message: "请选择时间", trigger: "change" }],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        endTime: [
          { required: false, message: "请选择结束时间", trigger: "change" }
        ]
      },
      gridDatas: [], //添加一行表格
      teacherId: null //teachId的id
    };
  },
  computed: {
    classDialog: {
      get() {
        if (this.scheduleClassDialogVisible) {
          this.getClassSchedules();
          this.getTeacher();
          this.form.time = []; //多选日期插件有个bug,选择后不自动清空
        }
        return this.scheduleClassDialogVisible;
      },
      set(val) {
        this.$refs.form.resetFields();
        this.$emit("update:scheduleClassDialogVisible", val);
        if (val == false) {
          this.gridDatas = [];
        }
      }
    }
  },
  methods: {
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var chooseTime = _this.form.time; //将选中日期转成正确格式
          var chooseTimeArr = [];
          for (var i = 0; i < chooseTime.length; i++) {
            chooseTimeArr.push(
              chooseTime[i].getFullYear() +
                "-" +
                _this.addZero(parseInt(chooseTime[i].getMonth()) + 1) +
                "-" +
                _this.addZero(chooseTime[i].getDate())
            );
          }
          console.log(chooseTimeArr);
          var duan = _this.form.startTime;
          var duan2 =_this.form.endTime;
          //判断条件，是否能插入
          var insert = this.classScheduleInsert(chooseTime);
          //上课老师是否与其他课程班级排课时间有冲突，若是则提示“上课老师时间与其他班级上课时间冲突，请更换老师或重新排课”；
          if (insert) {
            for (var i = 0; i < _this.teacherList.length; i++) {
              if (_this.teacherList[i].teacherId === _this.form.teacherId) {
                _this.form.teacherName = _this.teacherList[i].teacherName;
              }
            }
            for (var i = 0; i < chooseTimeArr.length; i++) {
              this.gridDatas.push({
                // id: i+1,
                time: chooseTimeArr[i],
                classTime: this.showMessage.times,
                duan: duan + "-" + duan2,
                teacherId: this.form.teacherId,
                teacherName: this.form.teacherName,
                classroom: this.form.classroom,
                className: this.showMessage.className,
                isDisable: false
              });
            }
            this.getGridData();
            this.$refs.form.resetFields();
            this.form.time = [];
          }
        } else {
          console.log("error submit!!");
        }
      });
    },
    //确认排课
    submitClass() {
      if (this.gridDatas.length == 0) {
        this.$message({
          message: "请先添加课程",
          type: "warning"
        });
      } else {
        var subDataArr = [];
        for (var i = 0; i < this.gridDatas.length; i++) {
          subDataArr.push({
            courseId: this.showMessage.courseId,
            classId: this.showMessage.classId,
            attendanceNum: this.gridDatas[i].indexId,
            beginTime:
              this.gridDatas[i].time +
              "T" +
              this.gridDatas[i].duan.split("-")[0] +
              ":00",
            endTime:
              this.gridDatas[i].time +
              "T" +
              this.gridDatas[i].duan.split("-")[1] +
              ":00",
            teacherId: this.gridDatas[i].teacherId,
            classroom: this.gridDatas[i].classroom,
            scheduleId: this.gridDatas[i].scheduleId
          });
        }
        this.subLoading = true;
        addScheduleList(subDataArr).then(res => {
          this.subLoading = false;
          this.classDialog = false;
          if (res.status == 200) {
            this.$message({
              message: "排课成功",
              type: "success"
            });
            this.gridDatas = [];
            this.classDialog = false;
            this.$parent.getClassList();
          } else {
            if (res.data) {
              var errorMsg = "";
              for (var i = 0; i < res.data.length; i++) {
                errorMsg += `[错误信息${i + 1}]:${
                  res.data[i].failMessage
                }，开始时间为${res.data[i].beginTime},结束时间为${
                  res.data[i].endTime
                }</br>`;
              }
              this.$alert(errorMsg, "错误信息", {
                confirmButtonText: "确定",
                dangerouslyUseHTMLString: true
              });
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          }
        });
      }
    },
    classScheduleInsert(chooseTime) {
      var length = this.gridDatas.length;
      var canAddTime = length + this.form.time.length; //列表中原有课程数加已选择课程
      //排课次数不可大于上课次数，请重新排课
      if (
        this.showMessage.times < length ||
        canAddTime > this.showMessage.times
      ) {
        this.$message({
          message: "排课次数不可大于上课次数，请重新排课",
          type: "warning"
        });
        return false;
      }
      //不可选择已过去时间
      for (var i = 0; i < this.form.time.length; i++) {
        let selectTime =  new Date(this.form.time[i]).setHours(Number(this.form.startTime.split(':')[0]));
        selectTime = new Date(selectTime).setMinutes(Number(this.form.startTime.split(':')[1]));
        if ( new Date(selectTime).getTime() < new Date().getTime()) {
          this.$message({
            message: "过去日期不可排课，请更改日期",
            type: "warning"
          });
          return false;
        }
      }
      //课表日期、上课时段、是否与本课程班级排课时间有冲突
      if (this.timeConflict()) {
        this.$message({
          message: this.repeatTime + "日期课表重复，请重新排课",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    //课表日期、上课时段、是否与本课程班级排课时间有冲突
    timeConflict() {
      var insetDate = []; //选择时间
      var insetDate2 = [];
      var scheduleDate = [];
      var scheduleDate2 = [];
      var chooseTime = this.form.time;
      for (var i = 0; i < chooseTime.length; i++) {
        insetDate.push(
          new Date(
            chooseTime[i].getFullYear(),
            chooseTime[i].getMonth(),
            chooseTime[i].getDate(),
            Number(this.form.startTime.split(':')[0]),
            Number(this.form.startTime.split(':')[1])
          )
        );
        insetDate2.push(
          new Date(
            chooseTime[i].getFullYear(),
            chooseTime[i].getMonth(),
            chooseTime[i].getDate(),
            Number(this.form.endTime.split(':')[0]),
            Number(this.form.endTime.split(':')[1])
          )
        );
      }
      //列表中时间
      for (var j = 0; j < this.gridDatas.length; j++) {
        let year = this.gridDatas[j].time.split("-")[0];
        let month = parseInt(this.gridDatas[j].time.split("-")[1]);
        let date = parseInt(this.gridDatas[j].time.split("-")[2]);
        let hours = this.gridDatas[j].duan.split("-")[0].split(":")[0];
        let min = this.gridDatas[j].duan.split("-")[0].split(":")[1];
        let hours2 = this.gridDatas[j].duan.split("-")[1].split(":")[0];
        let min2 = this.gridDatas[j].duan.split("-")[1].split(":")[1];
        scheduleDate.push(new Date(year, month - 1, date, hours, min));
        scheduleDate2.push(new Date(year, month - 1, date, hours2, min2));
      }
      for (var i = 0; i < insetDate.length; i++) {
        //选中时间
        for (var j = 0; j < scheduleDate.length; j++) {
          //列表中已排课时间
          if (
            scheduleDate[j].getTime() >= insetDate[i].getTime() &&
            scheduleDate2[j].getTime() >= insetDate2[i].getTime() &&
            insetDate2[i].getTime() >= scheduleDate[j].getTime()
          ) {
            return true;
          } else if (
            scheduleDate[j].getTime() >= insetDate[i].getTime() &&
            scheduleDate2[j].getTime() <= insetDate2[i].getTime() &&
            scheduleDate2.getTime() >= insetDate[i].getTime()
          ) {
            return true;
          } else if (
            scheduleDate[j].getTime() <= insetDate[i].getTime() &&
            scheduleDate2[j].getTime() <= insetDate2[i].getTime() &&
            insetDate[i].getTime() <= scheduleDate2[j].getTime()
          ) {
            return true;
          } else if (
            scheduleDate[j].getTime() <= insetDate[i].getTime() &&
            scheduleDate2[j].getTime() >= insetDate2[i].getTime() &&
            scheduleDate[j].getTime() <= insetDate2[i].getTime()
          ) {
            return true;
          } else {
            var year = insetDate[i].getFullYear();
            var month = this.addZero(insetDate[i].getMonth() + 1);
            var date = this.addZero(insetDate[i].getDate());
            this.repeatTime = year + "-" + month + "-" + date;
          }
        }
      }
      return false;
    },
    delClick(num) {
      this.dialogVisible = true;
      this.num = num.row.id;
      this.numId = num.$index;
    },
    addZero(n) {
      return parseInt(n) < 10 ? "0" + n : n + "";
    },
    delClass() {
      this.dialogVisible = false;
      if (this.num) {
        deleteSchedule(this.num).then(res => {
          if (res.status === 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getClassSchedules();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        });
      } else {
        this.gridDatas.splice(this.numId, 1);
      }

      this.getGridData();
    },
    //排课排序
    getGridData() {
      let gridDataSortArr = [];
      for (let i = 0; i < this.gridDatas.length; i++) {
        let year = this.gridDatas[i].time.split("-")[0];
        let month = parseInt(this.gridDatas[i].time.split("-")[1]);
        let date = parseInt(this.gridDatas[i].time.split("-")[2]);
        let hours = this.gridDatas[i].duan.split("-")[0].split(":")[0];
        let min = this.gridDatas[i].duan.split("-")[0].split(":")[1];
        let scheduleDate = new Date(year, month - 1, date, hours, min);
        gridDataSortArr.push({
          scheduleDate: scheduleDate,
          gridDatas: this.gridDatas[i]
        });
      }
      this.scheduleSort(gridDataSortArr);
    },
    scheduleSort(gridDataSortArr) {
      for (var i = 0; i < gridDataSortArr.length; i++) {
        var minDate = Math.abs(
          this.getDate().getTime() - gridDataSortArr[i].scheduleDate.getTime()
        );
        for (var j = i + 1; j < gridDataSortArr.length; j++) {
          if (
            minDate >=
            Math.abs(
              this.getDate().getTime() -
                gridDataSortArr[j].scheduleDate.getTime()
            )
          ) {
            minDate = Math.abs(
              this.getDate().getTime() -
                gridDataSortArr[j].scheduleDate.getTime()
            );
            var tempDate = gridDataSortArr[i];
            gridDataSortArr[i] = gridDataSortArr[j];
            gridDataSortArr[j] = tempDate;
          }
        }
        if (
          this.getDate().getTime() - gridDataSortArr[i].scheduleDate.getTime() >
          0
        ) {
          //判断上课时间是否已过
          gridDataSortArr[i].gridDatas.isDisable = true;
        } else {
          gridDataSortArr[i].gridDatas.isDisable = false;
        }
      }
      gridDataSortArr.forEach((val, index) => {
        this.gridDatas[index] = val.gridDatas;
      });
      for (var i = 0; i < this.gridDatas.length; i++) {
        this.gridDatas[i].indexId = i + 1;
      }
    },
    getDate() {
      return new Date();
    },
    //根据courseId和classId查询结果
    getClassSchedules() {
      this.gridDatas = [];
      getClassSchedules({
        classId: this.showMessage.classId,
        courseId: this.showMessage.courseId
      }).then(res => {
        if (res.status === 200) {
          if (res.data.list.length > 0) {
            res.data.list.forEach((val, index) => {
              this.gridDatas.push({
                id: val.id,
                time: val.date,
                duan: val.timeGap,
                teacherId: val.teacherId,
                classroom: val.classroom,
                className: this.showMessage.className,
                disabled: false,
                scheduleId: val.id,
                teacherName: val.teacherName
              });
              this.getGridData();
            });
          }
        }
      });
    },
    getTeacher() {
      findTeachList({
        gradeId: this.showMessage.gradeId,
        subjectId: this.showMessage.subjectId,
        campusId: this.showMessage.campusId,
        isEffective: "1"
      }).then(res => {
        if (res.status == 200) {
          this.teacherList = res.data;
        }
      });
    },
    format(time) {
      var y = new Date(time).getFullYear();
      var m = new Date(time).getMonth() + 1;
      var d = new Date(time).getDate();
      var h = new Date(time).getHours();
      var min = new Date(time).getMinutes();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : "" + h;
      min = min < 10 ? "0" + min : "" + min;

      return y + "-" + m + "-" + d + " " + h + ":" + min + ":00";
    }
  }
};
</script>
<style scoped>
.disabledBackground {
  background: gray;
  border: none;
}
</style>
