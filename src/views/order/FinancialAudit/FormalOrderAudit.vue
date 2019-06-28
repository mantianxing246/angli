/*
@author lfz
@date 2019/1/29
*/
<template>
  <div class="app-container">
    <student-info :student-id="$route.query.studentId"/>
    <transfer-course ref="transferCourse" v-show="transferCourseFlag"/>
    <Card-Container
      :orderNo="$route.query.row.orderNo"
      v-if="selectCourse.length>0 ||recListCourse.length>0||individuaListCourse.length>0 || noSubject.length>0 || other.length>0 ||giveOrderCourseList.length>0"
      title
    >
      <template slot="body">
        <div v-show="selectCourse.length>0">
          <el-table
            :data="selectCourse"
            border
            tip
            stripe
            highlight-current-row
            class="margin-top20"
          >
            <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="课次" align="center" prop="times" width="50"></el-table-column>
            <el-table-column label="购买课次" align="center" prop="buyTimes" width="50"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="individuaListCourse.length>0">
          <el-table
            :data="individuaListCourse"
            border
            tip
            stripe
            highlight-current-row
            class="margin-top20"
          >
            <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="课时" align="center" prop="hours" width="100"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="noSubject.length>0">
          <el-table :data="noSubject" border tip stripe highlight-current-row class="margin-top20">
            <el-table-column label="课程属性" width="100" align="center" prop="coursePropertyName"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="other.length>0">
          <el-table :data="other" border tip stripe highlight-current-row>
            <el-table-column label="课程属性" width="100" align="center" prop="coursePropertyName"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="recListCourse.length>0">
          <Live-Record :recListCourse="recListCourse" :isGive="false"></Live-Record>
        </div>
        <h3 v-if="giveOrderCourseList.length>0">赠送课程</h3>
        <div v-show="giveSelectCourse.length>0">
          <el-table
            :data="giveSelectCourse"
            border
            tip
            stripe
            highlight-current-row
            class="margin-top20"
          >
            <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="课次" align="center" prop="times" width="50"></el-table-column>
            <el-table-column label="购买课次" align="center" prop="buyTimes" width="50"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="giveIndividuaListCourse.length>0">
          <el-table
            :data="giveIndividuaListCourse"
            border
            tip
            stripe
            highlight-current-row
            class="margin-top20"
          >
            <el-table-column label="课程属性" align="center" prop="coursePropertyName" width="100"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="课时" align="center" prop="hours" width="100"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="giveNoSubject.length>0">
          <el-table :data="giveNoSubject" border tip stripe highlight-current-row class="margin-top20">
            <el-table-column label="课程属性" width="100" align="center" prop="coursePropertyName"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="giveOther.length>0">
          <el-table :data="giveOther" border tip stripe highlight-current-row>
            <el-table-column label="课程属性" width="100" align="center" prop="coursePropertyName"></el-table-column>
            <el-table-column label="课程名称" align="center" prop="courseName" min-width="400"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price|price }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="giveRecListCourse.length>0">
          <Live-Record :recListCourse="giveRecListCourse" :isGive="true"></Live-Record>
        </div>
      </template>
    </Card-Container>
    <!-- 付款信息详情 -->
    <Card-Container :paddingValue="10" title>
      <template slot="body">
        <el-form inline label-position="right" label-width="130px">
          <el-form-item v-if="formalOrderDetail.orderDiscount.discountRemark" label="符合优惠条件">
            <el-input
              v-model="formalOrderDetail.orderDiscount.discountRemark"
              type="textarea"
              disabled
              style="width:505px"
            />
          </el-form-item>
          <br v-if="formalOrderDetail.orderDiscount.discountRemark">
          <el-form-item label="特殊优惠申请单号">
            <el-input
              v-model="formalOrderDetail.orderDiscount.specDiscountNo"
              style="width:170px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="特殊优惠金额">
            <AmountInput
              money="￥"
              placeholder
              style="width:170px;"
              :disabledFlag="true"
              :amount="formalOrderDetail.orderDiscount.specDiscountAmount"
            ></AmountInput>
          </el-form-item>
          <!-- <el-form-item label="总价抵减">
        <div style="width:170px">{{ formalOrderDetail.orderDiscount.totalAiscountAmount|price }}</div>
          </el-form-item>-->
          <br>
          <el-form-item label="报名表号">
            <el-input v-model="formalOrderDetail.registerFormNum" disabled style="width:170px"></el-input>
          </el-form-item>
          <el-form-item label="付费日期">
            <el-date-picker
              type="date"
              style="width:170px"
              placeholder="付费日期"
              disabled
              v-model="formalOrderDetail.paymentDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="应付金额" label-width="68px">
              <AmountInput
                money="￥"
                style="width:100px;"
                :disabledFlag="true"
                :amount="formalOrderDetail.payable"
              ></AmountInput>
            </el-form-item>
          <el-row v-for="(item,index) in formalOrderDetail.orderMonies" :key="index" style="margin-bottom:0px;">
            <el-form-item label="付费方式">
              <el-select v-model="item.payTypeId" style="width:170px" disabled>
                <el-option
                  v-for="item in payTypes"
                  :key="item.payTypeId"
                  :label="item.payTypeName"
                  :value="item.payTypeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实收金额">
              <AmountInput
                money="￥"
                style="width:170px;"
                :disabledFlag="true"
                :amount="item.received"
              ></AmountInput>
            </el-form-item>
            <br>
            <el-form-item v-if="item.terminalNo" label="终端号">
              <el-input v-model="item.terminalNo" style="width:170px" disabled/>
            </el-form-item>
            <el-form-item v-if="item.bankCardNo" label="银行卡号">
              <el-input v-model="item.bankCardNo" style="width:170px" disabled/>
            </el-form-item>
            <el-form-item v-if="item.payNo" label="订单号">
              <el-input v-model="item.payNo" style="width:170px" disabled/>
            </el-form-item>
          </el-row>
          <el-form-item v-if="formalOrderDetail.remark" label="备注信息">
            <el-input
              style="width:505px"
              type="textarea"
              v-model="formalOrderDetail.remark"
              disabled
            />
          </el-form-item>
        </el-form>
        <single-order-info :order-id="orderId"/>
        <DialogContainer title="审核信息" :visible.sync="dialogVisible" width="30%" :diglogClass="['']">
          <template slot="body">
            <el-input
              :disabled="$route.query.auditType1 == 2"
              v-model="formalOrderDetail.auditRemark"
              type="textarea"
              maxlength="100"
              :rows="6"
              style="width:100%;"
            />
          </template>
          <span slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sendBack1">确 定</el-button>
          </span>
        </DialogContainer>
      </template>
      <span slot="footer">
        <div
          v-if="$route.query.auditType1 == 1"
          align="left"
          class="marginTop20px"
          style="text-align:center;padding-top:10px;"
        >
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" :loading="loading" @click="auditPass1">确认</el-button>
          <el-button type="primary" :loading="falseLoading" @click="dialogVisible = true">退回</el-button>
        </div>
        <div
          v-if="$route.query.auditType1 == 2"
          align="left"
          class="marginTop20px"
          style="text-align:center"
        >
          <el-button type="primary" @click="goBack">关闭</el-button>
        </div>
        <orderReturn ref="orderReturn" :return-dialog-visible.sync="returnDialogVisible"/>
      </span>
    </Card-Container>
  </div>
</template>
<script>
// import SelectCourse from "@/views/order/components/SelectCourse";
import StudentInfo from "@/views/order/components/StudentInfo";
import SingleOrderInfo from "./FormalOrderAudit/SingleOrderInfo";
import TransferCourse from "./FormalOrderAudit/TransferCourse";
import LiveRecord from "./FormalOrderAudit/LiveRecord";
import OrderReturn from "@/views/order/components/OrderReturn/index";
import {
  upDateFormalOrderAuditingFalse,
  upDateFormalOrderAuditingTrue
} from "@/api/order/OrderAuditApi";
import { findProductByOrder } from "@/api/order/FinancialAudit/FormalOrderAudit";
import { selectPayType } from "@/components/select/index";
import { findCourseChangeInfoByNewOrderId } from "@/api/order/TransferCourseApi";
import messageInfo from "./common/messageInfo";
export default {
  name: "FormalOrderAudit", // 正式订单审核
  mixins: [selectPayType, messageInfo],
  props: ["orderId"],
  components: {
    SingleOrderInfo,
    StudentInfo,
    OrderReturn,
    TransferCourse,
    LiveRecord
  },
  data () {
    return {
      dialogVisible: false,
      transferCourseFlag: false,
      loading: false,
      falseLoading: false,
      courses: [],
      returnDialogVisible: false,
      createOrderInfo: {
        registerFormNum: "",
        provinceId: null,
        type: 1,
        isContinuous: 0,
        sourceType: null,
        marketType: null,
        registerType: null,
        divideUser: null,
        payTypeId: null,
        palyable: null,
        received: null,
        payTime: null,
        remark: "",
        roleId: null
      },
      formalOrderDetail: {
        orderDiscount: {}
      }, //接口返回回显信息
      orderCourseList: [], //课程列表
      selectCourse: [], //班教课程列表
      recListCourse: [], //录播直播课程列表
      individuaListCourse: [], //个性化课程列表
      noSubject: [], //非学科类
      other: [], //其他类
      giveOrderCourseList:[],//赠送课程列表
      giveSelectCourse: [], //赠送班教课程列表
      giveRecListCourse: [], ///赠送录播直播课程列表
      giveIndividuaListCourse: [], ///赠送个性化课程列表
      giveNoSubject: [], ///赠送非学科类
      giveOther: [] ///赠送其他类
    };
  },
  mounted () {
    this.findProductByOrder();
  },
  methods: {
    //获取列表数据
    findProductByOrder () {
      var _this = this;
      var price = 0;
      this.orderId = this.$route.params.orderId;
      if (this.orderId) {
        findProductByOrder(this.orderId).then(res => {
          findCourseChangeInfoByNewOrderId(res.data.orderId).then(res => {
            if (res.data) {
              this.transferCourseFlag = true;
              _this.$refs.transferCourse.init(res.data);
            }
          });
          this.formalOrderDetail = res.data;
          var orderCourseList = res.data.orderCourseList; //获取课程列表
          var giveOrderCourseList = res.data.giveOrderCourseList; //获取赠送课程列表
          this.giveOrderCourseList = giveOrderCourseList;
          //遍历赠送课程列表，拆分成5个列表
          for (var i = 0;i < giveOrderCourseList.length;i++) {
            if (giveOrderCourseList[i].coursePropertyName == "班教") {
              this.giveSelectCourse.push(giveOrderCourseList[i]);
            } else if (
              giveOrderCourseList[i].coursePropertyName == "直播" ||
              giveOrderCourseList[i].coursePropertyName == "录播"
            ) {
              this.giveRecListCourse.push(giveOrderCourseList[i]);
            } else if (giveOrderCourseList[i].coursePropertyName == "个性化") {
              this.giveIndividuaListCourse.push(giveOrderCourseList[i]);
            } else if (giveOrderCourseList[i].coursePropertyName == "非学科类") {
              this.giveNoSubject.push(giveOrderCourseList[i]);
            } else if (giveOrderCourseList[i].coursePropertyName == "其他类") {
              this.giveOther.push(giveOrderCourseList[i]);
            }
          }
          //遍历课程列表，拆分成5个列表
          for (var i = 0;i < orderCourseList.length;i++) {
            if (orderCourseList[i].coursePropertyName == "班教") {
              this.selectCourse.push(orderCourseList[i]);
            } else if (
              orderCourseList[i].coursePropertyName == "直播" ||
              orderCourseList[i].coursePropertyName == "录播"
            ) {
              this.recListCourse.push(orderCourseList[i]);
            } else if (orderCourseList[i].coursePropertyName == "个性化") {
              this.individuaListCourse.push(orderCourseList[i]);
            } else if (orderCourseList[i].coursePropertyName == "非学科类") {
              this.noSubject.push(orderCourseList[i]);
            } else if (orderCourseList[i].coursePropertyName == "其他类") {
              this.other.push(orderCourseList[i]);
            }
          }
          if (this.formalOrderDetail.orderDiscount) {
            typeof this.formalOrderDetail.orderDiscount.specDiscountAmount ===
              "number" &&
              (this.formalOrderDetail.orderDiscount.specDiscountAmount = this.formalOrderDetail.orderDiscount.specDiscountAmount.toLocaleString());
          } else {
            this.formalOrderDetail.orderDiscount = {};
          }
          this.formalOrderDetail.paymentDate =
            this.formalOrderDetail.orderMonies[0] &&
            this.formalOrderDetail.orderMonies[0].paymentDate;
          for (var i = 0;i < this.formalOrderDetail.orderMonies.length;i++) {
            this.formalOrderDetail.orderMonies[
              i
            ].received = this.formalOrderDetail.orderMonies[
              i

            ].received.toLocaleString();
          }
        });
      }
    },
   // 正式订单确认通过
    auditPass1 () {
      this.$confirm("确认后无法更改审核，请确认是否通过审核。", "消息")
        .then(() => {
          this.confirmOrder();
        })
        .catch(() => { });
    },
    confirmOrder () {
      this.loading = true;
      upDateFormalOrderAuditingTrue({
        orderId: this.orderId,
        auditRemark: this.formalOrderDetail.auditRemark
      })
        .then(res => {
          this.loading = false;
          if (res.status == 200) {
            this.$message({
              message: "审核通过！",
              type: "success"
            });
            this.$router.push({ name: "FinancialAudit" });
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(err => { });
    },
    // 订单退回
    sendBack1 () {
      if (this.messageInfo(this.formalOrderDetail.auditRemark)) {
        this.$confirm(
          "退回后无法更改审核，需等待重新提交后可再次审核，请确认是否要退回？",
          "消息"
        )
          .then(() => {
            this.orderReturn();
          })
          .catch(() => { });
      } else {
        return false;
      }
    },
    orderReturn () {
      this.falseLoading = true;
      upDateFormalOrderAuditingFalse({
        orderId: this.orderId,
        auditRemark: this.formalOrderDetail.auditRemark
      }).then(respnse => {
        this.falseLoading = false;
        if (respnse.status === 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.$router.push({ name: "FinancialAudit" });
        } else {
          this.$message({
            message: respnse.message,
            type: "warning"
          });
        }
      });
    },
    // 返回
    goBack () {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.marginTop20px {
  margin: 0px 0px 0px 0px;
  color: #909399;
}
.product {
  margin: 0px 20px 20px 20px;
  color: #909399;
}

.course {
  margin: 0px 20px 20px 20px;
  color: #909399;
}
.font-size-thick {
  font-weight: bold;
  color: #909399;
}
.fontSize {
  font-weight: 700;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.pColor {
  background: #eee;
  padding: 5px;
}
.el-message-box__header {
  background: #e6e6e6;
}
.el-message-box__title {
  text-align: center;
  font-size: 16px;
}
.el-message-box__content {
  margin: 10px 20px 0 0;
  text-align: center;
  line-height: 24px;
  font-weight: 700;
  font-size: 14px;
  color: #606266;
}
.el-message-box__btns {
  text-align: center;
}
>>> .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0;
}
>>> .el-form--inline .el-form-item {
  margin-right: 0;
}
>>> .el-table--mini td,
.el-table--mini th {
  padding: 0px 0;
}
.el-form-item{
  margin-bottom:5px;
}
</style>
