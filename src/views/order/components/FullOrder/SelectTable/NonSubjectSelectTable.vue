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
      <el-table-column align="center" type="selection">
        <!-- <template slot-scope="scope" align="center">
          <el-checkbox @change="changeBox" :label="scope.row.courseName"></el-checkbox>
        </template>-->
      </el-table-column>
      <el-table-column label="课程属性" align="center" prop="propertyName"></el-table-column>
      <el-table-column prop="courseName" label="可选课程" align="center" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="beginDate"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType"></el-table-column>
      <el-table-column label="价格" align="center" prop="price"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="margin-top5">
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
      index: 0
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
      // console.log(this.$emit("selectCourse"))
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
.margin-top5 {
  margin-top: 5px;
}
</style>