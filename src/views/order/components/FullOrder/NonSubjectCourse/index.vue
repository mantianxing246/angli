<template>
  <div>
    <div class="container" style="margin-bottom:10px">
      <span class="fontSize" style="margin-right:20px">选择非学科类课程</span>
      <el-radio-group v-model="courseType" @change="clearChange(courseType)">
        <el-radio-button label="2">按课程选课</el-radio-button>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="在产品管理中打包所需课程组合后，可在此选择产品包。"
          class="border-radio"
        >
          <el-radio-button label="1" slot="reference">按产品选课</el-radio-button>
        </el-popover>
      </el-radio-group>
    </div>

    <el-row v-show="courseType==1" type="flex" align="middle">
      <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
      <el-col :span="2" class="fontSize">非学科类</el-col>-->
      <el-col :span="3">
        <el-input placeholder="输入产品名称" v-model="productQuery.courseName" clearable></el-input>
      </el-col>
      <el-col :span="3" style="margin-left:20px">
        <el-button
          :loading="productLoading"
          type="primary"
          icon="el-icon-search"
          @click="findCourseByNonsubj"
        >查询</el-button>
      </el-col>
    </el-row>

    <el-row v-show="courseType==2" type="flex" align="middle">
      <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
      <el-col :span="2" class="fontSize">非学科类</el-col>-->
      <!-- <el-col :span="3">
        <el-select
          v-model="courseQuery.gradeId"
          placeholder="课程码"
          clearable
          class="width120"
          @change="findAllProduct('课程')"
          @clear="clear"
        >
          <el-option
            v-for="item in headInfo.grades"
            :value="item.gradeId"
            :label="item.gradeName"
            :key="item.gradeId"
          />
        </el-select>
      </el-col>-->
      <el-col :span="3">
        <el-select v-model="courseQuery.courseType" placeholder="课程类型" clearable class="width120">
          <el-option
            v-for="item in headInfo.courseType"
            :value="item.name"
            :label="item.name"
            :key="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="课程名称" clearable v-model="courseQuery.courseName"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button
          :loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="findCourseByNonsubjFromCourse"
          style="margin-left:20px"
        >查询</el-button>
      </el-col>
    </el-row>

    <select-table ref="selectTable" :list-course="listCourse" @selectCourse="selectCourse"/>
    <!-- 非学科 -->
    <non-subject-choice-course
      :choice-course.sync="choiceCourse"
      :is-pass.sync="isPass"
      @changeSelectCourse="changeSelectCourse"
      @changePass="changePass"
    />
    <!-- 录播、直播 -->
    <!-- <rec-course-choice-course></rec-course-choice-course> -->
    <!-- 在线个性化 -->
    <!-- <individual-choice-course></individual-choice-course> -->
  </div>
</template>
<script>
import SelectTable from '@/views/order/components/FullOrder/SelectTable/NonSubjectSelectTable'
import NonSubjectChoiceCourse from '@/views/order/components/FullOrder/SelectCourse/NonSubjectChoiceCourse'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import {
  findAllProduct,
  getSelectProductParam,
  findProductById,
  findCourseByNonsubj,
  findCourseByNonsubjFromCourse
} from '@/api/order/FullOrder'
import OfflnCourseMgtApi from '@/api/offline/OfflnCourseMgtApi'
import { getSelectCourse, listCourseSort, startDateChange } from '@/views/order/FullOrderFunction/FullOrder.js'
import courseType from '@/CourseType/CourseType.js'
import { findNonsubjCourseList } from '@/api/nonsubject/NonsubjCourseMgt.js'

export default {
  components: { SelectTable, NonSubjectChoiceCourse },
  props: ['choiceCourse', 'isPass'],
  data () {
    return {
      courseType: "2",
      productQuery: {
        courseName: null
      },
      courseQuery: {
        courseType: null,
        courseName: null
      },
      product: [],
      headInfo: {
        courseType: [],
        grades: null
      },
      listCourse: [],
      loading: false,
      productLoading: false,
      year: null // 上面页面传递来的高考年份
    }
  },
  mounted () {
    this.year = this.$route.query.year
    this.headInfo.courseType = courseType.nonSubjectCourseType
  },
  methods: {
    // 通过产品查询课程
    findCourseByNonsubj () {
      if (!this.productQuery.courseName) {
        this.$tipsMessage("请填写产品名称", 'warning')
        return
      }
      this.productLoading = true
      findCourseByNonsubj(this.productQuery).then((res) => {
        this.productLoading = false
        if (res.status == 200) {
          this.listCourse = []
          for (var i = 0;i < res.data.length;i++) {
            //在订单暂存要用
            res.data[i].startDate = res.data[i].beginDate
            res.data[i].propertyId = res.data[i].courseProperty
            res.data[i].price = res.data[i].price.toLocaleString()
            res.data[i].giveAway = 0
            this.listCourse.push(res.data[i])
          }
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
            return
          }
        }
      })
    },
    // 点击按课程查询
    findCourseByNonsubjFromCourse () {
      if (!this.courseQuery.courseType&&!this.courseQuery.courseName) {
        this.$tipsMessage("请至少填写一个查询信息", "warning")
        return
      }
      this.loading = true
      this.listCourse = []
      findCourseByNonsubjFromCourse(this.courseQuery).then((res) => {
        this.loading = false
        if (res.status == 200) {
          for (var i = 0;i < res.data.length;i++) {
            res.data[i].price = res.data[i].price.toLocaleString()
            //在订单暂存要用
            res.data[i].startDate = res.data[i].beginDate
            res.data[i].propertyId = res.data[i].courseProperty
            res.data[i].giveAway = 0
            this.listCourse.push(res.data[i])
          }
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
            return
          }
        }
      })
    },
    clearChange (val) {
      if (val == 1) {
        this.courseQuery = {
          courseType: null,
          courseName: null
        }
        this.listCourse = []
      }
      if (val == 2) {
        this.productQuery = {
          courseName: null
        }
        this.listCourse = []
      }
    },
    getSelectProductParam () {
      getSelectProductParam(this.year).then(res => {
        this.headInfo.grades = Object.assign({}, res.data.grades)
      })
    },
    changeSelectCourse (course) {
      this.$emit('update:choiceCourse', course)
    },
    selectCourse (course) {
      this.choiceCourse = startDateChange(Object.assign(getSelectCourse(course, this.choiceCourse, this)))
      this.$emit('update:choiceCourse', this.choiceCourse)
    },
    // 是否验证通过
    changePass (val) {
      this.$emit('update:isPass', val)
    }
  }
}
</script>
<style scoped>
.border-bottom {
  height: 30px;
  border-bottom: 2px solid #909399;
}
.width120 {
  width: 120px;
}
.fontSize {
  font-size: 15px;
}
.border-radio /deep/ .el-radio-button__inner {
  border-radius: 0px 4px 4px 0px !important;
}
.el-row {
    margin-bottom: 10px;
}
</style>
