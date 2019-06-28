<template>
  <div class="courseColor font-color">
    <el-row type="flex" align="middle">
      <el-col :span="4">
        <div class="flex-div">
          <span class="form-item-rigth">原价</span>
          <amount-input
            :amount.sync="listQuery.totalPrice.toLocaleString()"
            money="￥"
            class="width120"
            disabledFlag
          ></amount-input>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="flex-div">
          <span class="form-item-rigth" style="display:inline-block;width:80px;">原价抵减</span>
          <amount-input
            :amount.sync="parseInt(listQuery.totalPrice-listQuery.originalPrice).toLocaleString()"
            money="￥"
            class="width120"
            disabledFlag
          ></amount-input>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle">
      <span class="form-item-rigth">符合优惠条件</span>
      <el-col :span="15">
        <el-input
          v-html="listQuery.discountMessages"
          type="textarea"
          class="discount-style"
          v-if="listQuery.discountMessages"
        ></el-input>
        <el-input class="discount-style" style="height:60px;" :disabled="true" v-else></el-input>
      </el-col>
    </el-row>

    <el-form
      inline
      label-position="right"
      :rules="rules"
      :model="listQuery"
      class="el-form-item__label_style el-row-Container"
      label-width="130px"
    >
      <el-row type="flex">
        <el-col :span="6">
          <el-form-item label="特殊优惠申请单号" prop="orderDiscount.specDiscountNo">
            <el-input
              v-model="listQuery.orderDiscount.specDiscountNo"
              @change="createNormalOrderChange"
              clearable
              class="width120"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="特殊优惠金额" prop="orderDiscount.specDiscountAmount">
            <amount-input
              :amount.sync="listQuery.orderDiscount.specDiscountAmount"
              money="￥"
              @change="getPayable"
              class="width130"
            ></amount-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应付金额" v-if="this.listQuery.orderDiscount.specDiscountAmount">
            <amount-input
              :amount.sync="parseInt(this.listQuery.payable-this.listQuery.orderDiscount.specDiscountAmount).toLocaleString()"
              money="￥"
              class="width120"
              disabledFlag
            ></amount-input>
          </el-form-item>
          <el-form-item label="应付金额" v-else>
            <amount-input
              :amount.sync="parseInt(this.listQuery.payable).toLocaleString()"
              money="￥"
              class="width120"
              disabledFlag
            ></amount-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="6">
          <el-form-item label="报名表号" prop="registerFormNum">
            <el-input
              v-model="listQuery.registerFormNum"
              @change="createNormalOrderChange"
              clearable
              :maxlength="20"
              class="width120"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="付费日期" prop="paymentDate" labelStyle="color:red;">
            <el-date-picker
              type="date"
              placeholder="付费日期"
              v-model="listQuery.paymentDate"
              @change="createNormalOrderChange(listQuery.paymentDate,'付费日期')"
              value-format="yyyy-MM-dd"
              clearable
              class="width130"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <table style="width:100%;margin-top:-16px;" >
      <tr v-for="(item,index) in listQuery.orderMoneys" :key="index">
        <td class="form-item-rigth">付费方式</td>
        <td>
          <el-select
            v-model="item.payTypeId"
            @change="createNormalOrderChange(item.payTypeId,'付费方式',index)"
            clearable
            class="width150"
          >
            <el-option
              v-for="item in payTypes"
              :key="item.payTypeId"
              :label="item.payTypeName"
              :value="item.payTypeId"
            ></el-option>
          </el-select>
        </td>

        <td class="form-item-rigth">实收金额</td>
        <td>
          <amount-input :amount.sync="item.received" money="￥" class="width150"></amount-input>
        </td>

        <td>
          <span @click="payTypeClick(item.icon,index)">
            <svg-icon icon-class="add" v-if="item.icon==='el-icon-circle-plus'" class="font-size"/>
            <svg-icon icon-class="reduce" v-else class="font-size"/>
          </span>
        </td>
        <td
          class="form-item-rigth"
          v-if="terminalAndbankCardAndorderIsTrue(item.payTypeId)==1||terminalAndbankCardAndorderIsTrue(item.payTypeId)==2"
        >终端号</td>
        <td
          v-if="terminalAndbankCardAndorderIsTrue(item.payTypeId)==1||terminalAndbankCardAndorderIsTrue(item.payTypeId)==2"
        >
          <el-select
            v-model="item.terminalNo"
            clearable
            @input="createNormalOrderChange(item.terminalNo,'端口号')"
            class="width120"
          >
            <el-option
              v-for="(item,index) in  TerminalInfo"
              :key="index"
              :label="item.ChargeMannerName"
              :value="item.TerminalCode"
            ></el-option>
          </el-select>
        </td>
        <td class="form-item-rigth" v-if="terminalAndbankCardAndorderIsTrue(item.payTypeId)==1">银行卡号</td>
        <td v-if="terminalAndbankCardAndorderIsTrue(item.payTypeId)==1">
          <!-- <el-input
            v-model="item.bankCardNo"
            :maxlength="23"
            @focus="createNormalOrderChangeFocus(index)"
            @blur="createNormalOrderChangeBlur(index)"
            @input="createNormalOrderChange(item.bankCardNo,'银行卡号',index)"
            class="width200"
            v-if="bankCardNoTrue"
          ></el-input>

          <el-input
            v-model="bankCardNoReplace"
            @focus="createNormalOrderChangeFocus(index)"
            @blur="createNormalOrderChangeBlur(index)"
            :maxlength="23"
            class="width200"
            v-else
          ></el-input>-->
          <el-input
            v-model="item.bankCardNo"
            :maxlength="23"
            @input="createNormalOrderChange(item.bankCardNo,'银行卡号',index)"
            clearable
            class="width200"
            v-if="bankCardNoTrue"
          ></el-input>
        </td>

        <td
          class="form-item-rigth"
          v-if="terminalAndbankCardAndorderIsTrue(item.payTypeId)==2||terminalAndbankCardAndorderIsTrue(item.payTypeId)==3"
        >订单号</td>
        <td
          v-if="terminalAndbankCardAndorderIsTrue(item.payTypeId)==2||terminalAndbankCardAndorderIsTrue(item.payTypeId)==3"
        >
          <el-input
            v-model="item.payNo"
            @input="createNormalOrderChange(item.payNo,'订单号')"
            clearable
            :maxlength="20"
            class="width190"
          ></el-input>
        </td>

        <td v-show="index===0">
          <el-tooltip class="item" effect="light" content="报名费直接计算为全责收入" placement="top-start">
            <el-checkbox v-model="item.isEntryFee" :true-label="1" :false-label="0">是否为报名费</el-checkbox>
          </el-tooltip>
        </td>
      </tr>
    </table>
    <el-row type="flex" align="middle" class="margin-top20">
      <span class="form-item-rigth">备注信息</span>
      <el-col :span="10">
        <el-input
          type="textarea"
          v-model="listQuery.remark"
          @change="createNormalOrderChange"
          clearable
          :maxlength="100"
        />
      </el-col>
    </el-row>
  </div>
</template> 
<script>
import OrderDetailApi from "@/api/order/OrderDetailApi";
import { getPayTypeName } from "@/views/order/FullOrderFunction/FullOrder.js";
import { getTerminalInfo } from "@/api/order/FullOrder";

export default {
  name: "FullOrder2",
  props: ["listQuery", "isPass"],
  data () {
    let registerFormNumValidator = function (rule, val, callback) {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      payTypes: [], //付费方式
      rules: {
        registerFormNum: [
          { required: true, message: "请填写信息", trigger: "blur" },
          { validator: registerFormNumValidator }
        ],
        paymentDate: [
          { required: true, message: "请填写信息", trigger: "blur" }
        ],
        "orderDiscount.specDiscountNo": [
          {
            validator (rules, val, callback) {
              if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
                callback(new Error("请输入数字"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        "orderDiscount.specDiscountAmount": [
          {
            validator (rules, val, callback) {
              if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
                callback(new Error("请输入数字"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      numValidator: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
      bankCardNoTrue: true,
      bankCardNoReplace: "",
      TerminalInfo: [] //终端号
    };
  },
  methods: {
    createNormalOrderChange (val, type, index) {
      //index第几个付费方式
      let reg = this.numValidator;
      if (type == "实收金额" || type == "特殊优惠金额") {
        if (!reg.test(val) && val.length != 0) {
          this.$tipsMessage("请填写数字", "warning");
          // this.$emit("update:isPass", false);
          return;
        }
      }
      if (type == "端口号" || type == "银行卡号" || type == "订单号") {
        if (/[\u4e00-\u9fa5]+/.test(val)) {
          this.$tipsMessage("不能输入汉字", "warning");
          // this.$emit("update:isPass", false);
          return;
        }
        if (type == "银行卡号") {
          this.listQuery.orderMoneys[index].bankCardNo = val
            .replace(/\s/g, "")
            .replace(/[^\d|*]/g, "")
            .replace(/([\d|*]{4})(?=[\d|*])/g, "$1 ");
        }
      }
      if (type == "付费方式") {
        //index表示第几个
        this.listQuery.orderMoneys[index].terminalNo = null;
        this.listQuery.orderMoneys[index].payNo = null;
        this.listQuery.orderMoneys[index].bankCardNo = null;
      }

      // this.$emit("update:isPass", true);
      this.$emit("update:listQuery", this.listQuery);
    },
    createNormalOrderChangeFocus (index) {
      this.bankCardNoTrue = true;
    },
    createNormalOrderChangeBlur (index) {
      this.bankCardNoTrue = false;
      this.bankCardNoReplace = this.listQuery.orderMoneys[
        index
      ].bankCardNo.replace(/^(.{9})(.*)(.{5})$/g, function (m, m1, m2, m3) {
        return m1 + "*".repeat(m2.length) + m3;
      });
    },
    payTypeClick (icon, index) {
      // var length = this.listQuery.orderMoneys.length;
      //如果添加的长度大于5，提示
      // if (length > 4 && icon == "el-icon-circle-plus") {
      //   this.$tipsMessage("付费方式不能大于5种", "warning");
      //   return;
      // }
      if (icon == "el-icon-circle-plus") {
        this.listQuery.orderMoneys.push({
          payTypeId: null, //付费方式
          received: null, //实收金额
          paymentDate: null, //支付时间
          icon: "el-icon-remove", //显示的图片
          isEntryFee: 0,
          terminalNo: null, //终端号
          bankCardNo: null, //银行卡号
          payNo: null //订单号
        });
      } else {
        this.listQuery.orderMoneys.splice(index, 1);
      }
    },
    //付费方式
    getOrderPayTypeList () {
      OrderDetailApi.getOrderPayTypeList().then(res => {
        this.payTypes = res.data;
      });
    },
    //应付金额-特殊优惠金额
    getPayable (val) {
      let reg = this.numValidator;
      if (!reg.test(val) && val.length != 0) {
        this.$tipsMessage("请填写数字", "warning");
        this.$emit("update:isPass", false);
        return;
      }
      if (val >= this.listQuery.totalPrice) {
        this.$tipsMessage("优惠金额不能超过应付金额", "warning");
        this.$emit("update:isPass", false);
        return;
      }
      // this.listQuery.totalPrice = this.listQuery.payable - this.listQuery.orderDiscount.specDiscountAmount
      this.$emit("update:listQuery", this.listQuery);
    },
    terminalAndbankCardAndorderIsTrue (payTypeId) {
      if (getPayTypeName(payTypeId) == "银行卡") {
        return 1;
      }
      if (
        getPayTypeName(payTypeId) == "支付宝" ||
        getPayTypeName(payTypeId) == "微信" ||
        getPayTypeName(payTypeId) == "银联商务-支付宝" ||
        getPayTypeName(payTypeId) == "银联商务-微信"
      ) {
        return 2;
      }
      if (getPayTypeName(payTypeId) == "支付宝在线支付") {
        return 3;
      }
    },
    getTerminalInfo () {
      let userId = JSON.parse(localStorage.getItem("states")).user.userId;
      getTerminalInfo(userId).then(res => {
        this.TerminalInfo = res.data;
      });
    }
  },
  created () {
    this.getOrderPayTypeList();
    this.getTerminalInfo();
  }
};
</script>
<style scoped>
.margin-top20 {
  margin-top: 0px;
}
.discount-style {
  line-height: 20px;
}
.font-size {
  font-size: 20px;
  cursor: pointer;
}
td {
  font-weight: bold;
  float: left;
  height: 40px;
  line-height: 40px;
}
td .el-checkbox {
  font-weight: bold;
}
.form-item-rigth {
  font-weight: bold;
}
.flex-div {
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
}
.el-row{
  margin-bottom:10px;
}
.el-row-Container .el-row {
    margin-bottom: 0px;
    margin-top: -6px;
}

</style>