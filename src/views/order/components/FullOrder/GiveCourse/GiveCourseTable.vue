<template>
  <div class="courseColor"> 
    <h3>赠送课程</h3>
    <el-table :data="selectCourse" border tip stripe highlight-current-row class="margin-top20">
      <el-table-column label="课程属性" align="center" width="100">
        <template slot-scope="scope">{{scope.row.propertyName?scope.row.propertyName:scope.row.coursePropertyName}}</template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="startDate" width="150"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="150"></el-table-column>
      <el-table-column label="价格" align="center" width="120" >
        <template slot-scope='scope'>
          {{scope.row.totalPrice?scope.row.totalPrice:scope.row.price}}  
        </template>  
      </el-table-column> 
    </el-table>
  </div>
</template>
<script>
export default {
  name: "giveCourse",
  data () {
    return {
      selectCourse: []
    }
  },
  props: ["giveCourse"],
  created () {
    this.giveCourse ? this.giveCourse.forEach((element, index) => {
      this.selectCourse.push(element)
    }) : null;
  },
  watch: {
    giveCourse (newVal) {
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
  margin-top: -8px;
}
.margin-top20{
  margin-top:-10px;
}
</style>
