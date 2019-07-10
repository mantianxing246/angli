/*
@author Andy
@date 2019/1/18
*/
<template>
  <div class="courseColor">
    <card-container :paddingValue="10">
      <template slot="body">
        <h3 class="container courseStep3">已选课程</h3>
        <!-- 班教列表 -->
        <offline-course-table
          v-if="tableIsShow.offlineCourse"
          :offlineListCourse.sync="coursePriceWentDutchArr[0]"
          class="marginTop20px"
        ></offline-course-table>
        <!-- 录播、直播列表 -->
        <rec-course-table v-if="tableIsShow.recCourse" :recListCourse.sync="coursePriceWentDutchArr[1]" class="marginTop20px"></rec-course-table>
        <!-- <rec-course-table v-if="recordList.length" :recListCourse.sync="recordList"></rec-course-table> -->
        <!-- 在线个性化 -->
        <individual-course-table
          v-if="tableIsShow.individuaCourse"
          :individuaListCourse.sync="coursePriceWentDutchArr[2]"
          class="marginTop20px"
        ></individual-course-table>

        <!-- 非学科 -->
        <non-subject-course-table
          v-if="tableIsShow.nonSubjectCourse"
          :nonSubjectListCourse.sync="coursePriceWentDutchArr[3]"
          class="marginTop20px"
        ></non-subject-course-table>

        <!-- 其他 -->
        <other-course-table
          v-if="tableIsShow.otherCourse"
          :otherListCourse.sync="coursePriceWentDutchArr[4]"
          class="marginTop20px"
        ></other-course-table>
        
        <!-- 赠送课程 -->
        <give-course v-if="tableIsShow.giveCourse" :giveCourse.sync="coursePriceWentDutchArr[5]"></give-course>
      </template>
    </card-container>

    <card-container :paddingValue="10">
      <template slot="body">
        <full-order3 class="marginTop20px" ref="fullOrder3" :list-query.sync="listQuery"></full-order3>

        <el-steps :active="step" finish-status="success" style="margin-top:10px">
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
          <el-col :span="2" v-if="!(courseChangeInfoId&&!orderId)">
            <el-button
              type="primary"
              @click="createNormalOrder(false,'暂存')"
              :loading="zcLoading"
            >&nbsp;&nbsp;暂存&nbsp;&nbsp;</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="createNormalOrder(true,'添加')"
              :loading="sureLoading"
            >&nbsp;&nbsp;确认&nbsp;&nbsp;</el-button>
          </el-col>
        </el-row>
      </template>
    </card-container>
  </div>
</template>
<script>
import { findStudent } from "@/api/order/StudentApi";
import { createNormalOrder } from "@/api/order/FullOrder";
import FullOrder3 from "@/views/order/components/FullOrder/FullOrder3";
import OfflineCourseTable from "@/views/order/components/FullOrder/OfflineCourse/OfflineCourseTable";
import RecCourseTable from "@/views/order/components/FullOrder/RecCourseCourse/RecCourseTable";
import IndividualCourseTable from "@/views/order/components/FullOrder/IndividualCourse/IndividualCourseTable";
import NonSubjectCourseTable from "@/views/order/components/FullOrder/NonSubjectCourse/NonSubjectCourseTable";
import OtherCourseTable from "@/views/order/components/FullOrder/OtherCourse/OtherCourseTable";
import giveCourse from "@/views/order/components/FullOrder/GiveCourse/GiveCourseTable";
import {
  findProductByOrder,
  discountMatch,
  coursePriceWentDutch
} from "@/api/order/FullOrder";
import {
  getCourseInfoList,
  full3CreateNormalOrder
} from "@/views/order/FullOrderFunction/FullOrder.js";

export default {
  name: "FullOrder",
  components: {
    FullOrder3,
    OfflineCourseTable,
    RecCourseTable,
    IndividualCourseTable,
    NonSubjectCourseTable,
    OtherCourseTable,
    giveCourse
  },
  props: {
    studentId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      courses: [],
      orderId: null, //订单号
      step: 4, //进度条进度
      student: {}, //学生信息
      choiceCourse: [], //记录在localstroge中选择的值
      offlineListCourse: [], //班教localstroge内容
      recListCourse: [], //录播，直播localstroge内容
      individuaListCourse: [], //在线个性化localstroge内容
      nonSubjectCourse: [], //非学科localstroge内容
      otherCourse: [], //其他localstroge内容
      giveCourse: [], //其他localstroge内容
      liveList: [], //直播
      recordList: [], //录播
      tableIsShow: {
        offlineCourse: false,
        recCourse: false,
        individuaCourse: false,
        nonSubjectCourse: false,
        otherCourse: false,
        giveCourse: false
      },
      zcLoading: false,
      sureLoading: false,
      orderMarketing: this.$store.state.fullStorage.info, //从暂存页面保存的数据
      orderId: null,
      list: {},
      listQuery: {
        divide: "否",
        payable: this.$store.state.fullStorage.info.actual, //实收金额：
        isContinuous: 1, //是否续保
        provinceId: null, //省市id
        sourceType: null, //收入类别
        marketType: null, //市场手段
        registerType: null, //报名场合
        salesUser: null, //销售人员id
        salesUserDeptId: null, //销售人员部门Id
        salesUserRoleId: null, //销售人员角色Id
        divideUser: null, //	销售分成人员
        divideUserDeptId: null, //销售分成部门人员
        divideUserRoleId: null, //销售分成角色人员
        createUserName: JSON.parse(localStorage.getItem("states")).user.name, //开单人员
        createUser: JSON.parse(localStorage.getItem("states")).user.userId //开单id
      },
      courseList: [], //红头文件课程列表
      courseChangeInfoId: this.$route.query.courseChangeInfoId, //转课下单时携带
      oldOrderId: this.$route.query.oldOrderId, //订金订单、试听订单转正式是添加
      // opengOnlineCourse:
      //   this.$route.query.opengOnlineCourse + "" === "true" ? true : false, //红头文件需要传的值,//密码、
      coursePriceWentDutchArr: [] //分摊之后的课程数组
    };
  },
  mounted() { 
    this.orderId = this.$route.query.orderId;
    this.findProductByOrder(this.oldOrderId);
    this.tableList();
  },
  methods: {
    //正式订单完成
    createNormalOrder(booleabVal, msg) {
      let courseInfoList = getCourseInfoList(
        JSON.parse(JSON.stringify(this.offlineListCourse)),
        JSON.parse(JSON.stringify(this.recListCourse)),
        JSON.parse(JSON.stringify(this.individuaListCourse)),
        JSON.parse(JSON.stringify(this.giveCourse)),
        JSON.parse(JSON.stringify(this.nonSubjectCourse)),
        JSON.parse(JSON.stringify(this.otherCourse))
      );
      //判断条件是否符合
      if (!full3CreateNormalOrder(this.listQuery, this)) {
        return;
      }
      let orderMoneys = [];
      for (let i = 0; i < this.orderMarketing.orderMoneys.length; i++) {
        if (
          this.orderMarketing.orderMoneys[i].payTypeId &&
          this.orderMarketing.orderMoneys[i].received
        ) {
          this.orderMarketing.orderMoneys[
            i
          ].paymentDate = this.orderMarketing.paymentDate;
          if (this.orderMarketing.orderMoneys[i].bankCardNo) {
            this.orderMarketing.orderMoneys[
              i
            ].bankCardNo = this.orderMarketing.orderMoneys[
              i
            ].bankCardNo.replace(/[" "]/g, "");
          }
          orderMoneys.push(this.orderMarketing.orderMoneys[i]);
        }
      }
      if (msg === "暂存") {
        this.zcLoading = true;
      } else {
        this.sureLoading = true;
      }
      this.orderMarketing.payable = this.$store.state.fullStorage.info
        .orderDiscount.specDiscountAmount
        ? this.$store.state.fullStorage.info.totalPrice -
          this.$store.state.fullStorage.info.orderDiscount.specDiscountAmount
        : this.$store.state.fullStorage.info.payable; // 原价 - 特殊优惠金额 - 总价抵减
      this.orderMarketing.orderDiscount.discountRemark = this.$store.state.fullStorage.info.discountMessages;
      //Fconsole.log(this.listQuery)
      createNormalOrder(
        Object.assign(
          {
            studentId: parseInt(this.studentId),
            submit: booleabVal,
            orderId: this.$route.query.orderId,
            courseChangeInfoId: this.courseChangeInfoId,
            oldOrderId: this.oldOrderId
          },
          this.orderMarketing,
          { orderMoneys: orderMoneys },
          { courseInfoList: courseInfoList },
          { createUser: this.listQuery.createUser },
          { orderMarketing: this.listQuery }
        )
      ).then(res => {
        this.zcLoading = false;
        this.sureLoading = false;
        if (res.status == 200) {
          this.$tipsMessage(msg + "成功", "success");
          if (msg == "暂存") {
            this.$router.push({
              path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep3",
              query: {
                orderId: res.data,
                courseChangeInfoId: this.courseChangeInfoId,
                // opengOnlineCourse: this.opengOnlineCourse,
                year: this.$route.query.year
              }
            });
            this.findProductByOrderList(res.data);
          } else {
            //OrderMgt/OrderDetail?id=43
            this.$router.push({
              path: "/OrderMgt/StudentOrderDeal"
            });
          }
        } else if (res.status === 500 && res.message) {
          this.$tipsMessage(res.message, "warning");
        } else {
          this.$tipsMessage(msg + "失败", "warning");
        }
      });
    },
    //回显
    findProductByOrder(oldOrderId) {
      // this.orderId = parseInt(this.$route.query.orderId);
      let course = [];
      if (this.orderId) {
        findProductByOrder(this.orderId).then(res => {
          if (res.status == 200 && !oldOrderId) {
            if (res.data.orderMarketing) {
              res.data.orderMarketing.payable = this.$store.state.fullStorage.info.actual;
              res.data.orderMarketing.divideUser
                ? (res.data.orderMarketing.divide = "是")
                : (res.data.orderMarketing.divide = "否");
              this.listQuery = res.data.orderMarketing;
            }
            this.listQuery.createUserName = res.data.createUserName;
            this.listQuery.createUser = res.data.createUser;
          }
        });
      }
    },
    findProductByOrderList(orderId) {
      findProductByOrder(orderId).then(res => {
        if (res.status == 200) {
          this.orderTableList(res.data.orderCourseList);
        }
      });
    },
    orderTableList(orderCourseList) {
      this.clear()
      for (let i = 0; i < orderCourseList.length; i++) {
        orderCourseList[i].price=orderCourseList[i].price.toLocaleString()
        if (orderCourseList[i].courseProperty === 1) {
          // this.offlineListCourse.push(orderCourseList[i]);
          if (orderCourseList[i].giveAway === 0) {
            this.offlineListCourse.push(orderCourseList[i]);
          } else {
            // this.giveCourse = this.choiceCourse[i];
            this.giveCourse.push(orderCourseList[i])
          }
        } else if (
          orderCourseList[i].courseProperty === 2 ||
          orderCourseList[i].courseProperty === 3
        ) {
          if (orderCourseList[i].giveAway === 0) {
            this.recListCourse.push(orderCourseList[i]);
          } else {
            // this.giveCourse = this.choiceCourse[i];
            this.giveCourse.push(orderCourseList[i])
          }
        } else if (orderCourseList[i].courseProperty === 4) {
          // this.individuaListCourse.push(orderCourseList[i]);
          if (orderCourseList[i].giveAway === 0) {
            this.individuaListCourse.push(orderCourseList[i]);
          } else {
            // this.giveCourse = this.choiceCourse[i];
            this.giveCourse.push(orderCourseList[i])
          }
        } else if (orderCourseList[i].courseProperty === 5) {
          orderCourseList[i].propertyName =
            orderCourseList[i].coursePropertyName;
          orderCourseList[i].beginDate = orderCourseList[i].startDate;
          // this.nonSubjectCourse.push(orderCourseList[i]);
          if (orderCourseList[i].giveAway === 0) {
            this.nonSubjectCourse.push(orderCourseList[i]);
          } else {
            // this.giveCourse = this.choiceCourse[i];
            this.giveCourse.push(orderCourseList[i])
          }
        } else if (orderCourseList[i].courseProperty === 6) {
          // orderCourseList[i].propertyName = orderCourseList[i].coursePropertyName
          orderCourseList[i].beginDate = orderCourseList[i].startDate;
          // this.otherCourse.push(orderCourseList[i]);
           if (orderCourseList[i].giveAway === 0) {
            this.otherCourse.push(orderCourseList[i]);
          } else {
            // this.giveCourse = this.choiceCourse[i];
            this.giveCourse.push(orderCourseList[i])
          }
        }
        for (var j = 0; j < orderCourseList[i].length; j++) {
          let money = orderCourseList[i].price + "";
          this.totleMoney += parseInt(money.replace(/,/g, ""));
        }
      }
      if (this.offlineListCourse.length > 0) {
        this.tableIsShow.offlineCourse = true;
        this.getCourseList(this.offlineListCourse, 1);
      }
      if (this.recListCourse.length > 0) {
        this.tableIsShow.recCourse = true;
        this.getCourseList(this.recListCourse, 0);
      }
      if (this.individuaListCourse.length > 0) {
        this.tableIsShow.individuaCourse = true;
        this.getCourseList(this.individuaListCourse, 0);
      }
      if (this.nonSubjectCourse.length > 0) {
        this.tableIsShow.nonSubjectCourse = true;
        this.getCourseList(this.nonSubjectCourse, 0);
      }
      if (this.otherCourse.length > 0) {
        this.tableIsShow.otherCourse = true;
        this.getCourseList(this.otherCourse, 0);
      }
      if (this.giveCourse.length > 0) {
        this.tableIsShow.giveCourse = true;
      }
    },
    tableList() {
      this.courses = JSON.parse(localStorage.getItem("courses"));
      this.choiceCourse = JSON.parse(localStorage.getItem("choiceCourse"));
      for (var i = 0; i < this.choiceCourse.length; i++) {
        if (this.choiceCourse[i][0].courseProperty === 1) {
          // this.offlineListCourse = this.choiceCourse[i];
          if (this.choiceCourse[i][0].giveAway === 0) {
            this.offlineListCourse = this.choiceCourse[i];
          } else {
            this.giveCourse = this.choiceCourse[i];
          }
        } else if (
          this.choiceCourse[i][0].courseProperty === 2 ||
          this.choiceCourse[i][0].courseProperty === 3
        ) {
          if (this.choiceCourse[i][0].giveAway === 0) {
            this.recListCourse = this.choiceCourse[i];
          } else {
            this.giveCourse = this.choiceCourse[i];
          }
        } else if (this.choiceCourse[i][0].courseProperty === 4) {
          if (this.choiceCourse[i][0].giveAway === 0) {
            this.individuaListCourse = this.choiceCourse[i];
          } else {
            this.giveCourse = this.choiceCourse[i];
          }
          // this.individuaListCourse = this.choiceCourse[i];
        } else if (this.choiceCourse[i][0].courseProperty === 5) {
          if (this.choiceCourse[i][0].giveAway === 0) {
            this.nonSubjectCourse = this.choiceCourse[i];
          } else {
            this.giveCourse = this.choiceCourse[i];
          }
          // this.nonSubjectCourse = this.choiceCourse[i];
        } else if (this.choiceCourse[i][0].courseProperty === 6) {
          if (this.choiceCourse[i][0].giveAway === 0) {
            this.otherCourse = this.choiceCourse[i];
          } else {
            this.giveCourse = this.choiceCourse[i];
          }
          // this.otherCourse = this.choiceCourse[i];
        }
        for (var j = 0; j < this.choiceCourse[i].length; j++) {
          let money = this.choiceCourse[i][j].price + "";
          this.totleMoney += parseInt(money.replace(/,/g, ""));
        }
      }

      if (this.offlineListCourse.length > 0) {
        this.tableIsShow.offlineCourse = true;
        this.getCourseList(this.offlineListCourse);
      }
      if (this.recListCourse.length > 0) {
        this.tableIsShow.recCourse = true;
        this.getCourseList(this.recListCourse);
      }
      if (this.individuaListCourse.length > 0) {
        this.tableIsShow.individuaCourse = true;
        this.getCourseList(this.individuaListCourse);
      }
      if (this.nonSubjectCourse.length > 0) {
        this.tableIsShow.nonSubjectCourse = true;
        this.getCourseList(this.nonSubjectCourse);
      }
      if (this.otherCourse.length > 0) {
        this.tableIsShow.otherCourse = true;
        this.getCourseList(this.otherCourse);
      }
      if (this.giveCourse.length > 0) {
        this.tableIsShow.giveCourse = true;
      }
      //从localstorage得到相关课程后，调用该方法得到红头文件匹配的课程
      this.discountMatch();
    },
    //红头文件匹配课程
    discountMatch() {
      discountMatch({
        courseList: this.courseList,
        // opengOnlineCourse: this.opengOnlineCourse,
        studentId: parseInt(this.studentId),
        year: parseInt(this.$route.query.year)
      }).then(res => {
        if (res.status == 200) {
          if (
            res.data.presentationCourseDTOList &&
            res.data.presentationCourseDTOList.length > 0
          ) {
            res.data.presentationCourseDTOList.forEach(val => {
              val.price = val.price.toLocaleString();
              val.startDate = val.beginDate;
              val.giveAway = 2;
              this.giveCourse.push(val);
              this.tableIsShow.giveCourse = true;
            });
          }
        }
        this.coursePriceWentDutch();
      });
    },
    //得到红头文件的课程列表
    getCourseList(courseList) {
      courseList.forEach(val => {
        let price = val.price + "";
        this.courseList.push({
          courseId: val.courseId,
          propertyId: val.courseProperty,
          times: val.buyTimes ? val.buyTimes : val.times,
          originPrice: parseInt(price.replace(/,/g, ""))
        });
      });
    },
    //课程分摊
    coursePriceWentDutch() {
      let courseInfoList = getCourseInfoList(
        JSON.parse(JSON.stringify(this.offlineListCourse)),
        JSON.parse(JSON.stringify(this.recListCourse)),
        JSON.parse(JSON.stringify(this.individuaListCourse)),
        JSON.parse(JSON.stringify(this.giveCourse)),
        JSON.parse(JSON.stringify(this.nonSubjectCourse)),
        JSON.parse(JSON.stringify(this.otherCourse))
      );
      coursePriceWentDutch({
        courseInfoList: courseInfoList,
        orderMoneys: this.orderMarketing.orderMoneys,
        netCourseHashKey: this.orderMarketing.netCourseHashKey,
        indivCourseHashKey: this.orderMarketing.indivCourseHashKey,
        offlineCourseCacheHashKey: this.orderMarketing.offlineCourseCacheHashKey
      }).then(res => {
        this.getCoursePriceWentDutchArr(res.data);
      });
    },
    getCoursePriceWentDutchArr(dutchArr) {
      let offlineListCourse = [],
        recListCourse = [],
        individuaListCourse = [],
        giveCourse = [],
        nonSubjectCourse = [],
        otherCourse = [];
      for (let i = 0; i < dutchArr.length; i++) {
        dutchArr[i].price = dutchArr[i].price.toLocaleString();
        dutchArr[i].propertyName = dutchArr[i].coursePropertyName;
        if (dutchArr[i].courseProperty === 1) {
          if (dutchArr[i].giveAway === 0) {
            offlineListCourse.push(dutchArr[i]);
          } else {
            giveCourse.push(dutchArr[i]);
          }
        }
        if (
          dutchArr[i].courseProperty === 2 ||
          dutchArr[i].courseProperty === 3
        ) {
          if (dutchArr[i].giveAway === 0) {
            recListCourse.push(dutchArr[i]);
          } else {
            giveCourse.push(dutchArr[i]);
          }
        }
        if (dutchArr[i].courseProperty === 4) {
          if (dutchArr[i].giveAway === 0) {
            individuaListCourse.push(dutchArr[i]);
          } else {
            giveCourse.push(dutchArr[i]);
          }
        }
        if (dutchArr[i].courseProperty === 5) {
          dutchArr[i].beginDate = dutchArr[i].startDate;
           if (dutchArr[i].giveAway === 0) {
            nonSubjectCourse.push(dutchArr[i]);
          } else {
            giveCourse.push(dutchArr[i]);
          }
        }
        if (dutchArr[i].courseProperty === 6) {
          dutchArr[i].beginDate = dutchArr[i].startDate;
          if (dutchArr[i].giveAway === 0) {
            otherCourse.push(dutchArr[i]);
          } else {
            giveCourse.push(dutchArr[i]);
          }
        }
      }
      this.coursePriceWentDutchArr.push(offlineListCourse);
      this.coursePriceWentDutchArr.push(recListCourse);
      this.coursePriceWentDutchArr.push(individuaListCourse);
      this.coursePriceWentDutchArr.push(nonSubjectCourse);
      this.coursePriceWentDutchArr.push(otherCourse);
      this.coursePriceWentDutchArr.push(giveCourse);
      //  console.log(this.coursePriceWentDutchArr);
    },
    //上一步
    preStep() {
      this.$router.push({
        path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep2",
        query: {
          orderId: this.$route.query.orderId,
          courseChangeInfoId: this.$route.query.courseChangeInfoId,
          year: this.$route.query.year,
          // opengOnlineCourse: this.$route.query.opengOnlineCourse,
          TransferFull: this.$route.query.TransferFull,
          callback: 1 //判断是否是step4返回的
        }
      });
    },
    //返回
    goBack() {
      this.$router.push({
        path: "/OrderMgt/StudentOrderDeal"
      });
    },
     //清空选中的列表
    clear(){
       (this.offlineListCourse = []),
        (this.giveCourse = []),
        (this.recListCourse = []),
        (this.individuaListCourse = []),
        (this.nonSubjectCourse = []),
        (this.otherCourse = []);
        this.tableIsShow={
        offlineCourse: false,
        recCourse: false,
        individuaCourse: false,
        nonSubjectCourse: false,
        otherCourse: false,
        giveCourse: false
      }
    }
  }
};
</script>
<style scoped>
.marginTop20px {
  margin: 5px 0px 0px 0px;
}
.courseStep3{
 margin:0px;
}
.font-color{
  margin-top:20px;
}
/* .font-size-thick-margin {
  margin: 0;
} */
</style>
