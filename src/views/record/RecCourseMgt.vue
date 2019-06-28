<template>
  <div class="app-container">
    <el-form inline>
      <rec-search-head
        :province-id.sync="listQuery.provinceId"
        :grade-id.sync="listQuery.gradeId"
        :course-function-id.sync="listQuery.courseFunctionId"
        :version.sync="listQuery.version"
        :year.sync="listQuery.year"
        :course-type.sync="listQuery.courseType"
        :course-name.sync="listQuery.courseName"
        :subject-id.sync="listQuery.subjectId"
        :is-publish.sync="listQuery.isPublish"
        class="rec-search-head"
      />
      <el-form-item>
        <el-button
          v-waves
          :loading="listLoading"
          icon="el-icon-search"
          type="primary"
          @click="getCourseList"
        >查询</el-button>
        <el-button
          v-waves
          icon="el-icon-edit"
          style="margin-left: 10px;"
          type="primary"
          @click.prevent.stop="addCourse('form')"
        >新增课程</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            v-loading="listLoading"
            :data="list"
            highlight-current-row
            border
            fit
            stripe
            style="width: 100%;"
          >
            <el-table-column label="版本" align="center" prop="version" width="50px"/>
            <el-table-column label="年级" align="center" prop="gradeName" width="50px">
              <template slot-scope="scope" style="display: flex;justify-content: space-between">
                <div v-html="scope.row['gradeName']"></div>
              </template>
            </el-table-column>
            <el-table-column label="学科" align="center" prop="subjectName" min-width="50"/>
            <el-table-column label="课程类型" align="center" prop="courseType" min-width="130"/>
            <el-table-column label="课程作用" align="center" prop="courseFunctionName" min-width="80"/>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
            <el-table-column label="开始日期" align="center" prop="beginDate" width="80"/>
            <el-table-column label="结束日期" align="center" prop="endDate" min-width="80"/>
            <el-table-column label="排序" align="center" prop="orderByNum" min-width="50"/>
            <el-table-column label="课程价格" align="center" prop="totalPrice" min-width="60"/>
            <el-table-column label="操作" align="center" prop="year" width="100">
              <template slot-scope="scope" style="display: flex;justify-content: space-between">
                <div class="czSort">
                  <el-tooltip effect="light" content="编辑" placement="top">
                    <i class="el-icon-edit" @click="editCourse(scope.row.courseId)"/>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete pointer" @click="deleteRecCourse(scope.row.courseId)"/>
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
        </div>
      </template>
    </Card-Container>
    <RecCourseAdd
      ref="RecCourseAdd"
      :create-class-dialog-visible.sync="createClassDialogVisible"
      @reloadList="getCourseList"
    />
    <RecCourseEdit
      ref="RecCourseEdit"
      :update-class-dialog-visible.sync="updateClassDialogVisible"
      @reloadList="getCourseList"
    />
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import RecSearchHead from "@/views/record/components/RecSearchHead";
import { updateClass } from "@/api/offline/OfflnClassMgtApi";
import RecCourseMgtApi from "@/api/record/RecCourseMgtApi";
import RecCourseAdd from "@/views/record/RecCourseAdd";
import RecCourseEdit from "@/views/record/RecCourseEdit";
import OfflnSchedule from "@/views/offline/OfflnSchedule";

export default {
  name: "RecCourseMgt",
  components: {
    RecSearchHead,
    RecCourseAdd,
    RecCourseEdit,
    OfflnSchedule
  },
  directives: { waves },
  data () {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        provinceId: 2,
        courseFunctionId: null,
        version: null,
        year: null,
        gradeId: null,
        courseType: null,
        subjectId: null,
        courseName: "",
        isPublish: 1
      },
      createClassDialogVisible: false,
      updateClassDialogVisible: false
    };
  },
  mounted () {
    this.getCourseList();
  },
  methods: {
    getCourseList () {
      this.listLoading = true;
      this.list = [];
      RecCourseMgtApi.getCourseList(this.listQuery).then(response => {
        this.listLoading = false;
        if (response.status === 200) {
          // this.list = response.data.list
          response.data.list.forEach((element, index) => {
            if (typeof element.totalPrice === "number") {
              this.list.push(element);
              this.list[index].totalPrice = element.totalPrice.toLocaleString();
            }
          });
          this.total = response.data.total;
        } else {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
      });
    },
    // 新增课程
    addCourse (form) {
      // 显示弹窗
      this.createClassDialogVisible = true;
      // 获取新增弹窗省市，年级等列表
      this.$refs.RecCourseAdd.getQueryList();
      // console.log('--->>',this.$refs.RecCourseAdd.form)
      this.$refs.RecCourseAdd.resetForm(); // 重置新增弹窗form表单
    },
    // 编辑课程
    editCourse (courseId) {
      // 获取编辑弹窗省市、年级等列表
      this.$refs.RecCourseEdit.getQueryList();
      this.$refs.RecCourseEdit.resetForm(); // 重置编辑弹窗form表单
      // 获取当前录播课程详细信息
      this.$refs.RecCourseEdit.getSingleCourse(courseId);
      this.updateClassDialogVisible = true;
    },
    deleteRecCourse (courseId) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        RecCourseMgtApi.deleteRecCourse(courseId).then(response => {
          if (response.data.status === 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getCourseList();
          } else if (response.data.status === 500) {
            this.$message({
              message: response.data.failMessage,
              type: "warning"
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.rec-search-head {
  display: inline-block;
}
.search-head {
  margin-bottom: 15px;
}
</style>
