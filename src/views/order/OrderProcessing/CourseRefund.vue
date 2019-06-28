<!--
 * @author jiakun
 * @date 2019/1/8
-->
<template>
  <div class="app-container">
     <Card-Container :paddingValue="10" :orderNo="$route.query.orderNo" title=""> 
      <template slot="body">
    <div v-if="offlineCourse.length != 0">
      <p class="font">班教课程</p>
      <div v-for="(item,index) in offlineCourse" :key="index">
        <el-table
          highlight-current-row
          border
          fit
          v-loading="listLoading"
          :data="item"
          stripe
          style="width: 100%;"
          class="table-top"
        >
          <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
          <el-table-column label="版本" align="center" prop="version" width="80"/>
          <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
          <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
          <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
          <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
          <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
            <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
          </el-table-column>
          <el-table-column label="退费金额" align="center" width="130">
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
          <el-table-column type="selection" align="center" :selectable="selectable">
          </el-table-column>
          <el-table-column label="课次" align="center">
            <template slot-scope="scope">
             第{{scope.row.attendanceNum}}次
            </template>
          </el-table-column>
          <el-table-column label="班级名称" align="center" prop="className" width="250"/>
          <el-table-column label="上课日期" align="center" prop="date"/>
          <el-table-column label="上课时段" align="center" prop="timeGap"/>
          <el-table-column label="上课老师" align="center" prop="teacherName"/>
          <el-table-column label="上课教室" align="center" prop="classroom"/>
        </el-table>
      </div>
    </div>
      <div v-if="resCourse.length != 0">
 <p class="font">录播、直播课程</p>
    <el-table highlight-current-row border fit stripe :data="resCourse" style="width: 100%;">
      <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
      <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
      <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
      <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
      <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
      <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
            <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
          </el-table-column>
      <el-table-column label="退费金额" align="center" width="130">
        <template slot-scope="scope">
        <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,2)"></Amount-Input>
        </template>
      </el-table-column>
    </el-table>
      </div>
        <div v-if="individualCourse.length != 0">
     <p class="font">在线个性化课程</p>
    <el-table highlight-current-row border fit stripe :data="individualCourse" style="width: 100%;">
      <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
      <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
      <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
      <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
      <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
     <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
            <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
          </el-table-column>
      <el-table-column label="退费金额" align="center" width="130">
        <template slot-scope="scope">
          <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,4)"></Amount-Input>
        </template>
      </el-table-column>
    </el-table>
        </div>
          <div v-if="nonSubjecCourse.length != 0">
     <p class="font">非学科课程</p>
    <el-table highlight-current-row border fit stripe :data="nonSubjecCourse" style="width: 100%;">
      <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
      <el-table-column label="课程名称" align="center" prop="courseName"  min-width="250"/>
      <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
      <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
      <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
      <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
     <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
            <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
          </el-table-column>
      <el-table-column label="退费金额" align="center" width="130">
        <template slot-scope="scope">
          <Amount-Input money="￥" minus="-" :amount.sync="scope.row.refundAmount" placeholder="请输入" clearable  style="width:100%"  @changeAmount="changeAmount(scope.row.refundAmount,scope.row.residueAmount,5)"></Amount-Input>
        </template>
      </el-table-column>
    </el-table>
          </div>
            <div v-if="otherCourse.length != 0">
     <p class="font">其他课程</p>
    <el-table highlight-current-row border fit stripe :data="otherCourse" style="width: 100%;">
      <el-table-column label="课程属性" align="center" prop="propertyName" width="100"/>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="250"/>
      <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
      <el-table-column label="课程状态" align="center" prop="statusName" width="100"/>
      <el-table-column label="开始日期" align="center" prop="startDate" width="100"/>
      <el-table-column label="结束日期" align="center" prop="endDate" width="100"/>
     <el-table-column label="剩余金额" align="center" prop="residueAmount" width="80">
            <template slot-scope="scope">{{scope.row.residueAmount | price}}</template>
          </el-table-column>
      <el-table-column label="退费金额" align="center" width="130">
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
    <div style="margin-bottom:10px" v-if="tableList.auditRemark">审核信息:{{tableList.auditRemark}}</div>
    <el-form :model="tableList" ref="CourseRefund" inline>
      
          <el-form-item label="操作人员" label-width="100px" style="width:220px">
            <span>{{tableList.oprationName}}</span>
          </el-form-item>
        
          <el-form-item label="销售人员" label-width="100px" style="width:260px">
            <span>{{tableList.salesUserName}}</span>
          </el-form-item>
  
          <el-form-item label="分成人员" label-width="100px" v-if="tableList.divideUserName" style="width:250px">
            <span>{{tableList.divideUserName}}</span>
          </el-form-item>
          <br/>
          <el-form-item label="退费单据号" required label-width="100px" style="width:220px">
            <el-input v-model.number="tableList.refundNo" clearable maxlength="20" placeholder="请输入" style="width:120px"/>
          </el-form-item>
      
          <el-form-item label="退费方式" required label-width="100px" style="width:260px">
            <el-select v-model="tableList.payTypeId" clearable  style="width:150px" placeholder="请选择">
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
              style="width:130px"
              placeholder="选择日期"
              v-model="tableList.operateTime"
              value-format="yyyy-MM-dd"
              clearable
            ></el-date-picker>
          </el-form-item>
          <br/>
          <el-form-item label="非常规退费" required label-width="100px" style="width:220px">
            <el-radio v-model="tableList.abnormalRefund" :label="1" @change="normalChange">是</el-radio>
            <el-radio v-model="tableList.abnormalRefund" :label="0" @change="normalChange">否</el-radio>
          </el-form-item>
    
          <el-form-item label="非常规退费金额" required label-width="130px" v-show="nonNormalRefundNOShow" style="width:260px">
            <Amount-Input money="￥" minus="-" :amount.sync="tableList.abnormalRefundAmount"  style="width:120px"   @changeAmount="abnormalRefundAmount(tableList.abnormalRefundAmount)"></Amount-Input>
          </el-form-item>
          <br/>
          <el-form-item label="非常规退费原因" label-width="130px" required v-show="nonNormalRefundNOShow">
            <el-input
              type="textarea"
              v-model="tableList.abnormalRefundCause"
              placeholder="请输入内容"
              style="width:355px"
              clearable
              maxlength="100"
            />
          </el-form-item>
          <br/>
          <el-form-item label="合计退费" label-width="100px" style="width:220px">
             <amount-input
            :amount.sync="parseFloat(tableList.totalAmount).toLocaleString()"
            money="￥"
            minus="-"
            class="width120"
            disabledFlag
          ></amount-input>
            <!-- <span>￥-{{this.tableList.totalAmount}}</span> -->
          </el-form-item>

    </el-form>
    <div slot="footer" class="footer">
      <el-button @click="$router.go(-1)">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
      </template>
      </Card-Container>
  </div>
</template>
<script>
import orderCourseApi from "@/api/order/OrderCourseApi";
import {
  findRefundCourse,
  updateRefundCourse
} from "@/api/order/RefundExamine";
import { getDepositInfo, refundOrder } from "@/api/order/OrderDetailApi";
// import BigNumber from "bignumber.js"
import { constants } from 'crypto';
export default {
  name: "CourseRefund", //订金退费页面
  components: {
    CourseRefundTable: () =>
      import("@/views/order/components/CourseRefund/index")
  },
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
      listTitle: [],
      listTitleOfContent: [],
      money: 0,
      offlineCourse: [], //班教
      resCourse: [], //录播，直播
      individualCourse: [], //个性化
      nonSubjecCourse: [], //非学科
      otherCourse: [], //其它
      listLoading: false,
      payType: [], //退费方式选择
      totleTimes: [], //合计课次的课程
      getAmount: 0,
      tableList: {
        orderId: parseInt(this.$route.query.orderId),//订单号
        operateBy: JSON.parse(localStorage.getItem("states")).user.userId,//操作人员
        oprationName: JSON.parse(localStorage.getItem("states")).user.name,
        courseRefundList: [{
          attendanceTypeIdList: [],//后端返回
          orderCourseId: 2585,
          refundCourseStatus:"",
          refundAmount: 500,//退费金额
          operateBy: 1,//操作人员id
           refundNum:[],
        }],
        // refundNum:[],
        isSubmission:true,
        refundNo: null, //退费单号
        totalAmount: 0, //合计金额
        frequency: 0, //合计课次
        payTypeId: null, //退费方式
        type: 1, //类型
        divideUserName:"",
        salesUserName:"",
        userName:"",
        returnsTime: null, //退费时间
        abnormalRefund: 1, //非常规退费
        abnormalRefundAmount: null, //非常规退费金额
        abnormalRefundCause: "", //非常规退费原因
        refundStatus: 1//可以随意，后端设定
      },
      nonNormalRefundNOShow: true,
      orderCourseIds: this.$store.state.fullStorage.CourseRefund,
      params: null //父组件传的值
    };
  },
  mounted () {
    this.getOrderPayTypeList();
    this.findRefundCourse();
  },
  methods: {
    //得到改变退费金额之后的数组
    changeAmount (val, residueAmount, index) {
      let money = 0;
      money += this.getTotleMoney(this.resCourse);
      money += this.getTotleMoney(this.individualCourse);
      money += this.getTotleMoney(this.nonSubjecCourse);
      money += this.getTotleMoney(this.otherCourse);
      for (let i = 0;i < this.offlineCourse.length;i++) {
        money += this.getTotleMoney(this.offlineCourse[i]);
      }
      this.money = Math.round(money*100)/100 ;
      let abnormalRefundAmount = this.tableList.abnormalRefundAmount

      // new BigNumber((Number(money) ? Number(money) : 0)).plus(( Number(this.tableList.abnormalRefundAmount) ? Number(this.tableList.abnormalRefundAmount) : 0 ));
      this.tableList.totalAmount =(Number(money) ? Number(money) : 0) + ( Number(abnormalRefundAmount) ? Number(abnormalRefundAmount) : 0 );
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
      //  console.log(moneyArr)
      let money = 0;
      for (let i = 0;i < moneyArr.length;i++) {
        //  new BigNumber(money).plus = Number(moneyArr[i].refundAmount) ? Number(moneyArr[i].refundAmount) : 0;
        money += Number(moneyArr[i].refundAmount) ? Number(moneyArr[i].refundAmount) : 0;
      }
      console.log(money)
      return money;
    },
     handleSelectionChange(val,index) {
       this.offlineCourse[index][0].refundNum = []
        for(var i=0;i<val.length; i++){
      this.offlineCourse[index][0].refundNum.push(val[i].attendanceNum)
        }
      },
    //调用接口，得到相关课程
    findRefundCourse () {
      findRefundCourse({
        orderCourseIds: this.orderCourseIds,
        orderId: this.$route.query.orderId,
      }).then(res => {
        if (res.status === 200) {
           this.tableList.salesUserName = res.data.salesUserName;
            this.tableList.divideUserName = res.data.divideUserName;
            this.tableList.userName = res.data.userName;
          // res.data = courseInfo
          let index = 0; //计算是第门课程
          for (var i = 0;i < res.data.length;i++) {
            res.data[i].residueAmount = res.data[
              i
            ].residueAmount;
            res.data[i].refundAmount = "";
            this.tableList.salesUserName = res.data[i].salesUserName;
            this.tableList.divideUserName = res.data[i].divideUserName;
            this.tableList.userName = res.data[i].userName;
            if (res.data[i].propertyId == 1) {
              for (let j = 0;j < res.data[i].offlnCourseNumDTOList.length;j++) {
                if(res.data[i].offlnCourseNumDTOList[j].attendanceNum == null){
                  res.data[i].offlnCourseNumDTOList = []
                }
              }
              this.offlineCourse.push([res.data[i]]);
            }
            if (res.data[i].propertyId == 2 || res.data[i].propertyId == 3) {
              res.data[i].propertyNameShow = "录播、直播课程：";
              this.resCourse.push(res.data[i]);
            }
            if (res.data[i].propertyId == 4) {
              res.data[i].propertyNameShow = "在线个性化课程：";
              this.individualCourse.push(res.data[i]);
            }
            if (res.data[i].propertyId == 5) {
              res.data[i].propertyNameShow = "非学科课程：";
              this.nonSubjecCourse.push(res.data[i]);
            }
            if (res.data[i].propertyId == 6) {
              res.data[i].propertyNameShow = "其他课程：";
              this.otherCourse.push(res.data[i]);
            }
          }
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    selectable (row, index) {
      if (row.attendanceTypeId == 1 || row.attendanceTypeId == 2 || row.attendanceTypeId == 3 || row.attendanceTypeId == 4 ) {
        return false
      } else {
        return true
      }
    },
    //非常规退费变化，合计金额变化
    abnormalRefundAmount (val) {
      let money = this.money
      this.tableList.totalAmount = (Number(Math.round(val*1000)/10000) ? Number(Math.round(val*1000)/1000) : 0) + (Number(Math.round(money*100)/100) ? Number(Math.round(money*100)/100) : 0) ;
      this.tableList.totalAmount = Number(Math.round((this.tableList.totalAmount)*100)/100)
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
      //复选框是否可以勾选
    selectable (row, index) {
      let date = new Date()
      let classDate = new Date(row.date + "T" + row.timeGap.replace(/-.+/, ":00"))
      if (row.attendanceTypeId == 1 || row.attendanceTypeId == 4 || row.attendanceTypeId == 3 || date.getTime() - classDate.getTime() > 0) {
        return false
      } else {
        return true
      }
    },
    // 确认提交操作
    submit (tableList) {
      if (this.insertInfoSure()) {
        //班教
        let courseRefundList = [], attendanceTypeIdList = [], refundNum = []
        try {
          for (let i = 0;i < this.offlineCourse.length;i++) {
          for (let j = 0;j < this.offlineCourse[i][0].offlnCourseNumDTOList.length;j++) {
            // if (this.offlineCourse[i][0].offlnCourseNumDTOList[j].istrue) {
              // attendanceTypeIdList.push(this.offlineCourse[i][0].offlnCourseNumDTOList[j].attendanceNum)
              // attendanceTypeIdList.push( refundNum.join())
            // }
          }
          courseRefundList.push({
            // attendanceTypeIdList:attendanceTypeIdList,
            orderCourseId: this.offlineCourse[i][0].orderCourseId,
            refundCourseStatus: this.offlineCourse[i][0].courseStatus,
            propertyName: this.offlineCourse[i][0].propertyName,
            refundAmount: this.offlineCourse[i][0].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
            refundNum: this.offlineCourse[i][0].refundNum &&　this.offlineCourse[i][0].refundNum.join(',')
          })
        }
        } catch (error) {
          console.error(error)
        }
        
        //录播/直播
        for (let i = 0;i < this.resCourse.length;i++) {
          courseRefundList.push({
            orderCourseId: this.resCourse[i].orderCourseId,
            refundCourseStatus: this.resCourse[i].courseStatus,
            propertyName: this.resCourse[i].propertyName,
            refundAmount: this.resCourse[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        //个性化
        for (let i = 0;i < this.individualCourse.length;i++) {
          courseRefundList.push({
            orderCourseId: this.individualCourse[i].orderCourseId,
            refundCourseStatus: this.individualCourse[i].courseStatus,
            propertyName: this.individualCourse[i].propertyName,
            refundAmount: this.individualCourse[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        //非学科
        for (let i = 0;i < this.nonSubjecCourse.length;i++) {
          courseRefundList.push({
            orderCourseId: this.nonSubjecCourse[i].orderCourseId,
            refundCourseStatus: this.nonSubjecCourse[i].courseStatus,
            propertyName: this.nonSubjecCourse[i].propertyName,
            refundAmount: this.nonSubjecCourse[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }
        //其他
        for (let i = 0;i < this.otherCourse.length;i++) {
          courseRefundList.push({
            orderCourseId: this.otherCourse[i].orderCourseId,
            refundCourseStatus: this.otherCourse[i].courseStatus,
            propertyName: this.otherCourse[i].propertyName,
            refundAmount: this.otherCourse[i].refundAmount,//退费金额
            operateBy: this.tableList.operateBy,//操作人员id
          })
        }

        orderCourseApi
          .save(Object.assign({}, this.tableList, { courseRefundList }))
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
    //退费方式
    getOrderPayTypeList () {
      orderCourseApi.getOrderPayTypeList().then(response => {
        this.payType = response.data;
      });
    },
    //判断条件
    insertInfoSure () {
       let reg = /^[0-9]*$ /;
      let refundNo = this.tableList.refundNo
      for (var i = 0;i < this.offlineCourse.length;i++) {
        if (this.offlineCourse[i][0].refundAmount == null || this.offlineCourse[i][0].refundAmount == "" ) {
          this.$tipsMessage("请输入班教课程退费金额", "warning");
          return false;
        }
        if (
          this.offlineCourse[i][0].refundAmount > this.offlineCourse[i][0].residueAmount
        ) {
          this.$tipsMessage("班教课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.resCourse.length;i++) {
        if (this.resCourse[i].refundAmount == null || this.resCourse[i].refundAmount == "" ) {
          this.$tipsMessage("请输入直播、录播课程退费金额", "warning");
          return false;
        }
        if (this.resCourse[i].refundAmount > this.resCourse[i].residueAmount) {
          this.$tipsMessage("直播、录播课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.individualCourse.length;i++) {
        let residueAmount = ""
        if (this.individualCourse[i].refundAmount == null || this.individualCourse[i].refundAmount == "" ) {
          this.$tipsMessage("请输入在线个性化课程退费金额", "warning");
          return false;
        }
        if (this.individualCourse[i].refundAmount > this.individualCourse[i].residueAmount) {
          this.$tipsMessage("在线个性化课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.nonSubjecCourse.length;i++) {
         let residueAmount = ""
        if (this.nonSubjecCourse[i].refundAmount == null || this.nonSubjecCourse[i].refundAmount == "" ) {
          this.$tipsMessage("请输入非学科课程退费金额", "warning");
          return false;
        }
        if (
          this.nonSubjecCourse[i].refundAmount > this.nonSubjecCourse[i].residueAmount
        ) {
          this.$tipsMessage("非学科课程退费金额不可大于剩余金额", "warning");
          return false;
        }
      }
      for (var i = 0;i < this.otherCourse.length;i++) {
        let residueAmount = ""
        if (this.otherCourse[i].refundAmount == null || this.otherCourse[i].refundAmount == "" ) {
          this.$tipsMessage("请输入其他课程退费金额", "warning");
          return false;
        }
        if (this.otherCourse[i].refundAmount > this.otherCourse[i].residueAmount) {
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
        this.$tipsMessage("请选择非常规退费金额", "warning");
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
    }
  },
  // watch: {
  //   offlineCourse: {
  //     deep: true,
  //     handler: function (val, oldVal) {
  //       this.tableList.frequency = 0
  //       for (let i = 0;i < this.offlineCourse.length;i++) {
  //         for (let j = 0;j < this.offlineCourse[i][0].offlnCourseNumDTOList.length;j++) {
  //           if (this.offlineCourse[i][0].offlnCourseNumDTOList[j].istrue) {
  //             this.tableList.frequency++
  //           }
  //         }
  //       }
  //     },
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.footer {
  margin-left: 40%;
}
.checkboxShow {
  display: flex;
  justify-content: center;
  align-items: center;
}
.font{
  display: block;
  font-size: 0.9em;
  -webkit-margin-before: 0.5em;
  -webkit-margin-after: 0.5em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
}
.table-top{
  margin-top: 10px;
}
.el-row {
  margin-bottom: 0;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 10px;
}
</style>
