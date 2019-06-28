
<template >
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="form">
        <el-form-item style="margin-right:0;padding-right:0;">
          <el-input style="width:150px" v-model="form.name" placeholder="学员姓名" clearable></el-input>
          <el-input
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            v-model="form.userId"
            placeholder="学员ID"
            clearable
          ></el-input>
          <el-input style="width:150px" v-model.number="form.orderNo" placeholder="订单号" clearable/>
          <el-date-picker
            v-model="selectTimer"
            type="daterange"
            range-separator="-"
            start-placeholder="录单日期"
            end-placeholder="录单日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-button
          v-waves
          icon="el-icon-search"
          type="primary"
          @click="AccrualSearch()"
          :loading="loading"
        >查询</el-button>
      </el-form>
      <Card-Container>
        <template>
          <div slot="body">
            <el-table
              :data="tableData"
              fit
              v-loading="loading"
              stripe
              :span-method="objectSpanMethod"
              border
              style="width: 100%"
            >
              <el-table-column prop="name" align="center" label="学员姓名" min-width="60"></el-table-column>
              <el-table-column prop="userId" align="center" label="学员ID" min-width="100"></el-table-column>
              <el-table-column prop="orderNo" align="center" label="订单号" min-width="100"></el-table-column>
              <el-table-column prop="orderStatusName" align="center" label="订单状态" min-width="70"></el-table-column>
              <el-table-column prop="received" align="center" label="实收金额" min-width="50">
                <template slot-scope="scope" style="display: flex;justify-content: space-between">
                  <div>
                    <span>{{scope.row['received']|price}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="courseName" align="center" label="课程名称" min-width="240"></el-table-column>
              <el-table-column prop="startDate" align="center" label="开始日期" min-width="70"></el-table-column>
              <el-table-column prop="endDate" align="center" label="结束日期" min-width="70"></el-table-column>
              <el-table-column prop="courseStatusName" align="center" label="课程状态" width="60"></el-table-column>
              <el-table-column prop="totalPrice" align="center" label="课程金额" min-width="50">
                <template slot-scope="scope" style="display: flex;justify-content: space-between">
                  <div>
                    <span>{{scope.row['totalPrice']|price}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="accruedRevenue" align="center" label="权责收入" min-width="50">
                <template slot-scope="scope" style="display: flex;justify-content: space-between">
                  <div>
                    <span>{{scope.row['accruedRevenue']|price}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="residueAmount"
                align="center"
                label="剩余课耗"
                width="50"
              >
                <template slot-scope="scope" style="display: flex;justify-content: space-between">
                  <div>
                    <span>{{scope.row['residueAmount']|price}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="课耗详情" width="50">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total>0"
              :limit.sync="form.pageSize"
              :page.sync="form.pageNum"
              :total="total"
              @pagination="getTableData(form)"
            />
          </div>
        </template>
      </Card-Container>
      <!-- 直播课 -->
      <Live ref="live"></Live>
      <Individual ref="Individual"></Individual>
      <NonSubject ref="NonSubject"></NonSubject>
      <Offline ref="Offline"></Offline>
      <others ref="others"></others>
      <Record ref="Record"></Record>
    </div>
  </div>
</template>
<script>
import waves from "@/components/directive/waves"; // Waves directive
import { findConsumer } from "@/api/AccountingMgt/AccrualSearch/AccrualSearch"; //表格数据
import { AccrualSearchLinkDialog } from "./const.js";
import arraySpanMethod from "@/components/table/tableBaseClass/arraySpanMethod";
import Live from "@/views/AccountingMgt/AccrualSearch/live"; // 直播
import Individual from "@/views/AccountingMgt/AccrualSearch/Individual"; // 在线个性化
import NonSubject from "@/views/AccountingMgt/AccrualSearch/NonSubject"; // 非学科
import Offline from "@/views/AccountingMgt/AccrualSearch/offline"; // 班教
import others from "@/views/AccountingMgt/AccrualSearch/others"; // 其他类
import Record from "@/views/AccountingMgt/AccrualSearch/record"; // 其他类
export default {
  name: "AccrualSearch",
  mixins: [arraySpanMethod],
  directives: { waves },
  data () {
    return {
      selectTimer: '',
      idFirst: true,
      pageSizes: [10, 20, 30],
      total: 0,
      form: {
        name: null,
        userId: null,
        startDate: null,
        endDate: null,
        orderNo: null,
        pageSize: 20,
        pageNum: 1
      },
      loading: false,
      query: {} // 给diaglig的传参
    };
  },
  methods: {
    getClassList () {
      this.findConsumer(this.form);
    },
    handleEdit (index, row) {
      this.query = {
        orderId: row.orderId,
        orderCourseId: row.orderCourseId,
        studentId: row.studentId
      };
      this.$refs[AccrualSearchLinkDialog[row.propertyId]].init(
        this.query,
        row.propertyId
      );
    },
    getTableData (form) {
      this.loading = true
      if (form) {
        form.startDate = this.selectTimer ? this.selectTimer[0] : null;
        form.endDate = this.selectTimer ? this.selectTimer[1] : null;
      }
      if(!form.name && !form.userId && !form.orderNo && !form.startDate && !form.endDate){
        this.$message({
            message:'请至少提交一个参数',
            type: 'warning'
          })
          this.loading = false;
        return 
      }
      findConsumer(form).then(res => {
        this.loading = false
        if (res && res.status === 500) {
          return;
        } else {
        }
        this.total = res.data.total;
        this.tableInit(res);
      }).catch(() => {
        this.loading = false
      });
    },
    // 点击搜索按钮
    AccrualSearch () {
      this.getTableData(this.form);
    }
  },
  created () {
    // this.getTableData();
  },
  components: { Live, Individual, NonSubject, Offline, others, Record }
};
</script>



