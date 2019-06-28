<template>
  <div class="app-container">
    <el-form inline>
      <el-row type="flex">
        <el-col>
      <el-date-picker
        v-model="list.date"
        type="month"
        value-format="yyyy-MM"
        style="width:120px;"
        @change="change(list)"
        placeholder="选择日期"
      ></el-date-picker>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          icon="el-icon-search"
          @click="findLedgerAllList"
        >搜索</el-button>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleDownload">导出</el-button>
      </el-form-item>
       </el-col>
        <el-col :span="3">
           <el-form-item class="right">
            <span>（单位：元）</span>
          </el-form-item>
       </el-col>
      </el-row>
    </el-form>
    <Card-Container>
      <template slot="body">
        <el-table :data="overviewDate" border :span-method="objectSpanMethod" style="width: 100%;">
          <el-table-column label align="center" prop="deptName"></el-table-column>
          <el-table-column prop="offlinePlusOnlineIndex" label="业绩指标" align="center"></el-table-column>
          <el-table-column prop="offlinePlusOnlineSum" label="实际业绩" align="center"></el-table-column>
         <el-table-column label="完成率" align="center" prop="wkComplete">
           <template slot-scope="scope">
              <span>{{ scope.row.a }}</span><br/>
              <span>{{ scope.row.b }}</span><br/>
              <span>={{ scope.row.c }}</span>
          </template>
         </el-table-column>
        </el-table>
      </template>
    </Card-Container>
    <div class="tips">
      <p>
        <span>*</span>上海业绩不统计课程属性为“其他类”课程的金额，全国业绩含课程属性为“其他类”且课程类型为“全国渠道加盟费”课程的金额
      </p>
    </div>
  </div>
</template>
<script>
import { findLedgerAllList } from "@/api/performance/PerformanceIndicators";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { exec } from "child_process";
export default {
  name: "PerformanceOverview",
  data() {
    return {
      loading: false,
      list: {
        date: null
      },
      overviewDate: [],
      totleAddress: [],
      searchInfo: {
        year: null,
        month: null,
        startTime: null,
        provinceId: null
      }
    };
  },
  methods: {
    data() {
      var myDate = new Date();
      this.list.date = myDate.getFullYear() + "-" + (myDate.getMonth() + 1);
      this.change();
    },
    change(list) {
      if (this.list.date != null) {
        const year = parseInt(this.list.date.split("-")[0]);
        const month = parseInt(this.list.date.split("-")[1]);
        this.searchInfo.month = month;
        this.searchInfo.year = year;
      }
    },
    getHeadInfo() {
      getHeadInfo().then(res => {
        res.data.provinces.filter(element => {
          if (element.provinceName.indexOf("上海") != -1) {
            this.searchInfo.provinceId = element.provinceId;
          }
          this.findLedgerAllList()
        });
      });
    },
    //总览业绩
    findLedgerAllList() {
      if (this.list.date == null) {
        return this.$message({
          message: "请选择日期",
          type: "warning"
        });
      }
      this.loading = true;
      this.searchInfo.startTime = this.list.date + "-01";
      findLedgerAllList(this.searchInfo).then(res => {
        this.loading = false;
        if (res.status == 200) {
          this.loading = false;
          if (!res.data) {
            this.overviewDate = [];
          } else {
            this.overviewDate = res.data.returnList;
            res.data.allcountryDTO.wkComplete = ((res.data.allcountryDTO.totalOfflineAddOnlineCourse) / Number(res.data.allcountryDTO.totallOfflineAddOnlineCourseIndex) ? ((res.data.allcountryDTO.totalOfflineAddOnlineCourse) / Number(res.data.allcountryDTO.totallOfflineAddOnlineCourseIndex)).toFixed(2) : 0) + '%' 
            // if(!res.data.allcountryDTO.wkComplete){
            //    return res.data.allcountryDTO.wkComplete = "0%"
            // }else{
            //    return res.data.allcountryDTO.wkComplete = res.data.allcountryDTO.wkComplete
            // }
            //  res.data.allcountryDTO.wkComplete =(res.data.allcountryDTO.wkComplete).toFixed(2)
          }
          this.overviewDate.push({
            actualOfflineIndex: 1201,
            actualOnlineIndex: 0,
            actualTotalOfflineIndex: 0,
            actualTotalOnlineCourseIndex: 666.5,
            allComplete: 0,
            allSum: null,
            deptId: 1916,
            deptName: "总计(事业部)",
            month: null,
            offlineComplete: null,
            offlineIndex: 0,
            offlinePlusOnlineIndex: res.data.allcountryDTO.totallOfflineAddOnlineCourseIndex,
            offlinePlusOnlineSum: res.data.allcountryDTO.totalOfflineAddOnlineCourse,
            onlineComplete: null,
            onlineIndex: 0,
            roleId: null,
            roleName: null,
            sourceType: null,
            startTime: null,
            totalOfflineIndex: 0,
            totalOnlineCourseIndex: 0
          });
           for (var i = 0; i < this.overviewDate.length; i++) {
            this.overviewDate[i].deptName =this.overviewDate[i].deptName || this.overviewDate[i].roleName;
            this.overviewDate[i].wkComplete = res.data.allcountryDTO.totalOfflineAddOnlineCourse + "/" + res.data.allcountryDTO.totallOfflineAddOnlineCourseIndex + "=" + res.data.allcountryDTO.wkComplete
              this.overviewDate[i].a = "当月实际业绩/当月业绩指标"
              this.overviewDate[i].b = res.data.allcountryDTO.totalOfflineAddOnlineCourse + "/" + res.data.allcountryDTO.totallOfflineAddOnlineCourseIndex 
              this.overviewDate[i].c = res.data.allcountryDTO.wkComplete
            if (this.overviewDate[i].offlinePlusOnlineIndex == null) {
              this.overviewDate[i].offlinePlusOnlineIndex = "无指标";
            }
            if (this.overviewDate[i].offlinePlusOnlineIndex) {
              this.overviewDate[i].offlinePlusOnlineIndex = this.overviewDate[
                i
              ].offlinePlusOnlineIndex.toLocaleString();
            }
            if (this.overviewDate[i].offlinePlusOnlineSum) {
              this.overviewDate[i].offlinePlusOnlineSum = this.overviewDate[
                i
              ].offlinePlusOnlineSum.toLocaleString();
            }
          }
        } else if (res.status == 500) {
          this.$message({
            message: res.message,
            type: "warning"
          });
        } else {
          this.$message({
            message: "搜索失败",
            type: "warning"
          });
        }
      });
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex % 7 === 3 || columnIndex % 7 === 6) {
        if (rowIndex === 0) {
          return {
            rowspan: 6,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //导出成excel表格
    handleDownload() {
      this.downloadLoading = true;
      import("@/export/index").then(excel => {
        const tHeader = ["", "业绩指标", "实际业绩", "完成率"];
        const filterVal = [
          "deptName",
          "actualTotalOnlineCourseIndex",
          "offlinePlusOnlineSum",
          "wkComplete"
        ];
        const list = this.overviewDate;
        const totleAddress = this.totleAddress;
        const data = this.formatJson(filterVal, list, totleAddress);
        excel.export_json_to_excel({
          header2: tHeader,
          data,
          filename: "总业绩概览",
          autoWidth: true,
          bookType: "xlsx",
          merges: ["D2:D7"]
        });
      });
    },
    formatJson(filterVal, jsonData, totleAddress) {
      let jsonDateArr = jsonData.map(v =>
        filterVal.map(j => {
          let label = j.split(".")[0],
            labelTitle = j.split(".")[1];
          if (j.indexOf(".") !== -1) {
            return v[label][labelTitle];
          } else {
            return v[j];
          }
        })
      );
      jsonDateArr.push(totleAddress);
      return jsonDateArr;
    }
  },
  created() {
    this.data();
    this.getHeadInfo();
  }
};
</script>
<style scoped>
.width120 {
  width: 120px;
}
.width140 {
  width: 140px;
}
.title-class {
  padding: 10px;
  background-color: lightgray;
  font-size: 14px;
  border: 1px solid darkgray;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
</style>
