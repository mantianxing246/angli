
<template >
  <div class="app-container">
    <div class="filter-container">
      <el-form inline ref="form" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <el-select
            clearable
            v-model="form.provinceId"
            style="width: 80px"
            placeholder="省市"
            class="labelAfterwidth"
          >
            <el-option
              v-for="item in headInfo.provinces"
              :value="item.provinceId"
              :label="item.provinceName"
              :key="item.provinceId"
            />
          </el-select>
          <el-select
            clearable
            v-model="form.deptId"
            placeholder="部门"
            class="labelAfterwidth"
            style="width: 150px"
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
          start-placeholder="付款日期"
          end-placeholder="付款日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
          <el-input style="width:150px" clearable v-model="form.studentName" placeholder="学员姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            clearable
            v-model="form.studentUserId"
            placeholder="学员ID"
          ></el-input>
          <el-select
            clearable
            v-model="form.propertyId"
            placeholder="课程属性"
            class="labelAfterwidth"
            style="width: 100px"
          >
            <el-option
              v-for="item in propertyName"
              :value="item.propertyId"
              :label="item.propertyName"
              :key="item.propertyId"
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
          <span slot="label">合计</span>
          <span >{{totalPrice.courseTotalPrice|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">录播合计</span>
          <span >{{totalPrice.recTotalPrice|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">直播合计</span>
          <span >{{totalPrice.liveTotalPrice|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">班教合计</span>
          <span >{{totalPrice.offlnTotalPrice|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">在线个性化合计</span>
          <span >{{totalPrice.indiTotalPrice|price}}元</span>
        </el-form-item>
        <br>
        <el-form-item>
          <span slot="label">非学科类合计</span>
          <span >{{totalPrice.nonsTotalPrice|price}}元</span>
        </el-form-item>
        <el-form-item>
          <span slot="label">其他类合计</span>
          <span >{{totalPrice.otherTotalPrice|price}}元</span>
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
        v-loading="loading"
        style="width: 100%;"
        id="EnrollmentRevenueByCourseTable"
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
  selectProvinceId,
  selectSalesUserDeptId,
  selectSalesUserRoleId
} from "@/components/select/index";
import { xlsxForTable } from "@/components/table/tableBaseClass/exportXlsx";
import { tableExcel } from "./EnrollmentRevenueByCourseTable";
import { export_table_to_excel } from "@/export/indexXlsx";
import {
  findCourseIncomeList,
  findCourseTotalPrice,
  findCourseExportList
} from "@/api/AccountingMgt/EnrollmentRevenueByCourse/EnrollmentRevenueByCourse";
import { propertyName } from "@/CourseType/PropertyName";
export default {
  name: "EnrollmentRevenueByCourse", // 招生收入(按课程属性)
  mixins: [
    selectHeadInfo,
    selectSalesUser,
    selectSalesUserDeptId,
    selectSalesUserRoleId,
    HeadStyle
  ],
  directives: { waves },
  data () {
    return {
      selectTimer:'',
      propertyName: propertyName,
      loadingExcle: false,
      tableExcel: tableExcel,
      visible: false,
      loading: false,
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
      totalPrice: {

      }
    };
  },
  methods: {
    getTotalPrice(){
      findCourseTotalPrice().then(res => {
        res.data && (this.totalPrice = res.data)
      });
    },
    Search (obj) {
      this.getTableData(this.pagination, this.form);
      this.getTotalPrice();
    },
    getTableData (pagination, form) {
      this.loading = true;
      if(form){
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      findCourseIncomeList({ ...pagination, ...form })
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
    handleDownload (form) {
      // new xlsxForTable({}, []).generateHeader("EnrollmentRevenueByCourseTable");
      if (form) {
        form.beginDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      this.getTotalPrice();
      findCourseExportList({...form }).then(res => {
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
  created () {
    this.getTableData(this.pagination, ...this.form);
    this.getTotalPrice();
  },
  components: {}
};
</script>
<style scoped>

</style>



