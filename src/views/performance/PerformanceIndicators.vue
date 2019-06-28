<template>
  <div class="app-container">
    <el-form inline>
      <el-row type="flex">
        <el-col>
      <el-form-item>
        <el-select clearable v-model="searchInfo.deptId" placeholder="部门" style="width:120px;">
          <el-option
            :value="campuses.deptId"
            v-for="campuses in campuses"
            :key="campuses.deptId"
            :label="campuses.campusName"
            style="height:45px;"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInfo.year" clearable style="width:100px;" :maxlength="4" placeholder="指标年份"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="loading"
          @click="findShAchievementList"
        >搜索</el-button>
      </el-form-item>
        </el-col>
       <el-col :span="3">
          <el-form-item class="right">
            <span>（单位：元）</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item>
        <el-button type="primary" @click="handleDownload">导出</el-button>
      </el-form-item>-->
    </el-form>
     <Card-Container>
      <template slot="body">
    <el-table :data="overviewDate" highlight-current-row center border fit stripe>
      <el-table-column prop="year" label="指标日期" align="center"></el-table-column>
      <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
      <el-table-column prop="totalOfflineIndex" label="班教指标" align="center"></el-table-column>
      <el-table-column prop="totalOnlineCourseIndex" label="网课指标" align="center"></el-table-column>
      <el-table-column prop="totalIndex" label="指标合计" align="center"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="light" placement="top">
            <i
              class="el-icon-edit pointer"
              @click="editCourse(scope.row.deptId,scope.row.year)"
              size="large"
            ></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination 
      v-show="total>0"
      :limit.sync="searchInfo.pageSize"
      :page.sync="searchInfo.pageNum"
      :total="total"
      @pagination="getClassList"
    />
      </template>
     </Card-Container>
    <PerformanceIndicatorsEdit
      ref="PerformanceIndicatorsEdit"
      :update-course-dialog-visible.sync="updateCourseDialogVisible"
      :show-message="StudentPlacementMessage"
      :find-shAchievement-list="findShAchievementList"
    />
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import { getHeadInfo } from "@/api/components/HeadInfoApi"; 
import { findShAchievementList} from "@/api/performance/PerformanceIndicators"
import PerformanceIndicatorsEdit from '@/views/performance/PerformanceIndicatorsEdit' //编辑弹窗
export default {
  name: "PerformanceIndicators",
  data () {
    return {
      loading: false,
      total: 0,
      searchInfo: {
        year: 2019,
        pageSize: 20,
        pageNum: 1,
        deptId: "",
      },
      StudentPlacementMessage: {
        year: '',
        deptName: ""
      },
      campuses: [],//部门
      headInfo: {},
      overviewDate: [],//总览数据
      updateCourseDialogVisible: false  //编辑弹窗
    }
  },
  components: {
    pagination,
    PerformanceIndicatorsEdit
  },
  methods: {
    // changeAmount (val, index) {
    //   var reg = /^[0-9]*$/
    //   if (!reg.test(val)) {
    //     this.$tipsMessage('请输入数字', 'warning')
    //     return
    //   }
    // },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.campuses = res.data.campuses
      })
    },
    getClassList () {
      this.findShAchievementList()
    },
    //总览业绩
    findShAchievementList () {
       var reg = /^[0-9]*$/
       if(this.searchInfo.year == null || this.searchInfo.year == ""){
         return this.$message({
            message: "请输入指标年份",
            type: "warning"
          })
      }
      if(!reg.test(this.searchInfo.year)){
        return this.$message({
            message: "请输入数字",
            type: "warning"
          }) 
      }
      findShAchievementList(this.searchInfo).then((res) => {
        this.listLoading = false;
        this.overviewDate = res.data.list
        this.total = res.data.total
      })
    },
    editCourse (deptId, msg) {
      this.$refs.PerformanceIndicatorsEdit.getSingleCourse(deptId,msg)
      this.updateCourseDialogVisible = true
      this.$refs.PerformanceIndicatorsEdit.resetForm()
    },
    //导出成excel表格
    handleDownload () {
      this.downloadLoading = true
      import('@/export/index').then(excel => {
        const tHeader = ['', '业绩指标', '实际业绩', '完成率']
        const filterVal = ['String', 'Float', 'Float', 'Float']
        const list = this.overviewDate
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '总业绩概览',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },

  },
  created () {
    this.getHeadInfo()
    this.getClassList()
    this.findShAchievementList()
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
.el-form--inline .el-form-item{
  margin-right: 0;
}
</style>