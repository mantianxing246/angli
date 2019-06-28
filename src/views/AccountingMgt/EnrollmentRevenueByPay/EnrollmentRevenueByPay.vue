
<template >
  <div class="app-container">
    <div class="filter-container">
      <el-form inline ref="form" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <el-select
            clearable
            v-model="form.deptId"
            placeholder="部门"
            style="width:150px"
            class="labelAfterwidth"
            @change="getUserListSales(form.salesUserDeptId,form.salesUserRoleId,'salesUsers')"
          >
            <el-option
              v-for="item in headInfo.depts"
              :value="item.deptId"
              :label="item.deptName"
              :key="item.deptId"
            />
          </el-select>
          <el-input style="width:150px" v-model.number="form.orderNo" placeholder="订单号" clearable/>
          <el-date-picker
          v-model="selectTimer"
          type="daterange"
          range-separator="-"
          start-placeholder="付费日期"
          end-placeholder="付费日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
          <el-input clearable style="width:150px" v-model="form.studentName" placeholder="学员姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable :style="{width:$selectConfig.studentRoleIdWidth+'px'}" v-model="form.userId" placeholder="学员ID"></el-input>
          <el-select
            clearable
            v-model="form.payTypeId"
            placeholder="付费方式"
            class="labelAfterwidth"
          >
            <el-option
              v-for="item in payTypes"
              :key="item.payTypeId"
              :label="item.payTypeName"
              :value="item.payTypeId"
            />
          </el-select>
          <el-button
            v-waves
            icon="el-icon-search"
            type="primary"
            @click="Search()"
            :loading="loading"
          >搜索</el-button>
          <el-button
            v-waves
            style="margin-left:10px"
            type="primary"
            @click="handleDownload(form)"
            :loading="loadingExcle"
          >导出</el-button>
        </el-form-item>
      </el-form>
      <Card-Container :paddingValue="10">
      <template>
        <div slot="body">
      <el-form :inline="true">
        <el-form-item>
          <span slot="label">合计</span>
          <span >{{totalPrice.totalIncome|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">现金合计</span>
          <span >{{totalPrice.pric1e1|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">银行卡合计</span>
          <span >{{totalPrice.pric1e2|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">网银合计</span>
          <span >{{totalPrice.pric1e3|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">跨事业部内部往来合计</span>
          <span >{{totalPrice.pric1e4|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">支付宝合计</span>
          <span >{{totalPrice.pric1e5|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">微信合计</span>
          <span >{{totalPrice.pric1e6|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">支付宝在线支付合计</span>
          <span >{{totalPrice.pric1e7|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">收钱吧合计</span>
          <span >{{totalPrice.pric1e8|price}}元</span>
        </el-form-item>
         <el-form-item>
          <span slot="label">银联商务-支付宝合计</span>
          <span >{{totalPrice.pric1e9|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">银联商务-微信合计</span>
          <span >{{totalPrice.pric1e10|price}}元</span>
        </el-form-item>
      </el-form>
      </div>
      </template>
    </Card-Container>
      <Card-Container>
      <template>
        <div slot="body">
      <el-table
        :data="tableList"
        stripe
        border
        fit
        v-loading="loading"
        style="width: 100%;"
        id="EnrollmentRevenueByPayTable"
      >
        <el-table-column
          v-for="(item ,index) in tableExcel"
          :key="index"
          :align="item.align"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope" style="display: flex;justify-content: space-between">
            <div>
              <span v-if="$tableConfig.filterPriceField[item.prop]">{{scope.row[item.prop]|price}}</span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :limit.sync="pagination.pageSize"
        :page.sync="pagination.pageNum"
        :total="total"
        @pagination="getTableData({pageSize:$event.limit,pageNum:$event.page},form)"
      />
      </div>
      </template>
    </Card-Container>
    </div>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import HeadStyle from "../HeadStyle";
import {
  selectHeadInfo,
  selectSalesUser,
  selectSalesUserDeptId,
  selectSalesUserRoleId,
  selectPayType
} from "@/components/select/index";
import { xlsxForTable } from "@/components/table/tableBaseClass/exportXlsx";
import { tableExcel } from "./EnrollmentRevenueByPayTable";
import { export_table_to_excel } from "@/export/indexXlsx";
import {
  findPayFlowList,
  findPayFlowTotalPrice,
  findPayFlowExportList
} from "@/api/AccountingMgt/EnrollmentRevenueByPay/EnrollmentRevenueByPay";
export default {
  name: "EnrollmentRevenueByPay", // 招生收入(按付费方式)
  mixins: [
    selectHeadInfo,
    selectSalesUser,
    selectSalesUserDeptId,
    selectSalesUserRoleId,
    HeadStyle,
    selectPayType
  ],
  directives: { waves },
  data() {
    return {
      selectTimer:'',
      loadingExcle:false,
      tableExcel: tableExcel,
      visible:false,
      loading: false,
      pageSizes: [10, 20, 30],
      total: 0,
      pagination: {
        pageSize: 20,
        pageNum: 1
      },
      tableList: [],
      form: {
        studentId: null, // 学员id
        name: "", // 学员姓名
        orderId: null //订单号
      },
      rules: {},
      totalPrice:{}
    };
  },
  methods: {
    getTotalPrice(){
      findPayFlowTotalPrice().then(res => {
            res.data && (this.totalPrice = res.data)
      });
    },
    Search(obj) {
      this.getTableData(this.pagination, this.form);
      this.getTotalPrice();
    },
    getTableData(pagination, form) {
      this.loading = true;
      if(form){
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      findPayFlowList({ ...pagination, ...form })
        .then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.tableList = res.data.list;
            this.total = res.data.total;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
     //导出成excel表格
    handleDownload(form) {
     // new xlsxForTable({}, []).generateHeader("EnrollmentRevenueByPayTable");
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      this.getTotalPrice();
      findPayFlowExportList({...form }).then(res => {
        if (res.status === 200 && res.data) {
          export_table_to_excel(
            new xlsxForTable(tableExcel, res.data).getOutAndranges(),
            "招生收入查询(按付费方式)"
          );
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    }
  },
  created() {
    this.getTableData(this.pagination, ...this.form);
    this.getTotalPrice();
  },
  components: {}
};
</script>
<style scoped>
</style>



