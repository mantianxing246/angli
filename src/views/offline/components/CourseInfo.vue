<template>
  <div>
    <card-container :paddingValue="10">
      <template slot="body">
        <div style="font-size:20px;margin-bottom:20px">课程信息:</div>
        <div class="courseInfoClass">
          <span>校区:&nbsp;&nbsp;{{courseInfo.campusName}}</span>
          <span>课程名称:&nbsp;&nbsp;{{courseInfo.courseName}}</span>
          <span>班级名称:&nbsp;&nbsp;{{courseInfo.className}}</span>
          <span>班主任:&nbsp;&nbsp;{{courseInfo.userName}}</span>
          <!-- <span>上课教师:&nbsp;&nbsp;{{courseInfo.teacherName}}</span> -->
        </div>
      </template>
    </card-container>
  </div>
</template>
<script>
import { findOfflnAttendance, getAttendClass, updataAttendance, getAttendExplain } from '@/api/offline/OfflnStuClsMgt'

export default {
  name: "CourseInfo",
  props: ["info"],
  data () {
    return {
      courseInfo: {
        campusName: null,
        courseName: null,
        className: null,
        userName: null,
        teacherName: null
      }
    }
  },
  methods: {
    //获取课程信息
    getAttendCourse () {
      // console.log(this.info)
      let classId = null
      if (this.info.oldClassId) {
        classId = this.info.oldClassId
      } else {
        classId = this.info.classId
      }
      findOfflnAttendance(classId, this.info.studentId).then(res => {
        if (res.status === 200) {
          this.courseInfo = res.data
          this.$emit("sendCampusId", this.courseInfo.campusId)//传campusId
          this.$emit("sendUserId", this.courseInfo.userId)//传campusId
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    }
  },
  created () {
    this.getAttendCourse()
  }
}
</script>
<style scoped>
.courseInfoClass > span {
  margin-right: 20px;
}
</style>