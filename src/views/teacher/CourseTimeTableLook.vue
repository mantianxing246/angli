<!--
 * @author wufan
 * @date 2019/1/8
-->
<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item label="教师姓名">{{teacherName}}</el-form-item>
      <el-form-item label="上课日期" prop="beginDate" class="label-width-110">
        <el-date-picker
          v-model="selectTimer"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          unlink-panels
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectCourseTime">搜索</el-button>
        <!-- <el-button type="primary">课表导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      border
      fit
      stripe
      style="width: 100%;"
    >
      <el-table-column label="日期" align="center" prop="beginTime"/>
      <el-table-column label="上课时段" align="center" prop="timeGap"/>
      <el-table-column label="校区" align="center" prop="campusName"/>
      <el-table-column label="课程名称" align="center" prop="courseName"/>
      <el-table-column label="班级名称" align="center" prop="className"/>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="getTeacherList"
    />
  </div>
</template>

<script>
import { findTimetable } from '@/api/teacher/TeacherMgtApi'

export default {
  name: 'CourseTimeTableLook',
  data () {
    return {
      list: [],
      listLoading: '',
      teacherName: sessionStorage.teacherName,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        teacherId: null,
        beginTime: null,
        endTime: null
      },
      total: 0,//一共有多少数据
      selectTimer: ""//选择日期
    }
  },
  components: {
  },
  methods: {
    getTeacherList () {
      this.findTimetable()
    },
    findTimetable () {
      this.listQuery.teacherId = this.$route.params.teacherId
      findTimetable(this.listQuery).then((res) => {
        if (res.status == 200) {
          this.list = res.data.list
          this.total = res.data.total
          this.listQuery.pageNum = res.data.pageNum
          this.listQuery.pageSize = res.data.pageSize
        }
      })
    },
    selectCourseTime () {
      if (this.selectTimer) {
        this.listQuery.beginTime = this.selectTimer[0]
        this.listQuery.endTime = this.selectTimer[1]
      } else {
        this.listQuery.beginTime = ''
        this.listQuery.endTime = ''
      }
      this.findTimetable();
    }
  },
  created () {
    this.findTimetable();
  }
}
</script>-->

