/*
@author Andy
@date 2019/1/18
*/
<template>
  <div class="font-color">
    <card-container :paddingValue="10">
      <template slot="body">
        <div class="out" style="display:flex;">
          <p>
            <span class="font">学员ID</span>
            <span class="left">{{ student.userId }}</span>
            <span class="font" style="margin-left:35px;">学员姓名</span>
            <span class="left">{{ student.name }}</span>
            <span class="font" style="margin-left:20px;">高考年份</span>
            <span class="left">{{ student.grade }}</span>
          </p>
          <p>
            <span class="font" style="margin-left:15px;">地区</span>
            <span class="left">{{ student.districtName}}</span>
            <span class="font" style="margin-left:20px;">学校</span>
            <span class="left">{{ student.schoolName }}</span>
            <span class="font" style="margin-left:10px;">手机</span>
            <span class="left">{{ student.mobile }}</span>
          </p>
        </div>
      </template>
    </card-container>
  </div>
</template>
<script>
import { findStudent } from '@/api/order/StudentApi'
export default {
  name: 'StudentInfo',
  props: ['studentId'],
  data () {
    return {
      student: {
        userId: '',
        grade: '',
        districtName: '',
        schoolName: '',
        mobile: ''
      }
    }
  },
  computed: {
  },
  mounted () {
    this.findStudentInfo()
  },
  methods: {
    findStudentInfo () {
      findStudent({ studentId: this.studentId }).then(response => {
        if (response.status === 200) {
          this.student = response.data.list[0]
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
div.out {
  text-align: center;
}

div.inTable {
  text-align: center;
}
.font {
  color: rgba(0, 0, 0, 0.85);
  display: inline-block;
  font-weight: 700;
}
.te {
  display: inline-block;
  width: 100px;
}
.left {
  color: rgba(0, 0, 0, 0.8);
  display: inline-block;
  text-align: left;
  margin-right: 15px;
}
p {
  text-align: left;
  margin: 0px;
}
span {
  display: inline-block;
}
.out span {
  font-size: small;
}
</style>
