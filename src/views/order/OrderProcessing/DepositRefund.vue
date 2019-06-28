<!--
 * @author wufan
 * @date 2019/1/8
 * 退定金
-->
<template>
  <div class="app-container">
       <DialogContainer title="退定金" :visible.sync="depositRefundDialog" width="800px" :diglogClass="['']"> 
      <template slot="body">
      <div style="margin-bottom:10px" v-show="auditRemark">审核信息：{{auditRemark}}</div>
      <table :model="tableList" class="out">
        <tr>
          <td class="font-size-thick">订单号</td>
          <td>{{ tableList.orderNo }}</td>
          <td class="font-size-thick">当前状态</td>
          <td class="right">{{ tableList.orderStatus | orderStatus }}</td>
          <td class="font-size-thick">退费单号</td>
          <td>
            <el-input v-model="tableList.refundNo" clearable placeholder="请输入内容"/>
          </td>
        </tr>
        <tr>
          <td class="font-size-thick">可退金额</td>
          <td>{{ tableList.received }}</td>
          <td class="font-size-thick">退费金额</td>
          <td class="right">
            - <el-input v-model.number="tableList.totalAmount" style="width:80%" clearable placeholder="请输入内容"/> 元
          </td>
          <td class="font-size-thick">退费方式</td>
          <td>
            <el-select v-model="tableList.payTypeId" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.payTypeId"
                :label="item.payTypeName"
                :value="item.payTypeId"
              />
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="font-size-thick" width="40px">退费时间</td>
          <td>
            <el-date-picker v-model="operateDate" type="date" style="width:150px" placeholder="选择日期"/>
          </td>
          <td class="font-size-thick">退费人员</td>
          <td class="right">{{ tableList.oprationName }}</td>
          <td class="font-size-thick"/>
          <td/>
        </tr>
      </table>
      <el-row>
      <el-col style="text-align:center;margin:20px 0;">
        <el-button @click="depositRefundDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit(tableList)">确 定</el-button>
      </el-col>
      </el-row>
      </template>
       </DialogContainer>
  </div>
</template>
<script>
import orderDetailApi from '@/api/order/OrderDetailApi'

export default {
  name: 'DepositRefund', //订金退费弹窗
  props: {
    depositRefundDialogVisible: {
      type: Boolean,
      default: false
    },
    findOrderDetail: {
      type: Function
    }
  },
  filters: {
    orderStatus (val) {
      switch (val) {
        case 202:
          return '已交订金'
          break;
        case 502:
          return '已交订金'
          break;
        case 201:
          return '试听'
          break;
        case 501:
          return '试听'
          break;
        case 304:
          return '订金退费驳回'
          break;
        case 302:
          return '订金申请驳回'
          break;
      }
    }
  },
  data () {
    return {
      options: [
        {
          payTypeId: '',
          payTypeName: ''
        }
      ],
      auditRemark: '', //审核信息
      value: '',
      tableList: {
        orderNo: '',
        totalAmount: '',
        received: '',
        refundNo: '',
        operateTime: '',
        operateBy: '',
        oprationName: '',
        type:"",   
        payTypeId: null
      }, 
      
      operateDate: '',
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  computed: {
    //
    depositRefundDialog: {
      get: function () {
        return this.depositRefundDialogVisible
      },
      set: function (val) {
        this.$emit('update:depositRefundDialogVisible', val)
      }
    }
  },
  mounted () {
    this.getOrderPayTypeList()
  },
  methods: {
    //获取付款方式
    getOrderPayTypeList () {
      orderDetailApi.getOrderPayTypeList().then(response => {
        this.options = response.data
      })
    },
    //获取订金订单信息
    getList (params) {
      orderDetailApi.getList(params).then(response => {
        //驳回的情况 显示审核信息
        if (response.data.orderStatus === 304 || response.data.orderStatus === 302) {
          if(response.data.totalAmount != null || response.data.totalAmount != ""){
            response.data.totalAmount = Math.abs(response.data.totalAmount)
            console.log(response.data.totalAmount)
          }
          this.auditRemark = response.data.auditRemark
          this.tableList = response.data
           if(!this.tableList.received){
            this.tableList.received = this.tableList.received 
          }else {
           this.tableList.received  = this.tableList.received.toLocaleString()
          }
          this.tableList.type = params.type
          this.tableList.operateBy = JSON.parse(localStorage.states).user.userId
          this.tableList.oprationName = JSON.parse(localStorage.states).user.name
          this.operateDate = response.data.operateTime
        }
        //正常
        if (response.data.orderStatus === 202 || response.data.orderStatus === 502 || response.data.orderStatus === 201 || response.data.orderStatus === 501) {
          this.tableList = response.data
          this.auditRemark = response.data.auditRemark
          if(!this.tableList.received){
            this.tableList.received = this.tableList.received 
          }else {
           this.tableList.received  = this.tableList.received.toLocaleString()
          }
          this.tableList.operateBy = JSON.parse(localStorage.states).user.userId
          this.tableList.oprationName = JSON.parse(localStorage.states).user.name
          this.tableList.type = params.type
          this.operateDate = this.format(new Date())
        }
      })
    },
    // 确认提交操作
    submit (tableList) {
      if(this.insertInfoSure()){
      if (this.tableList.totalAmount > this.tableList.received.replace(/,/g,'')) {
        this.$tipsMessage("退费金额不能大于可退金额", "warning")
        return
      }
      // 定义数字正则匹配
      var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
      if (!reg.test(this.tableList.refundNo)) {
       this.$tipsMessage("退费单号请填写数字", "warning")
        return false
      }
      if (!reg.test(this.tableList.totalAmount)) {
        this.$tipsMessage("退费金额填写数字", "warning")
        return false
      }
      this.tableList.operateTime = this.format(new Date(this.operateDate))     
          orderDetailApi.save(this.tableList).then(res => {
        // 关闭弹窗
        this.depositRefundDialog = false
        this.creatClassList = {}
        if (res.data.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
           this.depositRefundDialog = false
            this.findOrderDetail()
        } else if(res.data.status === 500){
            this.$message({
            message: res.data.failMessage,
            type: 'warning'
          })
           this.depositRefundDialog = true
        } else {
          this.$message({
            message: "操作失败",
            type: 'warning'
          })
        }
      })
      }
    
    },
    // 过滤时间不足补0
    add0 (m) {
      return m < 10 ? '0' + m : m
    },
    // 过滤时间
    format (time) {
      // shijianchuo是整数，否则要parseInt转换
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      return y + '-' + this.add0(m) + '-' + this.add0(d)
    },
    insertInfoSure () {
      if (!this.tableList.refundNo) {
        this.$tipsMessage("请填写退费单号", "warning")
        return false
      }
      if (this.tableList.totalAmount == null || this.tableList.totalAmount == "") {
        this.$tipsMessage("请填写退费金额", "warning")
        return false
      }
      if (!this.tableList.payTypeId) {
        this.$tipsMessage("请选择退费方式", "warning")
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.el-dialog__header {
  background: green !important;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}
.el-dialog__header span {
  color: #fff;
}
.el-dialog__header button {
  padding: 0;
  top: 10px;
}
.el-dialog__header button i {
  color: #fff !important;
}
.el-dialog__body {
  padding-top: 10px;
}
.classTitle {
  padding-bottom: 10px;
}
 .font-size-thick{
  width: 80px;
  color: #606266;
  font-weight: 700;
}
.display{
  display: inline;
  width: 90px;
}
</style>
