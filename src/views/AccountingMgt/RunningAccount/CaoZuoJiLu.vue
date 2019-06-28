<template >
  <el-dialog :close-on-click-modal="false" 
    v-el-drag-dialog
    :visible.sync="visible"
    title="订单操作记录"
    class="LiveDialog"
    width="1200px"
    center
  >
    <div class="app-container">
      <div class="filter-container">
        <el-table :data="tableList" border style="width: 100%">
          <el-table-column prop="operationName" align="center" label="操作人员"></el-table-column>
          <el-table-column prop="operationStatus" align="center" label="操作状态"></el-table-column>
          <el-table-column prop="operationTime" align="center" label="操作日期"></el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  findLedgerOperationList
} from "@/api/AccountingMgt/RunningAccount/CaoZuoJiLu";
export default {
  name: "CaoZuoJiLu",
  mixins:[],
  data(){
    return {
      visible:false,
      tableList:null
    }
  },
  methods:{
    init(index,row){
      findLedgerOperationList(row.orderId).then((res) =>{
        if (res.status === 200) {
            this.tableList = res.data;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
      })
      this.visible = true
    }
  }
};
</script>



