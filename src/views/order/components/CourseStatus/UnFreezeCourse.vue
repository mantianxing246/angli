<template>
   <DialogContainer title="课程解冻" :visible.sync="courseDialog" width="75%" :diglogClass="['rec-live-course']"> 
      <template slot="body">
    <div style="margin-bottom:10px" v-show="auditRemark.auditRemark">审核信息:{{auditRemark.auditRemark}}</div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="courseName" label="课程" align="center" min-width="310"/>
      <!-- <el-table-column prop="freezeAmount" label="冻结金额" align="center"/> -->
      <el-table-column prop="courseStatus" label="课程状态" align="center">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.courseStatus | formatCourseStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="freezeNo" label="解冻单据号" min-width="200" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.freezeNo" clearable/>
        </template>
      </el-table-column>
      <el-table-column label="解冻金额" align="center">
          <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
      </el-table-column>
      <el-table-column label="解冻时间" min-width="140" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.operateTime"
            type="date"
            value-format="yyyy-MM-dd"
            style="width:130px"
            placeholder="选择日期"
          ></el-date-picker>
        </template>
      </el-table-column>
      <el-table-column able-column prop="oprationName" align="center" label="操作人员">
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
import { getUnFreezeCourse, updateUnFreezeCourse ,queryOrderCourseById} from '@/api/order/OrderCourseApi'
export default {
  name: 'UnFreezeCourse', //解冻课程页面
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
      oprationName: JSON.parse(localStorage.getItem('states')).user.name,
      auditRemark: {
        operateTime: "",
        auditRemark: ''
      }, //审核信息
      // 课程信息
      tableData: []
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
      }
    }
  },
  mounted () {
  },
  methods: {
    //过滤时间不足补0
    add0 (m) {
      return m < 10 ? '0' + m : m;
    },
    //过滤时间
    format (time) {
      //shijianchuo是整数，否则要parseInt转换 
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + '-' + this.add0(m) + '-' + this.add0(d);
    },
    // 获取解冻的课程信息
    getUnFreezeCourse (params) {
      if( params.courseStatus === 202 ){
          queryOrderCourseById(params).then(res => {
        // console.log(res)
        if (res.status == 200) {
            res.data.freezeNo = null
            res.data.operateTime = this.format(new Date())
            res.data.unFreezeBy = JSON.parse(localStorage.states).user.userId
          this.tableData = []
          this.tableData.push(res.data)
          this.tableData[0].freezeBy = res.data.operateBy
          this.tableData[0].residueAmount = res.data.freezeAmount
          this.tableData[0].unFreezeBy = JSON.parse(localStorage.states).user.userId
          this.tableData[0].oprationName = JSON.parse(localStorage.states).user.name
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        // console.log(err)
      })
    }else{
          getUnFreezeCourse(params).then(res => {
        // console.log(res)
        if (res.status == 200) {
           this.auditRemark.auditRemark = res.data.auditRemark
            res.data.freezeNo = null
            res.data.operateTime = this.format(new Date())
            res.data.unFreezeBy = JSON.parse(localStorage.states).user.userId
          this.tableData = []
          this.tableData.push(res.data)
          this.tableData[0].freezeBy = res.data.operateBy
          this.tableData[0].residueAmount = res.data.freezeAmount
          this.tableData[0].unFreezeBy = JSON.parse(localStorage.states).user.userId
          this.tableData[0].oprationName = JSON.parse(localStorage.states).user.name
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        // console.log(err)
      })
    }
  },
    // 确认操作
    confirm () {
      if (this.tableData[0].freezeNo != Number(this.tableData[0].freezeNo)) {
        this.$notify({
          title: '提示',
          message: '请输入正确的冻结单据号,必须是数字！',
          type: 'warning'
        })
        return false
      }
      var params = {
        id: this.tableData[0].orderCourseId,
        orderCourseId: this.tableData[0].orderCourseId,
        orderId: this.tableData[0].orderId,
        operateBy: this.tableData[0].unFreezeBy,
        operateTime: this.tableData[0].operateTime,
        freezeAmount: this.tableData[0].residueAmount,
        freezeNo: this.tableData[0].freezeNo,
        courseStatus: this.tableData[0].courseStatus
      }
      updateUnFreezeCourse(params).then(res => {
        if (res.status == 200) {
          this.$message({
            message: '解冻申请',
            type: 'success'
          })
          this.courseDialog = false
          this.findOrderDetail()
        } else {
          this.$message({
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
