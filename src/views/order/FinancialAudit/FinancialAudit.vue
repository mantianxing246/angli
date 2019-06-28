/*
@author lfz
@date 2019/1/24
*/
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" inline style="margin-bottom:0px;">
      <el-form-item label>
        <el-input style="width:120px" v-model="form.name" placeholder="学员姓名" clearable/>
        <el-input
          :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
          v-model="form.studentUserId"
          placeholder="学员ID"
          clearable
        />
        <el-input style="width:150px;" v-model="form.orderNo" placeholder="订单号" clearable/>
        <el-date-picker
          style="margin-bottom:0;"
          v-model="selectTimer"
          type="daterange"
          range-separator="-"
          start-placeholder="申请日期"
          end-placeholder="申请日期"
          value-format="yyyy-MM-dd"
          class="margin-bottom"
        ></el-date-picker>
        <el-select
          v-model="form.auditType1"
          :style="{width:$selectConfig.orderStatusComWidth+'px'}"
          :change="change()"
          placeholder="审核状态"
        >
          <el-option :value="1" label="未审核"></el-option>
          <el-option :value="2" label="已审核"></el-option>
        </el-select>
        <el-select
          v-if="form.auditType1 == 2"
          v-model="form.auditType2"
          :style="{width:$selectConfig.orderStatusComWidth+'px'}"
          placeholder="审核状态"
        >
          <!-- <el-option :value="3" label="通过"></el-option> -->
          <el-option :value="4" label="驳回"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-button
          type="primary"
          :loading="listLoading"
          icon="el-icon-search"
          @click="getOrderAuditList"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            :data="tableData"
            stripe
            v-loading="listLoading"
            border
            style="width: 100%"
            highlight-current-row
            fit
          >
            <el-table-column prop="orderNo" label="订单号" align="center"/>
            <el-table-column prop="studentUserId" label="学员ID" align="center"/>
            <el-table-column prop="name" label="学员姓名" align="center"/>
            <el-table-column prop="received" label="付款金额" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.received|price }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" align="center" :formatter="formOrder"></el-table-column>
            <!-- <el-table-column prop="orderStatus" label="订单状态" align="center" :formatter="formOrder"></el-table-column> -->
            <el-table-column prop="modifyTime" label="申请时间" align="center"/>
            <el-table-column label="操作" align="center" prop="year">
              <template slot-scope="scope" style="display: flex;justify-content: space-between">
                <span
                  class="span"
                  v-if="form.auditType1 == 2"
                  type="text"
                  @click="toAuditPages(scope.row, form.auditType1)"
                >查看</span>
                <span
                  class="span"
                  v-if="form.auditType1 == 1"
                  type="text"
                  @click="toAuditPages(scope.row,form.auditType1)"
                >审核</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :limit.sync="form.pageSize"
            :page.sync="form.pageNum"
            :total="total"
            @pagination="getOrderAuditList"
          />
        </div>
      </template>
    </Card-Container>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import { getOrderAuditList } from "@/api/order/OrderAuditApi.js";
import { finished } from "stream";

export default {
  name: "FinancialAudit",
  directives: { waves },
  components: {},
  filters: {},
  data() {
    return {
      listLoading: false,
      // 查询条件
      form: {
        studentUserId: "",
        name: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        beginDate: null, //申请日期
        endDate: null, //申请日期
        auditType1: 1, //审核状态
        auditType2: null //駁回？
      },
      selectTimer: "",
      total: 1,
      // 订单审核列表
      tableData: null
    };
  },
  mounted() {
    this.getOrderAuditList();
  },
  methods: {
    change() {
      if (this.form.auditType1 === 2) {
        return (this.form.auditType2 = 4);
      } else {
        return (this.form.auditType2 = null);
      }
    },
    // 获取订单审核的列表
    getOrderAuditList() {
      this.listLoading = true;
      var form = JSON.parse(JSON.stringify(this.form));
      form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
      form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      getOrderAuditList(form)
        .then(response => {
          this.listLoading = false;
          if (response.status == 200) {
            this.tableData = response.data.list;
            // this.orderStatus()
            this.total = response.data.total;
          } else {
            this.$message({
              message: response.message,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
    },
    //列表中表格状态转换
    formOrder(row, column) {
      if (row.orderStatus === 101) {
        return "网课试听申请";
      }
      if (row.orderStatus === 102) {
        return "订金订单申请";
      }
      if (row.orderStatus === 103) {
        return "正式订单申请";
      }
      if (row.orderStatus === 104) {
        return "订金退费申请";
      }
      if (row.courseStatus === 102) {
        return "课程冻结申请";
      }
      if (row.courseStatus === 103) {
        return "课程解冻申请";
      }
      if (row.courseStatus === 305 && row.orderStatus === 105) {
        // 305 转课驳回 105 课程处理中
        return "转课驳回";
      }
      if (row.orderStatus === 201) {
        return "试听";
      }
      if (row.orderStatus === 202) {
        return "已交订金";
      }
      if (row.orderStatus === 203 && !row.refundStatus) {
        return "正常";
      }
      if (row.orderStatus === 204) {
        return "已退订金";
      }
      if (row.orderStatus === 299) {
        return "已结束";
      }
      if (row.orderStatus === 301) {
        return "试听申请驳回";
      }
      if (row.orderStatus === 302) {
        return "订金申请驳回";
      }
      if (row.orderStatus === 303) {
        return "正式申请驳回";
      }
      if (row.orderStatus === 304) {
        return "订金退费驳回";
      }
      if (row.orderStatus === 501) {
        return "试听";
      }
      if (row.orderStatus === 502) {
        return "已交订金";
      }
      if (row.orderStatus === 503) {
        return "正常";
      }
      if (row.orderStatus === 504) {
        return "已退订金";
      }
      if (row.orderStatus === 599) {
        return "已结束";
      }
      if (row.orderStatus === 105 && row.refundStatus == 200) {
        return "退费申请";
      }
      if (row.orderStatus === 105 && row.refundStatus == 300) {
        return "退费驳回";
      }
      if (row.orderStatus === 203 && row.refundStatus == 400) {
        return "退费通过";
      }
      if (row.orderStatus === 203 && row.refundStatus == 300) {
        return "退费驳回";
      }
      if (row.orderStatus === 105 && row.freezeId && !row.courseStatus) {
        return "冻结申请通过";
      }
      if (
        row.orderStatus === 105 &&
        row.freezeId &&
        (row.courseStatus === 302 || row.courseStatus === 303)
      ) {
        return "冻结申请驳回";
      }
      if (row.orderStatus === 105 && !row.freezeId && !row.courseStatus) {
        return "解冻申请通过";
      }
      if (row.orderStatus === 105) {
        return "课程处理中";
      }
    },
    orderStatus() {
      for (var i = 0; i < this.tableData.length; i++) {
        if (res.data.list[i].addTime) {
          res.data.list[i].addTime = this.$format(res.data.list[i].addTime);
        }
      }
    },
    //审核跳转页面
    toAuditPages(row, auditType1) {
      var orderStatus = row.orderStatus;
      var courseStatus = row.courseStatus;
      var refundStatus = row.refundStatus;
      var auditType1 = auditType1;
      if (
        orderStatus === 101 ||
        orderStatus === 201 ||
        orderStatus === 501 ||
        orderStatus === 301
      ) {
        //网课试听审核页面
        this.$router.push({
          path: "/OrderMgt/OrderAudit/OnlineAuditions/" + row.orderId,
          query: {
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      } else if (
        orderStatus == "102" ||
        orderStatus == "202" ||
        orderStatus == "502" ||
        orderStatus == "302"
      ) {
        //定金订单审核页面
        this.$router.push({
          path: "/OrderMgt/OrderAudit/EarnestMoneyAuditions/" + row.orderId,
          query: {
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      } else if (
        !row.refundStatus &&(
        orderStatus === 103 ||
        orderStatus === 203 ||
        orderStatus === 503 ||
        orderStatus === 303 ||
        row.courseStatus === 305)
      ) {
        //正式订单审核
        this.$router.push({
          path: "/OrderMgt/OrderAudit/FormalOrderAudit/" + row.orderId,
          query: {
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      } else if (
        orderStatus == "104" ||
        orderStatus == "204" ||
        orderStatus == "504" ||
        orderStatus == "304"
      ) {
        //定金订单退费审核
        this.$router.push({
          path: "/OrderMgt/OrderAudit/OrderFundExamine",
          query: {
            orderId: row.orderId,
            propertyId: row.propertyId,
            courseId: row.courseId,
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      } else if (
        (orderStatus == "105" && courseStatus == "102") ||
        courseStatus == "302" ||
        courseStatus == "202"
      ) {
        //课程冻结订单审核
        this.$router.push({
          path: "/OrderMgt/OrderAudit/frozenOrder",
          query: {
            orderId: row.orderId,
            orderCourseId: row.orderCourseId,
            // courseId: row.courseId,
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      } else if (
        (orderStatus == "105" && courseStatus == "103") ||
        courseStatus == "303" ||
        courseStatus == "203" ||
        courseStatus == "201" ||
        (!row.freezeId && this.auditType1 == 2)
      ) {
        //课程解冻订单审核
        this.$router.push({
          path: "/OrderMgt/OrderAudit/ThawOrderExamine",
          query: {
            orderId: row.orderId,
            propertyId: row.propertyId,
            courseId: row.courseId,
            orderCourseId: row.orderCourseId,
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      } else if (
        (orderStatus == "105" && refundStatus == "200") ||
        (refundStatus == "300") | (refundStatus == "400")
      ) {
        //课程退费订单审核
        this.$router.push({
          path: "/OrderMgt/OrderAudit/RefundExamine",
          query: {
            orderNo: row.orderNo,
            orderId: row.orderId,
            propertyId: row.propertyId,
            courseId: row.courseId,
            studentId: row.studentId,
            auditType1: auditType1,
            row: row
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.margin-bottom {
  margin-bottom: 14px;
}
.span {
  color: #409eff;
  cursor: pointer;
}
</style>
