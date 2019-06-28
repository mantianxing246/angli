<template>
  <div class="font-color">
    <el-form inline label-position="left" :rules="rules" :model="listQuery" ref="follOrder3">
      <el-row type="flex">
        <el-col :span="5">
          <el-form-item>
            <div class="flex-div">
              <span class="form-item-rigth">实收金额</span>
              <amount-input
                :amount.sync="parseInt(listQuery.payable).toLocaleString()"
                money="￥"
                class='width120'
                disabledFlag
              ></amount-input>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label="开单人员">
            <span>{{listQuery.createUserName}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item label="销售人员" prop="salesUser" style="float:right"></el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-select
              class="width120"
              v-model="listQuery.salesUserDeptId"
              @change="findUser(1)"
              clearable
              placeholder="选择部门"
            >
              <el-option
                v-for="item in deptAndRoleObject.depts"
                :key="item.deptId"
                :value="item.deptId"
                :label="item.deptName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-select
              class="width120"
              v-model="listQuery.salesUserRoleId"
              @change="findUser(1)"
              clearable
              placeholder="选择角色"
            >
              <el-option
                v-for="item in deptAndRoleObject.roles"
                :value="item.roleId"
                :label="item.roleName"
                :key="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item prop="salesUser">
            <el-select
              class="width120"
              v-model="listQuery.salesUser"
              placeholder="选择人员"
              @change="fullOrder3Change"
              clearable
            >
              <el-option
                v-for="(item,index) in userList"
                :key="index"
                :value="item.userId"
                :label="item.userName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex">
        <el-col :span="5">
          <el-form-item label="销售分成" style="margin-left:10px">
            <el-radio-group v-model="listQuery.divide" @change="divideChange">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="listQuery.divide!='否'" :span="3">
          <el-form-item label="分成比例">
            <span>{{"50%"}}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="listQuery.divide!='否'" :span="3">
          <el-form-item label="分成人员" style="float:right">
            <!-- <span>{{salesUserName}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="3" v-if="listQuery.divide!='否'">
          <el-form-item>
            <el-select
              placeholder="选择部门"
              class="width120"
              v-model="listQuery.divideUserDeptId"
              clearable
              @change="userList2Change(1)"
            >
              <el-option
                v-for="item in deptAndRoleObject.depts"
                :key="item.deptId"
                :value="item.deptId"
                :label="item.deptName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3" v-if="listQuery.divide!='否'">
          <el-form-item>
            <el-select
              placeholder="选择角色"
              v-model="listQuery.divideUserRoleId"
              class="width120"
              clearable
              @change="userList2Change(1)"
            >
              <el-option
                v-for="item in deptAndRoleObject.roles"
                :value="item.roleId"
                :label="item.roleName"
                :key="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3" v-if="listQuery.divide!='否'">
          <el-form-item>
            <el-select
              placeholder="选择人员"
              v-model="listQuery.divideUser"
              class="width120"
              clearable
              @change="getSalesUserName"
            >
              <el-option
                v-for="(item,index) in userList2"
                :key="index"
                :value="item.userId"
                :label="item.userName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="是否续报" prop="isContinuous">
        <el-radio-group v-model="listQuery.isContinuous" @change="changeType">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="省市" prop="provinceId">
        <el-select
          placeholder="省市"
          v-model="listQuery.provinceId"
          @change="getSourceType"
          clearable
          class="width80"
        >
          <el-option
            :value="provinces.provinceId"
            :label="provinces.provinceName"
            v-for="provinces in provinces"
            :key="provinces.provinceId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="收入类别"
        prop="sourceType"
        :class="{marginLeft10:!sourceTypeIsTrue(listQuery.isContinuous,listQuery.provinceId)}"
        :rules="[
      { required: sourceTypeIsTrue(listQuery.isContinuous,listQuery.provinceId), message: '收入类别不能为空'}
    ]"
      >
        <el-select
          placeholder="收入类别"
          v-model="listQuery.sourceType"
          style="width:140px"
          clearable
          @change="getMarketTypes"
        >
          <el-option
            :value="sourceTypes.id"
            :label="sourceTypes.typeName"
            v-for="sourceTypes in changeIsContinuousLink(headInfo.sourceTypes,listQuery.isContinuous,listQuery.provinceId,)"
            :key="sourceTypes.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="市场手段"
        prop="marketType"
        :class="{marginLeft10:!marketTypeisTrue(listQuery.isContinuous,listQuery.provinceId)}"
        :rules="[
      { required: marketTypeisTrue(listQuery.isContinuous,listQuery.provinceId), message: '收入类别不能为空'}
    ]"
      >
        <el-select
          placeholder="市场手段"
          v-model="listQuery.marketType"
          @change="fullOrder3Change"
          style="width:150px"
          clearable
        >
          <el-option
            :value="marketTypes.id"
            :label="marketTypes.typeName"
            v-for="marketTypes in marketTypes"
            :key="marketTypes.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="报名场合" prop="registerType">
        <el-select
          placeholder="报名场合"
          v-model="listQuery.registerType"
          @change="fullOrder3Change"
          class="width120"
          clearable
        >
          <el-option
            :value="registerTypes.id"
            :label="registerTypes.typeName"
            v-for="registerTypes in headInfo.registerTypes"
            :key="registerTypes.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import OrderDetailApi from "@/api/order/OrderDetailApi";
import {
  getHeadInfo,
  findSourceType,
  findMarketType
} from "@/api/components/HeadInfoApi";
import { deptAndRoleInfo, getUserList, findUser } from "@/api/common/common";
import { provinces } from "@/CourseType/OverallExplanation";
import changeIsContinuousLink from "@/components/select/changeIsContinuousLink";
import {
  sourceTypeIsTrue,
  marketTypeisTrue
} from "@/components/select/SourceTypes";

export default {
  name: "FullOrder2",
  mixins: [changeIsContinuousLink, sourceTypeIsTrue, marketTypeisTrue],
  data() {
    return {
      headInfo: {
        registerTypes: [], //报名场合
        sourceTypes: [] //收入类别
      },
      marketTypes: [], //市场手段
      provinces: [], //省市
      sourceTypes: [], //收入类别
      openingOrder: JSON.parse(localStorage.getItem("states")).user.name, //开单人员
      userList: [], //销售人员
      userList2: [], //销售分成人员
      deptAndRoleObject: {
        depts: null, //部门
        roles: null //角色
      }, //部门和角色数组对象
      deptAndRoleId: {
        deptId: null,
        roleId: null
      },
      salesUserName: null, //分成人员名字
      rules: {
        isContinuous: [
          { required: true, message: "请选择是否续保", trigger: "change" }
        ],
        provinceId: [
          { required: true, message: "请选择省市", trigger: "change" }
        ],
        registerType: [
          { required: true, message: "请选择报名场合", trigger: "change" }
        ],
        salesUser: [
          { required: true, message: "请填写销售人员", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    fullOrder3Change(val) {
      // this.$emit("update:listQuery", this.listQuery);
    },
    //付费方式
    getHeadInfo() {
      this.provinces = [];
      getHeadInfo().then(res => {
        this.provinces = provinces;
      });
    },
    //通过省市得到收入类别/报名场合
    getSourceType(val) {
      this.clearSourceType();
      if (val) {
        this.findSourceType(val);
      }
      this.$emit("update:listQuery", this.listQuery);
    },
    findSourceType(val, type) {
      findSourceType(val).then(res => {
        this.headInfo.sourceTypes = res.data.orderSourceTypes;
        this.headInfo.registerTypes = res.data.orderRegisterTypes;
        if (this.listQuery.sourceType) {
          this.getMarketTypes(this.listQuery.sourceType, type);
        }
      });
    },
    clearSourceType() {//divide
      let isContinuous = this.listQuery.isContinuous;
      let salesUser = this.listQuery.salesUser;
      let provinceId = this.listQuery.provinceId;
      this.$refs.follOrder3.resetFields();
      this.listQuery.isContinuous = isContinuous;
      this.listQuery.salesUser = salesUser;
      this.listQuery.provinceId = provinceId;
      this.marketTypes = []; //报名手段
      this.headInfo = {
        registerTypes: [], //报名场合
        sourceTypes: [] //收入类别
      };
      this.listQuery.sourceType = null;
      this.listQuery.marketType = null;
      this.listQuery.registerTypes = null;
    },
    //得到市场手段
    getMarketTypes(val, type) {
      if (val == "") {
        this.marketTypes = []; //报名手段
        let resetValue = {
          registerType: this.listQuery.registerType,
          isContinuous: this.listQuery.isContinuous,
          sourceType: this.listQuery.sourceType,
          provinceId: this.listQuery.provinceId,
          salesUser: this.listQuery.salesUser
        };
        this.$refs.follOrder3.resetFields();
        this.listQuery.registerType = resetValue.registerType;
        this.listQuery.isContinuous = resetValue.isContinuous;
        this.listQuery.sourceType = resetValue.sourceType;
        this.listQuery.provinceId = resetValue.provinceId;
        this.listQuery.salesUser = resetValue.salesUser;
        this.listQuery.marketType = null;
      }
      if (val) {
        this.marketTypes = [];
        findMarketType(val).then(res => {
          this.marketTypes = res.data;
          type ? null : ( this.marketTypes.length===1?this.listQuery.marketType = this.marketTypes[0].id:this.listQuery.marketType = null);
        });
      }
      this.$emit("update:listQuery", this.listQuery);
    },
    //如果选择是否续报，应该怎么选择
    changeType(val) {
      //       1、是否续报选“是”：省市选“上海”：收入类别显示：E、续费；
      // 2、是否续报选“是”：省市选“全国”：收入类别显示：空；
      // 3、是否续报选“否”：省市选“上海”：收入类别显示：除“E、续费”以外；
      // 4、是否续报选“否”：省市选“全国”：收入类别显示：全国下的收入类别（目前为Q和G）；
      this.getSourceType(this.listQuery.provinceId);
    },
    //当选择了部门和角色后得到这个用户
    findUser(key) {
      if (
        this.listQuery.salesUserDeptId == "" ||
        this.listQuery.salesUserRoleId == ""
      ) {
        this.listQuery.salesUser = null;
      }
      if (
        this.listQuery.salesUserDeptId == "" &&
        this.listQuery.salesUserRoleId == ""
      ) {
        this.userList = [];
      } else {
        findUser({
          deptId: this.listQuery.salesUserDeptId,
          roleId: this.listQuery.salesUserRoleId
        }).then(res => {
          if (res.status == 200) {
            this.userList = res.data;
            if (key) {
              this.listQuery.salesUser = null;
            }
          }
        });
      }
    },
    //销售分成人员指定
    userList2Change(key) {
      if (
        this.listQuery.divideUserDeptId == "" ||
        this.listQuery.divideUserRoleId == ""
      ) {
        this.listQuery.divideUser = null;
      }
      if (
        this.listQuery.divideUserDeptId == "" &&
        this.listQuery.divideUserRoleId == ""
      ) {
        this.userList2 = [];
      } else {
        findUser({
          deptId: this.listQuery.divideUserDeptId,
          roleId: this.listQuery.divideUserRoleId
        }).then(res => {
          if (res.status == 200) {
            this.userList2 = res.data;
            if (key) {
              this.listQuery.divideUser = null;
            }
          }
        });
      }
    },
    //得到部门和角色
    deptAndRoleInfo() {
      deptAndRoleInfo().then(res => {
        if (res.status == 200) {
          this.deptAndRoleObject = res.data;
        }
      });
    },
    //如果销售分成按钮改变，清空销售分成
    divideChange() {
      this.listQuery.divideUserDeptId = null;
      this.listQuery.divideUserRoleId = null;
      this.listQuery.divideUser = null;
    },
    clearDeptAndRoleObject() {
      //部门清空
      if (
        !this.isInclude(
          this.deptAndRoleObject.depts,
          "deptId",
          this.listQuery.salesUserDeptId
        )
      ) {
        this.listQuery.salesUserDeptId = null;
      }
      //角色清空
      if (
        !this.isInclude(
          this.deptAndRoleObject.roles,
          "roleId",
          this.listQuery.salesUserRoleId
        )
      ) {
        this.listQuery.salesUserRoleId = null;
      }

      //部门清空
      if (
        !this.isInclude(
          this.deptAndRoleObject.depts,
          "deptId",
          this.listQuery.divideUserDeptId
        )
      ) {
        this.listQuery.divideUserDeptId = null;
      }
      //角色清空
      if (
        !this.isInclude(
          this.deptAndRoleObject.roles,
          "roleId",
          this.listQuery.divideUserRoleId
        )
      ) {
        this.listQuery.divideUserRoleId = null;
      }
    },
    isInclude(array, obj, indexName) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][obj] === indexName) {
          return true;
        }
      }
      return false;
    },
    //得到分成人员的名字
    getSalesUserName(userId) {
      this.salesUserName = this.userList2.filter(val => {
        return val.userId === userId;
      })[0].userName;
    }
  },
  created() {
    this.getHeadInfo();
    this.deptAndRoleInfo();
    // this.findUser()
    // this.userList2Change()
  },
  props: ["listQuery"],
  watch: {
    listQuery(val) {
      if (this.listQuery.provinceId) {
        this.findSourceType(this.listQuery.provinceId, 1);
        this.findUser();
        this.userList2Change();
        this.clearDeptAndRoleObject();
      }
    }
  }
};
</script>
<style scoped >
.el-row {
  margin-bottom: 0;
}
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.marginLeft10::before {
  content: "*";
  float: left;
  color: white;
  margin-right: 2px;
}
.flex-div {
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
}
.form-item-rigth{
  font-weight: bold;
}
>>>.el-form-item__content{
  margin-top:-11px;
}
>>>.el-form-item__label{
 margin-top: -12px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 10px;
}
</style>
