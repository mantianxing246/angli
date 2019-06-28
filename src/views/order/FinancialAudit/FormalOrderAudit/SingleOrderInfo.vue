/**
@author lfz
@date 2019/1/30
*/
<template>
  <div>
    <el-form :inline="true" label-position="right" label-width="130px">
      <el-form-item label="开单人员">
        <div style="width:170px;">{{formData.createUserName}}</div>
      </el-form-item>
      <el-form-item label="销售人员" style="margin-bottom:0;">
        <el-form-item>
          <el-select v-model="form.salesUserDeptId" placeholder style="width:120px" disabled>
            <el-option
              v-for="item in headInfo.depts"
              :value="item.deptId"
              :label="item.deptName"
              :key="item.deptId+ '-depts'"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.salesUser" placeholder="选择人员" style="width:120px" disabled>
            <el-option
              v-for="(item, index) in selectInfo.salesUsers"
              :value="item.userId"
              :label="item.userName"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <br v-if="salesDivide">
      <!-- 需求改造新增 -->
      <el-form-item v-if="salesDivide" label="销售分成">
        <el-radio-group v-model="salesDivide" placeholder="销售分成" style="width:180px" disabled>
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="salesDivide" label="分成人员" style="margin-bottom:0;" v-show="salesDivide === 0 ? false : true ">
        <el-form-item>
          <el-select v-model="form.divideUserDeptId" placeholder style="width:120px" disabled>
            <el-option
              v-for="item in headInfo.depts"
              :value="item.deptId"
              :label="item.deptName"
              :key="item.deptId+ '-salesDividedepts'"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="salesDivide">
          <el-select v-model="form.divideUser" placeholder="选择人员" style="width:120px" disabled>
            <el-option
              v-for="(item, index) in selectInfo.divideUsers"
              :value="item.userId"
              :label="item.userName"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="68px" v-if="salesDivide" label="分成比例">
          <span>{{form.ratio*100}}%</span>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { findProductByOrder } from "@/api/order/FinancialAudit/FormalOrderAudit";
import { getAllRole, findRoleById } from "@/api/admin/RoleApi";
import {
  getUserList,
  findSourceType,
  findMarketType
} from "@/api/common/common.js";
import { isInclude } from "@/utils/ArrayUtils.js";
import SourceTypeAndMarketType from "@/components/select/SourceTypeAndMarketType";
export default {
  name: "SingleOrderInfo",
  mixins: [SourceTypeAndMarketType],
  props: {
    orderId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      salesDivide: 0, // 销售分成方式
      selectInfo: {
        // sourceTypes:null
      },
      radio: null,
      form: "",
      formData: "",
      orderMonies: "",
      rolesList: [], //角色
      usersList: [], //账户
      headInfo: {
        provinces: [],
        sourceTypes: [],
        marketTypes: [],
        registerTypes: [],
        payTypes: []
      },
      users: [
        { id: 1, value: "aa" },
        { id: 2, value: "bb" },
        { id: 3, value: "cc" }
      ],
      xiaoshoufencheng: 1
    };
  },
  computed: {
    username() {
      return this.$store.getters.name;
    }
  },
  mounted() {
    this.findOrderByOrderId();
  },
  methods: {
    //获取订单信息
    findOrderByOrderId() {
      var price = 0;
      findProductByOrder(this.orderId)
        .then(res => {
          if (res.status == 200) {
            this.form = res.data.orderMarketing;
            this.getHeadInfo();
            this.formData = res.data;
            //console.log(this.form);
            this.getUserListSales(
              res.data.salesUserDeptId,
              res.data.salesUserRoleId,
              "salesUsers"
            );
            if (this.form.divideUser) {
              this.salesDivide = 1;
              this.getUserListDiv(
                res.data.salesUserDeptId,
                res.data.salesUserRoleId,
                "divideUsers"
              );
            } else {
              this.salesDivide = 0;
            }
            for (var i = 0; i < res.data.orderMonies.length; i++) {
              price += res.data.orderMonies[i].received;
            }
            this.form.price = price;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .then(res => {
          return this.getFindSourceType();
        });
    }
  }
};
</script>
<style>
table.notElement {
  border-collapse: collapse;
  text-align: left;
  color: #909399;
  width: 100%;
}
.notElement td {
  font-size: small;
}
.pcolor {
  background: #eee;
  padding: 5px;
}
</style>

