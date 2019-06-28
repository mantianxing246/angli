/*
@author lfz
@date 2019/1/18
*/
<template>
  <div class="app-container top">
    <student-info :student-id="$route.query.studentId"/>
     <Card-Container :paddingValue="15">
      <template slot="body">
    <div v-show="showAuditRemark" class="style">审核信息：{{auditRemark}}</div>
    <el-form :model="form" label-width="85px" :rules="rules" inline>
      
          <el-form-item label="报名表号" prop="registerFormNum" maxlength="20">
            <el-input v-model="form.registerFormNum" clearable  placeholder="请输入" style="width:200px;"/>
          </el-form-item>
          <el-form-item label="开单人员">
            <span>{{createUserName}}</span>
          </el-form-item>
          <br/>
          <el-form-item label="是否续报" prop="orderMarketing.isContinuous">
            <el-radio-group v-model="form.orderMarketing.isContinuous" @change="changeType" style="width:200px">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="省市" prop="orderMarketing.provinceId">
            <el-select
              v-model="form.orderMarketing.provinceId"
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
            prop="sourceType"
            :rules="[
      { required: sourceTypeIsTrue(form.orderMarketing.isContinuous,form.orderMarketing.provinceId), trigger: 'blur'}
    ]"
          >
            <el-select
              v-model="form.orderMarketing.sourceType"
              placeholder="请选择"
              clearable
              style="width:200px"
              @change="getMarketTypes();changeIsContinuous1()"
            >
              <el-option
                :value="sourceTypes.id"
                :label="sourceTypes.typeName"
                v-for="sourceTypes in changeIsContinuousLink(headInfo.sourceTypes,form.orderMarketing.isContinuous,form.orderMarketing.provinceId)"
                :key="sourceTypes.id"
              ></el-option>
            </el-select>
          </el-form-item>
            <br/>
          <el-form-item
            label="市场手段"
            label-width="85px"
            prop="marketType"
            :rules="[
     { required: marketTypeisTrue(form.orderMarketing.isContinuous,form.orderMarketing.provinceId),trigger: 'blur'}
    ]"
          >
            <el-select
              v-model="form.orderMarketing.marketType"
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
          <el-form-item label="报名场合" prop="orderMarketing.registerType">
            <el-select
              v-model="form.orderMarketing.registerType"
              placeholder="请选择"
              clearable
              style="width:200px"
            >
              <el-option
                :value="registerTypes.id"
                :label="registerTypes.typeName"
                v-for="registerTypes in headInfo.registerTypes"
                :key="registerTypes.id"
              ></el-option>
            </el-select>
             
          </el-form-item>
           <br/>
          <el-form-item label="付费方式" prop="orderMoney.payTypeId">
            <el-select
              v-model="form.orderMoney.payTypeId"
              placeholder="请选择"
              style="width:200px"
              clearable
            >
              <el-option
                v-for="item in payTypes"
                :key="item.payTypeId"
                :label="item.payTypeName"
                :value="item.payTypeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付金额" prop="orderMoney.received">
            <!-- <el-input v-model="form.orderMoney.received" maxlength="10" placeholder="请输入" clearable  style="width:200px"/> -->
          <Amount-Input money="￥" :amount.sync="form.orderMoney.received" maxlength="10" placeholder="请输入" clearable  style="width:200px"></Amount-Input>
          </el-form-item>
          <el-form-item label="付费日期" prop="orderMoney.paymentDate">
            <el-date-picker
              v-model="form.orderMoney.paymentDate"
              clearable
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:200px"
            />
          </el-form-item> 
            <br/> 
          <el-form-item label="终端号" prop="orderMoney.terminalNo"  label-width="85px" v-if="terminalAndbankCardAndorderIsTrue(form.orderMoney.payTypeId)==1||terminalAndbankCardAndorderIsTrue(form.orderMoney.payTypeId)==2">
            <el-select
              v-model="form.orderMoney.terminalNo"
              clearable
               @input="createNormalOrderChange(form.orderMoney.terminalNo,'端口号')"
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
          <el-form-item label="订单号" prop="orderMoney.payNo"  label-width="85px" v-if="terminalAndbankCardAndorderIsTrue(form.orderMoney.payTypeId)==2||terminalAndbankCardAndorderIsTrue(form.orderMoney.payTypeId)==3">
            <el-input v-model="form.orderMoney.payNo" clearable maxlength="20" placeholder="请输入" @input="createNormalOrderChange(form.orderMoney.payNo,'订单号')" style="width:200px"/>
          </el-form-item>
           <el-form-item label="银行卡号" prop="orderMoney.bankCardNo" label-width="85px"  v-if="terminalAndbankCardAndorderIsTrue(form.orderMoney.payTypeId)==1">
            <el-input v-model="form.orderMoney.bankCardNo" clearable maxlength="23"  @input="createNormalOrderChange(form.orderMoney.bankCardNo,'银行卡号')" placeholder="请输入" style="width:200px"/>
          </el-form-item>
          <el-form-item label="备注信息" clearable>
            <el-input type="textarea" rows="3" placeholder="请输入" v-model="form.remark" style="width:800px"></el-input>
          </el-form-item>
          <br/>
      <el-form-item align="center" style="width:100%;margin-bottom:-5px;" >
        <router-link to="/OrderMgt/StudentOrderDeal" style="margin-right:10px;">
          <el-button>取消</el-button>
        </router-link>
        <el-button type="primary" @click="confirm(true)">提交</el-button>
        <el-button type="primary" @click="confirm(false)">暂存</el-button>
      </el-form-item>
    </el-form>
      </template>
     </Card-Container>
  </div>
</template>
<script>
import { getPayTypeName } from '@/views/order/FullOrderFunction/FullOrder.js'
import StudentInfo from "@/views/order/components/StudentInfo";
import { addSubscriptionOrder } from "@/api/order/StudentApi";
import { findProductByOrder ,getTerminalInfo} from "@/api/order/FullOrder.js";
import OrderDetailApi from "@/api/order/OrderDetailApi";
import {
  getHeadInfo,
  findSourceType,
  findMarketType
} from "@/api/components/HeadInfoApi";
import { provinces } from '@/CourseType/OverallExplanation'
import changeIsContinuousLink from "@/components/select/changeIsContinuousLink";
import { sourceTypeIsTrue, marketTypeisTrue } from '@/components/select/SourceTypes'
export default {
  name: "DepositOrder",
  components: { StudentInfo },
  mixins: [changeIsContinuousLink, sourceTypeIsTrue, marketTypeisTrue],
  data () {
    return {
      showAuditRemark: false, //是否显示审核信息
      auditRemark: "", //审核信息
      courses: [], //
      marketTypes: [], //市场手段
      provinces: [],
      sourceTypes: [], //收入类别
      payTypes: [], //付费方式
      // listQuery: {

      // },  //下拉框信息
      headInfo: {
        registerTypes: [], //报名场合
        sourceTypes: [] //收入类别
      },
       TerminalInfo: [],//终端号
      createUserName: JSON.parse(localStorage.states).user.name,
      form: {
        registerFormNum: "", // 报名表号
        createUser: JSON.parse(localStorage.states).user.userId, //默认开单人员为登录人
        orderMoney: {
          payTypeId: null, //付费方式
          received: null, //实收金额
          paymentDate: "", //付款日期
          terminalNo:null,//终端号
          payNo:null,//订单号
          bankCardNo:null//银行卡号
        },
        orderMarketing: {
          isContinuous: 1, //是否续保，0否，1是
          sourceType: null, //收入类别
          provinceId: null, //省份
          marketType: null, //市场手段
          registerType: null //报名场合
        },
        remark: "" // 备注信息
      },
      rules: {
        registerFormNum: [
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
        "orderMoney.payTypeId": [
          { required: true, message: "请选择付费方式", trigger: "blur" }
        ],
        "orderMoney.paymentDate": [
          {required: true, message: "请选择付费日期", trigger: "blur"}
        ],
        "orderMoney.received": [
          { required: true, message: "请填写支付金额", trigger: "blur" },
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
        "orderMarketing.isContinuous": [
          { required: true, message: "请选择是否续报", trigger: "blur" }
        ],
        "orderMarketing.provinceId": [
          { required: true, message: "请选择省市", trigger: "blur" }
        ],
         "orderMarketing.registerType": [
          { required: true, message: "请选择报名场合", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  watch: {
    ['form.orderMoney.bankCardNo'] (val) {
      this.$nextTick(() => {
        // str.replace(/\s/g, '').replace(/([\d|\*]{4})(?=[\d|\*])/g, "$1 ")
         this.form.orderMoney.bankCardNo = val.replace(/\s/g, '').replace(/([\d|\*]{4})(?=[\d|\*])/g, "$1 ")
      });
    }
  },
  methods: {
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
    //  if (type == '银行卡号') {
    //       this.form.orderMoney.bankCardNo = val.replace(/\s/g, '').replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
    //     }
     
      if (type == '付费方式') {
        //index表示第几个
        this.form.orderMoney.terminalNo = null
        this.form.orderMoney.payNo = null
        this.form.orderMoney.bankCardNo = null
      }
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
    //获取下拉框信息
    getHeadInfo () {
      getHeadInfo().then(res => {
        res.data.provinces.forEach(element => {
          if (
            element.provinceName == "全国" ||
            element.provinceName == "上海"
          ) {
            this.provinces.push(element);
          }
        });
      });
    },

    //通过省市得到收入类别/报名场合
    getSourceType (val, type) {
      if (type) {
        this.clearSourceType()
      }

      if (val == "") {
        let isContinuous = this.form.orderMarketing.isContinuous;
        this.form.orderMarketing.isContinuous = isContinuous;
        this.headInfo = {
          registerTypes: [], //报名场合
          sourceTypes: [] //收入类别
        };
        this.marketTypes = []; //报名手段
      }
      if (val) {
        this.headInfo.sourceTypes = [];
        this.headInfo.registerTypes = [];
        findSourceType(val).then(res => {
          this.headInfo.sourceTypes = res.data.orderSourceTypes
          res.data.orderRegisterTypes.forEach((val, index) => {
            this.headInfo.registerTypes.push(val);
          });
        })
          .then(() => {
            return this.getMarketTypes(this.form.orderMarketing.sourceType);
          });
      }
      // this.$emit("update:listQuery", this.listQuery);
    },
    clearSourceType () {
      // if (this.form.orderMarketing.provinceId == "") {
      this.form.orderMarketing.sourceType = null;
      this.form.orderMarketing.marketType = null;
      this.form.orderMarketing.registerType = null;
      //  }
    },
    //得到市场手段
    getMarketTypes (val) {
      if (val == "" || val == null) {
        this.marketTypes = [];
        return this.form.orderMarketing.marketType = null;
      }
      if (val) {
        this.marketTypes = [];
        findMarketType(val).then(res => {
          this.marketTypes = res.data;
        });
      }
    },
     changeIsContinuous(val) {  
      this.getSourceType(this.form.orderMarketing.provinceId)
      this.getMarketTypes()
      this.$set(this.form.orderMarketing, 'sourceType', '') // 清空收入类别
      this.$set(this.form.orderMarketing, 'marketType', '') // 市场手段
      this.$set(this.form.orderMarketing, 'registerType', '') // 报名场合
    },
    changeIsContinuous1(val) { 
      this.getMarketTypes(this.form.orderMarketing.sourceType) 
      this.$set(this.form.orderMarketing, 'marketType', '') // 市场手段
    },
    //如果选择是否虚报，应该怎么选择
    changeType (val) {
      // 1、是否续报选“是”：省市选“上海”：收入类别显示：E、续费；
      // 2、是否续报选“是”：省市选“全国”：收入类别显示：空；
      // 3、是否续报选“否”：省市选“上海”：收入类别显示：除“E、续费”以外；
      // 4、是否续报选“否”：省市选“全国”：收入类别显示：全国下的收入类别（目前为Q和G）；
      this.form.orderMarketing.sourceType = null;
      this.form.orderMarketing.marketType = null;
      this.form.orderMarketing.registerType = null;
      this.getSourceType(this.form.orderMarketing.provinceId);
      this.marketTypes = [];
      // this.getSourceType(this.listQuery.provinceId)
    },
    getTerminalInfo () {
      let userId = JSON.parse(localStorage.states).user.userId
      getTerminalInfo(userId).then((res) => {
        this.TerminalInfo = res.data
      })
    },
    getOrderPayTypeList () {
      OrderDetailApi.getOrderPayTypeList().then(res => {
        this.payTypes = res.data;
      });
    },
    //获取订单信息
    getAuditOrderInfo () {
      if (!this.$route.query.orderId) {
        return;
      }
      findProductByOrder(Number(this.$route.query.orderId))
        .then(res => {
          if (res.status === 200) {
            this.createUserName = res.data.createUserName;
            this.form.createUser = res.data.createUser;
            this.form.orderMarketing = res.data.orderMarketing;
            this.form.orderAudition = res.data.orderAudition;
            this.form.registerFormNum = res.data.registerFormNum;
            this.form.remark = res.data.remark;
            // console.log(this.form)
            if (res.data.orderMonies.length) {
              res.data.orderMonies.forEach(item => {
                this.form.orderMoney.received = item.received;
                this.form.orderMoney.payTypeId = item.payTypeId;
                this.form.orderMoney.paymentDate = item.paymentDate;
                this.form.orderMoney.terminalNo = item.terminalNo
                this.form.orderMoney.payNo = item.payNo
                this.form.orderMoney.bankCardNo = item.bankCardNo
              });
            }
            //  订金订单申请驳回
            if (res.data.orderStatus === 302) {
              this.showAuditRemark = true;
              this.auditRemark = res.data.auditRemark;
            }
          }
        })
        .then(() => {
          return this.getSourceType(this.form.orderMarketing.provinceId);
        })
        .then(() => {
          return this.getMarketTypes(this.form.orderMarketing.sourceType);
        });
    },
    // 确认操作
    confirm (type) {
      this.form.isSubscription = type;
      this.form.studentId = Number(this.$route.query.studentId);
      var form = JSON.parse(JSON.stringify(this.form));
      form.orderMoney.received = Number(this.form.orderMoney.received);
     if (this.form.orderMoney.bankCardNo) {
        form.orderMoney.bankCardNo = this.form.orderMoney.bankCardNo.replace(/[" "]/g, "")

      }
      console.log(form.orderMoney.bankCardNo)
      form.orderMoney.paymentDate = this.$format(
        this.form.orderMoney.paymentDate
      );
      if (this.$route.query.orderId) {
        form.orderId = Number(this.$route.query.orderId);
        form.orderMoney.orderId = Number(this.$route.query.orderId);
        form.orderMarketing.orderId = Number(this.$route.query.orderId);
      }
      if (!this.form.registerFormNum) {
        this.$tipsMessage('请输入报名表号', 'warning')
        return false
      }
      if (this.form.registerFormNum.length < 3 || this.form.registerFormNum.length > 20) {
        this.$tipsMessage('长度在 3 到 20 个字符', 'warning')
        return false
      }
      if (!this.form.orderMarketing.provinceId) {
        this.$tipsMessage('请选择省市', 'warning')
        return false
      }
      if (this.form.orderMarketing.isContinuous != 1 || this.form.orderMarketing.provinceId != 1) {
        if (!this.form.orderMarketing.sourceType) {
          this.$tipsMessage('请选择收入类别', 'warning')
          return false
        }
      }
      if (this.form.orderMarketing.isContinuous != 1 || this.form.orderMarketing.provinceId != 1) {
        if (!this.form.orderMarketing.marketType) {
          this.$tipsMessage('请选择市场手段', 'warning')
          return false
        }
      }
      if (!this.form.orderMarketing.registerType) {
        this.$tipsMessage('请选择报名场合', 'warning')
        return false
      }
      if (!this.form.orderMoney.payTypeId) {
        this.$tipsMessage('请选择付费方式', 'warning')
        return false
      }
      if (!this.form.orderMoney.paymentDate) {
        this.$tipsMessage('请选择付费日期', 'warning')
        return false
      }

      if (!this.form.orderMoney.received) {
        this.$tipsMessage('请填写支付金额', 'warning')
        return false
      }
      if (this.form.orderMoney.received != Number(this.form.orderMoney.received)) {
            this.$tipsMessage('支付金额请填写数字', 'warning')
            return false
        }
          // 当付费方式选择“银行卡”时会出现 终端号下拉框和银行卡号输入框；银行卡号输入框最多可输入20个字符，不可输入汉字
              if (
                getPayTypeName(this.form.orderMoney.payTypeId) === '银行卡' &&
                (!this.form.orderMoney.terminalNo ||
                  !this.form.orderMoney.bankCardNo)
              ) {
                this.$tipsMessage('终端号和银行卡号必填', 'warning')
                return false
              } 
              // 当付费方式选择“支付宝”、“微信”、“银联商务—支付宝”、“银联商务—微信”时会出现终端号下拉框和订单号输入框
              if (
                getPayTypeName(this.form.orderMoney.payTypeId) === '支付宝' &&
                  (!this.form.orderMoney.terminalNo ||
                    !this.form.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
               if (
                
                getPayTypeName(this.form.orderMoney.payTypeId) === '微信' &&
                  (!this.form.orderMoney.terminalNo ||
                    !this.form.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
               if (
                getPayTypeName(this.form.orderMoney.payTypeId) ===
                  '银联商务-支付宝' &&
                  (!this.form.orderMoney.terminalNo ||
                    !this.form.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
               if (
                getPayTypeName(this.form.orderMoney.payTypeId) ===
                  '银联商务-微信' &&
                  (!this.form.orderMoney.terminalNo ||
                    !this.form.orderMoney.payNo)
              ) {
                this.$tipsMessage('终端号和订单号必填', 'warning')
                return false
              }
              // 当付费方式选择“支付宝在线支付”时会出现 订单号 输入框
              if (
                getPayTypeName(this.form.orderMoney.payTypeId) ===
                  '支付宝在线支付' &&
                !this.form.orderMoney.payNo
              ) {
                this.$tipsMessage('订单号必填', 'warning')
                return false
              }
      addSubscriptionOrder(form).then(res => {
        if (res.status === 200) {
          if (type) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$router.push({
              path: "/OrderMgt/StudentOrderDeal",
            });
          } else {
            this.$router.push({
              path: "/OrderMgt/StudentOrderDeal",
            });
            this.$message({
              message: "暂存成功",
              type: "success"
            });
          }
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    }
  },
  created () {
    this.getHeadInfo();
    this.getTerminalInfo();
    this.getAuditOrderInfo();
    this.getOrderPayTypeList();
  }
};
</script>
<style lang="scss" scoped>
.deposit-title {
  font-size: 16px;
  margin: 15px 0;
}
.el-row {
  margin-bottom: 0;
}
.top {
  margin-top: 0px !important;
}
.style{
    font-size: 14px;
    color: #606266;
    font-weight: 700;
}
.float{
  float: right;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom:10px;
}
.margin0{
   margin-bottom: -5px;
}
</style>
