
<template >
  <div class="app-container">
    <div class="filter-container">
      <el-form inline ref="form" :model="form" :rules="rules" label-position="left">
        <el-form-item style="margin-right:0px;">
          <el-select
            clearable
            v-model="form.deptId"
            placeholder="部门"
            class="labelAfterwidth"
            style="width:150px;"
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
          >
            <el-option
              v-for="item in headInfo.roles"
              :value="item.roleId"
              :label="item.roleName"
              :key="item.roleId+ '-roles'"
            />
          </el-select>
          <el-select
            clearable
            v-model="form.salesUser"
            filterable
            style="width:180px;"
            placeholder="销售人员"
            class="labelAfterwidth"
          >
            <el-option
              v-for="(item, index) in salesUsers"
              :value="item.userId"
              :label="item.userName"
              :key="index"
            />
          </el-select>
          <el-select
            clearable
            v-model="form.divideUser"
            filterable
            style="width:180px;"
            placeholder="分成人员"
            class="labelAfterwidth"
          >
            <el-option
              v-for="(item, index) in salesUsers"
              :value="item.userId"
              :label="item.userName"
              :key="index"
            />
          </el-select>
          <el-input
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            v-model="form.studentUserId"
            placeholder="学员ID"
          ></el-input>
          <el-input style="width:150px" v-model.number="form.orderNo" placeholder="订单号" clearable/>
        </el-form-item>
        <el-form-item >
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
            type="primary"
            @click="handleDownload(form)"
            :loading="loadingExcle"
          >导出</el-button>
        </el-form-item>
      </el-form>
      <Card-Container>
      <template slot="body">
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
          :width="item.width ? item.width:null"
          :min-width="item['min-width'] ? item['min-width']:null"
          :fixed="item.fixed?item.fixed:null"
        >
          <template slot-scope="scope" style="display: flex;justify-content: space-between">
            <div>
              <span v-if="item.prop === 'price'">{{scope.row[item.prop]|price}}</span>
              <span v-else-if="item.prop === 'isContinuous'">{{scope.row[item.prop]|isContinuous}}</span>
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
       </template>
     </Card-Container>
    </div>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import {
  selectHeadInfo,
  selectSalesUser,
  selectSalesUserDeptId,
  selectSalesUserRoleId
} from "@/components/select/index";
import { xlsxForTable } from "@/components/table/tableBaseClass/exportXlsx";
import { tableExcel } from "./SalesPerformanceStatisticsTable";
import { export_table_to_excel } from "@/export/indexXlsx";
import {
  findSalesPerformanceList,
  findSalesExportList
} from "@/api/performance/SalesPerformanceStatistics/SalesPerformanceStatistics";
import {
  operationType
} from "@/CourseType/OperationType";
export default {
  name: "SalesPerformanceStatistics", // 销售业绩查询
  mixins: [
    selectHeadInfo,
    selectSalesUser,
    selectSalesUserDeptId,
    selectSalesUserRoleId,
  ],
  directives: { waves },
  data () {
    return {
      selectTimer: '',
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
    handleEdit (index, row) {
      this.$refs["CaoZuoJiLu"].init(index, row);
    },
    //导出成excel表格
    handleDownload (form) {
     // new xlsxForTable({}, []).generateHeader("EnrollmentRevenueByCourseTable");
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      findSalesExportList({...form }).then(res => {
        if (res.status === 200 && res.data) {
          export_table_to_excel(
            new xlsxForTable(tableExcel, res.data).getOutAndranges(),
            "销售业绩统计"
          );
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    Search (obj) {
      this.getTableData(this.pagination, this.form);
    },
    getTableData (pagination, form) {
      this.loading = true;
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      findSalesPerformanceList({ ...pagination, ...form })
        .then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.tableList = res.data.list;
            this.total = res.data.total;
            this.pagination.pageSize = res.data.pageSize;
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
  created () {
    this.getTableData(this.pagination, ...this.form);
  },
  components: {
  }
};
</script>
<style scoped>
</style>



