<!--
 * @author jiakun
 * @date 2019/4/8
-->
<template >
  <div class="app-container">
    <el-form inline>
      <el-input
        v-model="listQuery.studentName"
        clearable
        style="width: 100px"
        placeholder="学员姓名"
        :maxlength="50"
      />

      <el-input
        v-model.number="listQuery.studentUserId"
        style="width: 150px"
        clearable
        placeholder="学员ID"
        :maxlength="30"
      />

      <el-input
        v-model.number="listQuery.orderNo"
        clearable
        style="width: 150px"
        placeholder="订单号"
        :maxlength="18"
      />
    <el-select v-model="listQuery.courseType" clearable class="margin-bottom" style="width: 150px" placeholder="课程类型">
        <el-option
          v-for="(item,index) in headInfo.courseType"
          :key="index"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>

      <el-input
        clearable
        class="margin-bottom"
        placeholder="课程名称"
        :style="{width:$selectConfig.classNameWidth+'px'}"
        v-model="listQuery.courseName"
        :maxlength="50"
      ></el-input>
      <el-button
        :loading="loading"
        type="primary"
        icon="el-icon-search"
        @click="findOtherConsumerList"
      >搜索</el-button>
    </el-form>

    <card-container>
      <template slot="body">
        <el-table :data="dataList" highlight-current-row border fit center stripe>
          <el-table-column label="学员姓名" align="center" prop="studentName"></el-table-column>
          <el-table-column label="学员ID" align="center" prop="studentUserId"></el-table-column>
          <el-table-column label="订单号" align="center" prop="orderNo" min-width="110px"></el-table-column>
          <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="formCourse" min-width="50"></el-table-column>
          <el-table-column label="课程类型" align="center" prop="courseType" min-width="150"></el-table-column>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="195"></el-table-column>
          <el-table-column label="课程状态" align="center" prop="courseStatus" :formatter="formOrder" min-width="50"></el-table-column>
          <el-table-column label="课程价格" align="center" >
            <template slot-scope="scope">{{scope.row.totalPrice.toLocaleString()}}</template>
          </el-table-column>
          <el-table-column label="剩余课耗" align="center" prop="residueAmount" ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="span" @click="setAccrual(scope.row.orderCourseId)">课耗结算</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- </template>
    </card-container>

    <card-container>
        <template slot="body">-->
        <pagination
          v-show="total>0"
          :limit.sync="listQuery.pageSize"
          :page.sync="listQuery.pageNum"
          :total="total"
          @pagination="findOtherConsumerList"
        />
      </template>
    </card-container>
    <OtherAccrualSet
      ref="OtherAccrualSet"
      :update-course-dialog-visible.sync="updateCourseDialogVisible"
      :find-indivCourse-list="findOtherConsumerList"
    />
  </div>
</template>
<script>
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import courseType from '@/CourseType/CourseType.js'
import { findOtherConsumerList } from '@/api/other/OtherCourseMgt'
import OtherAccrualSet from '@/views/others/OtherAccrualSet'//课耗结算弹窗
export default {
  name: 'OtherAccrualMgt',
  data () {
    return {
      total: 0,
      fileList: [],
      file: '',
      dataList: [],
      listQuery: {
        courseName:"",
        courseType:"",
        pageSize: 20,
        pageNum: 1,
        studentName: '',
        studentUserId: '',
        orderNo: ''
      },
      headInfo: {},
      loading: false,
      updateCourseDialogVisible: false, //课耗结算弹窗
    }
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.headInfo.courseType = courseType.otherCourseType
      })
    },
    // 搜索
    findOtherConsumerList () {
      this.loading = true
      findOtherConsumerList(this.listQuery).then(response => {
        this.loading = false
        if (response.status === 200) {
          this.dataList = response.data.list
          this.total = response.data.total
        } else if (response.status === 500) {
          this.$message({
            message: "暂无数据",
            type: 'warning'
          })
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    },
    formOrder: function (row, column) {
      switch (row.courseStatus) {
        case 201:
          return "正常"
          break;
      }
    },
    formCourse: function (row, column) {
      switch (row.orderStatus) {
        case 203:
          return "正常"
          break;
      }
      switch (row.orderStatus) {
        case 503:
          return "正常"
          break;
      }
    },
    setAccrual (orderCourseId) {
      this.updateCourseDialogVisible = true
      this.$refs.OtherAccrualSet.findCourseConsumption(orderCourseId)
      // this.$refs.NonsubjAccrualSet.resetForm()
    },
  },
  components: {
    OtherAccrualSet
  },
  created () {
    this.getHeadInfo()
    this.findOtherConsumerList()
  }
}
</script>
<style scoped>
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.margin-bottom {
  margin-bottom: 14px;
}
.span {
  color: #409eff;
  cursor: pointer;
}
</style>
