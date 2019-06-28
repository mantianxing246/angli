<template>
  <div>
    <el-table :data="selectCourse" border tip stripe highlight-current-row class="margin-top10">
      <el-table-column label="已选课程列表" align="center">
        <el-table-column label="课程属性" align="center" prop="propertyName"></el-table-column>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
        <el-table-column label="开始日期" align="center" prop="beginDate"></el-table-column>
        <el-table-column label="结束日期" align="center" prop="endDate"></el-table-column>
        <el-table-column label="价格" align="center" prop="price"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="移除" placement="top">
              <i class="el-icon-delete" @click="deleteCourse(scope.$index)"/>
            </el-tooltip>
            <!--<span class="el-icon-delete" @click="deleteCourse(scope.$index)">移除</span>-->
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
      // startTimes: null,//开始次数
      // endTimes: null//结束次数
    }
  },
  props: ["choiceCourse"],
  methods: {
    deleteCourse (index) {
      this.selectCourse.splice(index, 1)
      this.$emit("changeSelectCourse", this.selectCourse)
    },
    //判断是否是正整数
    isNum (index, val, num) {
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (!reg.test(val)) {
        this.$tipsMessage("请输入正确的数字", "warning")
        this.$emit("changePass", false)
        return
      }

      //判断输入的课次只差是否超过总共课次
      if (this.selectCourse[index].endTimes > this.selectCourse[index].times) {
        this.$tipsMessage("所选课次必须小于所在课次之间", "warning")
        this.$emit("changePass", false)
        return
      }

      // //
      // this.selectCourse[index].price = parseFloat((this.selectCourse[index].endTimes - this.selectCourse[index].startTimes + 1)
      //   * this.selectCourse[index].unitPrice).toLocaleString()
      this.$emit("changeSelectCourse", this.selectCourse)
      this.$emit("changePass", true)
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
.margin-top10 {
  margin-top: 10px;
}
</style>
