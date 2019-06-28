<template>
  <div>
    <el-table
      :data="recordList"
      border
      tip
      stripe
      highlight-current-row
      class="margin-top"
      v-if="recordList.length>0"
    >
      <el-table-column label="已选课程列表" align="center">
        <el-table-column label="课程属性" align="center" prop="coursePropertyName"></el-table-column>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
        <el-table-column label="开始日期" align="center" width="200">
          <template slot-scope="scope">
            <!-- <el-date-picker
              type="date"
              :disabled="scope.row.startDateFlag"
              v-model="scope.row.startDate"
              style="width:150px"
              @change="changeDatePicker"
              value-format="yyyy-MM-dd"
            ></el-date-picker>-->
            <span>{{scope.row.startDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" align="center" width="200">
          <template slot-scope="scope">
            <!-- <el-date-picker
              type="date"
              :disabled="scope.row.endDateFlag"
              v-model="scope.row.endDate"
              value-format="yyyy-MM-dd"
              style="width:150px"
              @change="changeDatePicker"
            ></el-date-picker>-->
            <span>{{scope.row.endDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" prop="price"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="移除" placement="top">
              <i class="el-icon-delete" @click="deleteCourse(scope.$index,'recordList')"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      :data="liveList"
      border
      tip
      stripe
      highlight-current-row
      class="margin-top" style="margin-top:5px;"
      v-if="liveList.length>0"
    >
      <el-table-column label="课程属性" align="center" prop="coursePropertyName"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" width="200">
        <template slot-scope="scope">
          <!-- <el-date-picker
              type="date"
              :disabled="scope.row.startDateFlag"
              v-model="scope.row.startDate"
              style="width:150px"
              @change="changeDatePicker"
              value-format="yyyy-MM-dd"
          ></el-date-picker>-->
          <span>{{scope.row.startDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" width="200">
        <template slot-scope="scope">
          <!-- <el-date-picker
              type="date"
              :disabled="scope.row.endDateFlag"
              v-model="scope.row.endDate"
              value-format="yyyy-MM-dd"
              style="width:150px"
              @change="changeDatePicker"
          ></el-date-picker>-->
          <span>{{scope.row.endDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="price"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="移除" placement="top">
            <i class="el-icon-delete" @click="deleteCourse(scope.$index,'liveList')"/>
          </el-tooltip>
        </template>
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
      endTimes: null,//结束次数
      liveList: [],
      recordList: []
    }
  },
  props: ["choiceCourse"],
  methods: {
    deleteCourse (index, key) {
      this[key].splice(index, 1)
      this.selectCourse = this.liveList.concat(this.recordList)
      this.$emit("changeSelectCourse", this.selectCourse)
      // this.$emit("update:choiceCourse", this.selectCourse) 
    },
    changeDatePicker () {
      this.selectCourse = this.liveList.concat(this.recordList)
      this.$emit("changeSelectCourse", this.selectCourse)
    }
  },
  watch: {
    choiceCourse: {
      handler (val) {
        this.selectCourse = JSON.parse(JSON.stringify(val))
        // this.$emit("update:choiceCourse", this.selectCourse)
        this.liveList = this.selectCourse.filter(v => {
          return v.courseProperty !== 2;
        });
        this.recordList = this.selectCourse.filter(v => {
          return v.courseProperty !== 3;
        });
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.margin-top {
  margin-top: 10px;
}
</style>