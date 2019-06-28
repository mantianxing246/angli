<template>
  <div class="courseColor">
    <!-- <h3>录播、直播</h3> -->
    <el-table :data="liveList" border tip stripe highlight-current-row v-if="liveList.length>0">
      <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="startDate" width="150"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="150"></el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="120"></el-table-column>
    </el-table>

    <el-table
      :data="recordList"
      border
      tip
      stripe
      highlight-current-row
      class="margin-top20"
      v-if="recordList.length>0"
    >
      <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="startDate" width="150"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="150"></el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="120"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["recListCourse"],
  data () {
    return {
      selectCourse: [],
      liveList: [],
      recordList: []
    };
  },
  created () {
    // this.recListCourse
    //   ? this.recListCourse.forEach((element, index) => {
    //       this.selectCourse.push(element);
    //     })
    //   : null;
    if (this.recListCourse) {
      this.liveList = this.recListCourse.filter(v => {
        return v.courseProperty !== 2;
      });
      this.recordList = this.recListCourse.filter(v => {
        return v.courseProperty !== 3;
      });
    }
  },
  watch: {
    recListCourse (newVal) {
      // this.selectCourse = []
      // newVal.forEach((element, index) => {
      //   this.selectCourse.push(element)
      // });

      // this.selectCourse = JSON.parse(JSON.stringify(val))
      // this.$emit("update:choiceCourse", this.selectCourse)
      this.liveList = newVal.filter(v => {
        return v.courseProperty !== 2;
      });
      this.recordList = newVal.filter(v => {
        return v.courseProperty !== 3;
      });
    }
  }
};
</script>
<style scoped>
.courseColor {
  font-size: 15px;
}
.margin-top20 {
  margin-top:5px;
}
</style>

