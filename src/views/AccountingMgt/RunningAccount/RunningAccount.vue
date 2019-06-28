
<template >
  <div class="app-container">
    <div class="filter-container">
      <el-form inline ref="form" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <el-select
            clearable
            v-model="form.deptId"
            placeholder="部门"
            class="labelAfterwidth"
            style="width:150px;"
            @change="getUserListSales(form.salesUserDeptId,form.salesUserRoleId,'salesUsers')"
          >
            <el-option
              v-for="item in headInfo.depts"
              :value="item.deptId"
              :label="item.deptName"
              :key="item.deptId"
            />
          </el-select>
          <el-select
            clearable
            v-model="form.roleId"
            style="width:180px;"
            placeholder="销售角色"
            class="labelAfterwidth"
            @change="getUserListSales(form.salesUserDeptId,form.salesUserRoleId,'salesUsers')"
          >
            <el-option
              v-for="item in headInfo.roles"
              :value="item.roleId"
              :label="item.roleName"
              :key="item.roleId+ '-roles'"
            />
          </el-select>
          <el-select
            v-model="form.salesUser"
            style="width:180px;"
            placeholder="选择人员"
            class="labelAfterwidth"
          >
            <el-option
              v-for="(item, index) in salesUsers"
              :value="item.userId"
              :label="item.userName"
              :key="index"
            />
          </el-select>
          <el-input style="width:150px" v-model.number="form.orderNo" placeholder="订单号" clearable/>
          <el-date-picker
            v-model="selectTimer"
            type="daterange"
            range-separator="-"
            start-placeholder="付款日期"
            end-placeholder="付款日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input style="width:150px" v-model="form.studentName" placeholder="学员姓名"></el-input>
          <el-input
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            v-model="form.studentUserId"
            placeholder="学员ID"
          ></el-input>
          <el-select v-model="form.operationType" clearable placeholder="操作类型" class="labelAfterwidth">
            <el-option
              v-for="(item, index) in operationType"
              :value="item.ID"
              :label="item.Name"
              :key="index"
            />
          </el-select>
          <el-button
            v-waves
            icon="el-icon-search"
            type="primary"
            @click="Search({...pagination,...form})"
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
                <span slot="label">合计收入</span>
                <span>{{totalPrice.totalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">正式订单合计</span>
                <span>{{totalPrice.formalTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">订金订单合计</span>
                <span>{{totalPrice.depositTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">课程退费合计</span>
                <span>{{totalPrice.reCourseTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">退订金合计</span>
                <span>{{totalPrice.reDepositTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">转课出合计</span>
                <span>{{totalPrice.orderOutTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">转课入合计</span>
                <span>{{totalPrice.orderInTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">转正式合计</span>
                <span>{{totalPrice.turnFormalTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">报名费合计</span>
                <span>{{totalPrice.totalIsEntryFee|price}}元</span>
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
              style="width: 100%;"
              id="RunningAccountTable"
              v-loading="loading"
            >
              <el-table-column
                v-for="(item ,index) in tableExcel"
                :key="index"
                :align="item.align"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :fixed="item.fixed?item.fixed:null"
              >
                <template slot-scope="scope" style="display: flex;justify-content: space-between">
                  <div>
                    <el-button
                      v-if="item.prop === '操作记录'"
                      type="text"
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)"
                    >查看</el-button>
                    <span
                      v-else-if="$tableConfig.filterPriceField[item.prop]"
                    >{{scope.row[item.prop]|price}}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <CaoZuoJiLu ref="CaoZuoJiLu"/>
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
  selectSalesUserRoleId
} from "@/components/select/index";
import { xlsxForTable } from "@/components/table/tableBaseClass/exportXlsx";
import { tableExcel } from "./RunningAccountTable";
import CaoZuoJiLu from "./CaoZuoJiLu";
import { export_table_to_excel } from "@/export/indexXlsx";
import {
  findLedgerList,
  findLedgeTotalPrice,
  findLedgerExportList
} from "@/api/AccountingMgt/RunningAccount/RunningAccount";
import { operationType } from "@/CourseType/OperationType";
export default {
  name: "RunningAccount", // 流水账(总览)
  mixins: [
    selectHeadInfo,
    selectSalesUser,
    selectSalesUserDeptId,
    selectSalesUserRoleId,
    HeadStyle
  ],
  directives: { waves },
  data() {
    return {
      selectTimer: "",
      operationType: operationType, // 操作类型
      tableExcel: tableExcel,
      visible: false,
      loading: false,
      loadingExcle: false,
      pageSizes: [10, 20, 30],
      total: 0,
      pagination: {
        pageSize: 20,
        pageNum: 1
      },
      tableList: [],
      form: {
        studentId: null, // 学员id
        name: null, // 学员姓名
        orderId: null, //订单号
        deptId: null,
        roleId: null,
        userId: null,
        orderNo: null,
        paymentDate: null,
        studentName: null,
        studentUserId: null,
        operationType: null,
        beginDate: null,
        endDate: null
      },
      totalPrice: {},
      rules: {}
    };
  },
  methods: {
    getTotalPrice() {
      findLedgeTotalPrice().then(res => {
        res.data && (this.totalPrice = res.data);
      });
    },
    handleEdit(index, row) {
      this.$refs["CaoZuoJiLu"].init(index, row);
    },
    //导出成excel表格
    handleDownload(form) {
      // new xlsxForTable({},[]).generateHeader('RunningAccountTable')
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      this.getTotalPrice();
      findLedgerExportList({...form }).then(res => {
        if (res.status === 200 && res.data) {
          export_table_to_excel(
            new xlsxForTable(tableExcel, res.data).getOutAndranges(),
            "流水账(总览)"
          );
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    Search(obj) {
      this.getTableData(this.pagination, this.form);
      this.getTotalPrice();
    },
    getTableData(pagination, form) {
      this.loading = true;
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      findLedgerList({ ...pagination, ...form })
        .then(res => {
          this.loading = false;
          if (res.status === 200 && res.data) {
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
    }
  },
  created() {
    this.getTableData(this.pagination, ...this.form);
    this.getTotalPrice();
  },
  components: {
    CaoZuoJiLu
  }
};
</script>
<style scoped>
</style>



