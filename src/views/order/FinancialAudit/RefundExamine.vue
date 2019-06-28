/*
@author hongdengru
@date 2019/2/27
*/
<template>
  <div class="app-container">
    <student-info :student-id="$route.query.studentId"/>
    <Card-Container :orderNo="$route.query.row.orderNo" title="">
      <template slot="body">
    <div v-if="listTitle.length != 0">
      <div v-for="(item,index) in listTitle" :key="index">
        <el-table
          highlight-current-row
          border
          fit
          v-loading="listLoading"
          :data="listTitle[index]"
          stripe
          style="width: 100%;"
        >
          <el-table-column label="课程属性" align="center" prop="propertyName"/>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
          <el-table-column label="课程类型" align="center" prop="courseType"/>
          <el-table-column label="课程状态" align="center" prop="statusName"/>
          <el-table-column label="可退金额" align="center" prop="canBeRefundAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.canBeRefundAmount|price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退费金额" align="center">
            <template slot-scope="scope">
                <AmountInput money="￥-" placeholder="" :disabledFlag="true" :amount="scope.row.refundAmount"></AmountInput>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          highlight-current-row
          border
          fit
          v-loading="listLoading"
          v-if="!listTitleOfContent[index][0]"
          :data="listTitleOfContent[index]"
          stripe
          style="width: 100%;margin-top:15px;margin-bottom:15px;"
        >
          <el-table-column width="55" :render-header="renderHeader" align="center">
            <template slot-scope="scope">
              <el-checkbox disabled v-model="checkBox"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="课次" align="center" prop="attendanceNum"/>
          <el-table-column label="班级名称" align="center" prop="className" width="250"/>
          <el-table-column label="上课日期" align="center" prop="date"/>
          <el-table-column label="上课时段" align="center" prop="timeGap"/>
          <el-table-column label="上课老师" align="center" prop="teacherName"/>
          <el-table-column label="上课教室" align="center" prop="classroom"/>
        </el-table>
      </div>
    </div>
    <div v-if="this.listOne.length != 0">
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listOne"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
        <el-table-column label="课程类型" align="center" prop="courseType"/>
        <el-table-column label="课程状态" align="center" prop="statusName"/>
        <el-table-column label="可退金额" align="center" prop="canBeRefundAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.canBeRefundAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" align="center">
          <template slot-scope="scope">
                <AmountInput money="￥-" placeholder="" :disabledFlag="true" :amount="scope.row.refundAmount"></AmountInput>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.listTwo.length != 0">
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listTwo"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
        <el-table-column label="课程类型" align="center" prop="courseType"/>
        <el-table-column label="课程状态" align="center" prop="statusName"/>
        <el-table-column label="可退金额" align="center" prop="canBeRefundAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.canBeRefundAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" align="center">
          <template slot-scope="scope">
                <AmountInput money="￥-" placeholder="" :disabledFlag="true" :amount="scope.row.refundAmount"></AmountInput>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.listThree.length != 0">
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listThree"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
        <el-table-column label="课程类型" align="center" prop="courseType"/>
        <el-table-column label="课程状态" align="center" prop="statusName"/>
        <el-table-column label="可退金额" align="center" prop="canBeRefundAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.canBeRefundAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" align="center">
          <template slot-scope="scope">
                <AmountInput money="￥-" placeholder="" :disabledFlag="true" :amount="scope.row.refundAmount"></AmountInput>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.listFour.length != 0">
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listFour"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
        <el-table-column label="课程类型" align="center" prop="courseType"/>
        <el-table-column label="课程状态" align="center" prop="statusName"/>
        <el-table-column label="可退金额" align="center" prop="canBeRefundAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.canBeRefundAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" align="center">
          <template slot-scope="scope">
                <AmountInput money="￥-" placeholder="" :disabledFlag="true" :amount="scope.row.refundAmount"></AmountInput>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </template>
    </Card-Container>
    <Card-Container :paddingValue="10" title="">
      <template slot="body">
        <el-form style="margin-top:10px;" inline label-width="120px" :model="tableList" ref="CourseRefund" label-position="right">
          <el-form-item label="退费单据号" required >
            <el-input v-model="tableList.refundNo" style="width:180px;" disabled/>
          </el-form-item>
          <el-form-item label="退费方式" required>
            <el-select v-model="tableList.payTypeId" disabled style="width:180px;" placeholder="请选择">
              <el-option
                v-for="item in payType"
                :key="item.payTypeId"
                :label="item.payTypeName"
                :value="item.payTypeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="退费时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="tableList.operateTime"
              value-format="yyyy-MM-dd"
              clearable
              disabled
              style="width:180px;"
            ></el-date-picker>
          </el-form-item>
          <br>
          <el-form-item label="操作人员">
            <div style="width:180px;">{{tableList.userName}}</div>
          </el-form-item>
          <el-form-item label="销售人员">
            <div style="width:180px;">{{tableList.salesUserName}}</div>
          </el-form-item>
          <el-form-item v-if="this.tableList.divideUserName" label="分成人员">
            <div style="width:180px;">{{tableList.divideUserName}}</div>
          </el-form-item>
          <br>

          <el-form-item label="合计金额">
              <AmountInput money="￥-" placeholder="" style="width:180px;" :disabledFlag="true" :amount="tableList.totalAmount"></AmountInput>
          </el-form-item>
        <!-- <el-col :span="6">
          <el-form-item label="合计课次">
            <span>{{tableList.courseNum}} 次</span>
          </el-form-item>
        </el-col> -->
          <el-form-item label="非常规退费">
            <div style="width:180px;">
            <el-radio disabled v-model="tableList.abnormalRefund" :label="1">是</el-radio>
            <el-radio disabled v-model="tableList.abnormalRefund" :label="0">否</el-radio>

            </div>
          </el-form-item>
          <el-form-item v-show="tableList.abnormalRefund" label="非常规退费金额" label-width="120px">
              <AmountInput money="￥-" placeholder="" style="width:180px;" :disabledFlag="true" :amount="tableList.abnormalRefundAmount"></AmountInput>
          </el-form-item>
          <br>
          <el-form-item label="合计退费金额">
            <AmountInput money="￥-" placeholder="" style="width:180px;" :disabledFlag="true" :amount="tableList.totalRefundAmount"></AmountInput>
        </el-form-item>
        <br>
          <el-form-item label="非常规退费原因">
            <el-input
              type="textarea"
              v-model="tableList.abnormalRefundCause"
              placeholder="请输入内容"
              style="width:495px"
              disabled
              clearable
            />
          </el-form-item>
          <br>
          <el-form-item label=" 银行卡号" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="accountNumber" style="width:180px" clearable maxlength="23"/>
          </el-form-item>
          <el-form-item label="开户行" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="bankName" style="width:180px" clearable maxlength="50"/>
          </el-form-item>
          <el-form-item label="开户名" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="accountName"  style="width:180px" clearable maxlength="50"/>
          </el-form-item>
          <el-form-item label="退费发票号" required>
            <el-input :disabled="$route.query.auditType1 == 2" style="width:180px" v-model="invoiceNo" clearable maxlength="20"/>
          </el-form-item>
          <br>
          <el-form-item label="审核信息">
            <el-input style="width:495px" :disabled="$route.query.auditType1 == 2" type="textarea" v-model="tableList.auditRemark" maxlength="100"/>
          </el-form-item>
    </el-form>
    <div v-if="$route.query.auditType1 == 1" slot="footer" class="footer">
      <el-button @click="goBack">取消</el-button>
      <el-button :loading="loading" type="primary" @click="confirmOrder1">确认</el-button>
      <el-button :loading="falseLoading" type="primary" @click="orderReturn1">退回</el-button>
    </div>
    <div v-if="$route.query.auditType1 == 2" slot="footer" class="footer">
      <el-button type="primary" @click="goBack">关闭</el-button>
    </div>
    </template>
    </Card-Container>
  </div>
</template>
<script>
import {
  recfundAuditCourse,
  confirmOrder,
  orderReturn
} from "@/api/order/RefundExamineView";
import StudentInfo from "@/views/order/components/StudentInfo";
import { payMoney } from "@/api/order/AddOnlineAuditionApi";
import orderCourseApi from "@/api/order/OrderCourseApi";
import { getDepositInfo, refundOrder } from "@/api/order/OrderDetailApi";
import messageInfo from './common/messageInfo';
export default {
  name: "RefundExamine", //课程退费审核
  props: ["orderId"],
  mixins: [messageInfo],
  components: {
    StudentInfo,
  },
  data () {
    return {
      courseIdListByOfline: [],
      courseIdListAll: [],
      checkBox: true,
      loading: false, // 确认审核按钮
      falseLoading: false, // 退回审核按钮
      listTitle: [],
      accountNumber: null,
      bankName: null,
      accountName: null,
      invoiceNo: null,
      listTitleOfContent: [],
      money: "",
      moneyOne: "",
      moneyTwo: "",
      moneyThree: "",
      moneyFour: "",
      list: [], //班教
      lists: [], //班教每一个
      listOne: [], //直播、录播
      listTwo: [], //个性化
      listThree: [], //非学科
      listFour: [], //其他
      listLoading: false,
      payType: [], //退费方式选择
      getAmount: 0,
      tableList: {
        courseNum: 0, // 合计课次
        auditRemark: ""
      },
      nonNormalRefundNOShow: false,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      params: null //父组件传的值
    };
  },
  filters: {
    status (val) {
      if (val === 201) {
        return "正常";
      }
      if (val === 202) {
        return "已冻结";
      }
      if (val === 304) {
        return "退费驳回";
      }
    }
  },
  mounted () {
    this.getOrderPayTypeList();
    this.findRefundCourse();
  },
  methods: {

    // 确认审核
    confirmOrder1 () {
      if (this.insertInfoSure()) {
        this.$confirm("确认后无法更改审核，请确认是否通过审核。", '消息').then(() => {
          this.confirmOrder();
        }).catch(() => {
        });
      } else {
        return false
      }
    },
    confirmOrder () {
      this.loading = true;
      confirmOrder({
        orderId: this.$route.query.orderId, //this.$route.query.orderId,
        message: this.tableList.auditRemark,
        courseIdListByOfline: this.courseIdListByOfline,
        courseIdListAll: this.courseIdListAll,
        accountNumber: this.accountNumber.replace(/\D/g,''),
        bankName: this.bankName,
        accountName: this.accountName,
        invoiceNo: this.invoiceNo,
      }).then(res => {
        this.loading = false;
        if (res.status == 200) {
          this.$message({
            message: "课程退费订单审核确认成功",
            type: "success"
          });
          this.$router.push({ name: "FinancialAudit" });
        } else {
          this.$message({
            message: "课程退费订单审核确认失败",
            type: "warning"
          });
        }
      });
    },
    // 驳回审核
    orderReturn1 () {
      if (this.messageInfo(this.tableList.auditRemark)) {
        this.$confirm("退回后无法更改审核，需等待重新提交后可再次审核，请确认是否要退回？", '消息').then(() => {
          this.orderReturn();
        }).catch(() => { });
      } else {
        return false
      }
    },
    orderReturn () {
      this.falseLoading = true;
      orderReturn({
        orderId: this.$route.query.orderId, //this.$route.query.orderId,
        message: this.tableList.auditRemark,
        courseIdListByOfline: this.courseIdListByOfline,
        courseIdListAll: this.courseIdListAll,
        // accountNumber:this.accountNumber,
        // bankName:this.bankName,
        // accountName:this.accountName,
        // invoiceNo:this.invoiceNo,
      }).then(res => {
        this.falseLoading = false;
        if (res.status == 200) {
          this.$message({
            message: "课程退费订单退回成功",
            type: "success"
          });
          this.$router.push({ name: "FinancialAudit" });
        } else {
          this.$message({
            message: "课程退费订单退回失败",
            type: "warning"
          });
        }
      });
    },
    // 返回
    goBack () {
      this.$router.go(-1);
    },
    renderHeader (h, { column, $index }) {
      return <div />;
    },
    selectTable () {
      return false;
    },
    findRefundCourse () {
      recfundAuditCourse({
        orderNo: this.$route.query.orderNo //this.$route.query.orderId,
      })
        .then(res => {
          if (res.status === 200) {
            // console.log(res);
            this.tableList = res.data;
            this.accountNumber = res.data.accountNumber;
            this.bankName = res.data.bankName;
            this.accountName = res.data.accountName;
            this.invoiceNo = res.data.invoiceNo;
            this.tableList.courseNum = 0;
             if (this.tableList.abnormalRefundAmount != null || this.tableList.abnormalRefundAmount != "") {
              this.tableList.abnormalRefundAmount = Math.abs(this.tableList.abnormalRefundAmount)
            }
            let courseRefundResultDTOList = res.data.courseRefundResultDTOList;
            this.tableList.totalRefundAmount = 0;
            for (var i = 0;i < courseRefundResultDTOList.length;i++) {
              courseRefundResultDTOList[i].amount = 0;
              courseRefundResultDTOList[i].amount =
                courseRefundResultDTOList[i].totalPrice -
                this.tableList.totalAmount;
                console.log(courseRefundResultDTOList[
                i
              ].refundAmount);
              this.tableList.totalRefundAmount += Math.abs(courseRefundResultDTOList[
                i
              ].refundAmount);
              courseRefundResultDTOList[
                i
              ].refundAmount = Math.abs(courseRefundResultDTOList[
                i
              ].refundAmount).toLocaleString();
              console.log(courseRefundResultDTOList[
                i
              ].refundAmount);
              let listTitleArr = [courseRefundResultDTOList[i]];
              if (courseRefundResultDTOList[i].propertyId == 1) {
                // 组装班教表头(产品名称)
                this.courseIdListByOfline.push(listTitleArr[0].courseId);
                this.listTitle.push(listTitleArr)
                  //  console.log(courseRefundResultDTOList[i].refundAmount)
                   if (courseRefundResultDTOList[i].refundAmount != null || courseRefundResultDTOList[i].refundAmount != "") {
                   courseRefundResultDTOList[i].refundAmount = courseRefundResultDTOList[i].refundAmount;
                  }
                // 可退费课次
                let listTitleOfContentArr =
                  courseRefundResultDTOList[i].offlnCourseNumDTOList;
                  // console.log(this.listTitle[0])
                // 合计课次
                this.tableList.courseNum += listTitleOfContentArr.length;
                this.listTitleOfContent.push(listTitleOfContentArr);
              } else {
                this.courseIdListAll.push(listTitleArr[0].courseId);
              }
              if (
                courseRefundResultDTOList[i].propertyId === 2 ||
                courseRefundResultDTOList[i].propertyId === 3
              ) {
                this.listOne.push(courseRefundResultDTOList[i]);
                 
                 for(let i = 0;i<this.listOne.length;i++){
                  //  console.log(this.listOne[i].totalPrice)
                   if (this.listOne[i].refundAmount != null || this.listOne[i].refundAmount != "") {
                    this.listOne[i].refundAmount = this.listOne[i].refundAmount;
                  }
                }
              }
              if (courseRefundResultDTOList[i].propertyId == 4) {
                this.listTwo.push(courseRefundResultDTOList[i]);
                // console.log((this.listTwo[i].refundAmount)
                for(let i = 0;i<this.listTwo.length;i++){
                  console.log(this.listTwo[i].refundAmount)
                   if (this.listTwo[i].refundAmount != null || this.listTwo[i].refundAmount != "") {
                    this.listTwo[i].refundAmount = this.listTwo[i].refundAmount;
                  }
                }
              }
              if (courseRefundResultDTOList[i].propertyId == 5) {
                this.listThree.push(courseRefundResultDTOList[i]);
                 for(let i = 0;i<this.listThree.length;i++){
                   if (this.listThree[i].refundAmount != null || this.listThree[i].refundAmount != "") {
                    this.listThree[i].refundAmount = this.listThree[i].refundAmount;
                  }
                }
              }
              if (courseRefundResultDTOList[i].propertyId == 6) {
                this.listFour.push(courseRefundResultDTOList[i]);
                 for(let i = 0;i<this.listFour.length;i++){
                   if (this.listFour[i].refundAmount != null || this.listFour[i].refundAmount != "") {
                    this.listFour[i].refundAmount = this.listFour[i].refundAmount;
                  }
                }
              }
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(() => { });
    },
    //选择非常规退费与否
    normalChange (val) {
      if (val == 1) {
        this.nonNormalRefundNOShow = true;
      } else {
        this.nonNormalRefundNOShow = false;
      }
    },
    // 确认提交操作
    //退费方式
    getOrderPayTypeList () {
      orderCourseApi.getOrderPayTypeList().then(response => {
        this.payType = response.data;
      });
    },
    //格式化时间
    format () {
      let date = new Date();
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //判断条件
    insertInfoSure () {
      let reg = /^[0-9]*$/;
      let accountNumber = null;
      if (!this.accountNumber) {
        this.$tipsMessage("请填写银行卡号", "warning");
        return false;
      }
      accountNumber = this.accountNumber.replace(/\D/g,'')
      if (!reg.test(accountNumber)) {
        this.$tipsMessage("银行卡号请输入正确的数字", "warning");
        return false;
      }
      if (!this.bankName) {
        this.$tipsMessage("请填写开户行", "warning");
        return false;
      }
      if (!this.accountName) {
        this.$tipsMessage("请填写户名", "warning");
        return false;
      }
      if (!this.invoiceNo) {
        this.$tipsMessage("退费发票号", "warning");
        return false;
      }
      if (!reg.test(this.invoiceNo)) {
        this.$tipsMessage("退费发票号请输入正确的数字", "warning");
        return false;
      }
      return true;
    }
  },
  watch: {
    ['accountNumber'] (val) {
      this.$nextTick(() => {
        this.accountNumber = val.replace(/\s/g, '').replace(/[^\d|*]/g, '').replace(/([\d|\*]{4})(?=[\d|\*])/g, "$1 ");
      });
    }
  }
};
</script>
<style scoped>
.classTitle {
  padding-bottom: 10px;
}
td {
  /* border: 1px solid #000; */
  border-collapse: collapse;
  width: 900px;
  height: 40px;
}
.top {
  margin-top: -20px !important;
}
.font {
  font-size: 14px;
  margin-bottom: 10px;
}
.el-row {
  margin-bottom: 0;
}
.footer {
  margin-left: 40%;
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
</style>
