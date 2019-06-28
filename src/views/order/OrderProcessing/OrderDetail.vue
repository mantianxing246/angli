/*
@author Andy
@date 2019/1/18
*/
<template>
  <div class="app-container">
    <div v-if="$route.name === 'OrderDetail'">
      <el-form ref="searchForm" :inline="true">
        <el-form-item>
          <el-input
            v-model="searchForm.studentName"
            placeholder="学员姓名"
            class="width120"
            clearable
            @change="changeName"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.userId"
            placeholder="学员ID"
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            clearable
            :maxlength="35"
            @change="changeStudentId"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 150px"
            placeholder="订单号"
            class="width120"
            clearable
            v-model="searchForm.orderNo"
            :maxlength="16"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.orderType" placeholder="订单类型" class="width150" clearable>
            <el-option value="1" label="正式"></el-option>
            <el-option value="2" label="定金"></el-option>
            <el-option value="3" label="网课试听"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-checkbox label="1" :true-label="1" :false-label="0" v-model="searchForm.isReject">是否驳回</el-checkbox> -->
          <el-select v-model="searchForm.isReject" clearable style="width:100px">
            <el-option label="驳回" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            icon="el-icon-search"
            type="primary"
            :loading="loading"
            @click="getOrderDetail"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <card-container>
        <template slot="body">
          <el-table
            :data="orderDetail"
            border
            tip
            stripe
            highlight-current-row
            style="width: 100%;color: #909399"
            class="orderDetail"
            :span-method="spanMethod"
            v-loading="loading"
          >
            <el-table-column label="学生姓名" prop="studentName" align="center" min-width="50"/>
            <el-table-column label="学员ID" prop="studentUserId" align="center" min-width="50"/>
            <el-table-column label="报名表号" prop="registerFormNum" align="center" min-width="50"/>
            <el-table-column label="订单号" prop="orderNo" align="center" min-width="50"/>
            <el-table-column label="订单类型" prop="typeName" align="center" min-width="50px"/>
            <el-table-column label="订单金额" align="center" min-width="60">
              <template slot-scope="scope">{{scope.row.received.toLocaleString()}}</template>
            </el-table-column>
            <el-table-column label="订单状态" prop="orderStatusString" align="center" min-width="70px"/>
            <el-table-column label="课程名称" min-width="240" prop="courseName" align="center">
              <!-- <template slot-scope="scope">
              <el-checkbox
                v-if="scope.row.orderStatus==203||scope.row.orderStatus==503||scope.row.courseStatus==202||scope.row.courseStatus==201"
                v-model="scope.row.select"
                :value="scope.row.courseId"
                :label="scope.row.courseId"
              >{{scope.row.courseName}}</el-checkbox>
              <div v-else>{{scope.row.courseName}}</div>
              </template>-->
            </el-table-column>
            <el-table-column align="center" prop="propertyName" label="课程属性" min-width="60"></el-table-column>
            <el-table-column align="center" prop="courseStartDate" label="开始日期" min-width="70"></el-table-column>
            <el-table-column align="center" prop="courseEndDate" label="结束日期" min-width="70"></el-table-column>
            <el-table-column align="center" label="课程状态" fixed="right" min-width="60">
              <template slot-scope="scope" align="center">
                <!-- <div
                v-for="(item,index) in scope.row.courseDetailList"
                :key="index"
                >{{item.courseStatusName}}</div>-->
                <div>{{scope.row.courseStatusName}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="课程操作" fixed="right" min-width="80">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    v-if="scope.row.courseStatus==201&&scope.row.type===1"
                    @click="freezeCourse(scope.row)"
                  >冻结</el-button>
                  <!-- <el-button
                  type="text"
                  v-if="(scope.row.courseStatus==202||scope.row.courseStatus==201)&&
                  (scope.row.type==1)"
                  @click="courseRefund(scope.row )"
                  >退费</el-button>-->
                  <!-- <el-button type="text" @click="courseRefund(scope.row.orderId,item.courseId)">退费</el-button> -->
                  <el-button
                    type="text"
                    v-if="scope.row.courseStatus==202"
                    @click="unFreezeCourse(scope.row)"
                  >解冻</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.courseStatus==302||scope.row.courseStatus==303"
                    @click="courseChange(scope.row,scope.row.courseStatus)"
                  >修改</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.courseStatus==302||scope.row.courseStatus==303"
                    @click="courseApplyCancel(scope.row.orderCourseId)"
                  >撤销</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="订单操作" align="center" min-width="70">
              <template slot-scope="scope">
                <!--<el-button type="text">退定金</el-button> -->
                <el-button
                  type="text"
                  v-if="scope.row.orderStatus==11||scope.row.orderStatus==12||scope.row.orderStatus==13||scope.row.orderStatus==301||scope.row.orderStatus==302||scope.row.orderStatus==303"
                  @click="deleteOrder(scope.row)"
                  class="margins"
                >删除</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.orderStatus==11||scope.row.orderStatus==12||scope.row.orderStatus==13||
                scope.row.orderStatus==301||scope.row.orderStatus==302||scope.row.orderStatus==303||scope.row.orderStatus==304"
                  @click="modifyOrder(scope.row)"
                  class="margins"
                >修改</el-button>
                <el-button
                  type="text"
                  class="margins"
                  v-if="scope.row.orderStatus==201||scope.row.orderStatus==202||
                scope.row.orderStatus==501||scope.row.orderStatus==502"
                  @click="returnFullOrder(scope.row)"
                >转正式</el-button>
                <!-- <el-button
              type="text"
              v-if="(scope.row.orderStatus==201&&scope.row.received) || (scope.row.orderStatus==202&&scope.row.received)||
                (scope.row.orderStatus==301&&scope.row.received) || (scope.row.orderStatus==302&&scope.row.received)||
                (scope.row.orderStatus==501&&scope.row.received) || (scope.row.orderStatus==502&&scope.row.received)"
              @click="depositRefund(scope.row)"
                >退定金</el-button>-->
                <el-button
                  type="text"
                  class="margins"
                  v-if="(scope.row.orderStatus==201&&scope.row.received) || (scope.row.orderStatus==202&&scope.row.received)||
                (scope.row.orderStatus==501&&scope.row.received) || (scope.row.orderStatus==502&&scope.row.received)"
                  @click="depositRefund(scope.row)"
                >退定金</el-button>
                <el-button
                  type="text"
                  class="margins"
                  v-if="(scope.row.orderStatus==203||scope.row.orderStatus==503)&&
                  (scope.row.type==1)||scope.row.orderStatus==299"
                  @click="courseRefund(scope.row)"
                >退费</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.showRefundCourseModify"
                  @click="courseApplyCancels(scope.row)"
                >退费撤销</el-button>
                <el-button
                  type="text"
                  class="margins"
                  v-if="scope.row.showRefundCourseModify"
                  @click="modifyOrder(scope.row)"
                >退费修改</el-button>
                <!-- <el-button
                type="text"
                v-if="(scope.row.courseStatus==202||scope.row.courseStatus==201)&&
                  (scope.row.type==1)"
                >退费</el-button>-->
                <el-button
                  type="text"
                  class="margins"
                  v-if="scope.row.orderStatus==203||scope.row.orderStatus==503&&scope.row.type==1&&scope.row.received"
                  @click="TransferCourse(scope.row)"
                >转课</el-button>
                <el-button
                  type="text"
                  v-if="scope.row.orderStatus==304"
                  @click="orderApplyCancel(scope.row.orderId)"
                >撤销</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- </template>
          </card-container>-->

          <!-- 分页 -->
          <!-- <card-container :paddingValue="10">
          <template slot="body">-->
          <pagination
            v-show="total>0"
            :total="total"
            :limit.sync="searchForm.pageSize"
            :page.sync="searchForm.pageNum"
            @pagination="getOrderDetail"
          />
        </template>
      </card-container>
      <!-- 课程冻结 -->
      <freeze-course
        ref="freezeCourse"
        :dialog-visible.sync="freezeDialog"
        :findOrderDetail="getOrderDetail"
      />
      <!-- 课程解冻 -->
      <un-freeze-course
        ref="unFreezeCourse"
        :dialog-visible.sync="unFreezeDialog"
        :findOrderDetail="getOrderDetail"
      />
      <!-- 课程退费 -->
      <!-- <course-refund
        ref="courseRefund"
        :getOrderDetail="getOrderDetail"
        :course-refund-dialog-visible.sync="courseRefundDialogVisible"
      />-->
      <deposit-refund
        ref="depositRefund"
        :deposit-refund-dialog-visible.sync="depositRefundDialogVisible"
        :findOrderDetail="getOrderDetail"
      />
    </div>

    <!-- <router-view/> -->
    <!-- 选择课程列表 -->
    <course-list
      :dialogShow.sync="courseListDialog"
      :course="course"
      @getSelectCourse="getSelectCourse"
      :order="orderRow"
    ></course-list>

    <!-- 退课 -->
    <!-- <refund-list
      :dialogShow.sync="refundListDialog"
      :course="course"
      @getSelectCourse="getSelectCourse"
      :order="orderRow"
    ></refund-list>-->
  </div>
</template>

<script>
import FreezeCourse from "@/views/order/components/CourseStatus/FreezeCourse";
import UnFreezeCourse from "@/views/order/components/CourseStatus/UnFreezeCourse";
import clearNumber  from  "@/components/FullOrder/ClearLocalAndVuex"
import {
  deleteOrder,
  courseApplyCancel,
  orderApplyCancel,
  getOrderDetail,
  courseApplyCancels
} from "@/api/order/OrderDetailApi";
// import CourseRefund from "@/views/order/OrderProcessing/CourseRefund";
import DepositRefund from "@/views/order/OrderProcessing/DepositRefund"; //订金退费弹窗组件
import CourseList from "./CourseList";
// import RefundList from './RefundList'
export default {
  name: "OrderDetail",
  mixins:[clearNumber],
  components: {
    FreezeCourse, //课程冻结
    UnFreezeCourse, //课程解冻
    // RefundList, //课程退费
    DepositRefund, //订金退费
    CourseList //选择课程列表
  },
  data() {
    return {
      orderDetail: [],
      course: [], //要选中的课程
      orderRow: null, //选中的每一行订单
      returnsDialogVisible: false,
      returnsCourseDialogVisible: false,
      // courseRefundDialogVisible: false, //课程退费弹窗显示与否
      depositRefundDialogVisible: false, //订金退费弹窗显示与否
      freezeDialog: false, // 课程冻结弹窗 显示与否
      courseListDialog: false, //选择课程列表弹框
      refundListDialog: false, //选择课程列表弹框
      unFreezeDialog: false, // 课程解冻弹窗 显示与否
      searchForm: {
        studentName: null, //学生姓名
        userId: null, //学员登录id
        orderNo: null, //订单号
        orderType: null, //订单类型（1 全额;2 定金;3 网课试听
        pageNum: 1,
        pageSize: 20,
        isReject: null //是否驳回
      },
      total: 0,
      loading: false
    };
  },
  methods: {
    getOrderDetail() {
      this.loading = true;
      let params = Object.assign({}, this.searchForm);
      if (!this.searchForm.isReject) {
        Object.assign(params, { isReject: 0 });
      }
      getOrderDetail(params).then(res => {
        this.loading = false;
        if (res.status === 200) {
          this.total = res.data.total;
          this.orderDetail = [];
          //将每一门课程添加到订单上,并且给每个订单设置行为1，如果这个订单有多门课，那么设置行为0
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].row = 1;
            for (let j = 0; j < res.data.list[i].courseDetailList.length; j++) {
              if (res.data.list[i].courseDetailList.length > 1) {
                res.data.list[i].row = 0;
              }
              this.orderDetail.push(
                Object.assign(
                  {},
                  res.data.list[i],
                  res.data.list[i].courseDetailList[j]
                )
              );
            }
            if (res.data.list[i].courseDetailList.length == 0) {
              this.orderDetail.push(Object.assign({}, res.data.list[i]));
            }
          }

          //给每个订单设置成行为0的第一个订单设置行为课程长度
          for (let i = 0; i < this.orderDetail.length; i++) {
            if (this.orderDetail[i].row == 0) {
              this.orderDetail[i].row = this.orderDetail[
                i
              ].courseDetailList.length;
              i += this.orderDetail[i].courseDetailList.length - 1;
            }
          }
          // console.log(this.orderDetail)
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    handleCreateClass(id) {
      this.returnsDialogVisible = true;
      this.$refs.earnestReturns.getList(id);
    },
    //转课
    TransferCourse(row) {
      //得到选中的课程，并把它们放入数组中\
      let courseDetailList = [];
      row.courseDetailList.forEach(element => {
        //什么课程可以转课:除了冻结202，
        if (element.courseStatus != 202) {
          courseDetailList.push(element);
        }
      });
      this.courseListDialog = true;
      this.course = courseDetailList;
      row.typeOf = 2; //判断条件，是转课还是退费
      this.orderRow = row;
    },
    //得到专科选中的课程的orderCourseId数组
    getSelectCourse(select) {
      this.$store.commit("TRANSFERCOURSE", select);
      //调到转课页面
      if (this.orderRow.typeOf == 2) {
        this.$router.push({
          path: "/OrderMgt/TransferCourse",
          query: {
            orderId: this.orderRow.orderId,
            orderNo: this.orderRow.orderNo
          }
        });
      }
      // 调到退费页面
      this.$store.commit("COURSEREFUND", select);
      if (this.orderRow.typeOf == 1) {
        this.$router.push({
          path: "/OrderMgt/CourseRefund",
          query: {
            orderId: this.orderRow.orderId,
            orderNo: this.orderRow.orderNo
          }
        });
      }
    },
    // 冻结课程
    freezeCourse(row) {
      this.freezeDialog = true;
      var params = {
        orderId: row.orderId,
        orderCourseId: row.orderCourseId,
        courseId: row.courseId,
        courseStatus: row.courseStatus
      };
      // 点击冻结回显
      this.$refs.freezeCourse.getFreezeCourse(params);
    },
    // 解冻课程
    unFreezeCourse(row) {
      this.unFreezeDialog = true;
      var params = {
        orderId: row.orderId,
        orderCourseId: row.orderCourseId,
        courseId: row.courseId,
        courseStatus: row.courseStatus
      };
      // 点击解冻回显
      this.$refs.unFreezeCourse.getUnFreezeCourse(params);
    },
    //课程退费页面
    courseRefund(row) {
      let courseDetailList = [];
      row.courseDetailList.forEach(element => {
        if (element.courseStatus != 202) {
          courseDetailList.push(element);
        }
      });
      this.courseListDialog = true;
      row.typeOf = 1; //判断条件，是转课还是退费
      this.course = courseDetailList;
      this.orderRow = row;
      // var params = {
      //   type: row.type
      // };
    },
    //订单订金退费弹窗
    depositRefund(row) {
      var params = {
        orderId: row.orderId,
        orderStatus: row.orderStatus,
        type: row.type
      };
      this.depositRefundDialogVisible = true;
      this.$refs.depositRefund.getList(params);
    },
    //转正式
    returnFullOrder(row) {
      let query = {
        year: row.year,
        // orderId: row.orderId,
        oldOrderId: row.orderId
      };
      if (row.type == 2) {
        query.TransferFull = 1;
      }
      this.$router.push({
        path:
          "/OrderMgt/FullOrder/" + row.studentId + "/fullOrderStepSelectClass",
        query
      });

      this.clearNumber()
    },
    //订单删除
    deleteOrder(row) {
      this.$confirm("确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOrder(row.orderId).then(res => {
            if (res.status == 200) {
              this.$tipsMessage("暂存删除成功", "success");
              this.getOrderDetail();
            } else {
              this.$tipsMessage("暂存删除失败", "warning");
            }
          });
        })
        .catch(() => {});
    },
    //修改订单
    modifyOrder(row) {
      let orderStatus = row.orderStatus;
      //网课
      if (orderStatus == 11 || orderStatus == 301) {
        this.$router.push({
          path: "/OrderMgt/AddOnlineAudition",
          query: {
            orderId: row.orderId,
            studentId: row.studentId,
            year: row.year
          }
        });
      }
      //课程处理中,退费修改
      if (orderStatus == 105) {
        this.$router.push({
          path: "/OrderMgt/RefundModification",
          query: { orderNo: row.orderNo }
        });
      }
      //定金
      if (orderStatus == 12 || orderStatus == 302) {
        this.$router.push({
          path: "/OrderMgt/DepositOrder",
          query: { orderId: row.orderId, studentId: row.studentId }
        });
      }
      //定金退费驳回
      if (orderStatus == 304) {
        this.depositRefund(row);
      }
      //正式订单
      if (orderStatus == 13 || orderStatus == 303) {
        this.$router.push({
          path:
            "/OrderMgt/FullOrder/" +
            row.studentId +
            "/fullOrderStepSelectClass",
          query: { orderId: row.orderId, year: row.year }
        });

        this.clearNumber()//用于清空local数据和vuex中的数据
      }
    },
    courseChange(row, courseId) {
      //冻结驳回
      if (courseId == 302) {
        this.freezeCourse(row);
      }
      //解冻驳回
      if (courseId == 303) {
        this.unFreezeCourse(row);
      }
      // //0
      // if (courseId == 304) {
      //   this.courseRefund(row)
      // }
    },
    //课程撤销
    courseApplyCancel(orderCourseId) {
      this.$confirm("确定撤销吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          courseApplyCancel(orderCourseId).then(res => {
            if (res.status == 200) {
              this.$tipsMessage("撤销成功", "success");
              this.getOrderDetail();
            } else {
              this.$tipsMessage("撤销失败", "warning");
            }
          });
        })
        .catch(() => {});
    },
    //订单撤销
    orderApplyCancel(orderId) {
      this.$confirm("确定撤销吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          orderApplyCancel(orderId).then(res => {
            if (res.status == 200) {
              this.$tipsMessage("撤销成功", "success");
              this.getOrderDetail();
            } else {
              this.$tipsMessage("撤销失败", "warning");
            }
          });
        })
        .catch(() => {});
    },
    //合并单元行
    spanMethod({ row, column, rowIndex, columnIndex }) {
      let arr = [0, 1, 2, 3, 4, 5, 6, 13];
      let colspan = 0;
      row.row == 0 ? (colspan = 0) : (colspan = 1);
      if (arr.includes(columnIndex)) {
        return {
          rowspan: row.row,
          colspan: colspan
        };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    //查看输入的名字是否正确
    changeName(val) {
      if (val.length >= 50) {
        this.$tipsMessage("你输入的姓名的长度超过了50个汉字,请重输", "warning");
        this.searchForm.name = null;
      }
    },
    //查看学员id是否符合条件
    changeStudentId(val) {
      let reg = /[\u4e00-\u9fa5]/;
      if (reg.test(val) && val) {
        this.$tipsMessage("学员ID 处不能输入汉字 ", "warning");
      }
    },
    //正式订单退费撤销
    courseApplyCancels(row) {
      this.$confirm("确定撤销吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let orderCourseIds = [];
          row.courseDetailList.forEach(val => {
            orderCourseIds.push(val.orderCourseId);
          });
          courseApplyCancels({ orderCourseIds, orderId: row.orderId }).then(
            res => {
              if (res.status == 200) {
                this.$tipsMessage("撤销成功", "success");
                this.getOrderDetail();
              } else {
                this.$tipsMessage("撤销失败", "warning");
              }
            }
          );
        })
        .catch(() => {});
    }
  },
  created() {
    if (this.$route.query.isReject) {
      this.searchForm.isReject = 1;
    }
    this.getOrderDetail();
  }
};
</script>
<style lang="scss" scoped>
// .el-table /deep/ .cell,
// .el-table--border /deep/th:first-child .cell {
//   padding: 0;
//   text-align: center;
//   transform: scale(0.9);
// }
.font-size-thick {
  margin-top: 20px;
}
table td {
  border: 1px solid #909399;
  width: 80px;
}
table tr td:last-child {
  width: 250px;
}
table {
  border-collapse: collapse;
  border: 1px solid #909399;
}
.el-checkbox {
  display: block;
  margin-left: 0;
}
.top {
  margin-top: -20px !important;
}
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.width150 {
  width: 150px;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.margins {
  margin: 0;
  padding: 0;
}
</style>
