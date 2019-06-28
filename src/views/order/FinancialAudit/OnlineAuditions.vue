
<template>
  <div class="app-container">
    <student-info :student-id="$route.query.studentId"/>
    <Card-Container>
      <template slot="body">
        <el-table
    :data="tableData"
    style="width: 100%">
    <!-- <el-table-column
      prop="date"
      label="日期"
      width="150">
    </el-table-column> -->
    <el-table-column label="历史试听和已报名网课列表">
      <!-- <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column> -->
      <!-- <el-table-column label="地址"> -->
        <el-table-column
          prop="orderNo"
          label="订单号">
        </el-table-column>
        <el-table-column label="课程属性" align="center" prop="propertyName"></el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="beginDate"
          label="开始日期">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束日期">
        </el-table-column>
      <!-- </el-table-column> -->
    </el-table-column>
  </el-table>
      </template>
     </Card-Container>
    <!-- 报名课程列表 -->
   <Card-Container :orderNo="$route.query.row.orderNo">
      <template slot="body">
        <el-table v-loading="listLoading" style="margin-top:10px;" :data="classData" align="center" border fit stripe>
          <el-table-column label="报名课程列表" align="center">
            <el-table-column label="报名课程" align="center" prop="courseName" min-width="310"/>
            <el-table-column label="试听开始日期" align="center" prop="beginDate"/>
            <el-table-column label="试听结束日期" align="center" prop="endDate"/>
          </el-table-column>
        </el-table>
      </template>
    </Card-Container>
    <!-- 网课试听订单审核 -->
    <Card-Container :paddingValue="10" title="销售信息详情">
      <template slot="body">
      <el-form ref="form" :model="form" :inline="true" label-width="95px">
        <el-form-item label="申请单号:">
          <el-input v-model="form.auditionNo" disabled="disabled" :style="lableAfter"/>
        </el-form-item>
        <el-form-item label="开单人员:">
          <el-input v-model="form.createUserName" disabled="disabled" :style="lableAfter"/>
        </el-form-item>
        <el-form-item label="是否续报:">
          <el-radio-group v-model="form.isContinuous" style="width:180px">
            <el-radio disabled :label="1">是</el-radio>
            <el-radio disabled :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item label="省市:">
          <el-select v-model="form.provinceId" :style="lableAfter" disabled>
            <el-option
              v-for="item in headInfo.provinces"
              :value="item.provinceId"
              :label="item.provinceName"
              :key="item.provinceId+ '-provinceId'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收入类别:">
          <el-select disabled v-model="form.sourceType" placeholder="收入类别" :style="lableAfter">
            <el-option
              v-for="item in selectInfo.sourceTypes"
              :value="item.id"
              :label="item.typeName"
              :key="item.id+ '-sourceTypes'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="市场手段:">
          <el-select v-model="form.marketType" disabled :style="lableAfter" placeholder="市场手段">
            <el-option
              v-for="item in selectInfo.marketTypes"
              :key="item.id+ '-marketTypes'"
              :value="item.id"
              :label="item.typeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报名场合:">
          <el-select v-model="form.registerType" disabled :style="lableAfter">
            <el-option
              v-for="item in selectInfo.registerTypes"
              :value="item.id"
              :key="item.typeName+ '-registerTypes'"
              :label="item.typeName"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="0元试听:">
          <el-radio-group v-model="form.isZeroPay" disabled :style="lableAfter">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.isZeroPay===1" label="0元试听原因:">
          <el-input v-model="form.zeroPayCause" disabled="disabled" :style="lableAfter"/>
        </el-form-item>
        <br>
        <el-form-item v-show="form.isZeroPay===0" label="付款方式:">
          <el-select v-model="form.payTypeId" placeholder="请选择" disabled>
            <el-option
              v-for="item in payTypes"
              :value="item.payTypeId"
              :label="item.payTypeName"
              :key="item.payTypeid"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.isZeroPay===0" label="支付金额:">
          <AmountInput money="￥" placeholder="" style="width:180px;" :disabledFlag="true" :amount="form.received"></AmountInput>
        </el-form-item>
        <el-form-item v-show="form.isZeroPay===0" label="付费日期:">
          <el-date-picker
            disabled
            type="date"
            v-model="form.paymentDate"
            placeholder="选择日期"
            :style="lableAfter"
          ></el-date-picker>
        </el-form-item>
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
        <el-form-item label="备注信息:">
          <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" style="width:470px;" type="textarea" disabled/>
        </el-form-item>
        <br>
        <el-form-item label="审核信息:">
          <el-input :disabled="$route.query.auditType1 == 2" v-model="form.auditRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width:470px;" maxlength="100"/>
        </el-form-item>
        <br>
        <el-row v-if="$route.query.auditType1 == 1" style="margin-top:20px;text-align:center;">
          <el-col>
            <el-button @click="goback">取 消</el-button>
            <el-button :loading="loading" type="primary" @click="subAudit1">确 定</el-button>
            <el-button :loading="falseLoading" type="primary" @click="falseAudit1">退回</el-button>
          </el-col>
        </el-row>
        <el-row v-if="$route.query.auditType1 == 2" style="margin-top:20px;text-align:center;">
          <el-col>
            <el-button type="primary" @click="goback">关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
      </template>
    </Card-Container>
  </div>
</template>
<script>
import {
  findOrderAuditionById,
  findOnlineCourseById,
  upDateOnlineCourseAuditionFalse,
  upDateOnlineCourseAuditionTrue
} from "@/api/order/OrderAuditApi";
import { payMoney } from "@/api/order/AddOnlineAuditionApi";
import { checkAuditRemark } from "@/utils/async-validator.js";
import { findSourceType, findMarketType } from "@/api/common/common.js";
import { isInclude } from "@/utils/ArrayUtils.js";
import SourceTypeAndMarketType from "@/components/select/SourceTypeAndMarketType";
import { selectPayType } from "@/components/select/index";
import StudentInfo from "@/views/order/components/StudentInfo";
import messageInfo from './common/messageInfo';
import { findHistoryCourse } from '@/api/order/FullOrder.js'
export default {
  name: "OnlineAuditions", // 网课试听订单审核:
  mixins: [SourceTypeAndMarketType, selectPayType, messageInfo],
  components: {
    StudentInfo,
  },
  data: function () {
    return {
      lableBefor: {},
      lableAfter: {
        width: "180px"
      },
      listLoading: false,
      loading: false,
      falseLoading: false,
      orderId: this.$route.params.orderId, // 订单id
      classData: [], // 课程列表detail
      payTypes: [], // 付费方式
      headInfo: {}, //
      selectInfo: {
        // sourceTypes:null
      },
      form: {
        // 订单审核详情
        registerFormNum: "", // 报名表号
        createUserName: "", // 开单人员
        isContinuous: "", // 是否续报
        isZeroPay: "", // 是否0元试听
        zeroPayCause: "", // 试听原因
        received: "", // 支付金额
        remark: "", // 备注信息
        auditRemark: "" // 审核信息
      },
    };
  },
  created () {
    this.findOrderAuditionById();
    this.findOnlineCourseById();
    this.findHistoryCourse();
  },
  methods: {
    findHistoryCourse(){
       findHistoryCourse(this.$route.query.studentId).then(res => {
          if (res.status == 200) {
            this.tableData = res.data            
          }else{
          }
      })
    },
    // 获取试听订单审核内容
    findOrderAuditionById () {
      findOrderAuditionById(this.orderId)
        .then(respnse => {
          if (respnse.status === 200) {
            // console.log(respnse.data)
            respnse.data.received &&
              (respnse.data.received = respnse.data.received.toLocaleString());
            this.form = respnse.data;
            this.getHeadInfo(); // 查询省市、高考年份等
          } else {
            this.$message({
              message: respnse.message,
              type: "warning"
            });
          }
        })
        .then(res => {
          return this.getFindSourceType();
        })
    },
    // 获取试听审核课程列表
    findOnlineCourseById () {
      this.listLoading = true;
      findOnlineCourseById(this.orderId).then(respnse => {
        this.listLoading = false;
        if (respnse.status === 200) {
          this.classData = respnse.data;
        } else {
          this.$message({
            message: respnse.message,
            type: "warning"
          });
        }
      });
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
      upDateOnlineCourseAuditionTrue({
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
      upDateOnlineCourseAuditionFalse({
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
.span {
  font-size: 14px;
  font-weight: 800;
  color: #606266;
  position: absolute;
  top: 5px;
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
