<template>
  <div>
    <el-table
      :data="selectCourse"
      border
      tip
      stripe
      highlight-current-rowv-loading="loading"
    >
      <el-table-column label="已选课程列表" align="center">
        <el-table-column label="课程属性" align="center" prop="coursePropertyName"></el-table-column>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
        <el-table-column label="开始日期" align="center" prop="startDate"></el-table-column>
        <el-table-column label="结束日期" align="center" prop="endDate"></el-table-column>
        <el-table-column label="课次" align="center" prop="buyTimes"></el-table-column>
        <el-table-column label="开始课次" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.startTimes"
              clearable
              @input="isNum(scope.$index,scope.row.startTimes,1)"
              :maxlength="3"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="结束课次" ainputlign="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.endTimes"
              clearable
              @input="isNum(scope.$index,scope.row.endTimes,2)"
              :maxlength="3"
            ></el-input>
          </template>
        </el-table-column>
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
      startTimes: null,//开始次数
      endTimes: null,//结束次数
      loading: false,
    }
  },
  props: ["choiceCourse"],
  methods: {
    deleteCourse (index) {
      this.selectCourse.splice(index, 1)
      //这里判断如果开始课次和结束课次输入不正确，但是将这个错误的删除，则能够通过
      var reg = /^[0-9]*[1-9][0-9]*$/
      for (var i = 0;i < this.selectCourse.length;i++) {
        if (!reg.test(this.selectCourse[i].startTimes) || !reg.test(this.selectCourse[i].endTimes)) {
          this.$emit("changePass", false)//判断是否满足条件，不满足则返回false,否则返回true
          break
        }
        if (this.selectCourse[i].endTimes < this.selectCourse[i].startDate) {
          this.$emit("changePass", false)
          break
        }
        if (this.selectCourse[i].endTimes > this.selectCourse[i].times) {
          this.$emit("changePass", false)
          break
        }
      }
      if (i >= this.selectCourse.length) {
        this.$emit("changePass", true)
      }

      this.$emit("changeSelectCourse", this.selectCourse)
    },
    //判断是否是正整数
    isNum (index, val, num) {
      var reg = /^[0-9]*[1-9][0-9]*$/
      if (!reg.test(val)) {
        this.$tipsMessage("请输入正确的数字", "warning")
        this.$emit("changePass", false)//判断是否满足条件，不满足则返回false,否则返回true
        return
      }

      //num中1代表开始课次，num中2代表结束课次
      if (num == 1) {
        // console.log(this.selectCourse[index].endTimes)
        //   console.log(val)
        if (Number(this.selectCourse[index].endTimes) < Number(val)) {
          this.$tipsMessage("输入的开始课次不能大于结束课次", "warning")
          this.$emit("changePass", false)
          return
        }
      } else if( num == 2 ) {
        //  console.log(this.selectCourse[index].startTimes)
        //   console.log(val)
        //   console.log(this.selectCourse[index].startTimes > Number(val))
        if (Number(this.selectCourse[index].startTimes) > Number(val)) {
          this.$tipsMessage("输入的结束课次要大于开始课次", "warning")
          this.$emit("changePass", false)
          return
        }
      }

      //判断输入的课次之差是否超过总共课次
      if (this.selectCourse[index].endTimes > this.selectCourse[index].times) {
        this.$tipsMessage("所选课次必须小于所在课次之间", "warning")
        this.$emit("changePass", false)
        return
      }

      //得到所选的课次的价格
      this.selectCourse[index].price = parseFloat((this.selectCourse[index].endTimes - this.selectCourse[index].startTimes + 1)
        * this.selectCourse[index].unitPrice).toLocaleString()
      //得到所选的课次
      this.selectCourse[index].buyTimes = this.selectCourse[index].endTimes - this.selectCourse[index].startTimes + 1
      //将改变的结果给父组件
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
.margin-top20 {
  margin-top: 20px;
}
</style>
