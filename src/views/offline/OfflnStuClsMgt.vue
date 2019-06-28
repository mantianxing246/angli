<template >
  <div class="app-container">
    <div class="search-head">
      <el-select
        v-model="listQuery.provinceId"
        clearable
        placeholder="省市"
        style="width:75px"
        class="search-head"
      >
        <el-option
          v-for="item in provinces"
          :value="item.provinceId"
          :label="item.provinceName"
          :key="item.provinceId"
        />
      </el-select>
      <!-- <el-select
        v-model="listQuery.year"
        placeholder="中高考年份"
        clearable
        style="width:110px"
        class="search-head"
      >
        <el-option v-for="item in years" :value="item" :key="item"/>
      </el-select>-->
      <el-select
        v-model="listQuery.version"
        placeholder="版本"
        clearable
        style="width:75px"
        class="search-head"
      >
        <el-option v-for="item in versions" :value="item" :key="item"/>
      </el-select>
      <el-select
        v-model="listQuery.gradeId"
        placeholder="年级"
        clearable
        style="width:75px"
        class="search-head"
      >
        <el-option
          v-for="item in grades"
          :value="item.gradeId"
          :key="item.gradeId"
          :label="item.gradeName"
        />
      </el-select>
      <el-select
        v-model="listQuery.subjectId"
        placeholder="学科"
        clearable
        style="width:75px"
        class="search-head"
      >
        <el-option
          v-for="item in subjects"
          :value="item.subjectId"
          :key="item.subjectId"
          :label="item.subjectName"
        />
      </el-select>
      <el-select
        v-model="listQuery.courseType"
        placeholder="课程类型"
        clearable
        style="width:95px"
        class="search-head"
      >
        <el-option :value="item" v-for="(item,index) in offlineCourseType" :key="index"/>
      </el-select>
      <el-select
        v-model="listQuery.coursePeriodId"
        placeholder="阶段"
        clearable
        style="width:75px"
        class="search-head"
      >
        <el-option
          v-for="item in coursePeriods"
          :value="item.coursePeriodId"
          :key="item.coursePeriodId"
          :label="item.coursePeriodName"
        />
      </el-select>
      <el-select
        v-model="listQuery.campusId"
        placeholder="校区"
        clearable
        style="width:100px"
        class="search-head"
      >
        <el-option
          v-for="item in campuses"
          :value="item.campusId"
          :key="item.campusId"
          :label="item.campusName"
        />
      </el-select>
      <el-input
        v-model="listQuery.className"
        :maxlength="50"
        placeholder="班级名称"
        :style="{width:$selectConfig.classNameWidth+'px'}"
        clearable
        @change="changeClass"
        class="search-head"
      />
      <el-date-picker
        v-model="selectTimer"
        type="daterange"
        range-separator="-"
        start-placeholder="课表开始日期"
        end-placeholder="课表结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-search"
        @click="findAllOfflnAttendanceList"
        class="search-head"
      >搜索</el-button>
    </div>
    <card-container>
      <template slot="body">
        <el-table v-loading="loading" :data="list" border fit stripe>
          <el-table-column label="日期" align="center" prop="date" width="90px"/>
          <el-table-column label="上课时段" align="center" prop="timeGap" width="90px"/>
          <el-table-column label="校区" align="center" prop="campusName" width="80px"/>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="310px"/>
          <el-table-column label="班级名称" align="center" prop="className" width="310px"/>
          <!-- <el-table-column label="班主任" align="center" prop="userName"/> -->
          <el-table-column label="上课教师" align="center" prop="teacherName" width="80px"/>
          <el-table-column label="操作" align="center" prop="classId" width="80px">
            <template slot-scope="scope" style="display: flex;justify-content: space-between">
              <div class="czSort">
                <el-tooltip effect="light" content="查看考勤" placement="top">
                  <i class="el-icon-view" @click="viewAttend(scope.row)"/>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- </template>
    </card-container>

    <card-container>
        <template slot="body">-->
        <pagination
          v-show="total>0"
          :limit.sync="listQuery.pageSize"
          :page.sync="listQuery.pageNum"
          :total="total"
          @pagination="getClassList"
        />
      </template>
    </card-container>
    <OfflnAttendSign
      ref="offlnAttendSign"
      :view-attend-dialog-visible.sync="viewAttendDialogVisible"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getHeadInfo } from '@/api/components/HeadInfoApi' // 获取下拉框内容接口
import { findAllOfflnAttendanceList } from '@/api/offline/OfflnStuClsMgt' // 获取下拉框内容接口
import OfflnAttendSign from '@/views/offline/OfflnAttendSign'
import courseType from '@/CourseType/CourseType.js'


export default {
  name: 'OfflnStuClsMgt', // 考勤管理
  components: {
    Pagination,
    OfflnAttendSign
  },
  data () {
    return {
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        classId: null,
        className: null,
        courseId: null,
        provinceId: 2,
        courseType: null,
        year: null,
        gradeId: null,
        courseTypeId: null,
        subJectId: null,
        campusId: null,
        beginTime: null,
        endTime: null,
        version: null
      },
      selectTimer: '',
      total: 0,
      provinces: [], // 省市
      years: [], // 高考年份
      grades: [], // 年级
      coursePeriods: [], // 阶段
      campuses: [], // 校区
      subjects: [], // 学科
      versions: [],//版本
      viewAttendDialogVisible: false, // 查看考勤的弹窗显示与否
      loading: false,
      offlineCourseType: []//班教课程类型
    }
  },
  created () {
    this.getHeadInfo()
    this.findAllOfflnAttendanceList()
    this.offlineCourseType = courseType.offlineCourseType
  },
  methods: {
    getClassList () {
      this.findAllOfflnAttendanceList()
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        if (res.status == 200) {
          this.provinces = res.data.provinces
          this.years = res.data.years
          this.grades = res.data.grades
          this.coursePeriods = res.data.coursePeriods
          this.campuses = res.data.campuses
          this.subjects = res.data.subjects
          this.versions = courseType.versions
        }
      })
    },
    findAllOfflnAttendanceList () {
      this.loading = true
      this.listQuery.endTime = this.selectTimer ? this.selectTimer[1] : null;
      this.listQuery.beginTime = this.selectTimer ? this.selectTimer[0] : null;
      findAllOfflnAttendanceList(this.listQuery).then((res) => {
        if (res.status == 200) {
          this.list = res.data.list
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    // 查看考勤
    viewAttend (row) {
      this.$refs.offlnAttendSign.getAttendCourse(row.scheduleId)
      this.$refs.offlnAttendSign.getAttendClass({
        classId: row.classId,
        scheduleId: row.scheduleId
      })
      this.viewAttendDialogVisible = true
    },
    // 班级名称
    changeClass (val) {
      if (val.length >= 50) {
        this.$tipsMessage('班级名称的名字不能超过50个汉字', 'warning')
        this.listQuery.className = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-head {
  margin-bottom: 7px;
}
</style>
