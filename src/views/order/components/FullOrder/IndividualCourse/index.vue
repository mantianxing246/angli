<template>
  <div>
    <div class="container" style="margin-bottom:10px">
      <span class="fontSize" style="margin-right:20px">选择在线个性化课程</span>
      <el-radio-group v-model="courseType" @change="clearChange(courseType)">
        <el-radio-button label="3">按报名表选课</el-radio-button>
        <el-radio-button label="1">按课程选课</el-radio-button>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="在产品管理中打包所需课程组合后，可在此选择产品包。"
          class="border-radio"
        >
          <el-radio-button label="2" slot="reference">按产品选课</el-radio-button>
        </el-popover>
      </el-radio-group>
    </div>

    <el-row type="flex" align="middle" v-show="courseType==2">
      <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
      <el-col :span="2" class="fontSize">在线个性化</el-col>-->
      <el-col :span="3">
        <el-select
          placeholder="年级"
          v-model="productQuery.gradeId"
          clearable
          class="width120"
          @change="findAllProduct('产品')"
          @clear="clear"
        >
          <el-option
            :value="item.gradeId"
            :label="item.gradeName"
            v-for="item in headInfo.grades"
            :key="item.gradeId"
            style="margin-bottom：-6px"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          placeholder="版本"
          v-model="productQuery.year"
          clearable
          class="width120"
          @change="findAllProduct('产品','高考年份')"
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
        :loading="productLoading"
        type="primary"
        icon="el-icon-search"
        @click="findProductById"
      >查询</el-button>
    </el-row>

    <el-row type="flex" align="middle" v-show="courseType==1">
      <!-- <el-col :span="2" class="fontSize">课程属性</el-col>
      <el-col :span="2" class="fontSize">在线个性化</el-col>-->
      <el-col :span="3">
        <el-select
          placeholder="年级"
          v-model="courseQuery.gradeId"
          clearable
          class="width120"
          @change="findAllProduct('课程')"
          @clear="clear"
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
          v-model="courseQuery.year"
          clearable
          class="width120"
          @change="findAllProduct('课程')"
        >
          <el-option :value="item" :label="item" v-for="item in headInfo.versions" :key="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select placeholder="学科" v-model="courseQuery.subjectId" clearable class="width120">
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
      <!-- <el-col :span="3">
        <el-select placeholder="阶段" v-model="courseQuery.periodIds" clearable class="width120">
          <el-option
            :value="item.coursePeriodId"
            :label="item.coursePeriodName"
            v-for="(item,index) in headInfo.coursePeriods"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select placeholder="校区" v-model="courseQuery.campusId" clearable class="width120">
          <el-option
            :value="item.campusId"
            :label="item.campusName"
            v-for="item in headInfo.campuses"
            :key="item.campusId"
          ></el-option>
        </el-select>
      </el-col>-->
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

    <individual-entryForm
      v-show="courseType==3"
      @selectCourse="selectCourseFunction" 
    ></individual-entryForm>
     <!-- <individual-entryForm
      v-show="courseType==3"
      @selectCourse="selectCourseFunction"
      @individualSelectList='individualSelectList'
      @opengOnlineCourse="getOpengOnlineCourse"
    ></individual-entryForm> -->
    <!-- 在线个性化 -->
    <individual-choice-course
      :choiceCourse.sync="choiceCourse"
      @changeSelectCourse="changeSelectCourse"
    ></individual-choice-course>
    <!-- 录播、直播 -->
    <!-- <rec-course-choice-course></rec-course-choice-course> -->
    <!-- 在线个性化 -->
    <!-- <individual-choice-course></individual-choice-course> -->
  </div>
</template> 
<script>
import SelectTable from '../SelectTable/SelectTable'
import IndividualChoiceCourse from '../SelectCourse/IndividualChoiceCourse'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import { findAllProduct, getSelectProductParam, findProductById, getCourse } from '@/api/order/FullOrder'
import OfflnCourseMgtApi from '@/api/offline/OfflnCourseMgtApi'
import { getSelectCourse, startDateChange } from '@/views/order/FullOrderFunction/FullOrder.js'
import IndividualEntryForm from '@/views/order/components/FullOrder/IndividualCourse/IndividualEntryForm'
import { findIndivCourseList } from '@/api/individual/IndivCourseMgt'
import courseType from "@/CourseType/CourseType.js";

export default {
  data () {
    return {
      courseType: "3",
      productQuery: {
        gradeId: null,
        versions: null,
        productId: null
      },
      courseQuery: {
        gradeId: null,
        versions: null,
        subjectId: null,
        courseType: "",
        periodIds: null,
        campusId: null
      },
      product: [],
      choiceCourseArr: [],
      headInfo: {
        courseType: [],
        grades: null
      },
      listCourse: [],
      loading: false,
      productLoading: false,//产品的loading
      year: null//高考年份
    }
  },
  props: ["choiceCourse"],
  methods: {
    findAllProduct (courseType, type) {
      // this.getYears(courseType)
      if (courseType == "产品" && type == "高考年份") {
        this.productQuery.productId = null
      }
      if (this.productQuery.gradeId && this.productQuery.versions && courseType == '产品') {
        findAllProduct({
          versions: this.productQuery.versions,
          propertyIds: [4],
          gradeId: this.productQuery.gradeId
        }).then((res) => {
          if (res.status == 200) {
            this.product = res.data
          }
        })
      }
    },
    //通过年级得到符合的高考年份
    getYears (str) {
      if (this.productQuery.gradeId || this.courseQuery.gradeId) {
        const date = new Date()
        let year = 0//得到的符合的年份
        //当前点击的年级
        let gradeId = (str == '产品') ? this.productQuery.gradeId : this.courseQuery.gradeId
        if (date.getMonth() >= 9) {
          year = date.getFullYear() + (6 - gradeId + 1)
        } else {
          year = date.getFullYear() + (6 - gradeId)
        }
        let years = this.headInfo.years.filter((item) => {
          return item - year <= 0
        })

        if (str == "产品") {
          //清除原来选择的高考年份
          if (this.headInfo.year1.length != years.length) {
            this.productQuery.year = null
          }
          this.headInfo.year1 = years
        } else {
          if (this.headInfo.year2.length != years.length) {
            this.courseQuery.year = null
          }
          this.headInfo.year2 = years
        }
      }
    },
    findProductById () {
      if (!this.productQuery.productId) {
        this.$tipsMessage("请选择产品名称,产品名称通过高考年份和年级查询", "warning")
        return
      }
      this.productLoading = true
      this.listCourse = []
      if (this.productQuery.productId) {
        findProductById(Object.assign({
          propertyIds: 4,
          productId: this.productQuery.productId
        }, this.productQuery)).then((res) => {
          this.productLoading = false
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
            return
          }
          if (res.status == 200) {
            res.data.forEach(element => {
              element.price = element.price.toLocaleString()
              element.giveAway = 0
              this.listCourse.push(element)
            });
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
      // var periodIds = null, campusIds = null
      // this.courseQuery.periodIds ? periodIds = [this.courseQuery.periodIds] : periodIds = null
      // this.courseQuery.campusIds ? campusIds = [this.courseQuery.campusIds] : campusIds = null
      findIndivCourseList(this.courseQuery).then(res => {
        this.listCourse = []
        this.loading = false
        if (res.status === 200) {
          for (var i = 0;i < res.data.list.length;i++) {
            this.listCourse.push(res.data.list[i])
            this.listCourse[i].price = res.data.list[i].price.toLocaleString()
            this.listCourse[i].giveAway = 0
          }
          if (res.data.list == null || res.data.list == "" || res.data.list.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
            return
          }
        } else {
          this.$tipsMessage(res.message, "warning")
        }
      })
    },
    getSelectProductParam () {
      getSelectProductParam(this.year).then((res) => {
        this.headInfo.grades = Object.assign({}, res.data.grades)
      })
    },
    selectCourse (course) {
      this.choiceCourse = startDateChange(Object.assign(getSelectCourse(course, this.choiceCourse, this)))
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
          versions: null,
          subjectId: null,
          courseType: "",
          periodIds: null,
          campusId: null
        }
        this.listCourse = []
      }
      if (val == 2) {
        this.productQuery = {
          gradeId: null,
          versions: null,
          productId: null
        }
        this.listCourse = []
      }
      if (val == 3) {
        this.courseQuery = {
          gradeId: null,
          versions: null,
          subjectId: null,
          courseType: "",
          periodIds: null,
          campusId: null
        }
        this.listCourse = []
        this.productQuery = {
          gradeId: null,
          versions: null,
          productId: null
        }
      }
    },
    //当年级清空时，高考年份恢复
    clear () {
      this.getHeadInfo()
      // this.courseQuery.year = null
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.headInfo = Object.assign({}, res.data)
        // this.headInfo.year2 = Object.assign({}, res.data.years)
        // this.headInfo.year1 = Object.assign({}, res.data.years)
        this.headInfo.courseType = courseType.individualCourseType
        this.headInfo.versions = courseType.versions
        this.getSelectProductParam();//通过年份得到符合的年级
      })
    },
    //红头文件匹配的时候需要用的字段
    // getOpengOnlineCourse (val) {
    //   if (val == 1) {
    //     this.$emit("getOpengOnlineCourse", true)
    //   } else {
    //     this.$emit("getOpengOnlineCourse", false)
    //   }
    // }
  },
  mounted () {
    this.year = this.$route.query.year
    // this.productQuery.year = this.year
    // this.courseQuery.year = this.year
    this.getHeadInfo()
  },
  components: { SelectTable, IndividualChoiceCourse, IndividualEntryForm }
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
.el-row{
  margin-bottom:10px;
}
</style>