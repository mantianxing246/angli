<template >
  <DialogContainer title="非学科类课程课耗详情" :visible.sync="visible" width="1200px" :diglogClass="['']">
      <template slot="body">
    <div class="app-container">
      <div class="filter-container">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="orderNo" align="center" label="订单号"></el-table-column>
          <el-table-column prop="propertyName" align="center" label="课程属性"></el-table-column>
          <el-table-column prop="courseName" align="center" label="课程名称"></el-table-column>
          <el-table-column prop="residualAmount" align="center" label="剩余金额"></el-table-column>
          <el-table-column prop="accrualDate" align="center" label="权责发生日"></el-table-column>
          <el-table-column prop="accruedRevenue" align="center" label="权责收入"></el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :limit.sync="pagination.pageSize"
          :page.sync="pagination.pageNum"
          :total="total"
          @pagination="getTableData()"
        />
      </div>
    </div>
  </template>
  </DialogContainer>
</template>
<script>
import CourseMixins from "./BaseMixins/CourseMixins";
export default {
  name: "NonSubject",
  mixins: [CourseMixins]
};
</script>



