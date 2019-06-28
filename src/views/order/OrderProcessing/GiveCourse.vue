/*
@author Andy
@date 2019/1/18 
*/
<template>
  <div style="margin-top:10px">
    <card-container :paddingValue="10">
      <template slot="body">
        <select-course ref :choice-course.sync="choiceCourse" :is-pass.sync="isPass"/>
        <el-steps :active="step" finish-status="success" style="margin-top:20px">
          <el-step title="选择产品"></el-step>
          <el-step title="选择课程"></el-step>
          <el-step title="付费信息"></el-step>
          <el-step title="销售信息"></el-step>
        </el-steps>

        <el-row type="flex" justify="center" style="margin-top:10px">
          <el-col :span="2">
            <el-button @click="goBack">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="preStep">上一步</el-button>
          </el-col>
          <!-- <el-col :span="2" v-if="!(courseChangeInfoId&&!orderId)">
        <el-button type="primary" @click="createNormalOrder">暂存</el-button>
          </el-col>-->
          <el-col :span="2">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>
      </template>
    </card-container>
  </div>
</template>
<script>
import pagination from "@/components/Pagination";
import { findStudent } from "@/api/order/StudentApi";
import SelectCourse from "@/views/order/components/FullOrder/GiveCourse/index";
import {
  findCourseBySmallOnlineCourses,
  findProductByOrder
} from "@/api/order/FullOrder";
import {
  full2CreateNormalOrder,
  getCourseInfoList,
  prevClickPath
} from "@/views/order/FullOrderFunction/FullOrder.js";
export default {
  name: "FullOrder",
  components: { SelectCourse },
  data() {
    return {
      total: 0,
      listLoading: false,
      list: [],
      choiceCourse: [], // 选中的班教课程
      choiceCourseArr: [],
      radioValue: null,
      radioRow: null, //单选选中的行
      step: 2, //进度条进度
      isPass: true, // 所填信息是否正确
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        provinceId: null,
        courseType: null,
        isOnline: null,
        isPublish: null,
        courseName: null
      }
    };
  },
  methods: {
    //上一步
    preStep() {
      this.$router.push({
        path: prevClickPath(
          JSON.parse(localStorage.getItem("courses")),
          -1,
          this.studentId
        ),
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
    //下一步
    nextStep() {
      if (this.choiceCourse.length === 0) {
        this.$tipsMessage("未加入课程！", "warning");
        return false;
      } else if (this.choiceCourse.length > 0) {
        for (var i = 0; i < this.choiceCourse.length; i++) {
          if (this.choiceCourse[i].startDate > this.choiceCourse[i].endDate) {
            return this.$tipsMessage("结束日期不可小于开始日期", "warning");
          }
        }
        this.choiceCourseArr.push(this.choiceCourse);
      }
      localStorage.setItem(
        "choiceCourse",
        JSON.stringify(this.choiceCourseArr)
      );
      this.$router.push({
        path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep2",
        query: {
          orderId: this.$route.query.orderId,
          oldOrderId: this.$route.query.oldOrderId,
          courseChangeInfoId: this.$route.query.courseChangeInfoId,
          year: this.$route.query.year,
          // opengOnlineCourse: this.$route.query.opengOnlineCourse,
          TransferFull: this.$route.query.TransferFull,
          callback: this.$route.query.callback
        }
      });
    },
    // 得到localstroge的存储选择课程的信息
    getLocalStorageChoiceCourse() {
      let courseArr = JSON.parse(localStorage.getItem("choiceCourse"));
      courseArr.length > 0
        ? (this.choiceCourseArr = JSON.parse(JSON.stringify(courseArr)))
        : this.choiceCourseArr == [];
      if (courseArr.length > 0) {
        for (let i = 0; i < courseArr.length; i++) {
          if (courseArr[i][0].giveAway === 1) {
            this.choiceCourse = courseArr[i];
            this.choiceCourseArr.splice(i, 1);
            break;
          }
        }
      }
      this.choiceCourse.length > 0 ? null : this.findProductByOrder();
    },
    // 回显
    findProductByOrder() {
      const course = [],
        orderId = parseInt(this.$route.query.orderId);
      if (orderId) {
        findProductByOrder(orderId).then(res => {
          for (let i = 0; i < res.data.orderCourseList.length; i++) {
            if (res.data.orderCourseList[i].giveAway != 0) {
              res.data.orderCourseList[i].price = res.data.orderCourseList[
                i
              ].price.toLocaleString();
              res.data.orderCourseList[i].propertyName =
                res.data.orderCourseList[i].coursePropertyName;
              // res.data.orderCourseList[i].giveAway = 1;
              course.push(res.data.orderCourseList[i]);
            }
          }
          this.choiceCourse = course;
        });
      }
    },
    //返回
    goBack() {
      // if (this.orderId) {
      //   this.$router.push({
      //     path: "/OrderMgt/OrderDetail",
      //     query: {
      //       id: this.studentId
      //     }
      //   });
      // } else {
      this.$router.push("/OrderMgt/StudentOrderDeal");
      // }
    }
  },
  created() {
    this.studentId = this.$route.params.studentId;
    this.getLocalStorageChoiceCourse();
  }
};
</script>
<style>
.marginTop20px {
  margin: 20px 0px 0px 0px;
}
.courseColor {
  font-size: 14px;
}
.font-size-thick {
  font-weight: bold;
  margin-top: 20px;
}
</style>
