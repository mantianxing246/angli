/*
@author hongdengru
@date 2019/1/21
*/
<template>
  <div class="app-container top">
    <student-info :student-id="receivePara.studentId"/>
     <Card-Container :paddingValue="10">
      <template slot="body">
        <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column label="历史试听和已报名网课列表">
        <el-table-column
          prop="orderNo"
          label="订单号">
        </el-table-column>
         <el-table-column
          prop="propertyName"
          label="课程属性">
        </el-table-column>
        <el-table-column
          prop="courseName"
          min-width="310"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="beginDate"
          label="开始日期">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束日期">
        </el-table-column>
      <!-- </el-table-column> -->
    </el-table-column>
  </el-table>
      </template>
     </Card-Container>
     <Card-Container :paddingValue="10">
      <template slot="body">
    <div v-show="showAuditRemark" class="style">审核信息：{{auditRemark}}</div>
    <el-row>
      <el-col>
        <el-form inline>
          <el-form-item class="bottom">
            <el-select v-model="form.provinceId" clearable placeholder="省市" class="width80">
              <el-option
                v-for="item in headInfo.provinces"
                :value="item.provinceId"
                :key="item.provinceId"
                :label="item.provinceName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-select v-model="form.gradeId" clearable placeholder="年级" class="width120">
              <el-option
                v-for="item in headInfo.grades"
                :value="item.gradeId"
                :key="item.gradeId"
                :label="item.gradeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-select v-model="form.version" clearable placeholder="版本" class="width80">
              <el-option v-for="item in headInfo.versions" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bottom">
            <el-button
              type="primary"
              @click.stop="getCourseList"
              icon="el-icon-search"
              :loading="searchLoading"
            >查询</el-button>
          </el-form-item>
          <br>
          <el-form-item class="bottom">
            <el-checkbox-group v-model="form.subjectId" >
              <el-checkbox
                v-for="item in headInfo.subjects"
                :label="item.subjectId"
                :key="item.subjectId"
                :value="item.subjectName"
              >{{item.subjectName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          v-loading="listLoading"
          :data="list"
          highlight-current-row
          border
          fit
          stripe
          @selection-change="changeSelect"
          style="width: 100%"
        >
          <el-table-column type="selection" align="center"/>
          <el-table-column label="课程类型" align="center" prop="courseType"/>
           <el-table-column label="课程作用" align="center" prop="courseFunctionName"/>
          <el-table-column label="可选试听课程" align="center" prop="courseName" min-width="250"/>
          <el-table-column label="版本" align="center" prop="version"/>
          <el-table-column label="年级" align="center" prop="gradeName"/>
          <el-table-column label="学科" align="center" prop="subjectName"/>
        </el-table>
      </el-col>
      <el-col class="center">
        <el-button type="primary" @click="addCourseList" icon="el-icon-shopping-cart-full">加入课程列表</el-button>
      </el-col>
    </el-row>
    <!-- 已选课程列表 -->
    <el-row style="margin-top:10px">
      <el-col>
        <el-table
          :data="selectedCourseList"
          highlight-current-row
          border
          fit
          stripe
          style="width: 100%;"
          align="center"
        >
          <el-table-column label="已选课程列表" align="center">
            <el-table-column align="center" label="报名课程" prop="courseName" width="400px"/>
            <el-table-column align="center" label="试听开始日期">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.startDate"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width:80%;"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="试听结束日期">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.endDate"
                  type="date"
                  clearable
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width:80%;"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="90">
              <template slot-scope="scope">
                <el-button type="primary" @click="deleteSelected(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
      </template>
     </Card-Container>

      <Card-Container :paddingValue="15">
      <template slot="body">
    <el-form
      :model="orderForm"
      ref="orderForm"
      :rules="rules"
      inline
    >
   
          <el-form-item label="申请单号" prop="orderAudition.auditionNo"  label-width="85px" class="margin">
            <el-input v-model="orderForm.orderAudition.auditionNo" placeholder="请输入" @input="createNormalOrderChange(orderForm.orderAudition.auditionNo,'申请单号')" maxlength="50" clearable style="width:200px"/>
          </el-form-item>
        
        
          <el-form-item label="开单人员" prop="createUserName"  label-width="85px" class="margin">
            <span style="display:inline-block;width:200px">{{createUserName}}</span>
          </el-form-item>
       
          <el-form-item label="是否续报" prop="orderMarketing.isContinuous"  label-width="100px" class="margin">
            <el-radio-group v-model="orderForm.orderMarketing.isContinuous" @change="changeType" style="width:200px">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <br/>
          <el-form-item label="省市" prop="orderMarketing.provinceId"  label-width="85px" class="margin">
            <el-select
              v-model="orderForm.orderMarketing.provinceId"
              placeholder="请选择"
              style="width:200px"
              clearable
              @change="getSourceType();changeIsContinuous()"
            >
              <el-option
                v-for="provinces in provinces"
                :key="provinces.provinceId"
                :label="provinces.provinceName"
                :value="provinces.provinceId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收入类别"
            label-width="85px"
            class="margin"
            prop="sourceType"
            :rules="[
      { required: sourceTypeIsTrue(orderForm.orderMarketing.isContinuous,orderForm.orderMarketing.provinceId), trigger: 'blur'}
    ]"
          >
            <el-select
              v-model="orderForm.orderMarketing.sourceType"
              placeholder="请选择"
             style="width:200px"
              clearable
              @change="getMarketTypes();changeIsContinuous1()"
            >
              <el-option
                :value="sourceTypes.id"
                :label="sourceTypes.typeName"
                v-for="sourceTypes in  changeIsContinuousLink(selectInfo.sourceTypes,orderForm.orderMarketing.isContinuous,orderForm.orderMarketing.provinceId)"
                :key="sourceTypes.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="市场手段"
            label-width="100px"
            class="margin"
            prop="marketType"
            :rules="[
     { required: marketTypeisTrue(orderForm.orderMarketing.isContinuous,orderForm.orderMarketing.provinceId), trigger: 'blur'}
    ]"
          >
            <el-select
              v-model="orderForm.orderMarketing.marketType"
              placeholder="请选择"
              clearable
             style="width:200px"
            >
              <el-option
                :value="marketTypes.id"
                :label="marketTypes.typeName"
                v-for="marketTypes in marketTypes"
                :key="marketTypes.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报名场合" prop="orderMarketing.registerType"  label-width="85px" class="margin">
            <el-select
              v-model="orderForm.orderMarketing.registerType"
              placeholder="请选择"
              clearable
              style="width:200px"
            >
              <el-option
                :value="registerTypes.id"
                :label="registerTypes.typeName"
                v-for="registerTypes in selectInfo.registerTypes"
                :key="registerTypes.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="0元试听" prop="orderAudition.isZeroPay"  label-width="85px" class="margin">
            <el-radio-group v-model="orderForm.orderAudition.isZeroPay" @change="changeZeroPay" style="width:200px">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="0元试听原因" label-width="100px" prop="orderAudition.zeroPayCause" v-show="orderForm.orderAudition.isZeroPay">
            <el-select
              v-model="orderForm.orderAudition.zeroPayCause"
              clearable
              placeholder="请选择"
              style="width:200px"
            >
              <el-option
                v-for="item in selectInfo.zeroPayCauses"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <br v-if="orderForm.orderAudition.isZeroPay === 0"/>
          <el-form-item label="付费方式" prop="orderMoney.payTypeId" class="margin" label-width="85px" v-if="orderForm.orderAudition.isZeroPay === 0">
            <el-select
            @change="createNormalOrderChange(orderForm.orderMoney.payTypeId,'付费方式')"
              v-model="orderForm.orderMoney.payTypeId"
              clearable
              placeholder="请选择"
              style="width:200px"
            >
              <el-option
                v-for="item in selectInfo.payTypes"
                :key="item.payTypeId"
                :label="item.payTypeName"
                :value="item.payTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付金额" prop="orderMoney.received" class="margin" label-width="85px" v-if="orderForm.orderAudition.isZeroPay === 0">
            <Amount-Input money="￥" :amount.sync="orderForm.orderMoney.received" maxlength="10" placeholder="请输入" clearable  style="width:200px"  @input="createNormalOrderChange(orderForm.orderMoney.received,'支付金额')"></Amount-Input>
            <!-- <el-input v-model="orderForm.orderMoney.received" clearable maxlength="10" placeholder="请输入" @input="createNormalOrderChange(orderForm.orderMoney.received,'支付金额')" style="width:200px"/> -->
          </el-form-item>
          <el-form-item label="付费日期" prop="orderMoney.paymentDate" class="margin" label-width="100px" v-if="orderForm.orderAudition.isZeroPay === 0">
            <el-date-picker
              v-model="orderForm.orderMoney.paymentDate"
              type="date"
              clearable
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="终端号" prop="orderMoney.terminalNo" class="margin" label-width="85px" v-if="terminalAndbankCardAndorderIsTrue(orderForm.orderMoney.payTypeId)==1||terminalAndbankCardAndorderIsTrue(orderForm.orderMoney.payTypeId)==2">
            <el-select
              v-model="orderForm.orderMoney.terminalNo"
              clearable
               @input="createNormalOrderChange(orderForm.orderMoney.terminalNo,'端口号')"
              placeholder="请选择"
              style="width:200px"
            >
             <el-option
                  v-for="(item,index) in  TerminalInfo"
                  :key="index"
                  :label="item.ChargeMannerName"
                  :value="item.TerminalCode"
                ></el-option>
            </el-select>
          </el-form-item>
    
          <el-form-item label="订单号" prop="orderMoney.payNo" class="margin" label-width="85px" v-if="terminalAndbankCardAndorderIsTrue(orderForm.orderMoney.payTypeId)==2||terminalAndbankCardAndorderIsTrue(orderForm.orderMoney.payTypeId)==3">
            <el-input v-model="orderForm.orderMoney.payNo" clearable maxlength="20" placeholder="请输入" @input="createNormalOrderChange(orderForm.orderMoney.payNo,'订单号')" style="width:200px"/>
          </el-form-item>
    
           <el-form-item label="银行卡号" prop="orderMoney.bankCardNo" class="margin" label-width="85px" v-if="terminalAndbankCardAndorderIsTrue(orderForm.orderMoney.payTypeId)==1">
            <el-input v-model="orderForm.orderMoney.bankCardNo" clearable maxlength="23"  @input="createNormalOrderChange(orderForm.orderMoney.bankCardNo,'银行卡号')" placeholder="请输入" style="width:200px"/>
          </el-form-item>
          <br/>
          <el-form-item label="备注信息" label-width="85px" class="margin">
            <el-input type="textarea" placeholder="请输入" rows="3" v-model="orderForm.remark" maxlength="100" style="width:815px"></el-input>
          </el-form-item>
      <br/>
      <el-form-item align="center" style="width:100%" class="margin0">
        <router-link to="/OrderMgt/StudentOrderDeal" style="margin-right:10px;">
          <el-button>取消</el-button>
        </router-link>
        <el-button type="primary" @click="addOnlineCourse(1)">提交</el-button>
        <el-button type="primary" @click="addOnlineCourse(0)">暂存</el-button>
      </el-form-item>
    </el-form>
      </template>
      </Card-Container>
  </div>
</template>
<script>
import { getCourseList, addOnlineCourse } from '@/api/order/AddOnlineAuditionApi.js'
import { findProductByOrder, getSelectProductParam , findHistoryCourse,getTerminalInfo } from '@/api/order/FullOrder.js'
import StudentInfo from '@/views/order/components/StudentInfo'
import { getHeadInfo, findSourceType, findMarketType } from '@/api/components/HeadInfoApi'
import { getHeadInfo as getSelectInfo } from '@/api/order/HeadInfoApi' //市场手段
import { findStudent } from '@/api/order/StudentApi'
import { provinces } from '@/CourseType/OverallExplanation'
import changeIsContinuousLink from "@/components/select/changeIsContinuousLink";
import { sourceTypeIsTrue, marketTypeisTrue } from '@/components/select/SourceTypes'
import { constants } from 'crypto';
import { getPayTypeName } from '@/views/order/FullOrderFunction/FullOrder.js'
export default {
  name: 'AddOnlineAudition', //新增试听订单
  props: ['studentId'],
  components: {
    StudentInfo
  },
  mixins: [changeIsContinuousLink, sourceTypeIsTrue, marketTypeisTrue],
  data: function () {
    return {
      showAuditRemark: false, //是否显示审核信息
      auditRemark: '', //审核信息
      searchLoading: false,
      headInfo: {
        provinces: null,
        grades: null
      },
      tableData:[],
      selectInfo: {
        registerTypes: [],//报名场合
        sourceTypes: [],//收入类别
        payTypes: [], //付费方式
        zeroPayCauses: []
      },
      marketTypes: [],//市场手段 
      provinces: [],
      sourceTypes: [],//收入类别
      payTypes: [], //付费方式
      receivePara: this.$route.query, //
      form: {
        provinceId: '', // 省市
        gradeId: '', // 课程年级
        subjectId: [], // 学科
        version: ""
      },
      list: [], // 可选试听课程
      listLoading: false,  //查询列表loading
      createUserName: JSON.parse(localStorage.states).user.name, //登录人
      multipleSelection: [], //选中的课程发生变化
      selectedCourseList: [], //选中在课程列表 
      orderForm: {
        studentId: this.$route.query.studentId,
        createUser: JSON.parse(localStorage.states).user.userId, //默认开单人员为登录人
        rejectionId: "",
        orderMarketing: {
          isContinuous: 1, //是否续保，0否，1是
          sourceType: null, //收入类别
          provinceId: null,
          marketType: null, //市场手段
          registerType: null, //报名场合
        },
        orderAudition: {
          auditionNo: '', //申请单号
          isZeroPay: 1, //是否为0元试听;1：是; 0:不是
          zeroPayCause: '', //0元试听原因 isZeroPay为1 时必须提交
          days: "", //试听天数
          confirmBy: "" //延长试听确认人Id
        },
        orderMoney: {
          payTypeId: null, //付费方式
          received: null, //实收金额
          paymentDate: '', //付款日期
          terminal:null,
          terminalNo:null,//终端号
          payNo:null,//订单号
          bankCardNo:null//银行卡号
        },
       TerminalInfo: [],//终端号
        courseInfoList: [],
        remark: '', // 备注信息
        year: null ,// 上面页面传递来的高考年份
      },
      rules: {
        'orderAudition.auditionNo': [
           { required: true, message: '请输入申请单号', trigger: 'blur' },
          {  validator (rules, val, callback) {
            if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
              callback(new Error("请输入数字"))
            } else {
              callback()
            }
          }},
          { min: 3, max: 30, message: '长度在 3 到 30 个字符' }
        ],
        'orderMarketing.isContinuous': [
          { required: true, message: '请选择是否续报', trigger: 'blur' }
        ],
        'orderMoney.payTypeId': [
          { required: true, message: '请选择付费方式', trigger: 'blur' }
        ],
        "orderMoney.received": [
          { required: true, message: '请选择支付金额', trigger: "blur" },
        ],
        'orderMoney.paymentDate': [
          { required: true, message: '请选择付费日期', trigger: 'blur' }
        ],
         'orderMoney.terminalNo': [
          { required: true, message: '请选择终端号', trigger: 'blur' }
        ],
        "orderMoney.payNo": [
           { required: true, message: '请输入订单号', trigger: 'blur' },
          {  validator (rules, val, callback) {
            if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
              callback(new Error("请输入数字"))
            } else {
              callback()
            }
          }},
        ],
        'orderMoney.bankCardNo': [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
        ],
        'orderMarketing.provinceId': [
          { required: true, message: '请选择省市', trigger: 'blur' }
        ],
        'orderMarketing.registerType': [
          { required: true, message: '请选择报名场合', trigger: 'blur' }
        ],
        'orderAudition.isZeroPay': [
          { required: true, message: '请选择是否0元试听', trigger: 'blur' }
        ],
        'orderAudition.zeroPayCause': [
          { required: true, message: '0元试听原因', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getHeadInfo() // 查询高考年份、学科等   
    this.getSelectInfo() //查询收入类别、市场手段   
    this.getOnlineCourse()
    this.findHistoryCourse()
    this.getTerminalInfo()
    this.year = this.$route.query.year
    
  },
   watch: {
    ['orderForm.orderMoney.bankCardNo'] (val) {
      this.$nextTick(() => {
         this.orderForm.orderMoney.bankCardNo = val.replace(/\s/g, '').replace(/([\d|\*]{4})(?=[\d|\*])/g, "$1 ")
      });
    }
  },
  methods: {
    getTerminalInfo () {
      let userId = JSON.parse(localStorage.states).user.userId
      getTerminalInfo(userId).then((res) => {
        this.TerminalInfo = res.data
      })
    },
    createNormalOrderChange (val, type) {
      //index第几个付费方式
      let reg1 = /^[0-9]*$ /;
      let reg = this.numValidator;
      if ( type == '银行卡号' || type == '订单号' || type == '申请单号') {
        if (reg1.test(val)) {
          this.$tipsMessage("不能输入汉字", "warning")
          // this.$emit("update:isPass", false);
          return;
        } 
      }
     
      if (type == '付费方式') {
        //index表示第几个
        this.orderForm.orderMoney.terminalNo = null
        this.orderForm.orderMoney.payNo = null
        this.orderForm.orderMoney.bankCardNo = null
      }

      // // this.$emit("update:isPass", true);
      // this.$emit("update:listQuery", this.listQuery);
    },
    findHistoryCourse(){
       findHistoryCourse(this.$route.query.studentId).then(res => {
          if (res.status == 200) {
            this.tableData = res.data            
          }else{
          }
      })
    },
    getSelectProductParam () {
      getSelectProductParam(this.year).then(res => {
        this.headInfo.grades = Object.assign({}, res.data.grades)
      })
    },
    terminalAndbankCardAndorderIsTrue (payTypeId) {
      if (getPayTypeName(payTypeId) == '银行卡') {
        return 1
      }
      if (getPayTypeName(payTypeId) == '支付宝' ||
        getPayTypeName(payTypeId) == '微信' ||
        getPayTypeName(payTypeId) == '银联商务-支付宝' ||
        getPayTypeName(payTypeId) == '银联商务-微信'
      ) {
        return 2
      }
      if (getPayTypeName(payTypeId) == '支付宝在线支付') {
        return 3
      }
    },
    changeZeroPay (val) {
      if (val === 1) {
        this.orderForm.orderMoney.payTypeId = null
        this.orderForm.orderMoney.paymentDate = ''
        this.orderForm.orderMoney.received = null
      }

      if (val === 0) {
        this.orderForm.orderAudition.zeroPayCause = ''
      }
    },
    getSelectInfo () {
      getSelectInfo().then(res => {
        if (res.status === 200) {
          this.selectInfo.payTypes = res.data.payTypes
          this.selectInfo.zeroPayCauses = ['连报','换课','换单','政策原因', '公司送课', '集团送课', '优惠送课', '投诉送课', '其他','试听']
          this.provinces = provinces
        }
      })
    },
    //通过省市得到收入类别/报名场合
    getSourceType (val) {
      this.clearSourceType()
      if (val == "") {
        let isContinuous = this.orderForm.orderMarketing.isContinuous;
        this.orderForm.orderMarketing.isContinuous = isContinuous;
        this.selectInfo.zeroPayCauses = ['连报','换课','换单','政策原因', '公司送课', '集团送课', '优惠送课', '投诉送课', '其他','试听']
        this.selectInfo = {
          registerTypes: [], //报名场合
          sourceTypes: [] //收入类别
        };
        this.marketTypes = []; //报名手段
      }
      if (val) {
        this.selectInfo.sourceTypes = [];
        this.selectInfo.registerTypes = [];
        // this.findSourceType()
        findSourceType(val).then(res => {
          this.selectInfo.sourceTypes = res.data.orderSourceTypes
          res.data.orderRegisterTypes.forEach((val, index) => {
            this.selectInfo.registerTypes.push(val);
          });
        })
          .then(() => {
            return this.getMarketTypes(this.orderForm.orderMarketing.sourceType);
          });
      }
    },
    // findSourceType(){
    //   findSourceType(val).then(res => {
    //       this.selectInfo.sourceTypes = res.data.orderSourceTypes
    //       res.data.orderRegisterTypes.forEach((val, index) => {
    //         this.selectInfo.registerTypes.push(val);
    //       });
    //     })
    // },
    clearSourceType () {
      // this.findSourceType()
      if (this.orderForm.orderMarketing.provinceId == "") {
        this.orderForm.orderMarketing.sourceType = null;
        this.orderForm.orderMarketing.marketType = null;
        this.orderForm.orderMarketing.registerType = null;
        console.log(this.selectInfo.zeroPayCauses)
      }
    },
    changeIsContinuous(val) {  
      this.getSourceType(this.orderForm.orderMarketing.provinceId)
      this.getMarketTypes()
      this.$set(this.orderForm.orderMarketing, 'sourceType', '') // 清空收入类别
      this.$set(this.orderForm.orderMarketing, 'marketType', '') // 市场手段
      this.$set(this.orderForm.orderMarketing, 'registerType', '') // 报名场合
    },
    changeIsContinuous1(val) { 
      // console.log(this.orderForm.orderMarketing)
      this.getMarketTypes(this.orderForm.orderMarketing.sourceType) 
      this.$set(this.orderForm.orderMarketing, 'marketType', '') // 市场手段
    },
    //得到市场手段
    getMarketTypes (val) {
      console.log(val)
      if (val == "" || val == null) {
        this.marketTypes = [];
        return this.orderForm.orderMarketing.marketType = null;
      }
      if (val) {
        this.marketTypes = [];
        findMarketType(val).then(res => {
          this.marketTypes = res.data;
        });
      }
    },
    //如果选择是否虚报，应该怎么选择
    changeType (val) {
      // 1、是否续报选“是”：省市选“上海”：收入类别显示：E、续费；
      // 2、是否续报选“是”：省市选“全国”：收入类别显示：空；
      // 3、是否续报选“否”：省市选“上海”：收入类别显示：除“E、续费”以外；
      // 4、是否续报选“否”：省市选“全国”：收入类别显示：全国下的收入类别（目前为Q和G）；
      this.orderForm.orderMarketing.sourceType = null;
      this.orderForm.orderMarketing.marketType = null;
      this.orderForm.orderMarketing.registerType = null;
      this.marketTypes = [];
    },
    //获取省市、高考年份
    getHeadInfo () {
      getHeadInfo().then((res) => {
        if (res.status == 200) {
          this.headInfo = res.data
          this.headInfo.provinces = res.data.provinces
          this.getSelectProductParam()// 通过年份得到符合的年级
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          })
        }
      })
    },
    // 查询获取课程列表
    getCourseList () {
      let netCourseList = []
      this.form.subjectId.forEach((val, index) => {
        netCourseList.push(val)
        // console.log(netCourseList)
      })
      this.form.subjectId = netCourseList
      this.searchLoading = true
      getCourseList(this.form).then(res => {
        if (res.status == 200) {
          this.list = res.data
          this.searchLoading = false
        } else {
          this.searchLoading = false
          this.$message({
            message: res.message,
            type: "warning"
          })
        }
      })
    },
    //获取网课试听信息
    getOnlineCourse () {
      if (!this.receivePara.orderId) {
        return
      }
      findProductByOrder(Number(this.receivePara.orderId)).then(res => {
        if (res.status === 200) {
          this.orderForm.createUserName = res.data.createUserName
          this.orderForm.createUser = res.data.createUser
          this.orderForm.orderAudition = res.data.orderAudition
          this.orderForm.orderMarketing = res.data.orderMarketing
          this.orderForm.orderAudition = res.data.orderAudition

          this.orderForm.rejectionId = res.data.orderStatus
          this.orderForm.remark = res.data.remark
          this.selectedCourseList = []
          this.selectedCourseList = res.data.orderCourseList
          res.data.orderMonies.forEach(item => {
            this.orderForm.orderMoney.received = item.received
            this.orderForm.orderMoney.payTypeId = item.payTypeId
            this.orderForm.orderMoney.paymentDate = item.paymentDate
            this.orderForm.orderMoney.terminalNo = item.terminalNo
            this.orderForm.orderMoney.payNo = item.payNo
            this.orderForm.orderMoney.bankCardNo = item.bankCardNo
          })
          //  试听申请驳回
          if (res.data.orderStatus === 301) {
            this.showAuditRemark = true
            this.auditRemark = res.data.auditRemark
          }
        }
      })
        .then(() => {
          return this.getSourceType(this.orderForm.orderMarketing.provinceId);

        })
        .then(() => {
          return this.getMarketTypes(this.orderForm.orderMarketing.sourceType);
        });
    },
    //勾选的课程发生变化
    changeSelect (val) {
      this.multipleSelection = val
    },
    add0 (m) {
      return m < 10 ? '0' + m : m
    },
    format (time) {
      // shijianchuo是整数，否则要parseInt转换
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      return y + '-' + this.add0(m) + '-' + this.add0(d)
    },
    format2 (time) {
      // shijianchuo是整数，否则要parseInt转换
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate() + 3
      return y + '-' + this.add0(m) + '-' + this.add0(d)
    },
    //加入课程列表
    addCourseList () {
      if (!this.multipleSelection.length) {
        this.$message({
          message: '亲，记得选择课程再添加哦',
          type: "warning"

        })
        return
      }

      // if (this.multipleSelection.length > 3 || this.selectedCourseList.length > 3 || this.multipleSelection.length + this.selectedCourseList.length > 3) {
      //   this.$message({
      //     message: '亲，最多添加三门课程哦',
      //     type: "warning"
      //   })
      //   return
      // }
      //防止重复添加
      if (this.selectedCourseList.length) {
        for (var i = 0;i < this.multipleSelection.length;i++) {
          var repeat = false
          for (var j = 0;j < this.selectedCourseList.length;j++) {
            if (this.multipleSelection[i].grade === this.selectedCourseList[j].grade && this.multipleSelection[i].courseId === this.selectedCourseList[j].courseId) {
              repeat = true
            }
          }
          if (repeat) {
            this.$message({
              message: '请勿重复添加',
              type: "warning"
            })
            return
          }

        }
      }
      this.multipleSelection.forEach(item => {
        this.selectedCourseList.push({
          courseName: item.courseName, // 课程名称
          courseId: item.courseId, // 课程Id
          courseProperty: item.propertyId, // 课程属性Id
          startDate: this.format(new Date()), // 开始日期
          endDate: this.format2(new Date()) // 结束日期
        })
      })
      this.deleteSelect()
      this.multipleSelection = []
      console.log(this.selectedCourseList[0].startDate)
    },
    //删除添加到课程列表的查询结果
    deleteSelect () {
      for (var i = 0;i < this.multipleSelection.length;i++) {
        for (var j = 0;j < this.list.length;j++) {
          if (this.multipleSelection[i] === this.list[j])
            this.list.splice(j, 1)
        }
      }
    },
    //移除已经选中的课程
    deleteSelected (id) {
      this.selectedCourseList.splice(id, 1)
    },
    //新增网课试听订单
    addOnlineCourse (type) {
      let pass = false
      pass = true
      for (let i = 0;i < this.selectedCourseList.length;i++) {
        var bdate = Date.parse(this.selectedCourseList[i].startDate)
        var edate = Date.parse(this.selectedCourseList[i].endDate)
        if ((edate / (24 * 3600 * 1000)) - (bdate / (24 * 3600 * 1000)) > 3) {
          this.$message({
            message: '试听大于3天',
            type: "warning"
          })
          return
        } else if ((edate / (24 * 3600 * 1000)) < (bdate / (24 * 3600 * 1000))) {
          this.$message({
            message: '课程试听结束',
            type: "warning"
          })
          return
        }
      }
      if (pass) {
        this.orderForm.courseInfoList = []
        this.orderForm.courseInfoList = this.selectedCourseList
        if (!this.orderForm.courseInfoList.length) {
          this.$message({
            message: '请至少选择一门课程',
            type: "warning"
          })
          return
        }
        var orderForm = JSON.parse(JSON.stringify(this.orderForm))
        orderForm.orderMoney.received = Number(orderForm.orderMoney.received)
        if (orderForm.orderMoney.paymentDate) {
          orderForm.orderMoney.paymentDate = this.$format(orderForm.orderMoney.paymentDate)
        }
         if (this.orderForm.orderMoney.bankCardNo) {
        orderForm.orderMoney.bankCardNo = this.orderForm.orderMoney.bankCardNo.replace(/[" "]/g, "")
      }
      console.log(orderForm.orderMoney.bankCardNo)
        if (this.$route.query.orderId) {
          orderForm.orderAudition.orderId = Number(this.$route.query.orderId)
          orderForm.orderMoney.orderId = Number(this.$route.query.orderId)
          orderForm.orderMarketing.orderId = Number(this.$route.query.orderId)
          orderForm.orderId = Number(this.$route.query.orderId)
        }
        if (!this.orderForm.orderAudition.auditionNo) {
          this.$tipsMessage('请输入申请单号', 'warning')
          return false
        }
        if (!this.orderForm.orderMarketing.provinceId) {
          this.$tipsMessage('请选择省市', 'warning')
          return false
        }
        if (this.orderForm.orderMarketing.isContinuous != 1 || this.orderForm.orderMarketing.provinceId != 1) {
          if (!this.orderForm.orderMarketing.sourceType) {
            this.$tipsMessage('请选择收入类别', 'warning')
            return false
          }
        }
        if (this.orderForm.orderMarketing.isContinuous != 1 || this.orderForm.orderMarketing.provinceId != 1) {
          if (!this.orderForm.orderMarketing.marketType) {
            this.$tipsMessage('请选择市场手段', 'warning')
            return false
          }
        }
        if (!this.orderForm.orderMarketing.registerType) {
          this.$tipsMessage('请选择报名场合', 'warning')
          return false
        }
        if (this.orderForm.orderAudition.isZeroPay != 1) {
          if (!this.orderForm.orderMoney.payTypeId) {
            this.$tipsMessage('请选择付费方式', 'warning')
            return false
          }
          
          if (!this.orderForm.orderMoney.paymentDate) {
            this.$tipsMessage('请选择付费日期', 'warning')
            return false
          }
          if (!this.orderForm.orderMoney.received) {
            this.$tipsMessage('请填写支付金额', 'warning')
            return false
          }
          if (this.orderForm.orderMoney.received != Number(this.orderForm.orderMoney.received)) {
            this.$tipsMessage('支付金额请填写数字', 'warning')
            return false
          }
         
              // 当付费方式选择“银行卡”时会出现 终端号下拉框和银行卡号输入框；银行卡号输入框最多可输入20个字符，不可输入汉字
              if (
                getPayTypeName(this.orderForm.orderMoney.payTypeId) === '银行卡' &&
                (!this.orderForm.orderMoney.terminalNo ||
                  !this.orderForm.orderMoney.bankCardNo)
              ) {
                this.$tipsMessage('终端号和银行卡号必填', 'warning')
                return false
              } 
              // 当付费方式选择“支付宝”、“微信”、“银联商务—支付宝”、“银联商务—微信”时会出现终端号下拉框和订单号输入框
              if (
                getPayTypeName(this.orderForm.orderMoney.payTypeId) === '支付宝' &&
                  (!this.orderForm.orderMoney.terminalNo ||
                    !this.orderForm.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
               if (
                
                getPayTypeName(this.orderForm.orderMoney.payTypeId) === '微信' &&
                  (!this.orderForm.orderMoney.terminalNo ||
                    !this.orderForm.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
               if (
                getPayTypeName(this.orderForm.orderMoney.payTypeId) ===
                  '银联商务-支付宝' &&
                  (!this.orderForm.orderMoney.terminalNo ||
                    !this.orderForm.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
               if (
                getPayTypeName(this.orderForm.orderMoney.payTypeId) ===
                  '银联商务-微信' &&
                  (!this.orderForm.orderMoney.terminalNo ||
                    !this.orderForm.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
              // 当付费方式选择“支付宝在线支付”时会出现 订单号 输入框
              if (
                getPayTypeName(this.orderForm.orderMoney.payTypeId) ===
                  '支付宝在线支付' &&
                !this.orderForm.orderMoney.payNo
              ) {
                this.$tipsMessage('订单号必填', 'warning')
                return false
              }
            }
        if (this.orderForm.orderAudition.isZeroPay != 0) {
          if (!this.orderForm.orderAudition.zeroPayCause) {
            this.$tipsMessage('请选择0元试听原因', 'warning')
            return false
          }
        }
       

        //区分提交和暂存
        if (type) {
          orderForm.isAudition = true //提交
          // console.log(JSON.stringify(this.orderForm))
          addOnlineCourse(orderForm).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '提交成功',
                type: "success"
              })
              this.$router.push({
                path: '/OrderMgt/StudentOrderDeal',
              })
            } else if (res.status === 500) {
              this.$message({
                message: res.message,
                type: "warning"
              })
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              })
            }
          })

        } else {
          orderForm.isAudition = false
          addOnlineCourse(orderForm).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '暂存成功',
                type: "success"
              })
              this.$router.push({
                path: '/OrderMgt/StudentOrderDeal',
              })
            } else if (res.status === 500) {
              this.$message({
                message: res.message,
                type: "warning"
              })
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              })
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus{
  border-color: none;
}
.colorGray {
  color: #909399 !important;
}
.el-row {
  margin-bottom: 0px;
}
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.bottom{
   margin-bottom: 1px;
}
.top {
  margin-top: 0px !important;
}
.style {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.center{
  margin: 10px 0 0 45% ;
}
.el-checkbox+.el-checkbox{
  margin-left:19px; 
  margin-right: 0px;
}
.el-checkbox{
  margin-right: 0px;
}
.margin0{
   margin-bottom: -5px;
}
.margin{
  margin-bottom: 10px;
}
</style>
