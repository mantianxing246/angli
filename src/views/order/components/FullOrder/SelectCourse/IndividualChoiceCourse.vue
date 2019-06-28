<template>
  <div>
    <el-table :data="selectCourse" border tip stripe highlight-current-row>
      <el-table-column label="已选课程列表" align="center">
        <el-table-column label="课程属性" align="center" prop="coursePropertyName"></el-table-column>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
        <el-table-column label="开始日期" align="center" prop="startDate" min-width="150"></el-table-column>
        <el-table-column label="结束日期" align="center" prop="endDate" min-width="150"></el-table-column>
         <!-- <el-table-column label="开始日期" align="center" width="200">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              :disabled="scope.row.startDateFlag"
              v-model="scope.row.startDate"
              style="width:150px"
              @change="changeDatePicker"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" align="center" width="200">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              :disabled="scope.row.endDateFlag"
              v-model="scope.row.endDate"
              value-format="yyyy-MM-dd"
              style="width:150px"
              @change="changeDatePicker"
            ></el-date-picker>
          </template>
        </el-table-column> -->
        <el-table-column label="课时" align="center" prop="hours"></el-table-column>
        <el-table-column label="价格" align="center" prop="price"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="移除" placement="top">
              <i class="el-icon-delete" @click="deleteCourse(scope.$index)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectCourse: [],
      startTimes: null,//开始次数
      endTimes: null//结束次数 
    }
  },
  props: ["choiceCourse"],
  methods: {
    deleteCourse (index) {
      this.selectCourse.splice(index, 1)
      this.$emit("changeSelectCourse", this.selectCourse)
    },
     changeDatePicker () {
      this.$emit("changeSelectCourse", this.selectCourse)
    }
  },
  watch: {
    choiceCourse: {
      handler (val) {
        this.selectCourse = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.margin-top20 {
  margin-top: 20px;
}
</style>