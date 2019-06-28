<!--
 * @author hongdengru
 * @date 2019/3/1
-->
<template >
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-select
          clearable
          v-model="listQuery.provinceId"
          placeholder="省市"
          class="margin-bottom"
          @clear="clear('省市')"
        >
          <el-option
            :value="provinces.provinceId"
            v-for="provinces in provinces"
            :key="provinces.provinceId"
            :label="provinces.provinceName"
          ></el-option>
        </el-select>
        <el-select v-model="listQuery.version" placeholder="版本"  @clear="clear('版本')" clearable style="width: 80px">
          <el-option v-for="item in versions" :key="item" :label="item" :value="item"/>
        </el-select>
        <el-select
          placeholder="年级"
          clearable
          v-model="listQuery.gradeId"
          class="width80 margin-bottom"
          @clear="clear('年级')"
        >
          <el-option
            :value="grades.gradeId"
            v-for="grades in grades"
            :key="grades.gradeId"
            :label="grades.gradeName"
          ></el-option>
        </el-select>
        <el-select
          placeholder="学科"
          clearable
          v-model="listQuery.subjectId"
          class="width80 margin-bottom"
          @clear="clear('学科')"
        >
          <el-option
            :value="subjects.subjectId"
            v-for="subjects in subjects"
            :key="subjects.subjectId"
            :label="subjects.subjectName"
          ></el-option>
        </el-select>
        <el-select
          placeholder="课程类型"
          clearable
          v-model="listQuery.courseType"
          class="width130 margin-bottom"
          @clear="clear('课程类型')"
        >
          <el-option :value="item" :label="item" v-for="(item,index) in courseTypes" :key="index"></el-option>
        </el-select>
        <el-select
          v-model="listQuery.courseCode"
          class="width120 margin-bottom"
          clearable
          placeholder="课程码"
          @clear="clear('课程码')"
        >
          <el-option v-for="item in courseCodes" :key="item" :label="item" :value="item"/>
        </el-select>
        <el-input
          placeholder="课程名称"
          v-model="listQuery.courseName"
          @clear="clear('课程名称')"
          clearable
          maxlength="50"
          :style="{width:$selectConfig.classNameWidth+'px'}"
        ></el-input>
        <el-checkbox v-model="isPublish" style="margin-right:10px;" class="margin-bottom">是否发布</el-checkbox>
        <el-form-item>
          <el-button
          type="primary"
          icon="el-icon-search"
          :loading="listLoading"
          @click="findIndivCourseList"
          class="margin-bottom"
        >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCourse" class="margin-bottom">新增课程</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
    <el-table highlight-current-row border fit center stripe :data="list" v-loading="listLoading">
      <el-table-column label="版本" align="center" prop="version" min-width="50px"></el-table-column>
      <el-table-column label="年级" align="center" prop="gradeName" min-width="50px"></el-table-column>
      <el-table-column label="学科" align="center" prop="subjectName" min-width="50px"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType" min-width="80px"></el-table-column>
      <el-table-column label="课程码" align="center" prop="courseCode" min-width="60px"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310px"></el-table-column>
      <el-table-column label="开始日期" align="center" prop="startDate" min-width="100px"></el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" min-width="100px"></el-table-column>
      <el-table-column label="课程价格" align="center" prop="price" min-width="100px">
        <template slot-scope="scope" style="display: flex;justify-content: space-between">
          <div>
            <span>{{scope.row['price']|price}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100px" align="center">
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
    </div>
      </template>
    </Card-Container>
    <IndivCourseAdd
      ref="IndivCourseAdd"
      :create-course-dialog-visible.sync="createCourseDialogVisible"
      :find-indivCourse-list="findIndivCourseList"
    />
    <IndivCourseEdit
      ref="IndivCourseEdit"
      :update-course-dialog-visible.sync="updateCourseDialogVisible"
      :find-indivCourse-list="findIndivCourseList"
    />
  </div>
</template>
<script>
import pagination from "@/components/Pagination";
import { getHeadInfo } from "@/api/components/HeadInfoApi"; // 获取下拉框内容接口
import IndivCourseAdd from "@/views/individual/IndivCourseAdd"; //新增课程弹窗
import IndivCourseEdit from "@/views/individual/IndivCourseEdit"; //编辑弹窗
import {
  findIndivCourseList,
  deleteIndivCourse
} from "@/api/individual/IndivCourseMgt";
import courseType from "@/CourseType/CourseType.js";

export default {
  name: "IndivCourseMgt", // 在线个性化管理 课程管理
  data () {
    return {
      total: 0,
      listLoading: false,
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        versionId: null,
        gradeId: null,
        subjectId: null,
        provinceId: null,
        courseType: null,
        isPublish: null,
        version: null,
        courseName: null
      },
      isPublish: true,
      list: [],
      courseTypes: courseType.individualCourseType,
      individualCourseType: courseType.individualCourseType,
      versions: [], //版本
      grades: [], //年级
      subjects: [], //学科
      provinces: [], //省市
      courseCodes: ["a", "b", "c", "d", "e", "f", "g"], //课程码列表
      createCourseDialogVisible: false, //新增弹窗
      updateCourseDialogVisible: false //编辑弹窗
    };
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then(res => {
        this.versions = courseType.versions;
        this.grades = res.data.grades;
        this.subjects = res.data.subjects;
        this.provinces = res.data.provinces;
        this.years = res.data.years;
      });
    },
    getClassList () {
      this.findIndivCourseList();
    },
    findIndivCourseList () {
      this.listLoading = true;
      this.list = [];
      if (this.isPublish) {
        this.listQuery.isPublish = 1;
      } else {
        this.listQuery.isPublish = 0;
      }
      findIndivCourseList(this.listQuery).then(res => {
        this.listLoading = false;
        res.data.list.forEach((element, index) => {
          if (element.totalPrice) {
            this.list.push(element);
          }
        });
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    //新增课程
    addCourse () {
      this.createCourseDialogVisible = true;
    },
    // 编辑课程
    editCourse (courseId) {
      this.$refs.IndivCourseEdit.getSingleCourse(courseId);
      this.updateCourseDialogVisible = true;
      this.$refs.IndivCourseEdit.resetForm();
    },
    deleteCourse (row) {
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteIndivCourse(row.courseId).then(res => {
          if (res.status == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.findIndivCourseList();
          } else {
            this.$message({
              message: "删除失败",
              type: "warning"
            });
          }
        });
      });
    },
    clear (val) {
      switch (val) {
        case "省市":
          this.listQuery.provinceId = null;
          break;
        case "年级":
          this.listQuery.gradeId = null;
          break;
        case "版本":
          this.listQuery.version = null;
          break;
        case "学科":
          this.listQuery.subjectId = null;
          break;
        case "课程类型":
          this.listQuery.courseType = null;
          break;
        case "课程码":
          this.listQuery.courseCode = null;
          break;
        case "版本":
          this.listQuery.versionId = null;
          break;
        case "课程名称":
          this.listQuery.courseName = null;
          break;
      }
    }
  },
  components: {
    pagination,
    IndivCourseAdd,
    IndivCourseEdit
  },
  created () {
    this.getHeadInfo();
    this.getClassList();
    this.courseTypes = this.individualCourseType
    this.listQuery.provinceId = 2;
  }
};
</script>
<style scoped>
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.width130 {
  width: 130px;
}
.el-form-item {
  margin-right: 0;
}
.margin-bottom {
  margin-bottom: 14px;
}
.el-form-item,
.el-form-item--mini {
  margin-bottom: 0;
}
</style>
