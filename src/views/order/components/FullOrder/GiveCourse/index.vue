<template>
  <div>
    <div class="container">
      <span class="fontSize" style="margin-right:20px">选择赠送课程</span>
      <el-radio-group v-model="courseType">
        <el-radio-button label="2">按课程选课</el-radio-button>
      </el-radio-group>
    </div>

    <el-row class=".el-form-item__label" style="margin:10px 0 5px 0;">
      <el-col>
        <el-form inline>
          <el-form-item class="bottom">
            <el-input
              v-model="listQuery.courseName"
              placeholder="课程名称"
              style="width: 200px"
              clearable
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item class="bottom">
            <el-select v-model="listQuery.provinceId" clearable placeholder="省市" class="width120">
              <el-option
                v-for="item in headInfo.provinces"
                :value="item.provinceId"
                :key="item.provinceId"
                :label="item.provinceName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-select v-model="listQuery.gradeId" clearable placeholder="课程年级" class="width120">
              <el-option
                v-for="item in headInfo.grades"
                :value="item.gradeId"
                :key="item.gradeId"
                :label="item.gradeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-select v-model="listQuery.version" clearable placeholder="版本" class="width120">
              <el-option v-for="item in versions" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-select v-model="listQuery.propertyId" clearable placeholder="课程属性" class="width120">
              <!-- <el-option
                v-for="item in evenNumbers"
                :value="item.propertyId"
                :key="item.propertyId"
                :label="item.propertyName"
              >{{ item.propertyName }}</el-option> -->
              <el-option
                v-for="item in headInfo.properties"
                :value="item.propertyId"
                :key="item.propertyId"
                :label="item.propertyName"
              >{{ item.propertyName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-button
              type="primary"
              @click.stop="findCourseBySmallOnlineCourses"
              icon="el-icon-search"
              :loading="loading"
            >查询</el-button>
          </el-form-item>
          <br>
          <el-form-item class="bottom">
            <el-checkbox-group v-model="listQuery.subjectId">
              <el-checkbox
                v-for="item in headInfo.subjects"
                :label="item.subjectId"
                :key="item.subjectId"
                :value="item.subjectName"
              >{{item.subjectName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <select-table ref="selectTable" :list-course="listCourse" @selectCourse="selectCourse"/>
    <!-- 班教 -->
    <give-choice-course :choiceCourse.sync="choiceCourse" @changeSelectCourse="changeSelectCourse"></give-choice-course>
    <!-- 录播、直播 -->
    <!-- <rec-course-choice-course></rec-course-choice-course> -->
    <!-- 在线个性化 -->
    <!-- <individual-choice-course></individual-choice-course> -->
  </div>
</template> 
<script>
import SelectTable from "@/views/order/components/FullOrder/SelectTable/GiveSelectTable";
import GiveChoiceCourse from "@/views/order/components/FullOrder/SelectCourse/GiveChoiceCourse";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import courseType from '@/CourseType/CourseType';
import {
  findAllProduct,
  getSelectProductParam,
  findProductById,
  getCourse
} from "@/api/order/FullOrder";
import OfflnCourseMgtApi from "@/api/offline/OfflnCourseMgtApi";
import {
  getSelectCourse,
  startDateChange
} from "@/views/order/FullOrderFunction/FullOrder.js";
import { findCourseBySmallOnlineCourses } from "@/api/order/FullOrder";
import { all } from "q";
import { constants } from "crypto";

export default {
  components: { SelectTable, GiveChoiceCourse },
  props: ["choiceCourse"],
  data () {
    return {
      courseType: "1",
      listQuery: {
        courseName: "", //课程名称
        provinceId: "", // 省市
        gradeId: "", // 课程年级
        subjectId: [], // 学科
        propertyId: "", //课程属性
        version: ""
      },
      courseType: 2,
      product: [],
      headInfo: {
        courseType: [],
        grades: null,
        properties: []
      },
      listCourse: [],
      loading: false,
      properties: [], //课程属性
      year: null, //高考年份
      choiceCourseArr: [] //选中的赠送课
    };
  },
  computed: {
    // evenNumbers () {
    //   return this.headInfo.properties.filter(function (val) {
    //     return val.propertyId !== 1;
    //   });
    // }
  },
  mounted () {
    this.getHeadInfo(); // 查询高考年份、学科等
  },
  created () {
    this.getHeadInfo()
    this.versions = courseType.versions
  },
  methods: {
    //点击查询
    findCourseBySmallOnlineCourses () {
      let netCourseList = [];
      this.listQuery.subjectId.forEach((val, index) => {
        netCourseList.push(val);
      });
      this.listQuery.subjectId = netCourseList;
      this.loading = true;
      this.listCourse = [];
      findCourseBySmallOnlineCourses(this.listQuery).then(res => {
          this.loading = false;
        if (res.status == 200) {
           if (res.data == null || res.data == "" || res.data.length == 0) {
            return this.$tipsMessage("没有课程满足您所选择的条件", "warning");
          }
          for (var i = 0;i < res.data.length;i++) {
            res.data[i].price = res.data[i].totalPrice;
            res.data[i].startDate = res.data[i].beginDate;
            res.data[i].giveAway = 1;
            res.data[i].startTimes = 1;
            res.data[i].endTimes =res.data[i].times;
            res.data[i].courseProperty = res.data[i].propertyId;
            this.listCourse = res.data;
          }
        }
        this.loading = false;
      });
    },
    selectCourse (course) {
      let courseArr = getSelectCourse(course, this.choiceCourse, this)
      if (courseArr) {
        this.choiceCourse = startDateChange(courseArr);
      }
      this.$emit("update:choiceCourse", this.choiceCourse);
    },
    changeSelectCourse (course) {
      this.$emit("update:choiceCourse", course);
    },
    clear (val) {
      switch (val) {
        case "课程名称":
          this.listQuery.courseName = null;
          break;
      }
    },
    getHeadInfo () {
      getHeadInfo().then(res => {
        if (res.status == 200) {
          this.headInfo = res.data
          this.headInfo.provinces = res.data.provinces;
          // this.getSelectProductParam()// 通过年份得到符合的年级
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.margin-top20 {
  margin-top: 20px;
}
.border-bottom {
  height: 6px;
  border-bottom: 2px solid #909399;
}
.width120 {
  width: 120px;
}
.fontSize {
  font-size: 15px;
}
.el-checkbox + .el-checkbox {
  margin-left: 10px;
  margin-right: 0px;
}
.el-checkbox {
  margin-right: 0px;
}
.bottom {
  margin-bottom: 0px;
}
.el-row {
  margin-bottom: 0px;
}
>>> .el-checkbox__label {
  padding-left: 4px;
}
.el-form--inline .el-form-item {
  margin-right: 0px;
}
</style>