/*
@author hongdengru
@date 2019/2/27
*/
<template>
  <div class="app-container">
 <Card-Container :paddingValue="10" :orderNo="$route.query.orderNo" title="">
      <template slot="body">
    <span class="span" label-width="80px">审核信息：{{tableList.auditRemark}}</span>
    <div v-if="listTitle.length != 0">
      <p class="font">班教课程</p>
      <div v-for="(item,index) in listTitle" :key="index">
        <el-table
          highlight-current-row
          border
          fit
          v-loading="listLoading"
          :data="listTitle[index]"
          stripe
          style="width: 100%;margin-top:10px;"
        >
          <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/> 
          <el-table-column label="版本" align="center" prop="version" width="80"/>
          <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
          <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
          <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
          <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
          <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.residueAmount|price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退费金额" width="130" align="center">
            <template slot-scope="scope">
               <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,1)"></Amount-Input>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          highlight-current-row
          border
          fit
          v-loading="listLoading"
          :data="item[0].offlnCourseNumDTOList"
          @selection-change="handleSelectionChange($event,index)"
          stripe
          empty-text="暂无分班信息"
          style="width: 100%;margin-top:5px;"
        >
          <el-table-column width="55" type="selection" align="center" :selectable="selectable">
          </el-table-column>
          <el-table-column label="课次" align="center">
            <template slot-scope="scope">第{{scope.row.attendanceNum}}次</template>
          </el-table-column>
          <el-table-column label="班级名称" align="center" prop="className" width="250"/>
          <el-table-column label="上课日期" align="center" prop="date"/>
          <el-table-column label="上课时段" align="center" prop="timeGap"/>
          <el-table-column label="上课老师" align="center" prop="teacherName"/>
          <el-table-column label="上课教室" align="center" prop="classroom"/>
        </el-table>
      </div>
    </div>
    <div v-if="this.listOne.length != 0">
      <p class="font">录播、直播课程</p>
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listOne"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
        <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
        <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
        <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
        <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
        <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.residueAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" width="130" align="center">
          <template slot-scope="scope">
             <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,2)"></Amount-Input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.listTwo.length != 0">
      <p class="font">在线个性化课程</p>
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listTwo"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
        <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
        <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
        <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
        <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
        <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.residueAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" width="130" align="center">
          <template slot-scope="scope">
             <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,4)"></Amount-Input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.listThree.length != 0">
      <p class="font">非学科课程</p>
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listThree"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
        <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
        <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
        <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
        <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
        <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.residueAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" width="130" align="center">
          <template slot-scope="scope">
             <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,5)"></Amount-Input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.listFour.length != 0">
      <p class="font">其他课程</p>
      <el-table
        highlight-current-row
        border
        fit
        stripe
        v-loading="listLoading"
        :data="listFour"
        style="width: 100%;"
      >
        <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
        <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
        <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
        <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
        <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
        <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
        <el-table-column label="剩余金额" align="center" prop="residueAmount"  width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.residueAmount|price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费金额" width="130" align="center">
          <template slot-scope="scope">
             <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,6)"></Amount-Input>
          </template>
        </el-table-column>
      </el-table>
    </div>
      </template>
 </Card-Container>
  <Card-Container :paddingValue="15">
      <template slot="body">
    <el-form :model="tableList" ref="CourseRefund" inline>
          <el-form-item label="操作人员" label-width="100px" style="width:220px">
            <span>{{tableList.userName}}</span>
          </el-form-item>
          <el-form-item label="销售人员" label-width="100px" style="width:260px">
            <span>{{tableList.salesUserName}}</span>
          </el-form-item>
          <el-form-item label="分成人员" label-width="100px" style="width:250px" v-if="this.tableList.divideUser">
            <span>{{tableList.divideUserName}}</span>
          </el-form-item>
          <br/>
          <el-form-item label="退费单据号" required label-width="100px" style="width:220px">
            <el-input v-model.number="tableList.refundNo" style="width:120px" maxlength="20" placeholder="请输入" clearable/>
          </el-form-item>
          <el-form-item label="退费方式" required label-width="100px" style="width:260px">
            <el-select v-model="tableList.payTypeId" clearable style="width:150px" placeholder="请选择">
              <el-option
                v-for="item in payType"
                :key="item.payTypeId"
                :label="item.payTypeName"
                :value="item.payTypeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="退费时间" label-width="100px" style="width:250px">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="tableList.operateTime"
              value-format="yyyy-MM-dd"
              clearable
              style="width:130px"
            ></el-date-picker>
          </el-form-item>
          <br/>
          <el-form-item label="非常规退费" required label-width="100px" style="width:220px">
            <el-radio v-model="tableList.abnormalRefund" :label="1" @change="normalChange">是</el-radio>
            <el-radio v-model="tableList.abnormalRefund" :label="0" @change="normalChange">否</el-radio>
          </el-form-item>
          <el-form-item label="非常规退费金额" label-width="120px" v-show="tableList.abnormalRefund" required style="width:260px">
            <Amount-Input money="￥" minus="-" :amount.sync="tableList.abnormalRefundAmount" clearable  style="width:130px"   @changeAmount="abnormalRefundAmount(tableList.abnormalRefundAmount)"></Amount-Input>
          </el-form-item>
          <br/>
          <el-form-item label="非常规退费原因" label-width="120px" v-show="tableList.abnormalRefund" required>
            <el-input
              type="textarea"
              v-model="tableList.abnormalRefundCause"
              placeholder="请输入内容"
              style="width:364px"
              clearable
              maxlength="100"
            />
          </el-form-item>
          <br/>
          <el-form-item label="合计金额" label-width="100px" style="width:220px">
            <amount-input
            :amount.sync="parseFloat(tableList.totalAmount).toLocaleString()"
            money="￥"
            minus="-"
            class="width120"
            disabledFlag
          ></amount-input>
          </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button @click="goBack">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确认</el-button>
    </div>
      </template>
  </Card-Container>
  </div>
</template>
<script>
import {
  findRefundCourseEdit,
  confirmOrder,
  orderReturn
} from "@/api/order/RefundExamineView";
// import StudentInfo from "@/views/order/components/StudentInfo";
import { payMoney } from "@/api/order/AddOnlineAuditionApi";
import orderCourseApi from "@/api/order/OrderCourseApi";
import { getDepositInfo, refundOrder } from "@/api/order/OrderDetailApi";
export default {
  name: "RefundExamine", //课程退费审核
  props: ["orderId"],
  // components: {
  //   StudentInfo,
  // },
  filters: {
    formatCourseStatus (val) {
      switch (val) {
        case 101:
          return "网课试听申请"
          break;
        case 102:
          return "订金订单申请"
          break;
        case 103:
          return "正式订单申请"
          break;
        case 104:
          return "订金退费申请"
          break;
        case 105:
          return "课程处理中"
          break;
        case 201:
          return "试听"
          break;
        case 202:
          return "已交订金"
          break;
        case 203:
          return "正常"
          break;
        case 204:
          return "已退订金"
          break;
        case 299:
          return "已结束"
          break;
        case 301:
          return "试听申请驳回"
          break;
        case 302:
          return "订金申请驳回"
          break;
        case 303:
          return "正式申请驳回"
          break;
        case 304:
          return "订金退费驳回"
          break;
        case 501:
          return "试听"
          break;
        case 502:
          return "已交订金"
          break;
        case 503:
          return "正常"
          break;
        case 504:
          return "已退订金"
          break;
        case 599:
          return "已结束"
          break;
      }
    }
  },
  data () {
    return {
      courseIdListByOfline: [],
      courseIdListAll: [],
      checkBox: true,
      loading: false, // 确认审核按钮
      falseLoading: false, // 退回审核按钮
      listTitle: [],
      accountNumber: null,
      bankName: null,
      accountName: null,
      invoiceNo: null,
      listTitleOfContent: [],
      money: 0,
      courseRefundList: [{
        attendanceTypeIdList: [1, 2],//后端返回
        orderCourseId: 2585,
        refundAmount: 500,//退费金额
        operateBy: 1,//操作人员id
        refundNum: '123'
      }],
      list: [], //班教
      lists: [], //班教每一个
      listOne: [], //直播、录播
      listTwo: [], //个性化
      listThree: [], //非学科
      listFour: [], //其他
      listLoading: false,
      payType: [], //退费方式选择
      getAmount: 0,
      tableList: {
        orderId: parseInt(this.$route.query.orderId),//订单号
        operateBy: JSON.parse(localStorage.getItem("states")).user.userId,//操作人员
        oprationName: JSON.parse(localStorage.getItem("states")).user.name,
        courseRefundList: [{
          attendanceTypeIdList: [1, 2],//后端返回
          orderCourseId: 2585,
          refundCourseStatus: "",
          refundAmount: 500,//退费金额
          operateBy: 1,//操作人员id
          refundNum: '123'
        }],
        refundNum: [],
        orderId: "",
        isSubmission: false,
        refundNo: null, //退费单号
        totalAmount: 0, //合计金额
        frequency: 0, //合计课次
        payTypeId: null, //退费方式
        type: 1, //类型
        returnsTime: null, //退费时间
        abnormalRefund: 1, //非常规退费
        abnormalRefundAmount: null, //非常规退费金额
        abnormalRefundCause: "", //非常规退费原因
        refundStatus: 1//可以随意，后端设定
      },
      nonNormalRefundNOShow: false,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      params: null //父组件传的值
    };
  },
  filters: {
    status (val) {
      if (val === 201) {
        return "正常";
      }
      if (val === 202) {
        return "已冻结";
      }
      if (val === 304) {
        return "退费驳回";
      }
    }
  },
  mounted () {
    this.getOrderPayTypeList();
    this.findRefundCourse();
  },
  methods: {
    handleSelectionChange (val,index) {
      this.listTitle[index][0].refundNum = []
        for(var i=0;i<val.length; i++){
      this.listTitle[index][0].refundNum.push(val[i].attendanceNum)
        }
    },
    selectable (row, index) {
      if (row.attendanceTypeId == 1 || row.attendanceTypeId == 2 || row.attendanceTypeId == 3 || row.attendanceTypeId == 4 ) {
        return false
      } else {
        return true
      }
    },
    changeAmount (val, residueAmount ,index) {
      let money = 0;
      money += this.getTotleMoney(this.listOne);
      money += this.getTotleMoney(this.listTwo);
      money += this.getTotleMoney(this.listThree);
      money += this.getTotleMoney(this.listFour);
      for (let i = 0;i < this.listTitle.length;i++) {
        money += this.getTotleMoney(this.listTitle[i]);
      }
      this.money = money;
      this.tableList.totalAmount = (Number(money) ? Number(money) : 0) + (Number(this.tableList.abnormalRefundAmount) ? Number(this.tableList.abnormalRefundAmount) : 0);
      this.tableList.totalAmount = Number(Math.round((this.tableList.totalAmount)*100)/100)
      switch (index) {
        case 1:
          if (val != Number(val)) {
            this.$tipsMessage('请输入数字', 'warning')
            return
          }
           if (val > residueAmount) {
            this.$tipsMessage('班教课程退费金额不可大于剩余金额', 'warning')
            return
          }
           if (val == null || val == "") {
            this.$tipsMessage('请输入班教课程退费金额', 'warning')
            return
          }
          break;
        case 2:
          if (val != Number(val)) {
            this.$tipsMessage('请输入数字', 'warning')
            return
          }
          if (val > residueAmount) {
            this.$tipsMessage('录播、直播课程退费金额不可大于剩余金额', 'warning')
            return
          }
           if (val == null || val == "") {
            this.$tipsMessage('请输入录播、直播课程退费金额', 'warning')
            return
          }
          break;
        case 4:
          if (val != Number(val)) {
            this.$tipsMessage('请输入数字', 'warning')
            return
          }
          if (val > residueAmount) {
            this.$tipsMessage('在线个性化课程退费金额不可大于剩余金额', 'warning')
            return
          }
           if (val == null || val == "") {
            this.$tipsMessage('请输入在线个性化课程退费金额', 'warning')
            return
          }
          break;
        case 5:
          if (val != Number(val)) {
            this.$tipsMessage('请输入数字', 'warning')
            return
          }
          if (val > residueAmount) {
            this.$tipsMessage('非学科课程退费金额不可大于剩余金额', 'warning')
            return
          }
           if (val == null || val == "") {
            this.$tipsMessage('请输入非学科课程退费金额', 'warning')
            return
          }
          break;
        case 6:
          if (val != Number(val)) {
            this.$tipsMessage('请输入数字', 'warning')
            return
          }
          if (val > residueAmount) {
            this.$tipsMessage('其他课程退费金额不可大于剩余金额', 'warning')
            return
          }
           if (val == null || val == "") {
            this.$tipsMessage('请输入其他课程退费金额', 'warning')
            return
          }
          break;
      }
    },

    //计算一个数组内的钱数
    getTotleMoney (moneyArr) {
      // console.log(moneyArr)
      let money = 0;
      for (let i = 0;i < moneyArr.length;i++) {
        // money += parseFloat(moneyArr[i].refundAmount);
        money += Number(moneyArr[i].refundAmount) ? Number(moneyArr[i].refundAmount) : 0;
      }
      return money;

    },
    abnormalRefundAmount (val) {
      let money = 0;
      money += this.getTotleMoney(this.listOne);
      money += this.getTotleMoney(this.listTwo);
      money += this.getTotleMoney(this.listThree);
      money += this.getTotleMoney(this.listFour);
      for (let i = 0;i < this.listTitle.length;i++) {
        money += this.getTotleMoney(this.listTitle[i]);
      }
      this.tableList.totalAmount = (Number(val) ? Number(val) : 0) + (Number(money) ? Number(money) : 0);
     this.tableList.totalAmount = Number(Math.round((this.tableList.totalAmount)*100)/100)
    },
    submit (tableList) {
      if (this.insertInfoSure()) {
        //班教
        let courseRefundList = [], attendanceTypeIdList = [], refundNum = []
        for (let i = 0;i < this.listTitle.length;i++) {
          for (let j = 0;j < this.listTitle[i][0].offlnCourseNumDTOList.length;j++) {
          }
          courseRefundList.push({
            // attendanceTypeIdList: this.tableList.refundNum,
            orderCourseId: this.listTitle[i][0].orderCourseId,
            refundAmount: this.listTitle[i][0].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
            refundCourseStatus: this.listTitle[i][0].courseStatus,
            propertyName: this.listTitle[i][0].propertyName,
            refundNum: this.listTitle[i][0].refundNum &&　this.listTitle[i][0].refundNum.join(',')
          })
        }
        //录播/直播
        for (let i = 0;i < this.listOne.length;i++) {

          courseRefundList.push({
            orderCourseId: this.listOne[i].orderCourseId,
            refundCourseStatus: this.listOne[i].courseStatus,
            propertyName: this.listOne[i].propertyName,
            refundAmount: this.listOne[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        //个性化
        for (let i = 0;i < this.listTwo.length;i++) {
          courseRefundList.push({
            orderCourseId: this.listTwo[i].orderCourseId,
            propertyName: this.listTwo[i].propertyName,
            refundCourseStatus: this.listTwo[i].courseStatus,
            refundAmount: this.listTwo[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        //非学科
        for (let i = 0;i < this.listThree.length;i++) {
          courseRefundList.push({
            orderCourseId: this.listThree[i].orderCourseId,
            propertyName: this.listThree[i].propertyName,
            refundCourseStatus: this.listThree[i].courseStatus,
            refundAmount: this.listThree[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        //其他
        for (let i = 0;i < this.listFour.length;i++) {
          courseRefundList.push({
            orderCourseId: this.listFour[i].orderCourseId,
            propertyName: this.listFour[i].propertyName,
            refundCourseStatus: this.listFour[i].courseStatus,
            refundAmount: this.listFour[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        // console.log(JSON.stringify(Object.assign({}, this.tableList, delete this.tableList.courseRefundResultDTOList, { courseRefundList })))
        // this.tableList = delete this.tableList.courseRefundResultDTOList
        orderCourseApi
          .save(Object.assign({}, this.tableList, delete this.tableList.courseRefundResultDTOList, { courseRefundList }))
          .then(res => {
            if (res.status === 200) {
              this.$tipsMessage("退费申请成功", "success");
              this.$router.push({
                path: '/OrderMgt/OrderDetail',
              })
            } else {
              this.$message({
                message: "退费失败，稍后重试",
                type: "warning"
              });
            }
          });
      }
    },
    // 确认审核
    goBack () {
      this.$router.go(-1);
    },
    renderHeader (h, { column, $index }) {
      return <div />;
    },
    selectTable () {
      return false;
    },
    findRefundCourse () {
      findRefundCourseEdit({
        orderNo: this.$route.query.orderNo //this.$route.query.orderId,
      })
        .then(res => {
          if (res.status === 200) {
            this.tableList = res.data;
            // console.log(this.tableList)
            if (this.tableList.abnormalRefundAmount != null || this.tableList.abnormalRefundAmount != "") {
              this.tableList.abnormalRefundAmount = Math.abs(this.tableList.abnormalRefundAmount)
            }
            this.tableList.isSubmission = false
            this.tableList.type = 1,
              this.tableList.orderId = res.data.courseRefundResultDTOList[0].orderId
            this.tableList.courseNum = 0;
            for (var i = 0;i < res.data.courseRefundResultDTOList.length;i++) {
              // res.data.courseRefundResultDTOList[i].amount = 0;
              // res.data.courseRefundResultDTOList[i].amount =
              //   res.data.courseRefundResultDTOList[i].totalPrice +
              //   res.data.courseRefundResultDTOList[i].refundAmount;
              // res.data.courseRefundResultDTOList[
              //   i
              // ].refundAmount = res.data.courseRefundResultDTOList[
              //   i
              // ].refundAmount;

              let listTitleArr = [res.data.courseRefundResultDTOList[i]];
              // if(res.data[i].courseRefundResultDTOList[j].attendanceNum == null){
              //     res.data[i].courseRefundResultDTOList = []
              //   }
              if (res.data.courseRefundResultDTOList[i].propertyId == 1) {
                // 组装班教表头(产品名称)
                this.courseIdListByOfline.push(listTitleArr[0].courseId);
                this.listTitle.push(listTitleArr);
                 if (res.data.courseRefundResultDTOList[i].refundAmount != null || res.data.courseRefundResultDTOList[i].refundAmount != "") {
                   res.data.courseRefundResultDTOList[i].refundAmount = Math.abs(res.data.courseRefundResultDTOList[i].refundAmount)
                  }
                // 可退费课次
                let listTitleOfContentArr =
                  res.data.courseRefundResultDTOList[i].offlnCourseNumDTOList;
                // 合计课次
                for (var j = 0;j < res.data.courseRefundResultDTOList[i].offlnCourseNumDTOList.length;j++) {

                  if (res.data.courseRefundResultDTOList[i].offlnCourseNumDTOList[j].attendanceNum == null) {
                    res.data.courseRefundResultDTOList[i].offlnCourseNumDTOList = []
                    // console.log(res.data.courseRefundResultDTOList[i].offlnCourseNumDTOList)
                  }

                }
                this.tableList.courseNum += listTitleOfContentArr.length;
                this.listTitleOfContent.push(listTitleOfContentArr);
              } else {
                this.courseIdListAll.push(listTitleArr[0].courseId);
              }
              if (
                res.data.courseRefundResultDTOList[i].propertyId === 2 ||
                res.data.courseRefundResultDTOList[i].propertyId === 3
              ) {
                this.listOne.push(res.data.courseRefundResultDTOList[i]);
                 for(let i = 0;i<this.listOne.length;i++){
                   if (this.listOne[i].refundAmount != null || this.listOne[i].refundAmount != "") {
                    this.listOne[i].refundAmount = Math.abs(this.listOne[i].refundAmount)
                  }
                }
              }
              if (res.data.courseRefundResultDTOList[i].propertyId == 4) {
                this.listTwo.push(res.data.courseRefundResultDTOList[i]);
                 for(let i = 0;i<this.listTwo.length;i++){
                   if (this.listTwo[i].refundAmount != null || this.listTwo[i].refundAmount != "") {
                    this.listTwo[i].refundAmount = Math.abs(this.listTwo[i].refundAmount)
                  }
                }
              }
              if (res.data.courseRefundResultDTOList[i].propertyId == 5) {
                this.listThree.push(res.data.courseRefundResultDTOList[i]);
                 for(let i = 0;i<this.listThree.length;i++){
                   if (this.listThree[i].refundAmount != null || this.listThree[i].refundAmount != "") {
                    this.listThree[i].refundAmount = Math.abs(this.listThree[i].refundAmount)
                  }
                }
              }
              if (res.data.courseRefundResultDTOList[i].propertyId == 6) {
                this.listFour.push(res.data.courseRefundResultDTOList[i]);
                 for(let i = 0;i<this.listFour.length;i++){
                   if (this.listFour[i].refundAmount != null || this.listFour[i].refundAmount != "") {
                    this.listFour[i].refundAmount = Math.abs(this.listFour[i].refundAmount)
                  }
                }
              }
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(() => { });
    },
    insertInfoSure () {
      for (var i = 0;i < this.listTitle.length;i++) {
        let totalPrice = this.listTitle[i][0].totalPrice + this.listTitle[i][0].refundAmount
        if (this.listTitle[i][0].refundAmount == null || this.listTitle[i][0].refundAmount == "") {
          this.$tipsMessage("请输入班教课程退费金额", "warning");
          return false;
        }
        if (
          this.listTitle[i][0].refundAmount > this.listTitle[i][0].residueAmount
        ) {
          this.$tipsMessage("班教课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.listOne.length;i++) {
        let totalPrice = this.listOne[i].totalPrice + this.listOne[i].refundAmount
        if (this.listOne[i].refundAmount == null || this.listOne[i].refundAmount == "") {
          this.$tipsMessage("请输入直播、录播课程退费金额", "warning");
          return false;
        }
        if (this.listOne[i].refundAmount > this.listOne[i].residueAmount) {
          this.$tipsMessage("直播、录播课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.listTwo.length;i++) {
        let totalPrice = this.listTwo[i].totalPrice + this.listTwo[i].refundAmount
        if (this.listTwo[i].refundAmount == null || this.listTwo[i].refundAmount == "") {
          this.$tipsMessage("请输入在线个性化课程退费金额", "warning");
          return false;
        }
        if (this.listTwo[i].refundAmount >  this.listTwo[i].residueAmount) {
          this.$tipsMessage("在线个性化课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.listThree.length;i++) {
        let totalPrice = this.listThree[i].totalPrice + this.listThree[i].refundAmount
        if (this.listThree[i].refundAmount == null || this.listThree[i].refundAmount == "") {
          this.$tipsMessage("请输入非学科课程退费金额", "warning");
          return false;
        }
        // console.log(this.listThree[i].amount)
        if (
          this.listThree[i].refundAmount > this.listThree[i].residueAmount
        ) {
          this.$tipsMessage("非学科课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.listFour.length;i++) {
        if (this.listFour[i].refundAmount == null || this.listFour[i].refundAmount == "") {
          this.$tipsMessage("请输入其他课程退费金额", "warning");
          return false;
        }
        if (this.listFour[i].refundAmount > this.listFour[i].residueAmount) {
          this.$tipsMessage("其他课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      if (!this.tableList.refundNo) {
        this.$tipsMessage("请填写单据号", "warning");
        return false;
      }
       if (this.tableList.refundNo != Number(this.tableList.refundNo)) {
        this.$tipsMessage("单据号请输入正确的数字", "warning");
        return false;
      }
      if (!this.tableList.payTypeId) {
        this.$tipsMessage("请选择退费方式", "warning");
        return false;
      }
      if (
        this.tableList.abnormalRefund == 1 &&
        !this.tableList.abnormalRefundAmount
      ) {
        this.$tipsMessage("请选择非常规退费", "warning");
        return false;
      }
      if(this.tableList.abnormalRefundAmount &&  this.tableList.abnormalRefundAmount != Number(this.tableList.abnormalRefundAmount)){
          this.$tipsMessage("非常规退费金额请输入数字", "warning");
            return false;  
      }
      if (
        this.tableList.abnormalRefund == 1 &&
        !this.tableList.abnormalRefundCause
      ) {
        this.$tipsMessage("请填写非常规退费原因", "warning");
        return false;
      }
      return true;
    },
    //选择非常规退费与否
    normalChange (val) {
      if (val == 1) {
        this.nonNormalRefundNOShow = true;
        this.tableList.abnormalRefundAmount = "";
        this.tableList.abnormalRefundCause = "";
      } else {
        this.nonNormalRefundNOShow = false;
        this.tableList.abnormalRefundAmount = "";
        this.tableList.abnormalRefundCause = "";
        this.tableList.totalAmount = 0;
        this.changeAmount()
      }
    },
    // 确认提交操作
    //退费方式
    getOrderPayTypeList () {
      orderCourseApi.getOrderPayTypeList().then(response => {
        this.payType = response.data;
      });
    },
    //格式化时间
    format () {
      let date = new Date();
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //判断条件
  }
};
</script>
<style scoped>
.el-dialog__header {
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
td {
  /* border: 1px solid #000; */
  border-collapse: collapse;
  width: 900px;
  height: 40px;
}
.top {
  margin-top: -20px !important;
}
.font {
  font-size: 14px;
}
.el-row {
  margin-bottom: 0;
}
.font{
  display: block;
  font-size: 0.9em;
  -webkit-margin-before: 0.5em;
  -webkit-margin-after: 0.5em;
  -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
}
.footer {
  margin-left: 40%;
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
.span {
 font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 10px;
}
</style>
