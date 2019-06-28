<template>
  <div>
    <div class="container" style="margin-bottom:10px">
      <span class="fontSize" style="margin-right:20px">选择班教课程</span>
      <el-radio-group v-model="courseType" @change="clearChange(courseType)">
        <el-radio-button label="3">按报名表选课</el-radio-button>
        <el-radio-button label="2">按课程选课</el-radio-button>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          class="border-radio"
          content="在产品管理中打包所需课程组合后，可在此选择产品包。"
        >
          <el-radio-button label="1" slot="reference">按产品选课</el-radio-button>
        </el-popover>
      </el-radio-group>
    </div>

    <el-row v-show="courseType==1" type="flex" align="middle">
      <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
      <el-col :span="1" class="fontSize">班教</el-col>-->
      <el-col :span="3">
        <el-select
          v-model="productQuery.gradeId"
          placeholder="年级"
          clearable
          class="width120"
          @change="findAllProduct('产品')"
          @clear="clear"
        >
          <el-option
            v-for="item in headInfo.grades"
            :value="item.gradeId"
            :label="item.gradeName"
            :key="item.gradeId"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="productQuery.versions"
          placeholder="版本"
          clearable
          class="width120"
          @change="findAllProduct('产品','高考年份')"
        >
          <el-option v-for="item in headInfo.versions" :value="item" :label="item" :key="item"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="productQuery.productId" placeholder="产品名称" clearable class="width120">
          <el-option
            v-for="(item,index) in product"
            :value="item.productId"
            :label="item.productName"
            :key="index"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button
          :loading="productLoading"
          type="primary"
          icon="el-icon-search"
          @click="findProductById"
        >查询</el-button>
      </el-col>
    </el-row>

    <el-row v-show="courseType==2" type="flex" align="middle">
      <!-- <el-col :span="2" class="fontSize">产品属性</el-col>
      <el-col :span="1" class="fontSize">班教</el-col>-->
      <el-col :span="3">
        <el-select
          v-model="courseQuery.gradeId"
          placeholder="年级"
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
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="courseQuery.version"
          placeholder="版本"
          clearable
          class="width120"
          @change="findAllProduct('课程')"
        >
          <el-option v-for="item in headInfo.versions" :value="item" :label="item" :key="item"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="courseQuery.subjectId" placeholder="学科" clearable class="width120">
          <el-option
            v-for="item in headInfo.subjects"
            :value="item.subjectId"
            :label="item.subjectName"
            :key="item.subjectId"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="courseQuery.courseType" placeholder="课程类型" clearable class="width120">
          <el-option v-for="item in headInfo.courseType" :value="item" :label="item" :key="item"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="courseQuery.coursePeriodId" placeholder="阶段" clearable class="width120">
          <el-option
            v-for="item in headInfo.coursePeriods"
            :value="item.coursePeriodId"
            :label="item.coursePeriodName"
            :key="item.coursePeriodId"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="courseQuery.campusId" placeholder="校区" clearable class="width120">
          <el-option
            v-for="item in headInfo.campuses"
            :value="item.campusId"
            :label="item.campusName"
            :key="item.campusId"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button :loading="loading" type="primary" icon="el-icon-search" @click="getCourse">查询</el-button>
      </el-col>
    </el-row>

    <select-table
      ref="selectTable"
      :list-course="listCourse"
      @selectCourse="selectCourse"
      v-if="courseType==1||courseType==2"
    />

    <!-- 按报名表选课 -->
    <offline-entry-form
      v-show="courseType==3"
      @selectCourse="selectCourseFunction"
    ></offline-entry-form>
    <!-- 班教 -->
    <offline-choice-course
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
import SelectTable from "@/views/order/components/FullOrder/SelectTable/SelectTable";
import OfflineChoiceCourse from "@/views/order/components/FullOrder/SelectCourse/OfflineChoiceCourse";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import OfflineEntryForm from "@/views/order/components/FullOrder/OfflineCourse/OfflineEntryForm";
import {
  findAllProduct,
  getSelectProductParam,
  findProductById
} from "@/api/order/FullOrder";
import OfflnCourseMgtApi from "@/api/offline/OfflnCourseMgtApi";
import {
  getSelectCourse,
  listCourseSort,
  startDateChange
} from "@/views/order/FullOrderFunction/FullOrder.js";
import courseType from "@/CourseType/CourseType.js";
import offlineCourse from "@/api/offline/OfflnCourseMgtApi";

export default {
  components: { SelectTable, OfflineChoiceCourse, OfflineEntryForm },
  props: ["choiceCourse", "isPass"],
  data() {
    return {
      courseType: "3",
      productQuery: {
        gradeId: null,
        versions: null,
        productId: null
      },
      courseQuery: {
        gradeId: null,
        version: null,
        subjectId: null,
        courseType: "",
        coursePeriodId: null,
        campusId: null,
        pageNum: 1,
        pageSize: 20
      },
      product: [],
      headInfo: {
        courseType: [],
        grades: null
      },
      listCourse: [],
      choiceCourseArr: [],
      loading: false,
      productLoading: false,
      year: null // 上面页面传递来的高考年份
    };
  },
  mounted() {
    this.year = this.$route.query.year;
    // this.productQuery.year = this.year
    // this.courseQuery.year = this.year
    this.getHeadInfo();
  },
  methods: {
    // 通过产品查询课程
    findProductById() {
      if (!this.productQuery.productId) {
        this.$tipsMessage(
          "请选择产品名称,产品名称通过高考年份和年级查询",
          "warning"
        );
        return;
      }
      this.productLoading = true;
      this.listCourse = [];
      if (this.productQuery.productId) {
        findProductById(
          Object.assign(
            {
              propertyIds: 1,
              productId: this.productQuery.productId
            },
            this.productQuery
          )
        ).then(res => {
          this.productLoading = false;
          if (res.status == 200) {
            res.data.giveAway = 0;
            this.listCourse = listCourseSort(res.data);
            if (res.data == null || res.data == "" || res.data.length == 0) {
              this.$tipsMessage("没有课程满足您所选择的条件", "warning");
              return;
            }
          }
        });
      }
    },
    // 点击查询
    getCourse() {
      if ( !this.courseQuery.gradeId) {
        this.$tipsMessage('年级必须选择', 'warning')
        return
      }
      this.loading = true;
      offlineCourse.getCourseList(this.courseQuery).then(res => {
        this.listCourse = [];
        this.loading = false;
        if (res.status === 200) {
          if (res.data.list == null || res.data.list == "" || res.data.list.length == 0) {
            this.$tipsMessage("没有课程满足您所选择的条件", "warning");
          }
          res.data.list.giveAway = 0;
          this.listCourse = listCourseSort(res.data.list);
          // if (res.data.list == null || res.data.list == "" || res.data.list.length == 0) {
          //   this.$tipsMessage("没有课程满足您所选择的条件", "warning");
          //   return;
          // }
        } else {
          this.$tipsMessage(res.message, "warning");
        }
      });
    },
    clearChange(val) {
      if (val == 1) {
        this.courseQuery = {
          gradeId: null,
          versions: null,
          subjectId: null,
          courseType: "",
          coursePeriodId: null,
          campusId: null,
          pageNum: 1,
          pageSize: 20
        };
        this.listCourse = [];
      }
      if (val == 2) {
        this.productQuery = {
          gradeId: null,
          versions: null,
          productId: null
        };
        this.listCourse = [];
      }
      if (val == 3) {
        this.courseQuery = {
          gradeId: null,
          versions: null,
          subjectId: null,
          courseType: "",
          coursePeriodId: null,
          campusId: null,
          pageNum: 1,
          pageSize: 20
        };
        this.productQuery = {
          gradeId: null,
          versions: null,
          productId: null
        };
        this.listCourse = [];
      }
    },
    getSelectProductParam() {
      getSelectProductParam(this.year).then(res => {
        this.headInfo.grades = Object.assign({}, res.data.grades);
      });
    },
    changeSelectCourse(course) {
      this.$emit("update:choiceCourse", course);
    },
    selectCourse(course) {
      this.choiceCourse = startDateChange(
        Object.assign(getSelectCourse(course, this.choiceCourse, this))
      );

      // this.choiceCourse = getSelectCourse(course, this.choiceCourse, this)

      this.$emit("update:choiceCourse", this.choiceCourse);
    },
    selectCourseFunction(course) {
      this.choiceCourseArr = startDateChange(Object.assign(course));
      this.$emit("update:choiceCourse", this.choiceCourseArr);
    },
    // 是否验证通过
    changePass(val) {
      this.$emit("update:isPass", val);
    },
    //查询产品名称
    findAllProduct(courseType, year) {
      // this.getYears(courseType)
      if (
        this.productQuery.gradeId &&
        this.productQuery.versions &&
        courseType == "产品"
      ) {
        findAllProduct({
          versions: this.productQuery.versions,
          propertyIds: [1],
          gradeId: this.productQuery.gradeId
        }).then(res => {
          if (res.status == 200) {
            this.product = res.data;
            if (
              !res.data ||
              res.data == null ||
              res.data == "" ||
              res.data.length == 0
            ) {
              this.$tipsMessage("没有相关产品", "warning");
            }
          }
        });
      }
    },
    // 通过年级得到符合的高考年份
    getYears(str) {
      if (this.productQuery.gradeId || this.courseQuery.gradeId) {
        const date = new Date();
        let year = 0; //得到的符合的年份
        //当前点击的年级
        let gradeId =
          str == "产品" ? this.productQuery.gradeId : this.courseQuery.gradeId;
        if (date.getMonth() >= 9) {
          year = date.getFullYear() + (6 - gradeId + 1);
        } else {
          year = date.getFullYear() + (6 - gradeId);
        }
        let years = this.headInfo.years.filter(item => {
          return item - year <= 0;
        });

        if (str == "产品") {
          //清除原来选择的高考年份
          if (this.headInfo.year1.length != years.length) {
            this.productQuery.year = null;
          }
          this.headInfo.year1 = years;
        } else {
          if (this.headInfo.year2.length != years.length) {
            this.courseQuery.year = null;
          }
          this.headInfo.year2 = years;
        }
      }
    },
    // 当年级清空时，高考年份恢复
    clear() {
      this.getHeadInfo();
      // this.courseQuery.year = null
    },
    getHeadInfo() {
      getHeadInfo().then(res => {
        this.headInfo = Object.assign({}, res.data);
        // this.headInfo.year2 = Object.assign({}, res.data.years)
        // this.headInfo.year1 = Object.assign({}, res.data.years)
        this.headInfo.courseType = courseType.offlineCourseType;
        this.headInfo.versions = courseType.versions;
        this.getSelectProductParam()// 通过年份得到符合的年级
      });
    }
  }
};
</script>
<style scoped lang='scss'>
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
.el-row{
  margin-bottom:10px;
}
.border-radio /deep/ .el-radio-button__inner {
  border-radius: 0px !important;
}
</style>
