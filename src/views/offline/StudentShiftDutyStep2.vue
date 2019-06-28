<template>
  <div class="app-container">
    <div style="margin-bottom:20px" class="x-block2">选择班级</div>
    <card-container>
      <template slot="body">
        <el-table highlight-current-row border fit center stripe style="width: 100%" :data="course">
          <el-table-column label="课程" align="center">
            <template slot-scope="scope">
              <div>
                <el-radio
                  v-model="radioValue"
                  @change="selectCourse(scope.$index,scope.row)"
                  :label="scope.$index"
                >{{scope.row.courseName}}</el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="班级" align="center" prop="className"></el-table-column>
          <el-table-column label="校区" align="center" prop="campusName"></el-table-column>
          <el-table-column label="学科" align="center" prop="subjectName"></el-table-column>
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
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </el-col>
    </el-row>
  </div>
</template> 
<script>
import CourseInfo from "./components/CourseInfo"
import { findOfflnChangeClass, findUnitPrice } from '@/api/offline/OfflnClassMgtApi'

export default {
  name: "StudentShiftDutyStep1",
  data () {
    return {
      step: 2,
      radioValue: null,
      radioRow: null,//单选选中的行
      course: [],
      courseId: null,//课程id
      campusId: null,//地区id
      classId: null
    }
  },
  methods: {
    selectCourse (index, row) {
      this.radioRow = row
    },
    // 查询符合的课程  
    //year=2024&gradeId=1&campusId=1&courseId=16&unitPrice=600
    findOfflnChangeClass (params) {
      findOfflnChangeClass(params).then((res) => {
        if (res.status == 200) {
          this.course = res.data
          if(this.course.length==0){
             this.$tipsMessage("请重新选择，没有符合条件的班级", "warning")
          }
        } else {
          this.$tipsMessage(res.message, "warning")
        }
      })
    },
    //换班查询钱和高考年份和gradeId
    findUnitPrice () {
      this.courseId = this.$route.query.courseId
      this.campusId = this.$route.query.campusId
      findUnitPrice(this.courseId).then((res) => {
        if (res.status == 200) {
          //year=2019&unitPrice=100&gradeId=6&campusId=1&courseId=93
          this.findOfflnChangeClass({
            version: res.data.version,
            gradeId: res.data.gradeId,
            campusId: this.$route.query.campusId,
            totalPrice: res.data.totalPrice,
            classId: this.$route.query.classId,
            // year: 2024,
            // unitPrice: 600,
            // gradeId: 1,
            // campusId: 1,
            courseId: this.courseId
          })
        }
      })
    },
    //下一步
    nextStep () {
      if (!this.radioRow.courseId) {
        this.$tipsMessage("请选择班级", "warning");
        return
      }
      if(this.radioRow.actualNum>=this.radioRow.maxNum){
        this.$tipsMessage("新班级人数已满，请选择其他班级", "warning");
        return
      }
      this.$store.dispatch("SELECTRADIOVALUE",this.radioValue)
      this.$store.dispatch("radioRow",this.radioRow)

      this.$router.push({
        path: '/OfflineMgt/StudentShiftDutyStep3',
        query: {
          newCourseId: this.radioRow.courseId,
          classId: this.radioRow.classId,
          oldClassId: this.$route.query.classId,
          retrunCours: this.$route.query.retrunCours,
          courseId: this.courseId,
          studentId: this.$route.query.studentId,
          orderCourseId: this.$route.query.orderCourseId,
          orderId: this.$route.query.orderId
        }
      })
    },
    //返回
    back () {
      this.$router.push("/OfflineMgt/StudentMgt")
    }
  },
  created () {
    this.findUnitPrice()
    this.radioValue=this.$store.getters.selectRadioValue
    this.radioRow=this.$store.getters.radioRow
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