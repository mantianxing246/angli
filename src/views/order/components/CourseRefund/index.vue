<template>
  <div>
    <p class="font">{{title}}</p>
    <el-table highlight-current-row border fit stripe :data="getCourse" style="width: 100%;">
      <el-table-column label="课程属性" align="center" prop="propertyName"/>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
      <el-table-column label="课程类型" align="center" prop="courseType"/>
      <el-table-column label="课程状态" align="center" prop="statusName"/>
      <el-table-column label="开始日期" align="center" prop="startDate"/>
      <el-table-column label="结束日期" align="center" prop="endDate"/>
      <el-table-column label="剩余金额" align="center" prop="residueAmount"/>
      <el-table-column label="退费金额" align="center" width="140">
        <template slot-scope="scope">
          - <el-input v-model="scope.row.refundAmount" style="width:70%" clearable @change="changeAmount"/> 元
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "CourseRefundTable",
  data () {
    return {
      getCourse: []
    }
  },
  methods: {
    changeAmount (val) {
     let reg = /^[0-9]*$/;
      if (!reg.test(val)) {
        this.$tipsMessage('请输入数字', 'warning')
        return
      }

      switch (this.title) {
        case "录播、直播课程：":
          this.$emit("changeAmount", this.getCourse, 2)
          break
        case "在线个性化课程：":
          this.$emit("changeAmount", this.getCourse, 4)
          break
        case "非学科课程：":
          this.$emit("changeAmount", this.getCourse, 5)
          break
        case "其他课程：":
          this.$emit("changeAmount", this.getCourse, 6)
          break
      }
    }
  },
  created () {
    this.getCourse = JSON.parse(JSON.stringify(this.course))
  },
  props: ['title', 'course']
}

</script>
<style scoped>
.font{
  display: block;
    font-size: 0.9em;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
}
</style>

