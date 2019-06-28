<template>
  <DialogContainer title="课程冻结" :visible.sync="courseDialog" width="80%" :diglogClass="['rec-live-course']"> 
      <template slot="body">
    <div style="margin-bottom:10px" v-show="auditRemark.auditRemark">审核信息:{{auditRemark.auditRemark}}</div>
    <el-table :data="tableData" border>
      <el-table-column prop="courseName" label="课程" align="center" min-width="310"/>
      <!-- <el-table-column prop="freezeAmount" label="冻结金额" align="center" /> -->
      <el-table-column prop="courseStatus" label="课程状态" align="center">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.courseStatus | formatCourseStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结单据号"  min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.freezeNo" clearable/>
        </template>
      </el-table-column>
      <el-table-column label="冻结金额" align="center">
          <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
      </el-table-column>
      <el-table-column  min-width="150" align="center" label="冻结时间">
        <template slot-scope="scope">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            v-model="scope.row.operateTime"
            style="width:90%"
            placeholder="选择日期"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人员">
        <template slot-scope="scope">{{scope.row.userName}}</template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col style="text-align:center;margin:20px 0;">
      <el-button @click="courseDialog = false">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
      </el-col>
    </el-row>
      </template>
  </DialogContainer>
</template>
<script>
import { getFreezeCourse, updateFreezeCourse, courseFreezeReviewById } from '@/api/order/OrderCourseApi'
export default {
  name: 'FreezeCourse', //冻结课程页面
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    findOrderDetail: {
      type: Function
    }
  },
  filters: {
    formatCourseStatus (val) {
      switch (val) {
        case 201:
          return "正常"
          break;
        case 202:
          return "已冻结"
          break;
        case 204:
          return "已退费"
          break;
        case 205:
          return "已转课"
          break;
        case 205:
          return "已关闭"
          break;
        case 302:
          return "冻结驳回"
          break;
        case 303:
          return "解冻驳回"
          break;
        case 304:
          return "退费驳回"
          break;
        case 305:
          return "转课驳回"
          break;
      }
    }
  },
  data () {
    return {
      showAuditRemark:false,
      operateBy: JSON.parse(localStorage.getItem('states')).user.userId,
      userName: JSON.parse(localStorage.getItem('states')).user.name,
      auditRemark: {
        operateTime: "",
        auditRemark: "",
        freezeNo:"",
      },
      tableData: [],
    }
  },
  computed: {
    // 弹窗显示与否
    courseDialog: {
      get: function () {
        return this.dialogVisible
      },
      set: function (val) {
        this.$emit('update:dialogVisible', val)
        this.tableData = []
      }
    }
  },
  mounted () {
  },
  methods: {
    // courseFreezeReviewById(params){

    // },
    // 获取冻结信息
    getFreezeCourse (params) {
      // courseFreezeReviewById(params).then(res => {
      //   if (res.status === 200) {
      //    this.auditRemark.auditRemark = res.data.auditRemark
      //    this.tableData.push(res.data)
      //     this.auditRemark.freezeNo = res.data.freezeNo
      //     this.auditRemark.operateTime = res.data.operateTime
      //     this.tableData[0].operateTime = this.auditRemark.operateTime
      //     this.tableData[0].name = JSON.parse(localStorage.states).user.name
      //   }
      // })
      if( params.courseStatus === 201 ){
        getFreezeCourse(params).then(res => {
            if (res.status === 200) {  
              this.auditRemark.auditRemark = res.data.auditRemark
              res.data.freezeNo = null
              res.data.operateBy = JSON.parse(localStorage.states).user.userId
              this.tableData.push(res.data[0])
              this.tableData[0].operateBy = res.data.operateBy
              this.tableData[0].residueAmount = res.data[0].residueAmount
              this.tableData[0].operateTime = res.data.operateTime
              this.tableData[0].operateBy = JSON.parse(localStorage.states).user.userId
              this.tableData[0].userName =  JSON.parse(localStorage.getItem('states')).user.name
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(err => {
      })
    }else{
        courseFreezeReviewById(params).then(res => {
            if (res.status === 200) {  
               this.auditRemark.auditRemark = res.data.auditRemark
              res.data.freezeNo = null
              res.data.operateBy = JSON.parse(localStorage.states).user.userId
              this.tableData.push(res.data)
              
              this.tableData[0].operateBy = res.data.operateBy
              this.tableData[0].residueAmount = res.data.residueAmount
              this.tableData[0].operateTime = res.data.operateTime
              this.tableData[0].operateBy = JSON.parse(localStorage.states).user.userId
              this.tableData[0].userName =  JSON.parse(localStorage.getItem('states')).user.name
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(err => {
      })
    }
  },
    // 确认操作
    confirm () {
      if (this.tableData[0].freezeNo != Number(this.tableData[0].freezeNo)) {
        this.$message({
          title: '提示',
          message: '请输入正确的冻结单据号,必须是数字！',
          type: 'warning'
        })
        return false
      }
      var params = {
        id: this.tableData.id,
        orderCourseId: this.tableData[0].orderCourseId,
        orderId: this.tableData[0].orderId,
        operateBy: this.tableData[0].operateBy,
        operateTime: this.tableData[0].operateTime,
        freezeNo: this.tableData[0].freezeNo,
        freezeAmount: this.tableData[0].residueAmount
      }
      updateFreezeCourse(params).then(res => {
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '冻结申请',
            type: 'success'
          })
          this.courseDialog = false
          this.findOrderDetail()
        } else {
          this.$notify({
            title: '提示',
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 退费操作
    refund () { }
  }
}
</script>
<style scoped lang="scss">
.thaw-btn {
  text-align: center;
  margin-top: 20px;
}
</style>
