<template>
  <div class="app-container">
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="attendDialog"
      title="考勤签到"
      center
      width="1000px"
    >
      <div>课程信息：</div>
      <el-row class="dialog-class">
        <el-col :span="6">
          <span>日期：</span>
          <span>{{courseInfo.date}}</span>
        </el-col>
        <el-col :span="6">
          <span>上课时段：</span>
          <span>{{courseInfo.timeGap}}</span>
        </el-col>
        <el-col :span="6">
          <span>校区：</span>
          <span>{{courseInfo.campusName}}</span>
        </el-col>
        <!-- <el-col :span="6">
          <span>课程名称：</span>
          <span>{{courseInfo.courseName}}</span>
        </el-col>-->
        <!-- <el-col :span="12">
          <span>班级名称：</span>
          <span>{{courseInfo.className}}</span>
        </el-col>-->
        <!-- <el-col :span="6">
          <span>班主任：</span>
          <span>{{courseInfo.userName}}</span>
        </el-col>-->
        <!-- <el-col :span="6">
          <span>上课教师：</span>
          <span>{{courseInfo.teacherName}}</span>
        </el-col>-->
      </el-row>
      <el-row style="margin-bottom:20px" class="dialog-class">
        <el-col :span="12">
          <span>课程名称：</span>
          <span>{{courseInfo.courseName}}</span>
        </el-col>
        <el-col :span="6">
          <span>上课教师：</span>
          <span>{{courseInfo.teacherName}}</span>
        </el-col>
      </el-row>
      <el-form ref="form" inline>
        <el-form-item label>
          <el-input style="width:100px;" clearable placeholder="学员姓名" v-model="name"/>
        </el-form-item>
        <el-form-item label>
          <el-input style="width:100px;" clearable placeholder="学员ID" v-model="studentId"/>
        </el-form-item>
        <el-form-item label>
          <el-button
            v-waves
            icon="el-icon-search"
            type="primary"
            @click="getCourseList"
            class="search-head"
          >查询</el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column label="学生ID" align="center" prop="studentUserId" width="100"/>
        <el-table-column label="学生姓名" align="center" prop="name" width="150"/>
        <el-table-column label="班主任" align="center" prop="userName" width="150"/>
        <el-table-column label="考勤时间" align="center" prop="attendanceTime" width="150"/>
        <el-table-column label="考勤状态" align="center" min-width="150">
          <template slot-scope="scope">
            <ul class="sign-status">
              <!-- 考勤状态非换班、退费、转课时，只显示出勤、请假两个按钮；
              考勤状态是已换班、已退费、已转课时，显示汉字（非按钮）：已换班/已退费/已转课；-->
              <div
                v-if="attendanceType.includes(scope.row.attendanceTypeId)"
              >{{scope.row.attendanceTypeName}}</div>
              <div v-else>
                <li
                  :class="[1===scope.row.attendanceTypeId?'focus':'',scope.row.disabled?'disabled':'']"
                  @click="attendExplain(scope.row,1)"
                >出勤</li>
                <li
                  :class="[2===scope.row.attendanceTypeId?'focus':'',scope.row.disabled?'disabled':'']"
                  @click="attendExplain(scope.row,2)"
                >请假</li>
              </div>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="情况说明" width="150" align="center">
          <template slot-scope="scope">
            <div class="czSort">
              <el-tooltip effect="light" content="说明" placement="top">
                <i class="el-icon-edit" @click="attendExplain(scope.row,-1)"/>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attendDialog = false" type="primary">关闭</el-button>
        <!-- <el-button type="primary" @click="attendDialog = false">确定</el-button> -->
      </div>
    </el-dialog>
    <dialog-container title="考勤情况说明" :visible.sync="explainDialog" width="30%">
      <template slot="body">
        <el-input type="textarea" rows="5" v-model="remark"></el-input>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="explainDialog = false">取消</el-button>
          <el-button
            :type="explainDialogType"
            @click="updateAttendanceExplain"
            :disabled="disabled"
          >确定</el-button>
        </div>
      </template>
    </dialog-container>
  </div>
</template> 
<script>
import waves from "@/components/directive/waves"; // Waves directive'
import {
  getAttendCourse,
  getAttendClass,
  updataAttendance,
  getAttendExplain,
  updateRemark
} from "@/api/offline/OfflnStuClsMgt";
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
export default {
  name: "OfflnAttendSign",
  directives: { waves },
  props: {
    viewAttendDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      courseInfo: {
        attendanceTime: null,
        time: "",
        campusName: "",
        courseName: "",
        className: "",
        teacher: ""
      },
      remark: "",
      explainDialog: false,
      attendanceType: [],
      listLoading: false,
      list: [],
      id: null, //第几次课
      updateAttendanceExplainParams: {}, //更新考勤需要的字段
      explainDialogType: "primary", //对话框的类型
      disabled: false, //说明对话框是否能够被点击
      scheduleId: null,
      index: null, //修改是当前的list中第几个对象
      updateRemarkObj: {}, //跟新考勤的字段
      name: "",
      studentId: "",
      attendanceTypeName: ["出勤", "请假", "换班", "退费", "转课"]
    };
  },
  computed: {
    attendDialog: {
      get: function() {
        return this.viewAttendDialogVisible;
      },
      set: function(val) {
        this.$emit("update:viewAttendDialogVisible", val);
      }
    }
  },
  methods: {
    getCourseList() {
      this.list = this.listCopy.filter(row => {
        let str = this.name + this.studentId;
        return (row.studentUserId + row.name).indexOf(str) !== -1;
      });
    },
    //获取课程信息
    getAttendCourse(scheduleId) {
      getAttendCourse(scheduleId).then(res => {
        if (res.status === 200) {
          if (!res.data) {
            this.$message({
              message: "暂时无数据",
              type: "warning"
            });
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
    //获取班级列表
    getAttendClass(params) {
      this.classId = params.classId;
      getAttendClass(params).then(res => {
        if (res.status === 200) {
          res.data.forEach((val, index) => {
            val.index = index;
          });
          this.list = res.data;
          this.listCopy = JSON.parse(JSON.stringify(res.data));
          this.disableBeforeDate();
        } else {
          this.$message({
            message: "暂时无数据",
            type: "warning"
          });
        }
      });
    },
    //跟新说明
    updateAttendanceExplain() {
      if (!this.remark) {
        this.$message({
          message: "请输入考勤说明",
          type: "warning"
        });
        return;
      }
      if (this.remark && this.remark.length >= 100) {
        this.$message({
          message: "考勤签到说明字数不能超过100个汉字",
          type: "warning"
        });
        return;
      }
      //这个地方调用2个接口，说明和修改状态
      if (this.attendanceTypeId === -1) {
        this.updateRemark(
          Object.assign(this.updateRemarkObj, { remark: this.remark })
        );
      } else {
        this.updataAttendance(
          Object.assign(this.updateAttendanceExplainParams, {
            remark: this.remark
          })
        );
      }
    },
    //更新考勤签到
    updataAttendance(params) {
      updataAttendance(params).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.explainDialog = false;
          // this.getAttendClass({
          //   classId: this.classId,
          //   scheduleId: this.scheduleId
          // })
          this.list[this.index].attendanceTypeId = this.attendanceTypeId;
          this.list[this.index].attendanceTime = res.data.attendanceTime;
        } else {
          this.$message({
            message: "修改失败",
            type: "warning"
          });
        }
      });
    },
    //点击说明修改
    updateRemark(params) {
      updateRemark(params).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.explainDialog = false;
        } else {
          this.$message({
            message: "修改失败",
            type: "warning"
          });
        }
      });
    },
    //查看说明
    attendExplain(row, attendanceTypeId) {
      this.explainDialog = true;
      this.attendanceTypeId = attendanceTypeId; //如果是改变状态，记录当前点中的状态
      this.scheduleId = row.scheduleId; //查询班级签到时用到
      this.index = row.index;
      //说明能否修改
      this.explainDialogType = row.explainDialogType;
      this.disabled = row.disabledType;

      getAttendExplain({
        classId: row.classId,
        studentId: row.studentId,
        id: row.id
      }).then(res => {
        if (res.status === 200) {
          this.remark = res.data.remark; //给弹框赋值
          if (row.attendanceTypeId === attendanceTypeId) {
            this.disabled = true;
          }
          //修改状态需要的字段
          this.updateAttendanceExplainParams = {
            id: row.id,
            orderCourseId: row.orderCourseId,
            attendanceNum: row.attendanceNum,
            attendanceTime: row.attendanceTime,
            orderId: row.orderId,
            attendanceTypeId: this.attendanceTypeId,
            classId: this.classId,
            date: this.courseInfo.date,
            remark: res.data.remark,
            studentId: res.data.studentId
          };
          //查看考勤需要的字段:
          this.updateRemarkObj = {
            id: row.id,
            remark: this.remark
          };
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    disableBeforeDate() {
      var date = new Date();
      for (var i = 0; i < this.list.length; i++) {
        //考勤签到页面，未购买该课次的学生，考勤状态按钮及情况说明按钮为灰色不可编辑；批量处理也不设置为“出勤”；this.list[i].isPurchase == 0
        if (
          this.list[i].attendanceTypeId == 3 ||
          this.list[i].isPurchase == 0 ||
          this.list[i].attendanceTypeId == 4
        ) {
          this.list[i].disabled = true;
        } else {
          this.list[i].disabled = false;
        }
        if (this.list[i].isPurchase == 0) {
          this.list[i].explainDialogType = "info";
          this.list[i].disabledType = true;
        } else {
          this.list[i].explainDialogType = "primary";
          this.list[i].disabledType = false;
        }
      }
    },
    getHeadInfo() {
      getHeadInfo().then(res => {
        if (res.status == 200) {
          //得到考勤状态为：非换班、退费、转课的数组
          res.data.attendanceTypes.forEach(element => {
            if (
              element.attendanceTypeName === this.attendanceTypeName[2] ||
              element.attendanceTypeName == this.attendanceTypeName[3] ||
              element.attendanceTypeName == this.attendanceTypeName[4]
            ) {
              this.attendanceType.push(element.attendanceTypeId);
            }
          });
        }
      });
    }
  },
  created() {
    this.getHeadInfo();
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
.el-row {
  margin-bottom: 0;
}
</style>
