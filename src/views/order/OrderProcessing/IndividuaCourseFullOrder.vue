/*
@author Andy
@date 2019/1/18
*/
<template>
  <div>
    <card-container :paddingValue="10">
      <template slot="body">
        <!-- <select-course
          :choice-course.sync="choiceCourse"
          @individualSelectList="individualSelectList"
          @getOpengOnlineCourse="getOpengOnlineCourse"
        />-->
        <select-course :choice-course.sync="choiceCourse"/>
        <el-steps :active="step" finish-status="success" style="margin-top:20px">
          <el-step title="选择产品"/>
          <el-step title="选择课程"/>
          <el-step title="付费信息"/>
          <el-step title="销售信息"/>
        </el-steps>
        <el-row type="flex" justify="center" style="margin-top:10px">
          <el-col :span="2">
            <el-button @click="goBack">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="prevClick">上一步</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="stepClick">下一步</el-button>
          </el-col>
        </el-row>
      </template>
    </card-container>
  </div>
</template>
<script>
import { storage } from "@/api/order/OrderDetailApi";
import { findStudent } from "@/api/order/StudentApi";
import SelectCourse from "@/views/order/components/FullOrder/IndividualCourse/index";
import { findProductByOrder } from "@/api/order/FullOrder";
import { nextStepPath, prevClickPath } from "../FullOrderFunction/FullOrder.js";

export default {
  name: "FullOrder",
  components: { SelectCourse },
  props: {
    studentId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      courses: [],
      step: 2, // 进度条进度
      choiceCourse: [],
      choiceCourseArr: [],
      orderId: null
      // opengOnlineCourse: true,//红头文件需要匹配的字段
    };
  },
  mounted() {
    this.courses = JSON.parse(localStorage.getItem("courses"));
    this.orderId = this.$route.query.orderId;
    // this.findProductByOrder()
    this.getLocalStorageChoiceCourse();
  },
  methods: {
    // 下一步
    stepClick() {
      var indexArr = [], // 寻找当前页面是跳到的第几个页面数组
        index = 0; // 当前页面的在被选中的课程中的下标
      indexArr = this.courses.filter(item => {
        return item == 3;
      });
      index = this.courses.indexOf(indexArr[0]);
      if (this.choiceCourse.length > 0) {
        for (var i = 0; i < this.choiceCourse.length; i++) {
          if (this.choiceCourse[i].startDate > this.choiceCourse[i].endDate) {
            return this.$tipsMessage("结束日期不可小于开始日期", "warning");
          }
        }
        this.choiceCourseArr.push(this.choiceCourse);
        localStorage.setItem(
          "choiceCourse",
          JSON.stringify(this.choiceCourseArr)
        );
        this.stepNext(index);
      } else {
        this.$tipsMessage("请选择你要选择的课程", "warning");
      }
    },
    stepNext(index) {
      var {
        year,
        courseChangeInfoId,
        oldOrderId,
        TransferFull,
        callback
      } = this.$route.query;
      var courseChangeInfoId = this.$route.query.courseChangeInfoId;
      if (index + 1 >= this.courses.length) {
        let course = JSON.parse(localStorage.getItem("giveCourseCus"));
        if (course[0]) {
          this.$router.push({
            path: "/OrderMgt/FullOrder/" + this.studentId + "/giveCourse",
            query: {
              orderId: this.orderId,
              courseChangeInfoId: courseChangeInfoId,
              oldOrderId: oldOrderId,
              year: year,
              TransferFull: TransferFull,
              callback: callback
            }
          });
        } else {
          this.$router.push({
            path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep2",
            query: {
              orderId: this.$route.query.orderId,
              oldOrderId: this.$route.query.oldOrderId,
              courseChangeInfoId: this.$route.query.courseChangeInfoId,
              year: this.$route.query.year,
              TransferFull: this.$route.query.TransferFull,
              callback: this.$route.query.callback
            }
          });
        }

        return;
      }
      var nextPage = this.courses[index + 1];
      // 判断跳那个路径
      nextStepPath({
        page: nextPage,
        year: year,
        studentId: this.studentId,
        orderId: this.orderId,
        router: this.$router,
        courseChangeInfoId: courseChangeInfoId,
        oldOrderId: oldOrderId,
        TransferFull: TransferFull,
        callback: callback
      });
    },
    // 回显
    findProductByOrder() {
      const course = [];
      if (this.orderId) {
        findProductByOrder(this.orderId).then(res => {
          for (let i = 0; i < res.data.orderCourseList.length; i++) {
            if (
              res.data.orderCourseList[i].courseProperty == 4 &&
              res.data.orderCourseList[i].giveAway === 0
            ) {
              res.data.orderCourseList[i].price = res.data.orderCourseList[
                i
              ].price.toLocaleString();
              course.push(res.data.orderCourseList[i]);
            }
          }
          this.choiceCourse = course;
        });
      }
    },
    // 得到localstroge的存储选择课程的信息
    getLocalStorageChoiceCourse() {
      let courseArr = JSON.parse(localStorage.getItem("choiceCourse"));
      courseArr.length > 0
        ? (this.choiceCourseArr = courseArr)
        : (this.choiceCourseArr = []);
      if (courseArr.length > 0) {
        for (let i = 0; i < courseArr.length; i++) {
          if (
            courseArr[i][0].courseProperty === 4 ||
            courseArr[i][0].coursePropertyName == "个性化"
          ) {
            this.choiceCourse = courseArr[i];
            this.choiceCourseArr.splice(i, 1);
            return;
          }
        }
      }
      this.choiceCourse.length > 0 ? null : this.findProductByOrder();
    },
    // 上一步
    prevClick() {
      this.$router.push({
        path: prevClickPath(this.courses, 3, this.studentId),
        query: this.$route.query
      });


      if (this.choiceCourse.length > 0) {
        this.choiceCourseArr.push(this.choiceCourse);
      }
      localStorage.setItem(
        "choiceCourse",
        JSON.stringify(this.choiceCourseArr)
      );
    },
    // 返回
    goBack() {
      if (this.orderId) {
        this.$router.push({
          path: "/OrderMgt/StudentOrderDeal",
          query: {
            id: this.studentId
          }
        });
      } else {
        this.$router.push("/OrderMgt/StudentOrderDeal");
      }
    }
  }
};
</script>
<style scoped>
.marginTop20px {
  margin: 20px 0px 0px 0px;
  color: #909399;
}
.product {
  margin: 20px 20px 20px 20px;
  color: #909399;
}

.course {
  margin: 20px 20px 20px 20px;
  color: #909399;
}
.font-size-thick {
  font-weight: bold;
  color: #909399;
}
</style>
