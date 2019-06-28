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
              @click="findShProductAchievementList"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDownload">导出</el-button>
          </el-form-item >
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
        <el-table
          :data="overviewDate"
          border
          :span-method="objectSpanMethod"
          style="width: 100%;"
        >
          <el-table-column label align="center" prop="deptName"></el-table-column>
          <el-table-column prop="totalOnlineCourseIndex" label="网课业绩指标" align="center"></el-table-column>
          <el-table-column prop="actualTotalOnlineCourseIndex" label="网课实际业绩" align="center"></el-table-column>
          <el-table-column label="网课完成率" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.a }}</span><br/>
              <span>={{ scope.row.b }}</span>
          </template>
          </el-table-column>
          <el-table-column prop="totalOfflineIndex" label="班教业绩指标" align="center"></el-table-column>
          <el-table-column prop="actualOfflineIndex" label="班教实际业绩" align="center"></el-table-column>
          <el-table-column label="班教完成率" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.c }}</span><br/>
              <span>={{ scope.row.d }}</span>
          </template>
          </el-table-column>
        </el-table>
      </template>
    </Card-Container>
     <div class="tips">
      <p>
        <span>*</span>上海网课业绩=常规网课（录播+直播）+在线个性化 
      </p>
      <p>
        <span>*</span>班教业绩=所有班教产品
      </p>
    </div>
  </div>
</template>
<script>
import { findShProductAchievementList } from "@/api/performance/PerformanceIndicators"
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import { exec } from 'child_process';
export default {
  name: "SalesPerformance",
  data () {
    return {
      loading: false,
      list: {
        date: null
      },
      overviewDate1: {},
      overviewDate: [],
      totleAddress: [],
      searchInfo: {
        year: null,
        month: null,
        startTime: null,
        provinceId: null
      },
      headInfo: {},
      campus: ["徐汇校区", "人广校区", "杨浦校区", "浦东校区", "销售副总监"],
      campuses: {
        xhDeptId: null,
        ypDeptId: null,
        pdDeptId: null,
        rgDeptId: null
      }
    }
  },
  methods: {
    data () {
      var myDate = new Date();
      this.list.date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1)
      this.change()
    },
    //总览业绩
    change (list) {
      if (this.list.date != null) {
        const year = parseInt(this.list.date.split('-')[0])
        const month = parseInt(this.list.date.split('-')[1])
        this.searchInfo.month = month
        this.searchInfo.year = year
      }
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        res.data.provinces.filter((element) => {
          if (element.provinceName.indexOf("上海") != -1) {
            this.searchInfo.provinceId = element.provinceId
          }
        })
        res.data.campuses.forEach((val) => {
          if (val.campusName == this.campus[0]) {//徐汇校区
            this.campuses.xhDeptId = val.deptId
          }
          if (val.campusName == this.campus[1]) {//人广校区
            this.campuses.rgDeptId = val.deptId
          }
          if (val.campusName == this.campus[2]) {//杨浦校区
            this.campuses.ypDeptId = val.deptId
          }
          if (val.campusName == this.campus[3]) {//浦东校区
            this.campuses.pdDeptId = val.deptId
          }
        })
        this.findShProductAchievementList()
      })
    },
    findShProductAchievementList() {
      this.loading = false
      if (this.list.date == null) {
        return this.$message({
          message: "请选择日期",
          type: "warning"
        })
      }
      this.loading = true
      this.searchInfo.startTime = this.list.date + "-01"
      findShProductAchievementList(Object.assign({ provinceId: this.searchInfo.provinceId }, Object.assign(this.searchInfo, this.campuses))).then((res) => {
        this.loading = false
        if (res.status == 200) {
          this.loading = false
          if (!res.data) {
            this.overviewDate = []
          } else {
            this.overviewDate = res.data.returnList
            this.overviewDate.push({
                actualOfflineIndex:res.data.allSum.totalOfflineSum,
                actualOnlineIndex:null,
                actualTotalOfflineIndex:null,
                actualTotalOnlineCourseIndex:res.data.allSum.totalOnlineSum,
                allSum:null,
                deptId:1916,
                deptName:"合计",
                modifyBy:null,
                modifyTime:null,
                month:null,
                offlineComplete:null,
                offlineIndex:0,
                onlineComplete:null,
                onlineInde:0,
                roleId:null,
                roleName:null,
                sourceType:null,
                startTime:null,
                totalOfflineIndex:res.data.allSum.totalOfflineIndex,
                totalOnlineCourseIndex:res.data.allSum.getTotalOnlineIndex
            })
            for (var i = 0;i < this.overviewDate.length;i++) {
               if (this.overviewDate[i].totalOnlineCourseIndex) {
              this.overviewDate[i].totalOnlineCourseIndex = this.overviewDate[
                i
              ].totalOnlineCourseIndex.toLocaleString();
            }
            if (this.overviewDate[i].actualTotalOnlineCourseIndex) {
              this.overviewDate[i].actualTotalOnlineCourseIndex = this.overviewDate[
                i
              ].actualTotalOnlineCourseIndex.toLocaleString();
            }
                  if (this.overviewDate[i].totalOfflineIndex) {
              this.overviewDate[i].totalOfflineIndex = this.overviewDate[
                i
              ].totalOfflineIndex.toLocaleString();
            }
            if (this.overviewDate[i].actualOfflineIndex) {
              this.overviewDate[i].actualOfflineIndex = this.overviewDate[
                i
              ].actualOfflineIndex.toLocaleString();
            }
              this.overviewDate[i].deptName = this.overviewDate[i].deptName || this.overviewDate[i].roleName
              this.overviewDate[i].offlineComplete = res.data.allSum.totalOfflineSum + "/" + res.data.allSum.totalOfflineIndex + "=" + res.data.allSum.offlineComplete
              this.overviewDate[i].c = res.data.allSum.totalOfflineSum + "/" + res.data.allSum.totalOfflineIndex
              this.overviewDate[i].d = res.data.allSum.offlineComplete
              this.overviewDate[i].wkComplete = res.data.allSum.totalOnlineSum + "/" + res.data.allSum.getTotalOnlineIndex + "=" + res.data.allSum.wkComplete
              this.overviewDate[i].a = res.data.allSum.totalOnlineSum + "/" + res.data.allSum.getTotalOnlineIndex 
              this.overviewDate[i].b = res.data.allSum.wkComplete
            
            }
          }
        } else if (res.status == 500) {
          this.$message({
            message: res.message,
            type: "warning"
          })
        } else {
          this.$message({
            message: '搜索失败',
            type: "warning"
          })
        }

      })
    },
   
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
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
    handleDownload () {
      this.downloadLoading = true
      import('@/export/index').then(excel => {
        const tHeader = ['', '网课业绩指标', '网课实际业绩', '网课完成率', '班教业绩指标', '班教实际业绩', '班教完成率']
        const filterVal = ['deptName', 'totalOnlineCourseIndex', 'actualTotalOnlineCourseIndex', 'wkComplete', 'totalOfflineIndex', 'actualOfflineIndex', 'offlineComplete']
        const list = this.overviewDate
        const totleAddress = this.totleAddress
        const data = this.formatJson(filterVal, list, totleAddress)
        console.log(data)
        excel.export_json_to_excel({
          header2: tHeader,
          data,
          filename: '上海产品业绩概览',
          autoWidth: true,
          bookType: 'xlsx',
          merges: ['D2:D7', 'G2:G7']
        })
      })
    },
    formatJson (filterVal, jsonData, totleAddress) {
      let jsonDateArr = jsonData.map(v => filterVal.map(j => {
        let label = j.split(".")[0], labelTitle = j.split(".")[1];
        if (j.indexOf(".") !== -1) {
          return v[label][labelTitle]
        } else {
          return v[j]
        }
      }))
      jsonDateArr.push(totleAddress)
      return jsonDateArr
    },

  },
  created () {
    this.getHeadInfo()
    this.data() 
  }
}
</script>
<style scoped>
.width120 {
  width: 120px;
}
.width140 {
  width: 140px;
}
.right{
 text-align: right; 
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
