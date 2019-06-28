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
            <el-button type="primary" @click="findNewSignperformanceList" :loading="loading">搜索</el-button>
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
        <el-table border tip stripe highlight-current-row :data="overviewDate">
          <el-table-column label align="center" prop="deptName" width="80px"></el-table-column>
          <el-table-column label="新签" align="center">
            <el-table-column
              label="网课业绩"
              align="center"
              prop="newSign.actualTotalOnlineCourseIndex"
            ></el-table-column>
            <el-table-column label="班教业绩" align="center" prop="newSign.actualOfflineIndex"></el-table-column>
            <el-table-column label="非学科业绩" align="center" prop="newSign.actualTotalNonSubjectIndex"></el-table-column>
            <el-table-column label="新签业绩占比" align="center" prop="newSign.formatNewSignProportion"></el-table-column>
          </el-table-column>
          <el-table-column label="续费" align="center">
            <el-table-column label="网课业绩" align="center" prop="renew.actualTotalOnlineCourseIndex"></el-table-column>
            <el-table-column label="班教业绩" align="center" prop="renew.actualOfflineIndex"></el-table-column>
            <el-table-column label="非学科业绩" align="center" prop="renew.actualTotalNonSubjectIndex"></el-table-column>
            <el-table-column label="续费业绩占比" align="center" prop="renew.formatRenewalFeeRatio"></el-table-column>
          </el-table-column>
          <el-table-column label="退费" align="center">
            <el-table-column label="网课业绩" align="center" prop="refund.actualTotalOnlineCourseIndex"></el-table-column>
            <el-table-column label="班教业绩" align="center" prop="refund.actualOfflineIndex"></el-table-column>
            <el-table-column label="非学科业绩" align="center" prop="refund.actualTotalNonSubjectIndex"></el-table-column>
            <el-table-column label="退费小计" align="center" prop="refund.allTotalRefundSubtotal"></el-table-column>
          </el-table-column>
          <el-table-column label="总计（校区）" align="center" prop="totle"></el-table-column>
        </el-table>
      </template>
    </card-container>
    <div class="tips">
      <p>
        <span>*</span>上海网课业绩=常规网课（录播+直播）+在线个性化
      </p>
      <p>
        <span>*</span>班教业绩=所有班教产品
      </p>
      <p>
        <span>*</span>非学科业绩=中联院所有产品+科创竞赛
      </p>
      <p>
        <span>*</span>所有新签续费中的产品业绩金额（"正式"订单金额+课程退费金额+转课出的课程金额）
      </p>
      <p>
        <span>*</span>新签续费判断均来源于总办审核
      </p>
    </div>
  </div>
</template>
<script>
import { exec } from 'child_process';
import { findNewSignperformanceList } from '@/api/performance/RenewalFees'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
//allNewSignProportion 新签总占比,allOneSignProportion 续费总占比,formatNewSignProportion 新签业绩占比
//actualOfflineIndex班教业绩,actualTotalNonSubjectIndex非学科业绩,actualTotalOnlineCourseIndex网课业绩
//formatRenewalFeeRatio续费占比
export default {
  name: "SalesPerformance",
  data () {
    return {
      loading: false,
      searchInfo: {
        date: this.format(new Date()),
        provinceId: null
      },
      downloadLoading: false,
      headInfo: {},
      overviewDate: [],//总览数据
      llAchievementDTO: [],//新签和续费的业绩占比
      isContinuousName: [
        { width: "120", title: "" },
        { width: "", title: "新签" },
        { width: "", title: "续费" },
        { width: "", title: "退费" },
        { width: "100", title: "合计" },
      ],
      campus: ["徐汇校区", "人广校区", "杨浦校区", "浦东校区", "销售副总监"],
      isContinuousNameArr: [],
      loading: false,
      campuses: {
        xhDeptId: null,
        xhDeptId: null,
        pdDeptId: null,
        rgDeptId: null
      }
    }
  },
  methods: {
    //总览业绩查询
    findNewSignperformanceList () {
      this.loading = true
      let params = this.searchInfo.date ? { startTime: this.searchInfo.date + "-01" } : {},
        isContinuousNameArr = [], newSignArr = [], renewArr = [], refundArr = []
      findNewSignperformanceList(Object.assign({ provinceId: this.searchInfo.provinceId }, Object.assign(params, this.campuses))).then((res) => {
        //将得到的数据按照新签、续费、退费分为重组一个数组，数组格式:[type:'新签',typeArray:[都是新签的数据]]
        this.loading = false
        if (res.status === 200) {
          this.llAchievementDTO = res.data.llAchievementDTO
          res.data.returnList.forEach((val) => {
            val.actualTotalOnlineCourseIndex = parseFloat(val.actualTotalOnlineCourseIndex).toLocaleString()
            val.actualOfflineIndex = parseFloat(val.actualOfflineIndex).toLocaleString()
            val.actualTotalNonSubjectIndex = parseFloat(val.actualTotalNonSubjectIndex).toLocaleString()
            // val.newSignProportion = parseFloat(val.newSignProportion).toLocaleString()
            val.allTotalRefundSubtotal = parseFloat(val.allTotalRefundSubtotal).toLocaleString()
            if (val.isContinuousName === this.isContinuousName[1].title) {
              newSignArr.push(val)
            }
            if (val.isContinuousName === this.isContinuousName[2].title) {
              renewArr.push(val)
            }
            if (val.isContinuousName === this.isContinuousName[3].title) {
              refundArr.push(val)
            }
          })

          isContinuousNameArr.push({ type: this.isContinuousName[1].title, typeArr: newSignArr })
          isContinuousNameArr.push({ type: this.isContinuousName[2].title, typeArr: renewArr })
          isContinuousNameArr.push({ type: this.isContinuousName[3].title, typeArr: refundArr })
          this.isContinuousNameArr = isContinuousNameArr
          // console.log(isContinuousNameArr)
          this.getOverviewDate(isContinuousNameArr)
        } else {
          this.$tipsMessage(res.message, "warning")
        }
      })
    },
    //将得到的数据按照新签、续费、退费的数组再按照部门分，将部门和新签、续费、退费各自对应
    getOverviewDate (isContinuousNameArr) {
      let overviewDate = [{ newSign: {}, renew: {}, refund: {}, deptName: null },
      { newSign: {}, renew: {}, refund: {}, deptName: null },
      { newSign: {}, renew: {}, refund: {}, deptName: null },
      { newSign: {}, renew: {}, refund: {}, deptName: null },
      { newSign: {}, renew: {}, refund: {}, deptName: null }]
      for (let i = 0;i < isContinuousNameArr.length;i++) {
        let type = isContinuousNameArr[i].type//新签、续费、退费名字
        for (let j = 0;j < isContinuousNameArr[i].typeArr.length;j++) {
          let itemValue = isContinuousNameArr[i].typeArr[j]
          let index = itemValue.deptName ? this.campus.indexOf(itemValue.deptName) : this.campus.indexOf(itemValue.roleName)
          if (type == this.isContinuousName[1].title) {
            overviewDate[index].newSign = itemValue
          } else if (type == this.isContinuousName[2].title) {
            overviewDate[index].renew = itemValue
          } else {
            overviewDate[index].refund = itemValue
          }
          overviewDate[index].deptName = itemValue.deptName ? itemValue.deptName : itemValue.roleName
        }
      }
      this.overviewDate = overviewDate
      this.getTotle()
    },
    getTotle () {
      //对组合的数据添加一列----总计，校区
      let money = 0//计算总计（上海这一行的值）
      this.overviewDate.forEach((val) => {
        val.totle = parseFloat(val.newSign.actualTotalOnlineCourseIndex.replace(/,/g, "")) +
          parseFloat(val.newSign.actualOfflineIndex.replace(/,/g, "")) +
          parseFloat(val.newSign.actualTotalNonSubjectIndex.replace(/,/g, "")) +
          parseFloat(val.renew.actualTotalOnlineCourseIndex.replace(/,/g, ""))
          + parseFloat(val.renew.actualOfflineIndex.replace(/,/g, ""))
          + parseFloat(val.renew.actualTotalNonSubjectIndex.replace(/,/g, ""))
          // parseFloat(val.refund.actualTotalOnlineCourseIndex.replace(/,/g, ""))
          // + parseFloat(val.refund.actualOfflineIndex.replace(/,/g, ""))
          // + parseFloat(val.refund.actualTotalNonSubjectIndex.replace(/,/g, ""))
        money += val.totle
        val.totle = val.totle.toLocaleString()
      })
      //对组合的数据添加一行----总计（上海）
      let obj = {
        newSign: { actualTotalOnlineCourseIndex: 0, actualOfflineIndex: 0, actualTotalNonSubjectIndex: 0, formatNewSignProportion: 0 },
        renew: { actualTotalOnlineCourseIndex: 0, actualOfflineIndex: 0, actualTotalNonSubjectIndex: 0, formatRenewalFeeRatio: 0 },
        refund: { actualTotalOnlineCourseIndex: 0, actualOfflineIndex: 0, actualTotalNonSubjectIndex: 0, allTotalRefundSubtotal: 0 },
        deptName: "总计（上海）",
        totle: null
      }
      this.isContinuousNameArr.forEach((val) => {
        if (val.type == this.isContinuousName[1].title) {//新签
          val.typeArr.forEach((element) => {
            obj.newSign.actualTotalOnlineCourseIndex += parseFloat(element.actualTotalOnlineCourseIndex.replace(/,/g, ""))
            obj.newSign.actualOfflineIndex += parseFloat(element.actualOfflineIndex.replace(/,/g, ""))
            obj.newSign.actualTotalNonSubjectIndex += parseFloat(element.actualTotalNonSubjectIndex.replace(/,/g, ""))
            // obj.newSign.formatNewSignProportion += parseFloat(element.formatNewSignProportion.replace(/,/g, ""))
          })
          obj.newSign.actualTotalOnlineCourseIndex = obj.newSign.actualTotalOnlineCourseIndex.toLocaleString()
          obj.newSign.actualOfflineIndex = obj.newSign.actualOfflineIndex.toLocaleString()
          obj.newSign.actualTotalNonSubjectIndex = obj.newSign.actualTotalNonSubjectIndex.toLocaleString()
          // obj.newSign.formatNewSignProportion = obj.newSign.formatNewSignProportion.toLocaleString()
          obj.newSign.formatNewSignProportion = this.llAchievementDTO.allNewSignProportion
        } else if (val.type == this.isContinuousName[2].title) {//续费
          val.typeArr.forEach((element) => {
            obj.renew.actualTotalOnlineCourseIndex += parseFloat(element.actualTotalOnlineCourseIndex.replace(/,/g, ""))
            obj.renew.actualOfflineIndex += parseFloat(element.actualOfflineIndex.replace(/,/g, ""))
            obj.renew.actualTotalNonSubjectIndex += parseFloat(element.actualTotalNonSubjectIndex.replace(/,/g, ""))
            // obj.renew.formatRenewalFeeRatio += parseFloat(element.formatRenewalFeeRatio.replace(/,/g, ""))
          })
          obj.renew.actualTotalOnlineCourseIndex = obj.renew.actualTotalOnlineCourseIndex.toLocaleString()
          obj.renew.actualOfflineIndex = obj.renew.actualOfflineIndex.toLocaleString()
          obj.renew.actualTotalNonSubjectIndex = obj.renew.actualTotalNonSubjectIndex.toLocaleString()
          // obj.renew.formatRenewalFeeRatio = obj.renew.formatRenewalFeeRatio.toLocaleString()
          obj.renew.formatRenewalFeeRatio = this.llAchievementDTO.allOneSignProportion
        } else if (val.type == this.isContinuousName[3].title) {//退费名字
          val.typeArr.forEach((element) => {
            obj.refund.actualTotalOnlineCourseIndex += parseFloat(element.actualTotalOnlineCourseIndex.replace(/,/g, ""))
            obj.refund.actualOfflineIndex += parseFloat(element.actualOfflineIndex.replace(/,/g, ""))
            obj.refund.actualTotalNonSubjectIndex += parseFloat(element.actualTotalNonSubjectIndex.replace(/,/g, ""))
            obj.refund.allTotalRefundSubtotal += parseFloat(element.allTotalRefundSubtotal.replace(/,/g, ""))
          })
          obj.refund.actualTotalOnlineCourseIndex = obj.refund.actualTotalOnlineCourseIndex.toLocaleString()
          obj.refund.actualOfflineIndex = obj.refund.actualOfflineIndex.toLocaleString()
          obj.refund.actualTotalNonSubjectIndex = obj.refund.actualTotalNonSubjectIndex.toLocaleString()
          obj.refund.allTotalRefundSubtotal = obj.refund.allTotalRefundSubtotal.toLocaleString()
        }
      })
      obj.totle = money.toLocaleString()
      this.overviewDate.push(obj)
    },
    //导出成excel表格
    handleDownload () {
      // this.downloadLoading = true
      import('@/export/index').then((excel) => {
        const tHeader1 = ['', '新签', '', '', '', '续费', '', '', '', '退费', '', '', '', '总计(校区)', '', '', '']
        const tHeader2 = ['', '网课业绩', '班教业绩', '非学科业绩', '新签业绩占比',
          '网课业绩', '班教业绩', '非学科业绩', '续费业绩占比', '网课业绩', '班教业绩', '非学科业绩', '退费小计', ''];
        const filterVal = ["deptName", 'newSign.actualTotalOnlineCourseIndex', 'newSign.actualOfflineIndex', 'newSign.actualTotalNonSubjectIndex', 'newSign.newSignProportion',
          'renew.actualTotalOnlineCourseIndex', 'renew.actualOfflineIndex', 'renew.actualTotalNonSubjectIndex', 'renew.newSignProportion',
          'refund.actualTotalOnlineCourseIndex', 'refund.actualOfflineIndex', 'refund.actualTotalNonSubjectIndex', 'refund.allTotalRefundSubtotal', 'totle']

        const list = this.overviewDate
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header2: tHeader2,
          header1: tHeader1,
          data,
          filename: '上海新签续费概览',
          autoWidth: true,
          bookType: 'xlsx',
          merges: ['A1:A2', 'B1:E1', 'F1:I1', 'J1:M1', 'N1:N2']
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
      if (totleAddress) {
        jsonDateArr.push(totleAddress)
      }
      return jsonDateArr
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
        this.findNewSignperformanceList()
      })
    },
    format(date){
      return date.getFullYear()+"-"+(date.getMonth()>9?date.getMonth()+1:"0"+(date.getMonth()+1))
    }
  },
  created () {
    this.getHeadInfo()
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
