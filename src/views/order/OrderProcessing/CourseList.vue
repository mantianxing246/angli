<template>
  <el-dialog :close-on-click-modal="false" 
    v-loading="true"
    :visible.sync="dialog"
    title="课程列表"
    width="60%"
    center
    highlight-current-row
    border
    fit
    stripe
  >
    <el-table
      style="width: 100%"
      border
      tip
      stripe
      highlight-current-row
      :data="course"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="课程名称" prop="courseName" align="center" min-width="310"></el-table-column>
      <el-table-column label="课程属性" prop="propertyName" align="center"></el-table-column>
      <el-table-column label="课程状态" prop="courseStatusName" align="center"></el-table-column>
    </el-table>

    <div slot="footer" style="margin-top:20px">
      <el-button @click="dialog=false">取消</el-button>
      <el-button type="primary" @click="getSelectCourse">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "CourseList",
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectCourse: []
    }
  },
  methods: {
    getSelectCourse () {
      if (this.selectCourse.length <= 0) {
        this.$tipsMessage("请选择要退费的课程", "warning");
        return;
      }
      let orderCourseIdArr = []
      for (let i = 0;i < this.selectCourse.length;i++) {
        orderCourseIdArr.push(this.selectCourse[i].orderCourseId)
      }
      this.$emit("getSelectCourse", orderCourseIdArr)
      this.dialog = false
    },
    selectChange (val) {
      this.selectCourse = val
    }
  },
  computed: {
    dialog: {
      set (val) {
        this.$emit('update:dialogShow', val)
      },
      get () {
        return this.dialogShow
      }
    }
  },
  props: ['dialogShow', 'course']
}
</script>
