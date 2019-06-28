<template>
  <div class="courseColor">
    <!-- <h3>非学科</h3> -->
    <el-table :data="selectCourse" border tip stripe highlight-current-row class="margin-top20">
      <el-table-column label="课程属性" align="center" prop="propertyName" width="100"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="beginDate" width="150"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="150"></el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="120"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectCourse: []
    }
  },
  props: ["nonSubjectListCourse"],
  created () {
    this.nonSubjectListCourse ? this.nonSubjectListCourse.forEach((element, index) => {
      this.selectCourse.push(element)
      this.selectCourse[index].buyTimes = element.endTimes - element.startTimes + 1
    }) : null;
  },
  watch: {
    nonSubjectListCourse (newVal) {
      this.selectCourse = []
      newVal.forEach((element, index) => {
        this.selectCourse.push(element)
        this.selectCourse[index].buyTimes = element.endTimes - element.startTimes + 1
      });
    }
  }
}
</script>
<style scoped>
.courseColor {
  font-size: 15px;
}
</style>
