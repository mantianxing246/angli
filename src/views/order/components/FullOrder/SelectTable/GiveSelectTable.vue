<template>
  <div>
    <el-table
      :data="selectCourses"
      border
      tip
      stripe
      highlight-current-row
      align="center"
      ref="table"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" width="55"></el-table-column> 
      <el-table-column label="课程属性" align="center" prop="propertyName"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType" min-width="150"></el-table-column>
      <el-table-column label="可赠送课程" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="版本" align="center" prop="version"></el-table-column>
      <!-- <el-table-column label="年级" align="center" prop="gradeName"></el-table-column> -->
      <el-table-column label="课程价格" align="center" prop="totalPrice"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin:10px 0;">
      <el-col :span="2">
        <el-button type="primary" @click="insertCourse" icon="el-icon-shopping-cart-full">加入课程列表</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      course: [],
    }
  },
  props: ["listCourse"],
  methods: {
    selectChange (val) {
      this.course = JSON.parse(JSON.stringify(val))

      if (this.course.length > 0) {
        for (let i = 0;i < this.listCourse.length;i++) {
          if (this.course[0].courseName == this.listCourse[i].courseName && this.course[0].courseProperty == this.listCourse[i].courseProperty) {
            this.index = i
          }
        }
      }
    },
    insertCourse () {
      if (this.course.length == 0) {
        this.$tipsMessage("请选择要加入的课程", "warning")
        return
      }

      let courseArray = this.course
      this.selectCourses.splice(this.index, this.course.length)
      this.$emit("selectCourse", courseArray)
      // this.selectCourses.splice(0, this.selectCourses.length)
    }
  },
  computed: {
    selectCourses: {
      get () {
        return this.listCourse
      },
      set () {

      }
    }
  }
}
</script>
<style scoped>
.margin-top20 {
  margin-top: 20px;
}
</style>