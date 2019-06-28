/*
@author hongdengru
@date 2019/2/27
*/
<template>
  <div class="app-container rec-live-course">
    <student-info :student-id="$route.query.studentId"/>
    <Card-Container :orderNo="$route.query.row.orderNo" title="">
      <template slot="body">
    <el-table :data="ThawOrderExamine" border tip stripe highlight-current-row style="margin-top:10px;">
      <el-table-column label="课程" prop="courseName" min-width="310" align="center"/>
      <el-table-column label="课程状态" prop="statusName" align="center"/>
      <el-table-column label="冻结单据号" prop="freezeNo" align="center"/>
      <el-table-column label="冻结金额" align="center" width="80">
        <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
      </el-table-column>
      <el-table-column label="冻结时间" prop="operateTime" align="center"/>
      <el-table-column label="操作人员" prop="userName" align="center"/>
    </el-table>
    <el-form inline style="margin-top:30px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="备注信息：">
            <el-input v-model="remark" type="textarea" style="width:300px;" :rows="3" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="审核信息：">
            <el-input
              :disabled="$route.query.auditType1 == 2"
              v-model="auditRemark"
              type="textarea"
              style="width:300px;"
              :rows="3"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row v-if="$route.query.auditType1 == 1" class="margin-20" style="text-align:center">
      <el-col>
        <el-button @click="goBack">取消</el-button>
        <el-button :loading="loading" type="primary" @click="confirmOrder1">确认</el-button>
        <el-button :loading="falseLoading" type="primary" @click="orderReturn1">退回</el-button>
      </el-col>
    </el-row>
    <el-row v-if="$route.query.auditType1 == 2" class="margin-20" style="text-align:center">
      <el-col>
        <el-button type="primary" @click="goBack">关闭</el-button>
      </el-col>
    </el-row>
    </template>
    </Card-Container>
  </div>
</template>
<script>
import { confirmOrder, orderReturn, ThawOrderExamine } from '@/api/order/ThawOrderExamine'
import StudentInfo from "@/views/order/components/StudentInfo";
import messageInfo from './common/messageInfo';
export default {
  name: 'ThawOrderExamine', // 课程解冻
  mixins: [messageInfo],
  props: ['orderId'],
  components: {
    StudentInfo,
  },
  data () {
    return {
      loading: false,
      falseLoading: false,
      ThawOrderExamine: [],
      message: null,
      query: null,
      remark: '',
      auditRemark: '' // 审核信息
    }
  },
  created () {
    this.thawOrderExamine()
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 信息回显
    thawOrderExamine () {
      this.query = this.$route.query
      var data = {
        orderId: this.query.orderId,
        orderCourseId: this.query.orderCourseId,
      }
      ThawOrderExamine(data).then(res => {
        if (res.status == 200) {
          var status = this.switchStatus(res.data.status)
          res.data.status = status
          this.remark = res.data.remark
          this.auditRemark = res.data.auditRemark
          res.data.courseStatus = '解冻申请'
          this.ThawOrderExamine.push(res.data)
        } else {
          this.$message({
            message: '课程解冻查询失败',
            type: 'warning'
          })
        }
      })
    },
    // 订单冻结
    confirmOrder1 () {
      this.$confirm("确认后无法更改审核，请确认是否通过审核。", '消息').then(() => {
        this.confirmOrder();
      }).catch(() => { });
    },
    confirmOrder () {
      this.loading = true
      confirmOrder({
        orderId: this.query.orderId,
        orderCourseId: this.query.orderCourseId,
        courseId: this.query.courseId,
        auditRemark: this.auditRemark
      }).then((res) => {
        this.loading = false
        if (res.status === 200) {
          this.$message({
            message: '课程解冻订单确认成功',
            type: 'success'
          })
          this.message = ''
          this.$router.push({ name: 'FinancialAudit' })
        } else {
          this.$message({
            message: '课程解冻订单确认失败',
            type: 'warning'
          })
        }
      })
    },
    // 订单退回
    orderReturn1 () {
      if (this.messageInfo(this.auditRemark)) {
        this.$confirm("退回后无法更改审核，需等待重新提交后可再次审核，请确认是否要退回？", '消息').then(() => {
          this.orderReturn();
        }).catch(() => { });
      } else {
        return false
      }
    },
    orderReturn () {
      this.falseLoading = true
      orderReturn({
        orderId: this.query.orderId,
        orderCourseId: this.query.orderCourseId,
        courseId: this.query.courseId,
        auditRemark: this.auditRemark
      }).then((res) => {
        this.falseLoading = false
        if (res.status == 200) {
          this.$message({
            message: '解冻订单退回成功',
            type: 'success'
          })
          this.$router.push({ name: 'FinancialAudit' })
          this.message = ''
        } else {
          this.$message({
            message: '解冻订单退回失败',
            type: 'warning'
          })
        }
        this.falseLoading = false
      })
    },
    switchStatus (stu) {
      var status = ''
      switch (stu) {
        case 201:
          status = '正常'
          break
        case 202:
          status = '已冻结'
          break
        case 203:
          status = '已退费'
          break
        case 204:
          status = '已转课'
          break
        case 205:
          status = '已关闭'
          break
        case 301:
          status = '冻结驳回'
          break
        case 302:
          status = '解冻驳回'
          break
        case 303:
          status = '退费驳回'
          break
        case 304:
          status = '转课驳回'
          break
      }
      return status
    }
  }
}
</script>
<style scoped>
.margin-20 {
  margin-top: 20px;
}
.el-message-box__header {
  background: #e6e6e6;
}
.el-message-box__title {
  text-align: center;
  font-size: 16px;
}
.el-message-box__content {
  margin: 10px 20px 0 0;
  text-align: center;
  line-height: 24px;
  font-weight: 700;
  font-size: 14px;
  color: #606266;
}
.el-message-box__btns {
  text-align: center;
}
</style>
