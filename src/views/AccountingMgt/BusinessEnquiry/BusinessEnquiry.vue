
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
          <el-select clearable v-model="form.salesUser" placeholder="选择人员" class="labelAfterwidth">
            <el-option
              v-for="(item, index) in salesUsers"
              :value="item.userId"
              :label="item.userName"
              :key="index"
            />
          </el-select>
          <el-input
            :style="{width:$selectConfig.studentNameWidth+'px'}"
            v-model="form.studentName"
            placeholder="学员姓名"
          ></el-input>
          <el-input
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            v-model="form.studentUserId"
            placeholder="学员ID"
          ></el-input>
          <el-select
            v-model="form.grade"
            clearable
            placeholder="高考年份"
            style="width:100px"
            @clear="clear('高考年份')"
          >
            <el-option v-for="item in headInfo.years" :value="item" :key="item" :label="item"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width:180px" v-model.number="form.orderNo" placeholder="订单号" clearable/>
          <el-date-picker
            v-model="selectTimer"
            type="daterange"
            range-separator="-"
            start-placeholder="付款日期"
            end-placeholder="付款日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
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
            @click="handleDownload()"
            :loading="loadingExcle"
          >导出</el-button>
        </el-form-item>
      </el-form>
      <Card-Container :paddingValue="10">
        <template>
          <div slot="body">
            <el-form :inline="true">
              <el-form-item>
                <span slot="label">业绩合计</span>
                <span>{{totalPrice.totalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">正式订单合计</span>
                <span>{{totalPrice.formalTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">课程退费合计</span>
                <span>{{totalPrice.reCourseTotalIncome|price}}元</span>
              </el-form-item>
              <el-form-item>
                <span slot="label">转课出合计</span>
                <span>{{totalPrice.orderOutTotalIncome|price}}元</span>
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
              id="BusinessEnquiryTable"
              stripe
              border
              style="width: 100%;"
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
                    <span>{{scope.row[item.prop]}}</span>
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
import { xlsxForTable } from "@/components/table/tableBaseClass/exportXlsx";
import { tableExcel } from "./BusinessEnquiryTable";
import { export_table_to_excel } from "@/export/indexXlsx";
import {
  selectHeadInfo,
  selectSalesUser,
  selectSalesUserDeptId,
  selectSalesUserRoleId
} from "@/components/select/index";
import {
  findBusinessList,
  findBusinessTotalPrice,
  findBusinessExportList
} from "@/api/AccountingMgt/BusinessEnquiry/BusinessEnquiry";
export default {
  name: "BusinessEnquiry", // 业务查询
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
      tableExcel: tableExcel,
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
        deptId: null,
        roleId: null,
        userId: null,
        orderNo: null,
        studentName: null,
        studentUserId: null,
        grade: null,
        beginDate: null,
        endDate: null
      },
      rules: {},
      totalPrice: {}
    };
  },
  methods: {
    getTotalPrice(){
      findBusinessTotalPrice().then(res => {
        res.data && (this.totalPrice = res.data);
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
      findBusinessList({ ...pagination, ...form })
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
      // new xlsxForTable({}, []).generateHeader("EnrollmentRevenueByCourseTable");
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      this.getTotalPrice();
      findBusinessExportList({...form }).then(res => {
        if (res.status === 200 && res.data) {
          export_table_to_excel(
            new xlsxForTable(tableExcel, res.data).getOutAndranges(),
            "招生收入查询(按课程属性)"
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
  mounted() {},
  components: {}
};
</script>
<style scoped>

</style>



