/*
@author Andy
@date 2019/1/18
*/
<template>
  <div class="app-container-style">
    <card-container :paddingValue="10">
      <template slot="body">
        <h3 class="container font-size-thick-margin">已选课程</h3>
        <!-- 班教列表 -->
        <offline-course-table
          v-if="tableIsShow.offlineCourse"
          :offlineListCourse.sync="offlineListCourse"
          class="marginTop20px"
        ></offline-course-table>
        <!-- 录播、直播列表 -->
        <rec-course-table
          v-if="tableIsShow.recCourse"
          :recListCourse.sync="recListCourse"
          class="marginTop20px"
        ></rec-course-table>
        <!-- <rec-course-table v-if="recordList.length" :recListCourse.sync="recordList"></rec-course-table> -->
        <!-- 在线个性化 -->
        <individual-course-table
          v-if="tableIsShow.individuaCourse"
          :individuaListCourse.sync="individuaListCourse"
          class="marginTop20px"
        ></individual-course-table>

        <!-- 非学科 -->
        <non-subject-course-table
          v-if="tableIsShow.nonSubjectCourse"
          :nonSubjectListCourse.sync="nonSubjectCourse"
          class="marginTop20px"
        ></non-subject-course-table>

        <!-- 其他 -->
        <other-course-table
          v-if="tableIsShow.otherCourse"
          :otherListCourse.sync="otherCourse"
          class="marginTop20px"
        ></other-course-table>

        <!-- 赠送课程 -->
        <give-course v-if="tableIsShow.giveCourse" :giveCourse.sync="giveCourse"></give-course>
      </template>
    </card-container>

    <card-container :paddingValue="10">
      <template slot="body">
        <full-order2
          class="marginTop20px"
          ref="fullOrderStep2"
          :totleMoney="totleMoney"
          :list-query.sync="listQuery"
          :is-pass.sync="isPass"
        ></full-order2>

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
              @click="createNormalOrder"
              :loading="loading"
            >&nbsp;&nbsp;暂存&nbsp;&nbsp;</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-col>
        </el-row>
      </template>
    </card-container>
  </div>
</template>
<script>
import { findStudent } from "@/api/order/StudentApi";
import FullOrder2 from "@/views/order/components/FullOrder/FullOrder2";
import OfflineCourseTable from "@/views/order/components/FullOrder/OfflineCourse/OfflineCourseTable";
import RecCourseTable from "@/views/order/components/FullOrder/RecCourseCourse/RecCourseTable";
import IndividualCourseTable from "@/views/order/components/FullOrder/IndividualCourse/IndividualCourseTable";
import NonSubjectCourseTable from "@/views/order/components/FullOrder/NonSubjectCourse/NonSubjectCourseTable";
import OtherCourseTable from "@/views/order/components/FullOrder/OtherCourse/OtherCourseTable";
import {
  createNormalOrder,
  findProductByOrder,
  discountMatch,
  findChangeCourseOrderInfo
} from "@/api/order/FullOrder";
import {
  full2CreateNormalOrder,
  getCourseInfoList,
  prevClickPath
} from "@/views/order/FullOrderFunction/FullOrder.js";
import giveCourse from "@/views/order/components/FullOrder/GiveCourse/GiveCourseTable";

export default {
  name: "FullOrder",
  components: {
    FullOrder2,
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
  data () {
    return {
      courses: [],
      student: {}, //学生信息
      step: 3, //进度条进度
      tableIsShow: {
        offlineCourse: false,
        recCourse: false,
        individuaCourse: false,
        nonSubjectCourse: false,
        otherCourse: false,
        giveCourse: false
      },
      choiceCourse: [], //记录在localstroge中选择的值
      offlineListCourse: [], //班教localstroge内容
      recListCourse: [], //录播，直播localstroge内容
      liveList: [], //直播
      recordList: [], //录播
      individuaListCourse: [], //在线个性化localstroge内容
      nonSubjectCourse: [], //非学科localstroge内容
      otherCourse: [], //其他localstroge内容
      giveCourse: [], //其他localstroge内容
      totleMoney: 0, //总共的钱数
      orderId: null,
      isPass: false, //判断是否能够跳到下个页面
      list: {}, //存放用户选中的信息
      listQuery: {
        //需要用户填写的信息
        discountMessages: null, //符合优惠条件
        registerFormNum: null, //报名表号
        remark: null, //备注信息
        orderDiscount: {
          //订单优惠信息
          discountRemark: null, //符合优惠条件
          specDiscountNo: null, //特殊优惠申请单号
          specDiscountAmount: null, //特殊优惠金额
          totalAiscountAmount: null //总价抵减
        },
        orderMoneys: [
          {
            //订单金额信息
            payTypeId: null, //付费方式
            received: null, //实收金额
            paymentDate: null, //支付时间
            icon: "el-icon-circle-plus", //显示的图片
            isEntryFee: 0,
            terminalNo: null, //终端号
            bankCardNo: null, //银行卡号
            bankCardNoNum: "",
            payNo: null //订单号
          }
        ], //订单金额信息
        paymentDate: null,
        paymentDateCompare: null, //用于比较订单金额信息是回显还是新增
        netCourseHashKey: null, //红头文件，方法：discountMatch返回的值，用于添加订单的时候用
        indivApportionMapKey: null,
        indivApportionMapKey: null, //同上
        presentationCourseDTOList: [], //红头文件，方法：discountMatch返回的赠送的小课,
        actual: 0, //实收金额
        originalPrice: 0, //红头文件，用于总价抵减
        totalPrice: 0, //总价钱
        payable: 0, //应付金额  与totalPrice相等，但是应为传参接受的是payable
        createUser: JSON.parse(localStorage.getItem("states")).user.userId //开单人员id
      },
      courseList: [], //红头文件课程列表
      courseChangeInfoId: this.$route.query.courseChangeInfoId, //转课下单时携带
      oldOrderId: this.$route.query.oldOrderId, //订金订单、试听订单转正式是添加
      // opengOnlineCourse:
      //   this.$route.query.opengOnlineCourse + "" === "true" ? true : false, //红头文件需要传的值,//密码
      year: parseInt(this.$route.query.year), //红头文件需要传的值,高考年份
      loading: false
    };
  },
  mounted () {
    this.orderId = this.$route.query.orderId;
    if (this.$route.query.callback) {
      this.listQuery = this.$store.state.fullStorage.info;
      // this.isPass = true
    } else if (this.$route.query.courseChangeInfoId) {
      this.findChangeCourseOrderInfo(this.$route.query.courseChangeInfoId); //判断是转课，那么付费方式为68，否则（为试听或者定金，付费方式为对应的方式）
    } else {
      this.findProductByOrder(this.oldOrderId);
    }
    this.tableList();
  },
  methods: {
    //得到加入列表的数据
    tableList () {
      this.courses = JSON.parse(localStorage.getItem("courses"));
      this.choiceCourse = JSON.parse(localStorage.getItem("choiceCourse"));
      for (var i = 0;i < this.choiceCourse.length;i++) {
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
            // (this.liveList = this.choiceCourse[i].filter(v => {
            //   return v.courseProperty === 3;
            // })),
            //   (this.recordList = this.choiceCourse[i].filter(v => {
            //     return v.courseProperty === 2;
            //   }));
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
        for (var j = 0;j < this.choiceCourse[i].length;j++) {
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
    //得到红头文件的课程列表
    getCourseList (courseList, type) {
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
    //暂存
    createNormalOrder () {
      //判断条件是否满足
      if (!full2CreateNormalOrder(this.listQuery, this.isPass, this)) {
        return;
      }
      this.loading = true;
      let orderMoneys = this.getOrderMoneys();
      let courseInfoList = getCourseInfoList(
        JSON.parse(JSON.stringify(this.offlineListCourse)),
        JSON.parse(JSON.stringify(this.recListCourse)),
        JSON.parse(JSON.stringify(this.individuaListCourse)),
        JSON.parse(JSON.stringify(this.giveCourse)),
        JSON.parse(JSON.stringify(this.nonSubjectCourse)),
        JSON.parse(JSON.stringify(this.otherCourse))
      );
      this.$route.query.orderId
        ? (this.orderId = this.$route.query.orderId)
        : (this.orderId = null);
      if (this.orderId) {
        this.orderId = Number(this.orderId);
      }
      //符合优惠条件字段不一样，处理,这两个字段相等
      this.listQuery.orderDiscount.discountRemark = this.listQuery.discountMessages;
      //总价抵减处理
      this.listQuery.orderDiscount.totalAiscountAmount =
        this.listQuery.originalPrice - this.listQuery.totalPrice;
      let payable = this.listQuery.orderDiscount.specDiscountAmount // 原价 - 特殊优惠金额 - 总价抵减 - 试听/订金/转课金额
        ? this.listQuery.totalPrice -
        this.listQuery.orderDiscount.specDiscountAmount
        : this.listQuery.payable;
      createNormalOrder(
        Object.assign(
          {
            studentId: parseInt(this.studentId),
            submit: false,
            orderId: this.$route.query.orderId,
            courseChangeInfoId: this.courseChangeInfoId,
            oldOrderId: this.$route.query.oldOrderId
          },
          this.listQuery,
          { courseInfoList: courseInfoList },
          { createUser: this.listQuery.createUser },
          { orderMoneys: orderMoneys },
          { payable: payable }
        )
      ).then(res => {
        this.loading = false;
        if (res.status == 200) {
          this.$router.replace({
            path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep2",
            query: {
              orderId: res.data,
              year: this.year,
              // opengOnlineCourse: this.opengOnlineCourse
            }
          });

          this.findProductByOrderList(res.data);

          this.$tipsMessage("暂存成功", "success");
        } else if (res.status === 500 && res.message) {
          this.$tipsMessage(res.message, "warning");
        } else {
          this.$tipsMessage("暂存失败", "warning");
        }
      });
    },
    //回显
    findProductByOrder (oldOrderId) {
      let course = [];
      let id = oldOrderId ? oldOrderId : this.orderId; //判断是不是转正式
      if (id) {
        this.isPass = true;
        let orderMonies = [],
          icon = "el-icon-circle-plus";
        findProductByOrder(id).then(res => {
          if (oldOrderId && res.status == 200) {
            res.data.orderMonies.forEach((element, index) => {
              if (index == 0) {
                icon = "el-icon-circle-plus";
              } else {
                icon = "el-icon-remove";
              }
              orderMonies.push({
                payTypeId: 68,
                paymentDate: this.$format(new Date(element.paymentDate)),
                received: element.received,
                icon: icon, //显示的图片
                isEntryFee: element.isEntryFee,
                terminalNo: element.terminalNo, //终端号
                bankCardNo: element.bankCardNo, //银行卡号
                bankCardNoNum: "",
                payNo: element.payNo //订单号
              });
            });
            this.listQuery.orderMoneys = orderMonies;
          } else if (res.status == 200) {
            res.data.orderMonies.forEach((element, index) => {
              if (index == 0) {
                icon = "el-icon-circle-plus";
              } else {
                icon = "el-icon-remove";
              }
              orderMonies.push({
                payTypeId: element.payTypeId,
                paymentDate: this.$format(new Date(element.paymentDate)),
                received: element.received,
                icon: icon, //显示的图片
                isEntryFee: element.isEntryFee,
                terminalNo: element.terminalNo, //终端号
                bankCardNo: element.bankCardNo, //银行卡号
                bankCardNoNum: "",
                payNo: element.payNo //订单号
              });
            });
            let orderDiscount = res.data.orderDiscount
              ? res.data.orderDiscount
              : {
                discountRemark: null, //符合优惠条件
                specDiscountNo: null, //特殊优惠申请单号
                specDiscountAmount: null, //特殊优惠金额
                totalAiscountAmount: null //总价抵减
              };
            this.listQuery = {
              payable: res.data.payable,
              registerFormNum: res.data.registerFormNum,
              remark: res.data.remark,
              orderMoneys: orderMonies,
              paymentDate: this.$format(orderMonies[0].paymentDate),
              paymentDateCompare: this.$format(orderMonies[0].paymentDate),
              orderDiscount: orderDiscount,
              totalPrice: this.totleMoney, //打折后的钱
              originalPrice: this.totleMoney, //课程应付，没有打折的钱
              discountMessages: null, //符合优惠条件
              createUser: res.data.createUser
            };
          }
          if (res.status == 200) {
            this.discountMatch(true); //总价抵减=originalPrice-totalPrice-特殊优惠金额
          }
        });
      }
    },
    findProductByOrderList (orderId) {
      findProductByOrder(orderId).then(res => {
        if (res.status == 200) {
          this.orderTableList(res.data.orderCourseList);
        }
      });
    },
    //转课回显
    findChangeCourseOrderInfo () {
      let orderMonies = [];
      findChangeCourseOrderInfo(
        parseInt(this.$route.query.courseChangeInfoId)
      ).then(res => {
        orderMonies = [
          {
            payTypeId: 68,
            paymentDate: null,
            received: res.data.price,
            icon: "el-icon-circle-plus", //显示的图片
            isEntryFee: 0,
            terminalNo: null, //终端号
            bankCardNo: null, //银行卡号
            bankCardNoNum: "",
            payNo: null //订单号
          }
        ];
        this.listQuery.orderMoneys = orderMonies;
        this.discountMatch();
      });
    },
    orderTableList (orderCourseList) {
      this.clear()
      for (let i = 0;i < orderCourseList.length;i++) {
        orderCourseList[i].price = orderCourseList[i].price.toLocaleString()
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
        for (var j = 0;j < orderCourseList[i].length;j++) {
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
    //红头文件匹配课程
    discountMatch (type) {
      discountMatch({
        courseList: this.courseList,
        // opengOnlineCourse: this.opengOnlineCourse,
        studentId: parseInt(this.studentId),
        year: this.year
      }).then(res => {
        if (res.status == 200) {
          if (
            res.data.presentationCourseDTOList &&
            res.data.presentationCourseDTOList.length > 0 &&
            !type
          ) {
            res.data.presentationCourseDTOList.forEach(val => {
              val.price = val.price.toLocaleString();
              val.giveAway = 2;
              val.startDate = val.beginDate;
              this.giveCourse.push(val);
              this.tableIsShow.giveCourse = true;
            });
          }
          Object.assign(this.listQuery, res.data);
          //应为discountMessages得到的是数组，所有把数组组合成字符串
          // this.listQuery.orderDiscount.discountRemark = this.listQuery.discountMessages
          let discountMessages = "1、",
            index = "";
          for (var i = 0;i < this.listQuery.discountMessages.length;i++) {
            if (i !== this.listQuery.discountMessages.length - 1) {
              index = i + 2 + "、";
            } else {
              index = "";
            }
            discountMessages =
              discountMessages +
              this.listQuery.discountMessages[i] +
              "。" +
              index;
          }
          if (!res.data.totalPrice) {
            this.listQuery.totalPrice = this.totleMoney;
          }
          if (this.listQuery.discountMessages.length <= 0) {
            discountMessages = "";
          }
          this.listQuery.totalPrice = this.totleMoney;
          this.listQuery.discountMessages = discountMessages;
          this.listQuery.originalPrice = res.data.totalPrice
            ? res.data.totalPrice
            : this.totleMoney;
          this.listQuery.payable =
            this.totleMoney - (this.totleMoney - this.listQuery.originalPrice); //将返回的红头文件优惠后的价钱赋值给要暂存订单的payable字段
        }
        if (res.status == 500) {
          this.listQuery.totalPrice = this.totleMoney;
          this.listQuery.payable = this.listQuery.totalPrice; //将返回的红头文件优惠后的价钱赋值给要暂存订单的payable字段
          this.listQuery.originalPrice = this.totleMoney;
        }
      });
    },
    //上一步
    preStep () {
      let course = JSON.parse(localStorage.getItem("giveCourseCus"));
      if (course[0]) {
        this.$router.push({
          path: `/OrderMgt/FullOrder/${this.studentId}/giveCourse`,
          query: this.$route.query
        });
      } else {
        this.$router.push({
          path: prevClickPath(
            JSON.parse(localStorage.getItem("courses")),
            -1,
            this.studentId
          ),
          query: this.$route.query
        });
      }
    },
    //下一步
    nextStep () {
      //判断条件是否满足
      if (
        !full2CreateNormalOrder(this.listQuery, this.isPass, this, this.orderId)
      ) {
        return;
      }
      // 計算实收金额
      let price = 0;
      for (let i = 0;i < this.listQuery.orderMoneys.length;i++) {
        price += Number(this.listQuery.orderMoneys[i].received);
      }
      // 計算实收金额结束
      // if (!price) {
      //   alert("实收金额未填写！");
      //   return false;
      // }
      if (
        price !==
        this.listQuery.payable - this.listQuery.orderDiscount.specDiscountAmount //应付金额
      ) {
        this.$confirm(
          "实收金额与应付金额不同，请确定金额是否填写正确。",
          "确认信息",
          {
            distinguishCancelAndClose: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消"
          }
        )
          .then(() => {
            //  路由跳转功能
            let orderMoneys = this.getOrderMoneys(),
              orderMoney = 0;
            orderMoneys.forEach(val => {
              orderMoney += parseInt(val.received);
            });
            this.$router.push({
              path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep3",
              query: {
                orderId: this.$route.query.orderId,
                courseChangeInfoId: this.courseChangeInfoId,
                // opengOnlineCourse: this.opengOnlineCourse,
                year: this.year,
                oldOrderId: this.$route.query.oldOrderId
              }
            });
            this.listQuery.orderMoney = orderMoney;
            this.$store.dispatch("INFO", this.listQuery);
            //  路由跳转功能结束
          })
          .catch(action => { });
      } else {
        let orderMoneys = this.getOrderMoneys(),
          orderMoney = 0;
        orderMoneys.forEach(val => {
          orderMoney += parseInt(val.received);
        });
        this.$router.push({
          path: "/OrderMgt/FullOrder/" + this.studentId + "/fullOrderStep3",
          query: {
            orderId: this.$route.query.orderId,
            courseChangeInfoId: this.courseChangeInfoId,
            // opengOnlineCourse: this.opengOnlineCourse,
            year: this.year,
            oldOrderId: this.$route.query.oldOrderId
          }
        });
        this.listQuery.orderMoney = orderMoney;
        this.$store.dispatch("INFO", this.listQuery);
      }
    },
    getOrderMoneys () {
      let orderMoneys = [];
      this.listQuery.actual = 0;
      for (let i = 0;i < this.listQuery.orderMoneys.length;i++) {
        if (
          this.listQuery.orderMoneys[i].payTypeId &&
          this.listQuery.orderMoneys[i].received
        ) {
          this.listQuery.orderMoneys[
            i
          ].paymentDate = this.listQuery.paymentDate;
          this.listQuery.actual += parseInt(
            this.listQuery.orderMoneys[i].received
          );
          orderMoneys.push(this.listQuery.orderMoneys[i]);
          if (this.listQuery.orderMoneys[i].bankCardNo) {
            this.listQuery.orderMoneys[
              i
            ].bankCardNo = this.listQuery.orderMoneys[i].bankCardNo.replace(
              /[" "]/g,
              ""
            );
          }
        }
      }
      return orderMoneys;
    },
    //返回
    goBack () {
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
    },
    //清空选中的列表
    clear () {
      (this.offlineListCourse = []),
        (this.giveCourse = []),
        (this.recListCourse = []),
        (this.individuaListCourse = []),
        (this.nonSubjectCourse = []),
        (this.otherCourse = []);
      this.tableIsShow = {
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
  margin-top:5px;
}

.courseColor {
  font-size: 14px;
}
.font-size-thick-margin {
  margin: 0;
}
 
</style>
