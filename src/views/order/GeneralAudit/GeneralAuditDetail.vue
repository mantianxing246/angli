<!--
 * @author hongdengru
 * @date 2019/1/29
-->
<template>
  <div class="app-container rec-live-course">
    <el-dialog
      :close-on-click-modal="false"
      v-el-drag-dialog
      :visible.sync="auditDialog"
      title="订单审核"
      class="orderDialog"
      width="1200px"
      center
    >
      <el-form
        ref="form"
        :model="form"
        label-position="right"
        :inline="true"
        :rules="rules"
        label-width="107px"
      >
        <el-form-item label="学员ID" prop="studentId">
          <el-input v-model="form.userId" disabled class="input labelAfterwidth"/>
        </el-form-item>
        <el-form-item label="学员姓名" prop="name">
          <el-input v-model="form.name" disabled class="input labelAfterwidth"/>
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderNo" class="labelAfterwidth" disabled/>
        </el-form-item>
        <el-form-item label="是否续报" prop="isContinuous">
          <el-radio-group
            v-model="form.isContinuous"
            @change="checkSlect()"
            class="labelAfterwidth"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item label="省市" prop="provinceId">
          <el-select
            v-model="form.provinceId"
            @change="getFindSourceType();checkSlect()"
            class="labelAfterwidth"
          >
            <el-option
              v-for="item in provinces"
              :value="item.provinceId"
              :label="item.provinceName"
              :key="item.provinceId+ '-provinceId'"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="收入类别"
          :rules="[
      { required: sourceTypeIsTrue(form.isContinuous,form.provinceId), message:'请选择收入类别',trigger: 'blur'}
    ]"
          prop="sourceType"
        >
          <el-select
            clearable
            v-model="form.sourceType"
            @change="getFindMarketType();checkSlect()"
            placeholder="收入类别"
            class="labelAfterwidth"
          >
            <el-option
              v-for="item in selectInfo.sourceTypes"
              :value="item.id"
              :label="item.typeName"
              :key="item.id+ '-sourceTypes'"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="市场手段"
          :rules="[
      { required: marketTypeisTrue(form.isContinuous,form.provinceId), message:'请选择收入类别',trigger: 'blur'}
    ]"
          prop="marketType"
        >
          <el-select
            v-model="form.marketType"
            @change="checkSlect()"
            placeholder="市场手段"
            clearable
            class="labelAfterwidth"
          >
            <el-option
              v-for="item in selectInfo.marketTypes"
              :key="item.id+ '-marketTypes'"
              :value="item.id"
              :label="item.typeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报名场合" prop="registerType">
          <el-select v-model="form.registerType" @change="checkSlect()" class="labelAfterwidth">
            <el-option
              v-for="item in selectInfo.registerTypes"
              :value="item.id"
              :key="item.typeName+ '-registerTypes'"
              :label="item.typeName"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="市场作用时间" prop="comeTime">
          <el-date-picker
            v-model="form.comeTime"
            type="date"
            placeholder="选择日期"
            class="labelAfterwidth"
          />
        </el-form-item>
        <!-- 需求改造新增 -->
        <el-form-item label="销售人员" style="margin-bottom:0px;">
          <el-form-item label prop="salesUserDeptId">
            <el-select
              clearable
              v-model="form.salesUserDeptId"
              placeholder="部门"
              class="labelAfterwidth"
              @change="getUserListSales(form.salesUserDeptId,form.salesUserRoleId,'salesUsers')"
            >
              <el-option
                v-for="item in headInfo.depts"
                :value="item.deptId"
                :label="item.deptName"
                :key="item.deptId+ '-depts'"
              />
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="salesUserRoleId">
            <el-select
              clearable
              v-model="form.salesUserRoleId"
              placeholder="销售角色"
              class="labelAfterwidth"
              @change="getUserListSales(form.salesUserDeptId,form.salesUserRoleId,'salesUsers')"
            >
              <el-option
                v-for="item in headInfo.roles"
                :value="item.roleId"
                :label="item.roleName"
                :key="item.roleId+ '-roles'"
              />
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="salesUser">
            <el-select v-model="form.salesUser" placeholder="选择人员" class="labelAfterwidth">
              <el-option
                v-for="(item, index) in selectInfo.salesUsers"
                :value="item.userId"
                :label="item.userName"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-form-item>
        <br>
        <!-- 需求改造新增 -->
        <el-form-item label="销售分成" prop="salesDivide">
          <el-radio-group
            v-model="salesDivide"
            @change="getUserListDiv(form.divideUserDeptId,form.divideUserRoleId,'divideUsers');resetData()"
            placeholder="销售分成"
            class="labelAfterwidth"
          >
            <el-radio :label="1">否</el-radio>
            <el-radio :label="0">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="分成人员"
          v-if="salesDivide === 1 ? false : true "
          style="margin-bottom:0px;"
        >
          <el-form-item label prop="divideUserDeptId">
            <el-select
              v-model="form.divideUserDeptId"
              clearable
              placeholder="部门"
              class="labelAfterwidth"
              @change="getUserListDiv(form.divideUserDeptId,form.divideUserRoleId,'divideUsers')"
            >
              <el-option
                v-for="item in headInfo.depts"
                :value="item.deptId"
                :label="item.deptName"
                :key="item.deptId+ '-salesDividedepts'"
              />
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="divideUserRoleId">
            <el-select
              v-model="form.divideUserRoleId"
              clearable
              placeholder="销售角色"
              class="labelAfterwidth"
              @change="getUserListDiv(form.divideUserDeptId,form.divideUserRoleId,'divideUsers')"
            >
              <el-option
                v-for="item in headInfo.roles"
                :value="item.roleId"
                :label="item.roleName"
                :key="item.roleId+ '-salesDivideroles'"
              />
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="divideUser">
            <el-select v-model="form.divideUser" placeholder="选择人员" class="labelAfterwidth">
              <el-option
                v-for="(item ,index) in selectInfo.divideUsers"
                :value="item.userId"
                :label="item.userName"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="salesDivide === 1 ? false : true " label="比例" prop="ratio">
          <div class="labelAfterwidth">{{form.ratio*100}}%</div>
        </el-form-item>
        <!-- 需求改造新增 -->
        <el-form-item label="是否待确认">
          <el-radio-group v-model="form.hasIssue">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="auditDialog = false">取消</el-button>
        <el-button type="primary" @click="editSingleAudit">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/components/Pagination";
import waves from "@/components/directive/waves"; // Waves directive
import { getSingleAudit, editSingleAudit } from "@/api/order/GenetalAudit.js";
import SourceTypeAndMarketType from "@/components/select/SourceTypeAndMarketType";
import {
  sourceTypeIsTrue,
  marketTypeisTrue
} from "@/components/select/SourceTypes";
import {
  selectMarketType,
  selectProvinceId,
  selectSourceType
} from "@/components/select/index";
import { sourceTypeVaildators } from "@/utils/vaildators/sourceTypeVaildators";
export default {
  name: "GeneralAuditDetail",
  mixins: [
    SourceTypeAndMarketType,
    selectMarketType,
    selectProvinceId,
    sourceTypeIsTrue,
    marketTypeisTrue
  ],
  props: {
    updateAuditDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    isContinuousFilter(val) {
      return val == 1 ? "是" : "否";
    }
  },
  directives: { waves },
  components: { pagination },
  computed: {
    // 弹窗显示与否
    auditDialog: {
      get: function() {
        return this.updateAuditDialogVisible;
      },
      set: function(val) {
        this.$emit("update:updateAuditDialogVisible", val);
      }
    }
  },
  data() {
    return {
      sureAuditDialog: false, // 确认审核的弹出框
      headInfo: {}, //
      salesDivide: 1, // 销售分成方式
      form: {
        studentId: null, // 学员id
        name: "", // 学员姓名
        orderId: null, //订单号
        registerType: null, // 报名场合
        comeTime: null, //市场作用时间
        salesUserDeptId: null, // 销售人员所属部门 需求改造新增
        salesUserRoleId: null, // 销售人员所属角色Id 需求改造新增
        salesUser: null, // 销售人员
        divideUserDeptId: null, //分成人员所属部门 需求改造新增
        divideUserRoleId: null, // 分成人员所属角色Id 需求改造新增
        ratio: "0.5", // 分成比例 需求改造新增
        divideUser: null // 分成人员
      },
      rules: {
        studentId: [
          {
            required: true,
            message: "请选择学员ID",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写学员姓名",
            trigger: "change"
          }
        ],
        orderId: [
          {
            required: true,
            message: "请填写订单号",
            trigger: "change"
          }
        ],
        registerType: [
          {
            required: true,
            message: "请选择报名场合",
            trigger: "blur"
          }
        ],
        comeTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        salesUser: [
          {
            required: true,
            message: "请选择人员",
            trigger: "change"
          }
        ],
        divideUser: [
          {
            required: true,
            message: "请选择人员",
            trigger: "change"
          }
        ]
      },
      selectInfo: {
        // sourceTypes:null
      },
      grad: [], // 高考年份
      endTime: null
    };
  },
  created() {},
  methods: {
    resetData() {
      this.form.divideUserDeptId = null;
      this.form.divideUserRoleId = null;
      this.form.divideUser = null;
    },
    // 重置form表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    //获取单个审核信息
    getSingleAudit(orderId) {
      getSingleAudit(orderId)
        .then(res => {
          if (res.status === 200) {
            this.form = res.data;
            if (!res.data) {
              this.form = {
                studentId: null, // 学员id
                name: "", // 学员姓名
                orderId: null, //订单号
                registerType: null, // 报名场合
                comeTime: null, //市场作用时间
                salesUserDeptId: null, // 销售人员所属部门 需求改造新增
                salesUserRoleId: null, // 销售人员所属角色Id 需求改造新增
                salesUser: null, // 销售人员
                divideUserDeptId: null, //分成人员所属部门 需求改造新增
                divideUserRoleId: null, // 分成人员所属角色Id 需求改造新增
                ratio: "", // 分成比例 需求改造新增
                divideUser: null // 分成人员
              }
            }
            this.getHeadInfo(); // 查询省市、高考年份等
            this.getUserListSales(
              res.data.salesUserDeptId,
              res.data.salesUserRoleId,
              "salesUsers"
            );

            this.form.comeTime = this.$format(new Date());
            if (this.form.divideUser) {
              this.salesDivide = 0;
              this.getUserListDiv(
                res.data.divideUserDeptId,
                res.data.divideUserRoleId,
                "divideUsers"
              );
            } else {
              this.salesDivide = 1;
            }
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
    },
    // 修改信息
    editSingleAudit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$confirm("您确认此次操作, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              editSingleAudit(this.form).then(res => {
                if (res.status == 200) {
                  this.$message({
                    message: "审核通过",
                    type: "success"
                  });
                  this.auditDialog = false;
                  this.$emit("reloadList");
                } else {
                  this.$message({
                    message: "修改失败",
                    type: "warning"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消审核"
              });
            });
        } else {
          return false;
        }
      });
    },
    //时间是否符合
    timeIsPublish() {
      if (this.form.startTime) {
        if (!this.form.endTime) {
          this.form.endTime = this.$format(new Date());
        } else {
          this.form.endTime = this.$format(this.endTime);
        }
        const startTime = new Date(this.form.startTime);
        const endTime = new Date(this.form.endTime);

        if (startTime.getTime() - endTime.getTime() >= 0) {
          this.$message({
            message: "选择的时间不符合，请重新选择",
            type: "warning",
            duration: 1000
          });
          return false;
        }
      }
      if (this.form.endTime && !this.form.startTime) {
        this.$message({
          message: "请先选择开始时间",
          type: "warning",
          duration: 1000
        });
        return false;
      }
      return true;
    }
  }
};
</script>
<style scoped>
.span {
  color: #409eff;
  cursor: pointer;
}
.orderDialog .input {
  width: 20em;
}
.orderDialog .labelAfterwidth {
  width: 150px;
}
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
.width200 {
  width: 160px;
}
.el-form-item--mini {
  padding-right: 0;
}
</style>
