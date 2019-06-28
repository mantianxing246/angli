
<template>
  <div class="app-container">
    <student-info :student-id="$route.query.studentId"/>
    <Card-Container :orderNo="$route.query.row.orderNo" title="">
      <template slot="body">
    <el-form ref="form" :model="form" :inline="true" style="margin-top:10px;" label-width="80px">
      <el-form-item label="报名表号">
        <el-input v-model="form.registerFormNum" disabled="disabled" :style="lableAfter"/>
      </el-form-item>
      <el-form-item label="开单人员">
        <el-input v-model="form.createUserName" disabled="disabled" :style="lableAfter"/>
      </el-form-item>
      <br>
      <el-form-item label="是否续报">
        <el-radio-group v-model="form.isContinuous" :style="lableAfter">
          <el-radio disabled :label="1">是</el-radio>
          <el-radio disabled :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="省市">
        <el-select v-model="form.provinceId" :style="lableAfter" disabled>
          <el-option
            v-for="item in headInfo.provinces"
            :value="item.provinceId"
            :label="item.provinceName"
            :key="item.provinceId+ '-provinceId'"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收入类别" prop="sourceType">
        <el-select placeholder="收入类别" v-model="form.sourceType" :style="lableAfter" disabled>
          <el-option
            :value="sourceTypes.id"
            :label="sourceTypes.typeName"
            v-for="sourceTypes in  changeIsContinuousLink(selectInfo.sourceTypes,form.isContinuous,form.provinceId)"
            :key="sourceTypes.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市场手段" prop="marketType">
        <el-select placeholder="市场手段" v-model="form.marketType" style="width:180px;" disabled>
          <el-option
            :value="marketTypes.id"
            :label="marketTypes.typeName"
            v-for="marketTypes in selectInfo.marketTypes"
            :key="marketTypes.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名场合" prop="registerType">
        <el-select placeholder="报名场合" v-model="form.registerType" :style="lableAfter" disabled>
          <el-option
            :value="registerTypes.id"
            :label="registerTypes.typeName"
            v-for="registerTypes in selectInfo.registerTypes"
            :key="registerTypes.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="付费方式">
        <el-select v-model="form.payTypeId" placeholder="请选择" :style="lableAfter" disabled>
          <el-option
            v-for="item in payTypes"
            :value="item.payTypeId"
            :label="item.payTypeName"
            :key="item.payTypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付金额">
          <AmountInput money="￥" placeholder="" style="width:180px;" :disabledFlag="true" :amount="form.received"></AmountInput>
      </el-form-item>
      <el-form-item label="付费日期">
        <el-date-picker
          type="date"
          style="width:180px"
          placeholder="付费日期"
          disabled
          v-model="form.paymentDate"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <br>
      <el-form-item v-if="form.terminalNo" label="终端号">
        <el-input v-model="form.terminalNo" :style="lableAfter" disabled/>
      </el-form-item>
      <el-form-item v-if="form.bankCardNo" label="银行卡号">
        <el-input v-model="form.bankCardNo" :style="lableAfter" disabled/>
      </el-form-item>
      <el-form-item v-if="form.payNo" label="订单号">
        <el-input v-model="form.payNo" :style="lableAfter" disabled/>
      </el-form-item>
      <br>
      <el-form-item label="备注信息">
        <el-input v-model="form.remark" type="textarea" style="width:455px;" disabled/>
      </el-form-item>
      <br>
      <el-form-item label="审核信息">
        <el-input :disabled="$route.query.auditType1 == 2" v-model="form.auditRemark" type="textarea" style="width:455px;" maxlength="100"/>
      </el-form-item>
      <el-row v-if="$route.query.auditType1 == 1" style="margin-top:20px;text-align:center;">
        <el-col>
          <!-- 取消 确定 退回的显示逻辑放在messageInfo组件里面 -->
          <el-button @click="goback">取 消</el-button>
          <el-button :loading="loading" type="primary" @click="subAudit1">确 定</el-button>
          <el-button :loading="falseLoading" type="primary" @click="falseAudit1">退回</el-button>
        </el-col>
      </el-row>
      <el-row v-if="$route.query.auditType1 == 2" style="margin-top:20px;text-align:center;">
        <el-col>
          <!-- 取消 确定 退回的显示逻辑放在messageInfo组件里面 -->
          <el-button type="primary" @click="goback">关 闭</el-button>
        </el-col>
      </el-row>
    </el-form>
    </template>
    </Card-Container>
  </div>
</template>
<script>
import {
  findDepositOrderById,
  upDateDepositOrderAuditingTrue,
  upDateDepositOrderAuditingFalse
} from "@/api/order/OrderAuditApi";
import StudentInfo from "@/views/order/components/StudentInfo";
import { payMoney } from "@/api/order/AddOnlineAuditionApi";
import { getHeadInfo } from "@/api/order/HeadInfoApi";
import SourceTypeAndMarketType from "@/components/select/SourceTypeAndMarketType";
import changeIsContinuousLink from "@/components/select/changeIsContinuousLink";
import messageInfo from './common/messageInfo';
import { selectPayType } from "@/components/select/index";
export default {
  name: "EarnestMoneyAuditions", //订金订单审核
  mixins: [SourceTypeAndMarketType, changeIsContinuousLink, messageInfo, selectPayType],
  components: {
    StudentInfo,
  },
  data: function () {
    return {
      lableAfter: {
        width: "180px"
      },
      selectInfo: {},
      listLoading: false,
      loading: false,
      falseLoading: false,
      orderId: this.$route.params.orderId, // 订单id
      classData: [], // 课程列表detail
      form: {
        // 订单审核详情
        registerFormNum: "", // 报名表号
        createUserName: "", // 开单人员
        payTypeId: "", // 付费方式
        received: "", // 支付金额
        remark: "", // 备注信息
        isContinuous: "", // 是否续保
        sourceType: "", // 收入类别
        marketType: "", // 市场手段
        registerType: "", // 报名场合
        auditRemark: "" // 审核信息
      },
      auditMsg: {},
      headInfo: {
        marketTypes: [],
        registerTypes: []
      }
    };
  },
  created () {
    this.findDepositOrderById();
    this.getHeadInfo();
  },
  methods: {
    // 获取定金订单审核内容
    findDepositOrderById () {
      findDepositOrderById(this.orderId)
        .then(res => {
          if (res.status === 200) {
            this.form = res.data;
            this.form.received = this.form.received.toLocaleString()
            this.getUserListSales(res.data.salesUserDeptId, res.data.salesUserRoleId, 'salesUsers');
            if (this.form.divideUser) {
              this.salesDivide = 0;
              this.getUserListDiv(res.data.salesUserDeptId, res.data.salesUserRoleId, 'divideUsers');
            } else {
            };
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .then(res => {
          return this.getFindSourceType();
        })
    },
    // 返回
    goback () {
      this.$router.back(-1);
    },
    // 确定审核
    subAudit1 () {
      this.$confirm("确认后无法更改审核，请确认是否通过审核。", '消息').then(() => {
        this.confirmOrder();
      }).catch(() => { });
    },
    confirmOrder () {
      this.loading = true;
      upDateDepositOrderAuditingTrue({
        orderId: this.orderId,
        auditRemark: this.form.auditRemark
      }).then(respnse => {
        this.loading = false;
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
    // 审核驳回
    falseAudit1 () {
      if (this.messageInfo(this.form.auditRemark)) {
        this.$confirm("退回后无法更改审核，需等待重新提交后可再次审核，请确认是否要退回？", '消息').then(() => {
          this.orderReturn();
        }).catch(() => { });
      } else {
        return false
      }
    },
    orderReturn () {
      upDateDepositOrderAuditingFalse({
        orderId: this.orderId,
        auditRemark: this.form.auditRemark
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
    }
  }
};
</script>
<style scoped>
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
