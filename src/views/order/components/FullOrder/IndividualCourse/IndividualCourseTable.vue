<template>
  <div class="courseColor">
    <el-table :data="selectCourse" border tip stripe highlight-current-row class="margin-top20">
      <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="课时" align="center" prop="hours" width="80"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="startDate" width="150"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="150"></el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="120"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["individuaListCourse"],
  data () {
    return {
      selectCourse: []
    }
  },
  created () {
    this.individuaListCourse ? this.individuaListCourse.forEach((element, index) => {
      this.selectCourse.push(element)
    }) : null;
  },
  watch: {
    individuaListCourse (newVal) {
      this.selectCourse = []
      newVal.forEach((element, index) => {
        this.selectCourse.push(element)
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
