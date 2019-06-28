<template>
  <div class="app-container">
    <el-form inline>
      <el-row type="flex">
        <el-col>
          <el-form-item>
            <el-date-picker
              v-model="searchInfo.date"
              style="width:140px;"
              placeholder="选择日期"
              type="month"
              value-format="yyyy-MM"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="findShPerformanceList"
              :loading="loading"
              icon="el-icon-search"
            >搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="downloadLoading" @click="handleDownload">导出</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>（单位：元）</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <card-container>
      <template slot="body">
        <el-table
          border
          tip
          stripe
          highlight-current-row
          :data="overviewDate"
          show-summary
          sum-text="总计（上海）"
          :summary-method="summaryMethod"
        >
          <el-table-column prop="deptName" align="center"></el-table-column>
          <el-table-column label="A-市场资源转化" prop="sourceTypeNameA" align="center"></el-table-column>
          <el-table-column label="B-自有资源转化" prop="sourceTypeNameB" align="center"></el-table-column>
          <el-table-column label="C-友介" prop="sourceTypeNameC" align="center"></el-table-column>
          <el-table-column label="D-推荐" prop="sourceTypeNameD" align="center"></el-table-column>
          <el-table-column label="E-续费" prop="sourceTypeNameE" align="center"></el-table-column>
          <el-table-column label="F-跨事业部代报名" prop="sourceTypeNameF" align="center"></el-table-column>
        </el-table>
      </template>
    </card-container>
    <div class="tips">
      <p>
        <span>*</span>A/B/C/D/E的判断均来源于总办审核
      </p>
      <p>
        <span>*</span>此页面显示的业绩金额（去除课程退费金额、转课出的课程金额、其他类课程金额）
      </p>
    </div>
  </div>
</template>
<script>
import { findShPerformanceList } from "@/api/performance/PerformanceQuality";
import { getHeadInfo } from "@/api/components/HeadInfoApi";

export default {
  name: "SalesPerformance",
  data() {
    return {
      loading: false,
      searchInfo: {
        date: this.format(new Date()),
        provinceId: null
      },
      downloadLoading: false,
      headInfo: {},
      overviewDate: [], //总览数据
      totleAddress: [],
      campus: ["徐汇校区", "人广校区", "杨浦校区", "浦东校区", "销售副总监"],
      campuses: {
        xhDeptId: null,
        xhDeptId: null,
        pdDeptId: null,
        rgDeptId: null
      }
    };
  },
  methods: {
    //导出成excel表格
    handleDownload() {
      import("@/export/index").then(excel => {
        const tHeader2 = [
          "",
          "A-市场资源转化",
          "B-自有资源转化",
          "C-友介",
          "D-推荐",
          "E-续费",
          "F-跨事业部代报名"
        ];
        const filterVal = [
          "deptName",
          "sourceTypeNameA",
          "sourceTypeNameB",
          "sourceTypeNameC",
          "sourceTypeNameD",
          "sourceTypeNameE",
          "sourceTypeNameF"
        ];
        const list = this.overviewDate;
        const totleAddress = this.totleAddress;
        const data = this.formatJson(filterVal, list, totleAddress);
        excel.export_json_to_excel({
          header2: tHeader2,
          data,
          filename: "上海业绩质量概览",
          autoWidth: true,
          bookType: "xlsx"
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
    },
    summaryMethod({ columns, data }) {
      let arr = [];
      columns.forEach((element, index) => {
        let money = 0;
        data.forEach((val, indexItem) => {
          money += parseFloat(val[element.property].replace(/,/g, ""));
        });
        if (index == 0) {
          arr.push("总计（上海）");
        } else {
          arr.push(money.toLocaleString());
        }
      });
      this.totleAddress = arr;
      return arr;
    },
    //总览业绩
    findShPerformanceList() {
      this.loading = true;
      let params = this.searchInfo.date
        ? {
            startTime: this.searchInfo.date + "-01"
          }
        : {};
      findShPerformanceList(
        Object.assign(
          { provinceId: this.searchInfo.provinceId },
          Object.assign(params, this.campuses)
        )
      ).then(res => {
        this.loading = false;
        this.overviewDate = [];
        let campusArr = new Array([], [], [], [], []);
        res.data.forEach(val => {
          let deptName = val.deptName ? val.deptName : val.roleName;
          if (deptName === this.campus[0]) {
            campusArr[0].push(val);
          }
          if (deptName === this.campus[1]) {
            campusArr[1].push(val);
          }
          if (deptName === this.campus[2]) {
            campusArr[2].push(val);
          }
          if (deptName === this.campus[3]) {
            campusArr[3].push(val);
          }
          if (deptName === this.campus[4]) {
            campusArr[4].push(val);
          }
        });
        this.getChangeOverviewDate(campusArr);
      });
    },
    getChangeOverviewDate(campusArr) {
      for (let i = 0; i < campusArr.length; i++) {
        this.overviewDate.push({
          deptName: campusArr[i][0].deptName
            ? campusArr[i][0].deptName
            : campusArr[i][0].roleName
        });
        for (let j = 0; j < campusArr[i].length; j++) {
          let totalPerformance = parseFloat(
            campusArr[i][j].totalPerformance
          ).toLocaleString();
          if (campusArr[i][j].sourceTypeName.indexOf("A") !== -1) {
            this.overviewDate[i].sourceTypeNameA = totalPerformance;
          }
          if (campusArr[i][j].sourceTypeName.indexOf("B") !== -1) {
            this.overviewDate[i].sourceTypeNameB = totalPerformance;
          }
          if (campusArr[i][j].sourceTypeName.indexOf("C") !== -1) {
            this.overviewDate[i].sourceTypeNameC = totalPerformance;
          }
          if (campusArr[i][j].sourceTypeName.indexOf("D") !== -1) {
            this.overviewDate[i].sourceTypeNameD = totalPerformance;
          }
          if (campusArr[i][j].sourceTypeName.indexOf("E") !== -1) {
            this.overviewDate[i].sourceTypeNameE = totalPerformance;
          }
          if (
            campusArr[i][j].sourceTypeName &&
            campusArr[i][j].sourceTypeName.indexOf("F") !== -1
          ) {
            this.overviewDate[i].sourceTypeNameF = totalPerformance;
          }
        }
      }
      // console.log(this.overviewDate)
    },
    getHeadInfo() {
      getHeadInfo().then(res => {
        res.data.provinces.filter(element => {
          if (element.provinceName.indexOf("上海") != -1) {
            this.searchInfo.provinceId = element.provinceId;
          }
        });
        res.data.campuses.forEach(val => {
          if (val.campusName == this.campus[0]) {
            //徐汇校区
            this.campuses.xhDeptId = val.deptId;
          }
          if (val.campusName == this.campus[1]) {
            //人广校区
            this.campuses.rgDeptId = val.deptId;
          }
          if (val.campusName == this.campus[2]) {
            //杨浦校区
            this.campuses.ypDeptId = val.deptId;
          }
          if (val.campusName == this.campus[3]) {
            //浦东校区
            this.campuses.pdDeptId = val.deptId;
          }
        });
        this.findShPerformanceList();
      });
    },
    format(date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1))
      );
    }
  },
  created() {
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
.el-form-item {
  margin-right: 0;
}
</style>

