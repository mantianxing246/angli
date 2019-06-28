9/*
@author Andy
@date 2019/1/18
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="searchForm" v-model="searchForm" :inline="true">
        <el-form-item>
          <el-input
            v-model="searchForm.name"
            placeholder="学员姓名"
            class="width120"
            clearable
            @change="changeName"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.userId"
            placeholder="学员ID"
            :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
            clearable
            :maxlength="35"
            @change="changeStudentId"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-input
            v-model="searchForm.mobile"
            style="width: 150px"
            placeholder="手机号"
            class="width120"
            clearable
            @input="phoneChange"
            :maxlength="16"
          />-->
          <el-input
            style="width: 150px"
            placeholder="手机号"
            class="width120"
            clearable
            v-model="searchForm.mobile"
            @keyup.native="phoneChange"
            :maxlength="16"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.grade" placeholder="高考年份" class="width120" clearable>
            <el-option v-for="years in years" :value="years" :key="years" :label="years"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            class="filter-item query"
            icon="el-icon-search"
            type="primary"
            @click="findStudent"
            :loading="loading"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <card-container>
      <template slot="body">
        <el-table :data="students" border tip stripe highlight-current-row style="width: 100%">
          <el-table-column prop="name" label="姓名" align="center" min-width="70"/>
          <el-table-column prop="userId" label="学员ID" align="center" min-width="100"/>
          <el-table-column label="手机号" align="center" min-width="90">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="手机号"
                trigger="hover"
                :content="scope.row.mobile"
              >
                <div slot="reference">{{scope.row.mobile | mobiles}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="grade" label="高考年份" align="center" min-width="60"/>
          <el-table-column prop="districtName" label="区域" align="center" min-width="60"/>
          <el-table-column
            prop="schoolName"
            label="学校"
            align="center"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="学校"
                width="200"
                trigger="hover"
                :content="scope.row.schoolName"
              >
                <div slot="reference">{{scope.row.schoolName | schoolName}}</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="280" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="createFullOrder(scope.row)">新增正式订单</el-button>
              <el-button type="text" @click="createDepositOrder(scope.row.id)">新增订金订单</el-button>
              <el-button type="text" @click="orderAudition(scope.row)">新增网课试听</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- </template>
    </card-container>

    <card-container>
        <template slot="body">-->
        <pagination
          v-show="searchForm.total>0"
          :limit.sync="searchForm.pageSize"
          :page.sync="searchForm.pageNum"
          :total="searchForm.total"
          @pagination="findStudent"
        />
      </template>
    </card-container>
  </div>
</template>
<script>
import waves from '@/components/directive/waves' // Waves directive
import { findStudent } from '@/api/order/StudentApi'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import clearNumber from "@/components/FullOrder/ClearLocalAndVuex"
export default {
  name: 'Student',
  directives: { waves },
  mixins: [clearNumber],
  data () {
    return {
      searchForm: {
        name: '',
        userId: '',
        grade: null,
        mobile: '',
        total: 0,
        pageNum: 1,
        pageSize: 20
      },
      mobile: [],
      years: [],
      students: [],
      loading: false
    }
  },
  methods: {
    // orderDetail (row) {
    //   this.$router.push({ path: '/OrderMgt/OrderDetail', query: { id: row.id } })
    // },
    findStudent () {
      this.loading = true
      findStudent(this.searchForm).then(response => {
        if (response.status === 200) {
          this.students = response.data.list
          // for (let i = 0;i < this.students.length;i++) {
          //   this.mobile = this.students[i].mobile
          //   if (this.mobile) {
          //     this.mobile = this.students[i].mobile.substr(0, 3) + '****' + this.students[i].mobile.substr(7)
          //     console.log(this.mobile)
          //   }
          // }
          this.searchForm.total = response.data.total
          this.loading = false
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
          this.loading = false
        }
      })
    },
    createFullOrder (row) {
      this.$router.push({ path: '/OrderMgt/FullOrder/' + row.id + "/fullOrderStepSelectClass", query: { year: row.grade } });
      this.clearNumber()//用于清空local数据和vuex中的数据
    },
    // 新增订金订单
    createDepositOrder (id) {
      this.$router.push({
        path: '/OrderMgt/DepositOrder',
        query: {
          studentId: id,
          orderId: null
        }
      })
    },
    orderAudition (row) {
      this.$router.push({
        path: '/OrderMgt/AddOnlineAudition',
        query: {
          studentId: row.id,
          orderId: null,
          year: row.grade
        }
      })
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        this.years = res.data.years
      })
    },
    //查看输入的名字是否正确
    changeName (val) {
      if (val.length >= 50) {
        this.$tipsMessage("你输入的姓名的长度超过了50个汉字,请重输", "warning")
        this.searchForm.name = null
      }
    },
    //查看学员id是否符合条件
    changeStudentId (val) {
      let reg = /[\u4e00-\u9fa5]/
      if (reg.test(val) && val) {
        this.$tipsMessage("学员ID 处不能输入汉字 ", "warning")
      }
    },
    phoneChange (event) {
      this.searchForm.mobile = this.searchForm.mobile.replace(/[^\.\d]/g, '');
      this.searchForm.mobile = this.searchForm.mobile.replace('.', '');
    }
  },
  created () {
    this.getHeadInfo()
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
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-form-item {
  margin-bottom: 10px;
}
.query {
  margin-bottom: 2px;
  border: 0;
  height: 25px;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>