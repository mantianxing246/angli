<!--
 * @author hongdengru
 * @date 2019/3/1
-->
<template >
  <div class="app-container" id="yang">
    <el-form inline>
      <el-select
        clearable
        v-model="listQuery.provinceId"
        placeholder="省市"
        class="width80 margin-bottom"
        @clear="clear('省市')"
      >
        <el-option
          :value="provinces.provinceId"
          v-for="provinces in provinces"
          :key="provinces.provinceId"
          :label="provinces.provinceName"
          style="height:45px;"
        ></el-option>
      </el-select>
       <el-select
        clearable
        v-model="listQuery.version"
        placeholder="版本"
        class="width80 margin-bottom"
      >
        <el-option
          :value="item"
          v-for="item in versions"
          :key="item"
          :label="item"
          style="height:45px;"
        ></el-option>
      </el-select>
      <el-select
        placeholder="课程类型"
        clearable
        v-model="listQuery.courseType"
        class="width120 margin-bottom"
        @clear="clear('课程类型')"
      >
        <el-option
          style="height:40px"
          :value="item.name"
          :label="item.name"
          v-for="item in courseTypes"
          :key="item.index"
        ></el-option>
      </el-select>
      <el-select
        placeholder="上课形式"
        clearable
        v-model="listQuery.isOnline"
        class="margin-bottom"
        style="width:110px"
        @clear="clear('上课形式')"
      >
        <el-option :value="item.id" v-for="item in classForms" :key="item.index" :label="item.name"></el-option>
      </el-select>
      <el-input
        placeholder="课程名称"
        v-model="listQuery.courseName"
        @clear="clear('课程名称')"
        clearable
        :style="{width:$selectConfig.classNameWidth+'px'}"
        :maxlength="50"
        class="margin-bottom"
      ></el-input>
      <el-checkbox v-model="isPublish" class="margin-bottom">是否发布</el-checkbox>
      <el-button
        type="primary"
        icon="el-icon-search"
        :loading="listLoading"
        @click="findNonsubjCourseList"
        class="margin-bottom"
      >搜索</el-button>
      <el-button type="primary" @click="addCourse" class="margin-bottom margin-left">新增课程</el-button>
    </el-form>
   <Card-Container>
      <template slot="body">
        <!-- <div > -->
    <el-table highlight-current-row border fit center stripe :data="list" v-loading="listLoading">
       <el-table-column label="版本" align="center" prop="version"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType"></el-table-column>
      <el-table-column label="上课形式" align="center" prop="isOnline"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="beginDate"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate"></el-table-column>
      <el-table-column label="课程价格" prop="totalPrice" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="czSort">
            <el-tooltip content="编辑" effect="light" placement="top">
              <i class="el-icon-edit pointer" @click="editCourse(scope.row.courseId)" size="large"></i>
            </el-tooltip>
            <el-tooltip content="删除" effect="dark" placement="top">
              <i class="el-icon-delete pointer" @click="deleteCourse(scope.row)" size="large"></i>
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
      @pagination="getClassList"
    />
    <!-- </div> -->
      </template>
   </Card-Container>
    
    <NonsubjCourseAdd
      ref="NonsubjCourseAdd"
      :create-course-dialog-visible.sync="createCourseDialogVisible"
      :find-indivCourse-list="findNonsubjCourseList"
    />
    <NonsubjCourseEdit
      ref="NonsubjCourseEdit"
      :update-course-dialog-visible.sync="updateCourseDialogVisible"
      :find-indivCourse-list="findNonsubjCourseList"
    />
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
import NonsubjCourseAdd from '@/views/NonSubject/NonsubjCourseAdd'    //新增课程弹窗
import NonsubjCourseEdit from '@/views/NonSubject/NonsubjCourseEdit'    //编辑弹窗
import { findNonsubjCourseList, deleteNonsubjCourse } from "@/api/nonsubject/NonsubjCourseMgt"
import courseType from '@/CourseType/CourseType.js'

export default {
  name: "IndivCourseMgt",
  data () {
    return {
      total: 0,
      listLoading: false,
      listQuery: {
        version: null,
        pageSize: 20,
        pageNum: 1,
        provinceId: null,
        courseType: null,
        isOnline: null,
        isPublish: null,
        courseName: null
      },
      isPublish: true,
      list: [],
      courseTypes: null,
      classForms: null,
      versions:[],//版本
      provinces: [],//省市
      courseCodes: ["a", "b", "c", "d", "e", "f", "g"],       //课程码列表
      createCourseDialogVisible: false, //新增弹窗
      updateCourseDialogVisible: false  //编辑弹窗
    }
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.provinces = res.data.provinces
        this.versions = courseType.versions
        this.classForms = courseType.formCourseType
        this.courseTypes = courseType.nonSubjectCourseType
      })
    },
    getClassList () {
      this.findNonsubjCourseList()
    },
    findNonsubjCourseList () {
      this.listLoading = true;
      this.list = [];
      if (this.isPublish) {
        this.listQuery.isPublish = 1;
      } else {
        this.listQuery.isPublish = 0;
      }
      findNonsubjCourseList(this.listQuery).then((res) => {
        this.listLoading = false;
        res.data.list.forEach((element, index) => { 
          if (res.data.list[index].isOnline == "0") {
            return res.data.list[index].isOnline = '线下'
          } else if (res.data.list[index].isOnline == "1") {
            return res.data.list[index].isOnline = '线上'
          } else {
            return res.data.list[index].isOnline = '线下+线上'
          }
          
        });
        this.total = res.data.total
        this.list = res.data.list
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].totalPrice){
             this.list[i].totalPrice = this.list[i].totalPrice.toLocaleString()
          }
        }
      })
    },
    //新增课程
    addCourse () {
      this.createCourseDialogVisible = true
    },
    // 编辑课程
    editCourse (courseId) {
      this.$refs.NonsubjCourseEdit.getSingleCourse(courseId)
      this.updateCourseDialogVisible = true
      this.$refs.NonsubjCourseEdit.resetForm()
    },
    deleteCourse (row) {
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteNonsubjCourse(row.courseId).then((res) => {
          if (res.status == 200) {
            this.$message({
              message: '删除成功',
              type: "success"
            })
            this.findNonsubjCourseList()
          } else if (res.status == 500) {
            this.$message({
              message: '该课程已打包在产品中无法进行删除操作!',
              type: "warning"
            })
            this.findNonsubjCourseList()
          } else {
            this.$message({
              message: '删除失败',
              type: "warning"
            })
          }
        })
      })
    },
    clear (val) {
      switch (val) {
        case "省市":
          this.listQuery.provinceId = null
          break;
        case "课程类型":
          this.listQuery.courseType = null
          break;
        case "课程形式":
          this.listQuery.isOnline = null
          break;
        case "课程名称":
          this.listQuery.courseName = null
          break;
      }
    },
    getCurrentYear () {
      var myDate = new Date()
      var year = myDate.getFullYear()
      return year
    },
  },
  components: {
    pagination,
    NonsubjCourseAdd,
    NonsubjCourseEdit
  },
  created () {
    this.getHeadInfo()
    this.getClassList()
    this.findNonsubjCourseList()
  }
}
</script>
<style scoped>
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.el-form-item {
  margin-right: 0;
}
.margin-bottom {
  margin-bottom: 14px;
}
.margin-left {
  margin-left: 0px;
}
#yang .el-select-dropdown__list {
  height: 100%;
}
.el-checkbox{
  margin-right: 0px;
}
</style>
