<template>
  <div class="app-container">
    <el-form inline>
      <live-search-head
        class="live-search-head"
        :province-id.sync="listQuery.provinceId"
        :grade-id.sync="listQuery.gradeId"
        :year.sync="listQuery.year"
        :subject-id.sync="listQuery.subjectId"
        :course-type.sync="listQuery.courseType"
        :class-type.sync="listQuery.classType"
        :version.sync="listQuery.version"
        :course-period-id.sync="listQuery.coursePeriodId"
        :course-name.sync="listQuery.courseName"
        :is-publish.sync="listQuery.isPublish"
      />
      <el-form-item>
        <el-button
          v-waves
          icon="el-icon-search"
          type="primary"
          :loading="listLoading"
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
            <el-table-column label="版本" align="center" prop="version" min-width="50px"/>
            <el-table-column label="年级" align="center" prop="gradeName" min-width="50px">
              <template slot-scope="scope" style="display: flex;justify-content: space-between">
                <div v-html="scope.row['gradeName']"></div>
              </template>
            </el-table-column>
            <el-table-column label="学科" align="center" prop="subjectName" min-width="50px"/>
            <el-table-column label="课程类型" align="center" prop="courseType" min-width="130px"/>
            <el-table-column label="阶段" align="center" prop="coursePeriodName" min-width="50px"/>
            <!--j阶段 -->
            <el-table-column label="班型" align="center" prop="classType" min-width="50px"/>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="310px"/>
            <!-- 授课老师待确认字段 暂放orderBy-->
            <!-- <el-table-column label="授课老师" align="center" prop="orderBy"/> -->
            <el-table-column label="开始日期" align="center" prop="beginDate" min-width="80px"/>
            <el-table-column label="结束日期" align="center" prop="endDate" min-width="80px"/>
            <el-table-column label="课程价格" align="center" prop="totalPrice" min-width="60px">
                <template slot-scope="scope" style="display: flex;justify-content: space-between">
                  <div>
                    <span>{{scope.row['totalPrice']|price}}</span>
                  </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" prop="year" min-width="120px">
              <template slot-scope="scope" style="display: flex;justify-content: space-between">
                <div class="czSort">
                  <el-tooltip effect="light" content="编辑" placement="top">
                    <i class="el-icon-edit" size="large" @click="editCourse(scope.row.courseId)"/>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <i
                      class="el-icon-delete pointer"
                      size="large"
                      @click="deleteLiveCourse(scope.row.courseId)"
                    />
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
    <LiveCourseAdd
      ref="LiveCourseAdd"
      :create-class-dialog-visible.sync="createClassDialogVisible"
      @reloadList="getCourseList"
    />
    <LiveCourseEdit
      ref="LiveCourseEdit"
      :update-class-dialog-visible.sync="updateClassDialogVisible"
      @reloadList="getCourseList"
    />
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import LiveSearchHead from "@/views/live/components/LiveSearchHead"; // 查询条件
import { getCourseList, deleteLiveCourse } from "@/api/live/LiveCourseMgtApi"; // 直播课接口
import LiveCourseAdd from "@/views/live/LiveCourseAdd"; // 新增直播课
import LiveCourseEdit from "@/views/live/LiveCourseEdit"; // 编辑直播课

export default {
  name: "LiveCourseMgt",
  components: { LiveSearchHead, LiveCourseAdd, LiveCourseEdit },
  directives: { waves },
  data () {
    return {
      list: [], // 直播课程列表
      total: 0, // 列表总数
      listLoading: false, // loading加载
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        provinceId: 2,
        version: null,
        gradeId: null,
        courseType: "",
        subjectId: null,
        courseName: "",
        classType: "",
        isPublish: 1
      }, // 查询条件
      createClassDialogVisible: false, // 新增直播课程弹窗显示与否
      updateClassDialogVisible: false // 编辑直播课程弹窗显示与否
    };
  },
  mounted () {
    this.getCourseList();
  },
  methods: {
    // 获取直播课程列表
    getCourseList () {
      this.listLoading = true;
      this.list = [];
      getCourseList(this.listQuery).then(res => {
        this.listLoading = false;
        if (res.status === 200) {
          this.list = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 新增课程
    addCourse (form) {
      this.createClassDialogVisible = true;
      // 获取新增弹窗省市，年级等列表
      this.$refs.LiveCourseAdd.getQueryList();
      // console.log('--->>',this.$refs.LiveCourseAdd.form)
      this.$refs.LiveCourseAdd.resetForm(); // 重置新增弹窗form表单
    },
    // 编辑课程
    editCourse (courseId) {
      // 获取编辑弹窗省市、年级等列表
      this.$refs.LiveCourseEdit.getQueryList();
      this.$refs.LiveCourseEdit.resetForm(); // 重置编辑弹窗form表单
      // 获取当前录播课程详细信息
      this.$refs.LiveCourseEdit.getSingleCourse(courseId);
      this.updateClassDialogVisible = true;
    },
    // 删除课程
    deleteLiveCourse (courseId) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteLiveCourse(courseId).then(res => {
          if (res.data.status === 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getCourseList();
          } else if (res.data.status === 500) {
            this.$message({
              message: res.data.failMessage,
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
.live-search-head {
  display: inline-block;
}
.search-head {
  margin-bottom: 15px;
}
</style>
