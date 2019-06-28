<template>
  <div>
    <el-table :data="selectCourse" border tip stripe highlight-current-row>
      <el-table-column label="已选课程列表" align="center">
        <el-table-column label="课程属性" align="center" prop="propertyName" min-width="100"></el-table-column>
        <el-table-column label="赠送课程" align="center" prop="courseName" min-width="310"></el-table-column>
        <el-table-column label="开始日期" align="center" min-width="150">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              v-model="scope.row.startDate"
              style="width:150px"
              @change="changeDatePicker"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" align="center" min-width="150">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              v-model="scope.row.endDate"
              value-format="yyyy-MM-dd"
              style="width:150px"
              @change="changeDatePicker"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="移除" placement="top">
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
  data() {
    return {
      selectCourse: [],
      startTimes: null, //开始次数
      endTimes: null //结束次数
    };
  },
  props: ["choiceCourse"],
  methods: {
    deleteCourse(index) {
      this.selectCourse.splice(index, 1);
      this.$emit("changeSelectCourse", this.selectCourse);
      // this.$emit("update:choiceCourse", this.selectCourse)
    },
    changeDatePicker() {
      this.$emit("changeSelectCourse", this.selectCourse);
    }
  },
  created() {
    this.choiceCourse.length>0
      ? this.choiceCourse.forEach((element, index) => {
          this.selectCourse.push(element);
        })
      : null;
  },
  watch: {
    choiceCourse: {
      handler(val) {
        this.selectCourse=[]
        this.choiceCourse.length>0
          ? this.choiceCourse.forEach((element, index) => {
              this.selectCourse.push(element);
            })
          : null;
      }
    }
  }
};
</script>
<style scoped>
.margin-top20 {
  margin-top: 20px;
}
</style>
