<template>
  <div class="entry-form">
    <!-- <h2>报名班教课程项目:</h2> -->
    <div style="margin-left:20px;">
      <div class="margin-bottom">
        <!-- <el-button
          type="primary"
          class="but"
          @click="findCourseByOffInEntryForm"
          v-loading="loading"
        >确认</el-button>-->
        <el-form inline style="margin-top:5px" v-for="(item,index) in list" :key="index">
          <el-form-item style="margin-right:30px">
            <span class="form-item-rigth">{{item.campusName}}</span>
            <el-select
              :placeholder="item.campusNamePlacehold"
              v-model="item.campusId"
              clearable
              class="width120"
            >
              <el-option
                :value="item.campusId"
                :label="item.campusName"
                v-for="item in item.campuses"
                :key="item.campusId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right:30px">
            <span class="form-item-rigth">{{item.courseTypeName}}</span>
            <el-select
              :placeholder="item.courseTypePlaceholder"
              v-model="item.courseTypeId"
              clearable
              class="width120"
            >
              <el-option :value="item" :label="item" v-for="item in item.courseType" :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="form-item-rigth">{{item.gradeName}}</span>
            <el-select
              :placeholder="item.gradePlaceholder"
              v-model="item.gradeId"
              clearable
              class="width120"
            >
              <el-option
                :value="item.gradeId"
                :label="item.gradeName"
                v-for="item in headInfo.grades"
                :key="item.gradeId"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-button circle :icon="item.icon" @click="add(item.icon,index)" class="font-size"></el-button> -->
          <el-form-item>
            <span @click="add(item.icon,index)">
              <svg-icon
                icon-class="add"
                v-if="item.icon==='el-icon-circle-plus'"
                class="font-size"
              />
              <svg-icon icon-class="reduce" v-else class="font-size"/>
            </span>
          </el-form-item>

          <br>
          <el-form-item label="学科">
            <!-- <span class="form-item-rigth" style="display:inline-block">学科</span> -->
            <el-checkbox-group v-model="item.subject">
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
              <el-checkbox :label="6">政治</el-checkbox>
              <el-checkbox :label="8">地理</el-checkbox>
              <el-checkbox :label="9">生物</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="阶段">
            <!-- <span class="form-item-rigth">阶段</span> -->
            <el-checkbox
              v-model="item.selectAll1"
              @change="selectAllChange"
              :indeterminate="item.isIndeterminate1"
              style="display:inline"
            >全年</el-checkbox>
            <el-checkbox-group
              v-model="item.stage"
              style="display:inline"
              @change="selectAllChangeClick(item.stage)"
            >
              <el-checkbox :label="1">春</el-checkbox>
              <el-checkbox :label="2">暑</el-checkbox>
              <el-checkbox :label="3">秋</el-checkbox>
              <el-checkbox :label="4">寒</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-row type="flex" justify="center">
      <el-col :span="2">
        <el-button
          type="primary"
          @click="findCourseByOffInEntryForm"
          :loading="loading"
          icon="el-icon-shopping-cart-full"
        >加入课程列表</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { getSelectProductParam } from "@/api/order/FullOrder.js";
import OrderDetailApi from "@/api/order/OrderDetailApi";
import courseType from "@/CourseType/CourseType.js";
import { findCourseByOffInEntryForm } from "@/api/order/FullOrder";
import { listCourseSort } from "@/views/order/FullOrderFunction/FullOrder.js";
export default {
  name: "EntryForm",
  props: ["listQuery"],
  data() {
    return {
      courseQuery: {
        gradeId: null,
        version: null,
        subjectIds: null,
        courseType: null,
        periodIds: null,
        campusIds: null,
        propertyIds: [2, 3]
      },
      headInfo: {
        courseType: [],
        campusIds: null
      },
      year: null, // 上面页面传递来的高考年份
      loading: false,
      list: [
        {
          campusName: "校区",
          campusNamePlacehold: "校区",
          campuses: [],
          courseTypeName: "课程类型",
          courseTypePlaceholder: "课程类型",
          courseType: courseType.offlineCourseType,
          gradeName: "年级",
          gradePlaceholder: "年级",
          grades: [],
          icon: "el-icon-circle-plus",
          campusId: [],
          gradeId: [],
          courseTypeId: [],
          stageName: "阶段",
          stage: [],
          subjectName: "学科",
          subject: [],
          selectAll1: false,
          isIndeterminate1: false
        }
      ],
      campuses: [],
      courseType: [],
      grades: [],
      tempes: []
    };
  },
  methods: {
    getSelectProductParam() {
      getSelectProductParam(this.year).then(res => {
        this.headInfo.grades = Object.assign({}, res.data.grades);
      });
    },
    findCourseByOffInEntryForm() {
      let offInCourseQueryList = this.getNetCourseList();
      localStorage.setItem("temp", offInCourseQueryList);
      if (offInCourseQueryList.length <= 0) {
        this.$tipsMessage("年级,校区和课程类型必选", "warning");
        return;
      }
      this.loading = true;
      findCourseByOffInEntryForm({
        year: this.$route.query.year,
        offInCourseQueryList
      }).then(res => {
        this.loading = false;
        if (res.status == 200) {
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage("没有课程满足您所选择的条件", "warning");
          }
          res.data.giveAway = 0;
          let course = listCourseSort(res.data);
          this.$emit("selectCourse", course);
        }
      });
      this.$store.dispatch("OFFLINSELECTLISTARR", this.list);
    },
    getNetCourseList() {
      let offInCourseQueryList = [];
      this.list.forEach((val, index) => {
        if (val.campusId && val.courseTypeId && val.gradeId) {
          offInCourseQueryList.push({
            campusId: val.campusId,
            courseType: val.courseTypeId,
            gradeId: val.gradeId,
            subjectIds: val.subject,
            coursePeriodIds: val.stage
          });
        }
      });
      return offInCourseQueryList;
    },
    getHeadInfo() {
      getHeadInfo().then(res => {
        this.headInfo = Object.assign({}, res.data);
        this.campuses = res.data.campuses;
        this.list[0].campuses = this.campuses;
        this.list[0].courseType = courseType.offlineCourseType;
        this.getSelectProductParam(); // 通过年份得到符合的年级
      });
    },
    add(icon, index) {
      if (icon == "el-icon-circle-plus") {
        this.list.push({
          campusName: "校区",
          campusNamePlacehold: "校区",
          campuses: this.campuses,
          courseTypeName: "课程类型",
          courseTypePlaceholder: "课程类型",
          courseType: courseType.offlineCourseType,
          gradeName: "年级",
          gradePlaceholder: "年级",
          grades: this.grades,
          icon: "el-icon-remove",
          campusId: null,
          gradeId: null,
          courseTypeId: null,
          stageName: "阶段",
          stage: [],
          subjectName: "学科",
          subject: [],
          isIndeterminate1: false,
          selectAll1: false
        });
      } else {
        this.list.splice(index, 1);
      }
    },
    selectAllChange(val) {
      for (var i = 0; i < this.list.length; i++) {
        // console.log(this.list[i].selectAll1)
        if (this.list[i].selectAll1) {
          this.list[i].stage = [1, 2, 3, 4];
          this.list[i].isIndeterminate1 = false;
        } else {
          this.list[i].stage = [];
        }
      }
    },
    selectAllChangeClick(val) {
      for (var i = 0; i < this.list.length; i++) {
        this.list[i].stage.length > 0 && this.list[i].stage.length < 4
          ? (this.list[i].isIndeterminate1 = true)
          : (this.list[i].isIndeterminate1 = false);
        if (this.list[i].stage.length >= 4) {
          this.list[i].selectAll1 = true;
        } else {
          this.list[i].selectAll1 = false;
        }
      }
    },
    getResSelectList() {
      this.list = this.$store.getters.offlinSelectListArr;
    }
  },
  mounted() {
    this.year = this.$route.query.year;
    this.getHeadInfo();
  },
  created() {
    this.getResSelectList();
  }
};
</script>
<style scoped>
.entry-form {
  font-size: 14px;
}
.margin-bottom10 {
  margin-bottom: 10px;
}
.but {
  margin-left: 60%;
  display: inline;
}
.width120 {
  width: 120px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox {
  margin-right: 5px;
}
.font-size {
  font-size: 20px;
  cursor: pointer;
}
.el-row {
  margin: 5px 0 10px 0;
}
>>> .el-form-item__label {
  line-height: 25px;
}
>>> .el-form-item--mini .el-form-item__content,
.el-form-item--mini .el-form-item__label {
  line-height: 25px;
}
>>> .el-checkbox__label {
  padding-right: 6px;
}
>>> .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
>>> label {
  font-weight: normal;
}
>>> .el-checkbox__label {
  padding-left: 5px;
}
</style>
