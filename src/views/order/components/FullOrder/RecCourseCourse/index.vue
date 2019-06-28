<template>
  <div>
    <div class="container" style="margin-bottom:10px">
      <span class="fontSize" style="margin-right:20px">选择录播、直播课程</span>
      <el-radio-group v-model="courseType" @change="clearChange(courseType)">
        <el-radio-button label="3">按报名表选课</el-radio-button>
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

    <div>
      <el-row type="flex" align="middle" v-show="courseType==1">
        <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
        <el-col :span="2" class="fontSize">录播、直播</el-col>-->
        <el-col :span="3">
          <el-select
            placeholder="年级"
            v-model="productQuery.gradeId"
            clearable
            class="width120"
            @change="findAllProduct"
          >
            <el-option
              :value="item.gradeId"
              :label="item.gradeName"
              v-for="item in headInfo.grades"
              :key="item.gradeId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            placeholder="版本"
            v-model="productQuery.version"
            clearable
            class="width120"
            @change="findAllProduct"
          >
            <el-option :value="item" :label="item" v-for="item in headInfo.versions" :key="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="产品名称" v-model="productQuery.productId" clearable class="width120">
            <el-option
              :value="item.productId"
              :label="item.productName"
              v-for="(item,index) in product"
              :key="index"
            ></el-option>
          </el-select>
        </el-col>
        <el-button
          :loading="loading"
          type="primary"
          icon="el-icon-search"
          @click="findProductById"
        >查询</el-button>
      </el-row>

      <el-row type="flex" align="middle" v-show="courseType==2">
        <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
        <el-col :span="2" class="fontSize">录播、直播</el-col>-->
        <el-col :span="3">
          <el-select placeholder="年级" v-model="courseQuery.gradeId" clearable class="width120">
            <el-option
              :value="item.gradeId"
              :label="item.gradeName"
              v-for="item in headInfo.grades"
              :key="item.gradeId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="版本" v-model="courseQuery.version" clearable class="width120">
            <el-option :value="item" :label="item" v-for="item in headInfo.versions" :key="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="学科" v-model="courseQuery.subjectIds" clearable class="width120">
            <el-option
              :value="item.subjectId"
              :label="item.subjectName"
              v-for="item in headInfo.subjects"
              :key="item.subjectId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select placeholder="课程类型" v-model="courseQuery.courseType" clearable class="width120">
            <el-option :value="item" :label="item" v-for="item in headInfo.courseType" :key="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getCourse" icon="el-icon-search" :loading="loading">查询</el-button>
        </el-col>
      </el-row>

      <select-table
        ref="selectTable"
        :listCourse="listCourse"
        @selectCourse="selectCourse"
        v-if="courseType==1||courseType==2"
      ></select-table>

      <rec-entry-form
        v-show="courseType==3"
        @selectCourse="selectCourseFunction"
      ></rec-entry-form>
      <!-- 班教 -->
      <rec-course-choice-course
        :choiceCourse.sync="choiceCourse"
        @changeSelectCourse="changeSelectCourse"
      ></rec-course-choice-course>
    </div>
    <!-- 录播、直播 -->
    <!-- <rec-course-choice-course></rec-course-choice-course> -->
    <!-- 在线个性化 -->
    <!-- <individual-choice-course></individual-choice-course> -->
  </div>
</template>  
<script>
import SelectTable from '../SelectTable/RecSelectTable'
import RecEntryForm from '@/views/order/components/FullOrder/RecCourseCourse/RecEntryForm'
import RecCourseChoiceCourse from '../SelectCourse/RecCourseChoiceCourse'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import { findAllProduct, getSelectProductParam, findProductById, getCourse } from '@/api/order/FullOrder'
import OfflnCourseMgtApi from '@/api/offline/OfflnCourseMgtApi'
import { getSelectCourse, startDateChange } from "@/views/order/FullOrderFunction/FullOrder.js";
import courseType from '@/CourseType/CourseType.js'

export default {
  data () {
    return {
      courseType: "3",
      productQuery: {
        gradeId: null,
        version: null,
        productId: null
      },
      courseQuery: {
        gradeId: null,
        version: null,
        subjectIds: null,
        courseType: "",
        periodIds: null,
        campusIds: null,
        propertyIds: [2, 3]
      },
      product: [],
      choiceCourseArr: [],
      headInfo: {
        courseType: [],
        grades: null
      },
      loading: false,
      productLoading: false,
      listCourse: [],
      year: null//高考年份
    }
  },
  props: ["choiceCourse"],
  methods: {
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.headInfo = Object.assign({}, res.data)
        this.headInfo.courseType = courseType.resCourseType
        this.headInfo.versions = courseType.versions
        this.getSelectProductParam();//通过年份得到符合的年级
      })
    },
    findAllProduct () {
      if (
        this.productQuery.gradeId &&
        this.productQuery.version
      ) {
        findAllProduct({
          version: this.productQuery.version,
          propertyIds: [2, 3],
          gradeId: this.productQuery.gradeId
        }).then(res => {
          if (res.status == 200) {
            this.product = res.data
          }
        })
      }
    },
    findProductById () {
      this.listCourse = []
      this.productLoading = true
      if (!this.productQuery.productId) {
        this.$tipsMessage("请选择产品名称", "warning")
        return
      }
      if (this.productQuery.productId) {
        findProductById(Object.assign({
          propertyIds: [2, 3],
          productId: this.productQuery.productId
        }, this.productQuery)).then((res) => {
          this.productLoading = false
          res.data.forEach(element => {
            element.price = element.price.toLocaleString()
            element.giveAway = 0
            this.listCourse.push(element)
          });
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
            return
          }
        })
      }
    },
    //点击查询
    getCourse () {
      if (!this.courseQuery.gradeId) {
        this.$tipsMessage("年级必须选择", "warning")
        return
      }
      this.loading = true
      var periodIds = null, campusIds = null, subjectIds = null
      this.courseQuery.periodIds ? periodIds = [this.courseQuery.periodIds] : periodIds = null
      this.courseQuery.subjectIds ? subjectIds = [this.courseQuery.subjectIds] : subjectIds = null
      this.courseQuery.campusIds ? campusIds = [this.courseQuery.campusIds] : campusIds = null
      getCourse(Object.assign({}, this.courseQuery,
        { subjectIds: subjectIds },
        { periodIds: periodIds },
        { campusIds: campusIds }
      )).then(res => {
        this.listCourse = []
        this.loading = false
        if (res.status === 200) {
          res.data.forEach((val, index) => {
            this.listCourse.push(val)
            this.listCourse[index].price = val.price.toLocaleString()
            this.listCourse[index].giveAway = 0
          })
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
          }
        } else {
          this.$tipsMessage(res.message, "warning")
        }
      })
    },
    getSelectProductParam () {
      getSelectProductParam(this.year).then((res) => {
        // console.log(res.data.grades)
        this.headInfo.grades = Object.assign({}, res.data.grades)
      })
    },
    selectCourse (course) {
      this.choiceCourse = getSelectCourse(startDateChange(course), this.choiceCourse, this);
      this.$emit("update:choiceCourse", this.choiceCourse)
    },
    selectCourseFunction (course) {
      this.choiceCourseArr =
        startDateChange(Object.assign(course))
      this.$emit('update:choiceCourse', this.choiceCourseArr)
    },
    changeSelectCourse (val) {
      this.$emit("update:choiceCourse", val)
    },
    clearChange (val) {
      if (val == 1) {
        this.courseQuery = {
          gradeId: null,
          version: null,
          subjectIds: null,
          courseType: "",
          periodIds: null,
          campusIds: null,
          propertyIds: [2, 3]
        },
          this.listCourse = []
      }
      if (val == 2) {
        this.productQuery = {
          gradeId: null,
          version: null,
          productId: null
        }
        this.listCourse = []
      }
      if (val == 3) {
        this.courseQuery = {
          gradeId: null,
          version: null,
          subjectIds: null,
          courseType: "",
          periodIds: null,
          campusIds: null,
          propertyIds: [2, 3]
        }
        this.productQuery = {
          gradeId: null,
          version: null,
          productId: null
        }
        this.listCourse = []
      }
    },
    // 是否验证通过
    changePass (val) {
      this.$emit('update:isPass', val)
    }
  },
  mounted () {
    this.year = this.$route.query.year
    this.getHeadInfo()
  },
  components: { SelectTable, RecCourseChoiceCourse, RecEntryForm }
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
  border-radius: 0px !important;
}
</style>