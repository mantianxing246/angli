/*
@author hongdengru
@date 2019/2/27
*/
<template>
  <div class="app-container">
    <student-info :student-id="$route.query.studentId"/>
    <Card-Container :orderNo="$route.query.row.orderNo" title="">
      <template slot="body">
    <el-form inline label-position="right" style="margin-top:10px;" label-width="100px">
      <el-form-item label="当前状态">
        <div class="itemWidth">
          {{refundExamine.orderStatus | formatCourseStatus}}
        </div>
      </el-form-item>
      <el-form-item label="退费单据号">
        <div class="itemWidth">
        {{refundExamine.refundNo}}
        </div>
      </el-form-item>
      <el-form-item label="可退金额">
        <div class="itemWidth">
        ￥{{refundExamine.received|price}}
        </div>
      </el-form-item>
      <br>
      <el-form-item label="退费金额">
        <div class="itemWidth">
        ￥{{refundExamine.totalAmount|price}}
        </div>
      </el-form-item>
      <el-form-item label="退费方式">
        <div class="itemWidth">
        {{refundExamine.payTypeId}}
        </div>
      </el-form-item>
      <el-form-item label="退费时间">
        <div class="itemWidth">
        {{refundExamine.operateTime}}
        </div>
      </el-form-item>
      <br>
      <el-form-item label="退费人员">
        <div class="itemWidth">
        {{refundExamine.userName}}
        </div>
      </el-form-item>
      <br>
      <el-form-item label="备注信息">
        <el-input
          v-model="refundExamine.remark"
          style="width:514px"
          :rows="3"
          type="textarea"
          disabled
        />
      </el-form-item>
    </el-form>
    </template>
    </Card-Container>
    <Card-Container :paddingValue="10" title="">
      <template slot="body">
      <el-form inline label-position="right" label-width="100px">
          <el-form-item label=" 银行卡号" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="accountNumber" style="width:220px" clearable maxlength="23"/>
          </el-form-item>
           <el-form-item label="开户行" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="bankName" style="width:180px" clearable maxlength="50"/>
          </el-form-item>
          <br>
          <el-form-item label="开户名" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="accountName" style="width:220px" clearable maxlength="50"/>
          </el-form-item>
          <el-form-item label="退费发票号" required>
            <el-input :disabled="$route.query.auditType1 == 2" v-model="invoiceNo" style="width:180px" clearable maxlength="20"/>
          </el-form-item>
          <el-form-item label="审核信息">
            <el-input :disabled="$route.query.auditType1 == 2" v-model="auditRemark" type="textarea" style="width:514px" maxlength="100"/>
          </el-form-item>
      </el-form>
    <el-row v-if="$route.query.auditType1 == 1" class="margin-20" type="flex" style="text-align:center">
      <el-col>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" :loading="loading" @click="confirmOrder1">确认</el-button>
        <el-button type="primary" :loading="falseLoading" @click="orderReturn1">退回</el-button>
      </el-col>
    </el-row>
    <el-row v-if="$route.query.auditType1 == 2" class="margin-20" type="flex" style="text-align:center">
      <el-col>
         <el-button type="primary" @click="goBack">关闭</el-button>
      </el-col>
    </el-row>
    </template>
    </Card-Container>
  </div>
</template>
<script>
import orderCourseApi from "@/api/order/OrderCourseApi";
import {
  recfundCourse,
  confirmOrder,
  orderReturn,
  recfundAuditCourse
} from "@/api/order/OrderRefundExamine";
import StudentInfo from "@/views/order/components/StudentInfo";
import { payMoney } from "@/api/order/AddOnlineAuditionApi";
import { checkAuditRemark } from "@/utils/async-validator.js";
import { getOrderPayTypeList } from "@/api/common/common";
import messageInfo from './common/messageInfo';
export default {
  name: "RefundExamine", // 订金订单退费审核
  props: ["orderId"],
  mixins: [messageInfo],
  components: {
    StudentInfo,
  },
  filters: {
    formatCourseStatus (val) {
      switch (val) {
        case 101:
          return "网课试听申请"
          break;
        case 102:
          return "订金订单申请"
          break;
        case 103:
          return "正式订单申请"
          break;
        case 104:
          return "订金退费申请"
          break;
        case 105:
          return "课程处理中"
          break;
        case 201:
          return "试听"
          break;
        case 202:
          return "已交订金"
          break;
        case 203:
          return "正常"
          break;
        case 204:
          return "已退订金"
          break;
        case 299:
          return "已结束"
          break;
        case 301:
          return "试听申请驳回"
          break;
        case 302:
          return "订金申请驳回"
          break;
        case 303:
          return "正式申请驳回"
          break;
        case 304:
          return "订金退费驳回"
          break;
        case 501:
          return "试听"
          break;
        case 502:
          return "已交订金"
          break;
        case 503:
          return "正常"
          break;
        case 504:
          return "已退订金"
          break;
        case 599:
          return "已结束"
          break;
      }
    }
  },
  data () {
    return {
      loading: false,
      falseLoading: false,
      ThawOrderExamine: [],
      message: null,
      query: null,
      accountNumber: null,
      bankName: null,
      accountName: null,
      invoiceNo: null,
      refundExamine: [],
      tableQuery: {
        payTypes: null,
        nonNormalRefundNO: null
      },
      auditRemark: "", //审核信息
      date: null,
      payTypes: [], //付款方式
      payTypeId: "" //退费方式
    };
  },
  created () {
    this.recfundAuditCourse();
  },
  methods: {
    //返回
    goBack () {
      this.$router.go(-1);
    },
    //获取退费方式
    getOrderPayTypeList () {
      var _this = this;
      getOrderPayTypeList().then(res => {
        for (var i = 0;i < res.data.length;i++) {
          if (res.data[i].payTypeId == _this.refundExamine.payTypeId) {
            _this.refundExamine.payTypeId = res.data[i].payTypeName;
          }
        }
      });
    },
    //获取列表信息
    recfundAuditCourse () {
      var _this = this;
      this.query = this.$route.query;
      var data = { orderId: this.query.orderId };
      recfundAuditCourse(data).then(res => {
        if (res.status == 200) {
          this.refundExamine = res.data;
          this.accountNumber = res.data.accountNumber;
          this.bankName = res.data.bankName;
          this.accountName = res.data.accountName;
          this.invoiceNo = res.data.invoiceNo;
          this.auditRemark = this.refundExamine.auditRemark
          this.refundExamine.received = this.refundExamine.received
          this.refundExamine.totalAmount = this.refundExamine.totalAmount
          this.getOrderPayTypeList(res);
          this.courseStatus(res.data.status);
          res.data.operateTime
            ? (this.date = new Date(res.data.operateTime))
            : (this.date = "");
          _this.payTypeId = res.data.payTypeId;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    //确认审核
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
        orderId: this.query.orderId,
        auditRemark: this.auditRemark,
        status: 402,
        accountNumber: this.accountNumber.replace(/\D/g,''),
        bankName: this.bankName,
        accountName: this.invoiceNo,
        invoiceNo: this.invoiceNo,
      }).then(res => {
        this.loading = false;
        if (res.status == 200) {
          this.$message({
            message: "订单退费订单审核确认成功",
            type: "success"
          });
          this.$router.push({ name: "FinancialAudit" });
        } else {
          this.$message({
            message: "订单退费订单审核确认失败",
            type: "warning"
          });
        }
      });
    },
    //审核驳回
    orderReturn1 () {
      if (this.messageInfo(this.auditRemark)) {
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
        orderId: this.query.orderId,
        auditRemark: this.auditRemark,
        status: 402,
        // accountNumber:this.accountNumber,
        // bankName:this.bankName,
        // accountName:this.invoiceNo,
        // invoiceNo:this.invoiceNo,
      }).then(res => {
        this.falseLoading = false;
        if (res.status == 200) {
          this.$message({
            message: "订单退费订单退回成功",
            type: "success"
          });
          this.$router.push({ name: "FinancialAudit" });
        } else {
          this.$message({
            message: "订单退费订单退回失败",
            type: "warning"
          });
        }
      });
    },
    courseStatus (courseStatus) {
      if (courseStatus === 100) {
        this.refundExamine.courseStatus = "暂存";
      }
      if (courseStatus === 101) {
        this.refundExamine.courseStatus = "开课申请";
      }
      if (courseStatus === 102) {
        this.refundExamine.courseStatus = "冻结申请";
      }
      if (courseStatus === 103) {
        this.refundExamine.courseStatus = "解冻申请";
      }
      if (courseStatus === 104) {
        this.refundExamine.courseStatus = "退费申请";
      }
      if (courseStatus === 105) {
        this.refundExamine.courseStatus = "订单创转课申请";
      }
    },
    insertInfoSure () {
      let reg = /^[0-9]*$/;
      let  accountNumber = null
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
.itemWidth{
  width:100px;
}
.margin-20 {
  margin-top: 20px;
}
td {
  font-size: 14px;
  color: rgba(0,0,0,0.85);;
  width: 90px;
}
.width120 {
  width: 130px;
}
.pcolor {
  background: #eee;
  padding: 5px;
  font-size: 14px;
}
.font {
  font-weight: 700;
}
.el-row {
  margin-bottom: 0px;
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