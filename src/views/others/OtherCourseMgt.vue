<!--
 * @author jiakun
 * @date 2019/4/8
-->
<template>
  <div class="app-container">
    <el-form inline>
      <el-select
        clearable
        v-model="listQuery.provinceId"
        placeholder="省市"
        class="margin-bottom"
        style="width:80px"
      >
        <el-option
          :value="provinces.provinceId"
          v-for="provinces in provinces"
          :key="provinces.provinceId"
          :label="provinces.provinceName"
        ></el-option>
      </el-select>

      <el-select

        clearable
        v-model="listQuery.version"
        placeholder="版本"
         style="width:80px"
        class="margin-bottom"
      >
        <el-option
          :value="item"
          v-for="item in versions"
          :key="item"
          :label="item"
        ></el-option>
      </el-select>

      <el-select v-model="listQuery.courseType" clearable class="margin-bottom"  style="width:170px" placeholder="课程类型">
        <el-option
          v-for="(item,index) in headInfo.courseType"
          :key="index"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>

      <el-input
        clearable
        class="margin-bottom"
        placeholder="课程名称"
        :style="{width:$selectConfig.classNameWidth+'px'}"
        v-model="listQuery.courseName"
        :maxlength="50"
      ></el-input>

      <el-checkbox :false-label="0" :true-label="1" v-model="isPublish" class="margin-bottom">是否发布</el-checkbox>

      <el-button
        type="primary"
        class="margin-bottom"
        icon="el-icon-search"
        :loading="loading"
        @click="findOtherCourseList"
      >搜索</el-button>

      <el-button type="primary" @click="addCourse" class="margin-bottom margin-left">新增课程</el-button>
    </el-form>

    <card-container>
      <template slot="body">
        <el-table highlight-current-row border fit center stripe :data="list" v-loading="loading">
           <el-table-column label="版本" prop="version" align="center"></el-table-column>
          <el-table-column label="课程类型" prop="courseType" align="center" min-width="150"></el-table-column>
          <el-table-column label="课程名称" prop="courseName" align="center" min-width="310"></el-table-column>
          <el-table-column label="开始日期" prop="beginDate" align="center"></el-table-column>
          <el-table-column label="结束日期" prop="endDate" align="center"></el-table-column>
          <el-table-column label="课程价格" prop="totalPrice" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="czSort">
                <el-tooltip class="item" effect="light" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="editCourse(scope.row.courseId)" size="large"/>
                </el-tooltip>
                <el-tooltip class="item" content="删除" effect="dark" placement="top">
                  <i
                    class="el-icon-delete"
                    size="large"
                    @click="deleteOtherCourse(scope.row.courseId)"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- </template>
        </card-container>-->
        <!-- 分页 -->
        <!-- <card-container>
        <template slot="body">-->
        <pagination
          v-show="total>0"
          :total="total"
          :limit.sync="listQuery.pageSize"
          :page.sync="listQuery.pageNum"
          @pagination="getClassList"
        />
      </template>
    </card-container>
    <OtherCourseAdd
      ref="OtherCourseAdd"
      :create-course-dialog-visible.sync="createCourseDialogVisible"
      :find-indivCourse-list="findOtherCourseList"
    />
    <OtherCourseEdit
      ref="OtherCourseEdit"
      :update-course-dialog-visible.sync="updateCourseDialogVisible"
      :find-indivCourse-list="findOtherCourseList"
    />
  </div>
</template>
<script>
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import courseType from '@/CourseType/CourseType.js'
import OtherCourseAdd from '@/views/others/OtherCourseAdd'    //新增课程弹窗
import OtherCourseEdit from '@/views/others/OtherCourseEdit'    //编辑弹窗
import { findOtherCourseList, deleteOtherCourse } from '@/api/other/OtherCourseMgt.js'

export default {
  name: 'OtherAccrualMgt',
  data () {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        isPublish: null,
        provinceId: null,
        courseType: null,
        courseName: null,
        version: null
      },
      versions:[],
      loading: false,
      total: 0,
      isPublish: true,
      list: [],
      headInfo: {},
      provinces: [],
      createCourseDialogVisible: false, //新增弹窗
      updateCourseDialogVisible: false  //编辑弹窗
    }
  },
  methods: {
    getClassList () {
      this.findOtherCourseList()
    },
    findOtherCourseList () {
      this.loading = true;
      this.list = [];
      if (this.isPublish) {
        this.listQuery.isPublish = 1;
      } else {
        this.listQuery.isPublish = 0;
      }
      findOtherCourseList(this.listQuery).then((res) => {
        this.loading = false;
        res.data.list.forEach((element, index) => {
          if (element.totalPrice) {
            this.list.push(element)
            this.list[index].totalPrice = element.totalPrice.toLocaleString()
          }
        });
        this.total = res.data.total
        this.list = res.data.list
      })
    },
    deleteOtherCourse (id) {
      this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOtherCourse(id).then((res) => {
          if (res.status == 200) {
            this.$tipsMessage("删除成功", "success")
            this.findOtherCourseList()
          } else if (res.status == 500) {
            this.$tipsMessage("该课程已打包在产品中无法进行删除操作", "warning")
            this.findOtherCourseList()
          } else {
            this.$tipsMessage("删除失败", "warning")
          }
        })
      })
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.headInfo = res.data
        this.provinces = res.data.provinces
        this.headInfo.courseType = courseType.otherCourseType
        this.versions = courseType.versions
      })
    },
    addCourse () {
      this.createCourseDialogVisible = true
    },
    editCourse (courseId) {
      this.$refs.OtherCourseEdit.getSingleCourse(courseId)
      this.updateCourseDialogVisible = true
      this.$refs.OtherCourseEdit.resetForm()
    },
    clear (val) {
      switch (val) {
        case "省市":
          this.listQuery.provinceId = null
          break;
        case "课程类型":
          this.listQuery.courseType = null
          break;
        case "课程名称":
          this.listQuery.courseName = null
          break;
        case "版本":
          this.listQuery.courseName = null
          break;
      }
    },
  },
  created () {
    this.getHeadInfo()
    this.findOtherCourseList()
  },
  components: {
    OtherCourseAdd,
    OtherCourseEdit
  }
}
</script>
<style scoped>
.margin-bottom {
  margin-bottom: 14px;
}
.margin-left {
  margin-left: 0px;
}
.el-checkbox{
  margin-right: 0px;
}
</style>
