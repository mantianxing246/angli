<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item style="margin-right:0">
          <offln-search-head
            class="offln-search-head"
            :province-id.sync="listQuery.provinceId"
            :versions.sync="listQuery.version"
            :grade-id.sync="listQuery.gradeId"
            :course-period-id.sync="listQuery.coursePeriodId"
            :course-type.sync="listQuery.courseType"
            :subject-id.sync="listQuery.subjectId"
            :campus-id.sync="listQuery.campusId"
          />
          <el-input
          v-model="listQuery.courseName"
          placeholder="课程名称"
          clearable
          :maxlength="50"
          class="search-head"
          :style="{width:$selectConfig.classNameWidth+'px'}"
        />
        </el-form-item>
        <!-- <el-input
          v-model="listQuery.courseName"
          placeholder="课程名称"
          clearable
          :maxlength="50"
          class="search-head"
          :style="{width:$selectConfig.classNameWidth+'px'}"
        /> -->
        <el-checkbox v-model="isPublish" class="search-head">是否发布</el-checkbox>
        <el-button
          v-waves
          :loading="listLoading"
          icon="el-icon-search"
          type="primary"
          @click="getCourseList"
          class="search-head"
        >查询</el-button>
        <el-button v-waves type="primary" @click.native="addCourse" class="search-head">新增课程</el-button>
      </el-form>
    </div>
    <Card-Container>
      <template slot="body">
        <el-table
          v-loading="listLoading"
          :data="list"
          highlight-current-row
          border
          fit
          center
          stripe
          class="x-block"
          style="width: 100%"
        >
          <el-table-column label="版本" align="center" prop="version" min-width="50px"/>
          <el-table-column label="年级" align="center" prop="gradeName" min-width="50px"/>
          <el-table-column label="学科" align="center" prop="subjectName" min-width="50px"/>
          <el-table-column label="阶段" align="center" prop="coursePeriodName" min-width="50px"/>
          <el-table-column label="课程类型" align="center" prop="courseType" min-width="50px"/>
          <el-table-column label="校区" align="center" prop="campusName" min-width="50px"/>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="240px"/>
          <el-table-column label="开始日期" align="center" prop="beginDate" min-width="100px"/>
          <el-table-column label="结束日期" align="center" prop="endDate" min-width="100px"/>
          <el-table-column label="课程价格" align="center" prop="totalPrice" min-width="50px"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope" align="center">
              <div class="czSort">
                <el-tooltip
                  class="item"
                  effect="light"
                  content="新增班级"
                  placement="top"
                  v-if="!scope.row.isDisable"
                >
                  <i class="el-icon-circle-plus-outline" @click="addClass(scope.row.courseId)"/>
                </el-tooltip>
                <el-tooltip class="item" content="过往日期不可新增班级" placement="top" v-else>
                  <i class="el-icon-circle-plus"/>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="editCourse(scope.row.courseId)"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete pointer" @click="deleteCourse(scope.row.courseId)"/>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :limit.sync="listQuery.pageSize"
          :page.sync="listQuery.pageNum"
          :total="total"
          @pagination="getCourseList"
        />
      </template>
    </Card-Container>
    <OfflnCourseEdit
      ref="OfflnCourseEdit"
      :update-course-dialog-visible.sync="updateCourseDialogVisible"
      @reloadList="getCourseList"
    />
    <OfflnCourseAdd
      ref="OfflnCourseAdd"
      :create-course-dialog-visible.sync="createCourseDialogVisible"
    />
    <OfflnClassAdd
      ref="OfflnClassAdd"
      :create-class-dialog-visible.sync="createClassDialogVisible"
    />
  </div>
</template>
<script>
import waves from '@/components/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import OfflnSearchHead from '@/views/offline/components/OfflnSearchHead'
import OfflnCourseEdit from '@/views/offline/OfflnCourseEdit'
import OfflnCourseAdd from '@/views/offline/OfflnCourseAdd'
import OfflnClassAdd from '@/views/offline/OfflnClassAdd'
import OfflnCourseMgtApi from '@/api/offline/OfflnCourseMgtApi'
import {
  deleteCourse
} from '@/api/offline/OfflnCourseMgtApi'
import { setTimeout } from 'timers';
export default {
  name: 'OfflnCourseMgt', // 课程管理
  components: { Pagination, OfflnSearchHead, OfflnCourseEdit, OfflnCourseAdd, OfflnClassAdd },
  directives: { waves },
  data () {
    return {
      updateCourseDialogVisible: false, // 编辑课程弹窗默认隐藏
      createCourseDialogVisible: false, // 新增课程弹窗默认隐藏
      createClassDialogVisible: false, // 新增班级弹窗默认隐藏
      list: [], // 课程列表
      total: 0, // 列表总数
      listLoading: false, // loading加载
      isPublish: true,  //默认筛选已发布
      disable: "",
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        provinceId: 2,  //默认为上海
        version: null,
        gradeId: null,
        coursePeriodId: null,
        courseType: '',
        subjectId: null,
        campusId: null,
        courseName: '',

      } // 查询条件
    }
  },
  created () {
    this.getCourseList()
  },
  methods: {
    // 获取课程列表
    getCourseList () {
      this.listLoading = true;
      this.list = [];
      if (this.isPublish) {
        this.listQuery.isPublish = 1;
      } else {
        this.listQuery.isPublish = 0;
      }
      OfflnCourseMgtApi.getCourseList(this.listQuery).then(res => {
        if (res.status === 200) {
          for (var i = 0;i < res.data.list.length;i++) {
            res.data.list[i].endDate = this.$format(res.data.list[i].endDate)
            if (res.data.list[i].totalPrice) {
              res.data.list[i].totalPrice = res.data.list[i].totalPrice.toLocaleString()
            }
          }
          this.list = res.data.list
          this.total = res.data.total
          this.duty()
          this.listLoading = false
        } else {
          this.listLoading = false
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    duty () {
      //  console.log(this.list)
      for (var i = 0;i < this.list.length;i++) {
        if (this.list[i].endDate) {
          var newData = new Date()
          var year = parseInt(this.list[i].endDate.split('-')[0])
          var month = parseInt(this.list[i].endDate.split('-')[1])
          var date = parseInt(this.list[i].endDate.split('-')[2])
          var data = new Date(year, month - 1, date)
          // console.log(new Date(year, month - 1, date))
          if (newData.getTime() < data.getTime()) {
            this.list[i].isDisable = false
          } else {
            this.list[i].isDisable = true
          }
        }
      }
    },
    // 新增课程
    addCourse () {
      this.createCourseDialogVisible = true
      this.$refs.OfflnCourseAdd.resetForm()
    },
    // 编辑课程
    editCourse (courseId) {
      this.updateCourseDialogVisible = true
      // 获取当前课程详细信息
      this.$refs.OfflnCourseEdit.getSingleCourse(courseId)
      this.$refs.OfflnCourseEdit.resetForm()// 重置编辑弹窗form表单
    },

    // 新增班级
    addClass (courseId) {
      this.createClassDialogVisible = true
      this.$refs.OfflnClassAdd.resetForm()
      this.$refs.OfflnClassAdd.getSingleCourse(courseId)
    },
    // 删除之前的判定
    deleteCourse (courseId) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCourse(courseId).then(res => {
          if (res.data.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getCourseList()
          } else if (res.data.status === 500) {
            this.$message({
              message: res.data.failMessage,
              type: 'warning'
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.offln-search-head {
  display: inline-block;
}
.el-form-item {
  margin-right: 0;
}
.search-head {
  margin-bottom: 10px;
}
.el-button + .el-button {
  margin-left: 0;
}
.el-checkbox{
  margin-right: 0px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 0px;
}
</style>