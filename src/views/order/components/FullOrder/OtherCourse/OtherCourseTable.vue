<template>
  <div class="courseColor">
    <!-- <h3>其他</h3> -->
    <el-table :data="selectCourse" border tip stripe highlight-current-row class="margin-top20">
      <el-table-column label="课程属性" align="center" prop="propertyName" width="100">
        <template slot-scope="scope">{{scope.row.propertyName?scope.row.propertyName:scope.row.coursePropertyName}}</template>
      </el-table-column>
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
  props: ["otherListCourse"],
  created () {
    this.otherListCourse ? this.otherListCourse.forEach((element, index) => {
      this.selectCourse.push(element)
    }) : null;
  },
  watch: {
    otherListCourse (newVal) {
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
