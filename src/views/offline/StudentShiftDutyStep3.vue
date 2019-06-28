<template>
  <div class="app-container">
    <!-- 课程信息 -->
    <course-info style="margin-bottom:20px" :info="params"></course-info>

    <div style="margin-bottom:20px">剩余转出课次:{{retrunCours}}</div>

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
          @select="selectionChange"
          @select-all="selectAll"
          ref="table"
        >
          <el-table-column type="selection" align="center" :selectable="selectable"></el-table-column>
          <el-table-column label="课次" align="center" prop="attendanceNum"></el-table-column>
          <el-table-column label="上课日期" align="center" prop="date"></el-table-column>
          <el-table-column label="上课时段" align="center" prop="timeGap"></el-table-column>
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
        <el-button type="primary" @click="$router.go(-1)">上一步</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="updateChangClass">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CourseInfo from "./components/CourseInfo"
import { findOfflnClass, updateChangClass } from '@/api/offline/OfflnStuClsMgt'


export default {
  name: "StudentShiftDutyStep1",
  data () {
    return {
      step: 3,
      classId: null,
      courseId: null,
      list: [],
      selectCourse: [],//选择的课程
      retrunCours: null,//一共能转出的课次
      beforeReturnCourse: null,//转出的课次保存
      params: {
        classId: null,
        courseId: null,
        oldClassId: null
      },//查询需要的字段对象
      selecCourse: [],
      userId: null
    }
  },
  methods: {
    //换班插入查询
    findOfflnClass () {
      findOfflnClass(this.params).then((res) => {
        if (res.status == 200) {
          this.list = res.data
        } else {
          this.$tipsMessage(res.message, "warning")
        }
      })
    },
    selectAll (selection) {
      //能够选中的次数
      this.retrunCours = this.beforeReturnCourse - selection.length <= 0 ? 0 : this.beforeReturnCourse - selection.length
      this.selectCourse = this.list
      if (this.beforeReturnCourse - selection.length < 0) {
        this.$tipsMessage("剩余转出课次数不足", 'warning')
        this.$refs.table.clearSelection()
      }
    },
    selectionChange (row) {
      //能够选中的次数
      this.retrunCours = this.beforeReturnCourse - row.length <= 0 ? 0 : this.beforeReturnCourse - row.length
      //用于存放不能够选择的内容
      var course = []
      if (this.beforeReturnCourse - row.length < 0) {//判断是否符合条件，不符合弹出警告
        this.$tipsMessage("剩余转出课次数不足", 'warning')
        for (var i = 0;i < this.list.length;i++) {
          for (var j = 0;j < this.selectCourse.length;j++) {
            if (this.list[i].classId == this.selectCourse[j].classId
              && this.list[i].attendanceNum == this.selectCourse[j].attendanceNum
              && this.list[i].timeGap == this.selectCourse[j].timeGap) {
              break
            }
          }
          if (j >= this.selectCourse.length) {
            course.push(this.list[i])
          }
        }
        //设置不能选中的复选框，通过false
        for (let i = 0;i < course.length;i++) {
          this.$refs.table.toggleRowSelection(course[i], false)
        }
      } else {//符合条件能够选中复选框，并且把选中的赋值给selectCourse
        this.selectCourse = JSON.parse(JSON.stringify(row))
      }
    },
    updateChangClass () {
      if (this.selectCourse.length == 0) {
        this.$message("请选择转出课程", "warning")
        return
      }
      if (this.retrunCours != 0) {
        this.$message("转入课程数量要和转出课程数量一致", "warning")
        return
      }
      var attendanceNum = [], scheduleId = [], beginTime = []
      this.selectCourse.filter((item) => {
        attendanceNum.push(item.attendanceNum)
        scheduleId.push(item.scheduleId)
        beginTime.push(item.beginTime)
        return true
      })
      let attendanceIdList = JSON.parse(localStorage.getItem("attendanceIdList"))
      updateChangClass(Object.assign({
        studentId: parseInt(this.$route.query.studentId),
        courseId: parseInt(this.courseId),
        newCourseId: parseInt(this.newCourseId),
        classId: parseInt(this.$route.query.classId),
        attendanceNum: attendanceNum,
        scheduleIds: scheduleId,
        beginDates: beginTime,
        attendanceTypeId: 2
        // userId: this.userId
      }, attendanceIdList)).then((res) => {
        if (res.status == 200) {
          this.$tipsMessage("换班成功!", "success")
          this.retrunCours = this.retrunCours - this.selectCourse.length
          this.$router.push("/OfflineMgt/StudentMgt")
        } else {
          this.$tipsMessage(res.message, "warning")
        }
      })
    },
    //复选框是否可以勾选
    selectable (row, index) {
      let date = new Date()
      let classDate = new Date(row.date + "T" + row.timeGap.split("-")[0])
      if (classDate.getTime() - date.getTime() < 0||row.isChange===1) {
        return false
      } else {
        return true
      }
    },
    back () {
      this.$router.push("/OfflineMgt/StudentMgt")
    }
  },
  created () {
    this.newCourseId = this.$route.query.newCourseId
    this.classId = this.$route.query.classId
    this.beforeReturnCourse = this.$route.query.retrunCours
    this.retrunCours = this.beforeReturnCourse
    this.courseId = this.$route.query.courseId
    this.params = {
      classId: this.classId,
      courseId: this.newCourseId,
      scheduleId: this.$route.query.scheduleId,
      studentId: this.$route.query.studentId,
      oldClassId: this.$route.query.oldClassId,
      orderId:this.$store.getters.studentDutySelect[0].orderId
    }
    this.findOfflnClass()
  },
  components: {
    CourseInfo
  }
}
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
.disabled {
  pointer-events: none;
}
</style>