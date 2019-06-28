<!--
 * @author hongdengru
 * @date 2019/1/29
-->
<template>
  <div class="app-container rec-live-course">
    <el-form inline ref="form" :model="form" :rules="rules" label-position="left">
      <el-form-item>
        <el-input
          style="width:120px"
          v-model="form.name"
          clearable
          placeholder="学员姓名"
          @clear="clear('学员姓名')"
        />
        <el-input
          :style="{width:$selectConfig.studentRoleIdWidth+'px'}"
          v-model="form.uId"
          clearable
          placeholder="学员ID"
          @clear="clear('学员ID')"
        />
        <el-input style="width:150px" v-model="form.orderNo" placeholder="订单号" clearable @clear="clear('订单号')"/>
        <el-select
          v-model="form.grade"
          clearable
          placeholder="高考年份"
          style="width:100px"
          @clear="clear('高考年份')"
        >
          <el-option v-for="item in headInfo.years" :value="item" :key="item" :label="item"/>
        </el-select>
        <el-date-picker
          v-model="selectTimer"
          type="daterange"
          range-separator="-"
          start-placeholder="付费日期"
          end-placeholder="付费日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <br>
      <el-form-item>
        <el-select
          v-model="form.sourceId"
          clearable
          placeholder="收入类别"
          class="width120"
          @change="sourceIdChange(form.sourceId)"
          @clear="clear('收入类别')"
        >
          <el-option
            v-for="item in selectInfo.sourceTypes"
            :value="item.id"
            :label="item.typeName"
            :key="item.id"
          >{{ item.typeName }}</el-option>
        </el-select>
        <el-select
          v-model="form.marketId"
          clearable
          placeholder="市场手段"
          class="width120"
          @clear="clear('市场手段')"
        >
          <el-option
            v-for="item in marketTypes"
            :value="item.id"
            :label="item.typeName"
            :key="item.id"
          >{{ item.typeName }}</el-option>
        </el-select>
        <el-select
          v-model="orderStatusCom"
          clearable
          placeholder="审核状态"
          style="width:100px;"
          @clear="clear('审核状态')"
        >
          <el-option :value="0" label="未审核"></el-option>
          <el-option :value="1" label="待确认"></el-option>
          <el-option :value="2" label="已审核"></el-option>
        </el-select>
        <el-button
          v-waves
          type="primary"
          @click.stop="getAuditList"
          :loading="listLoading"
          icon="el-icon-search"
        >查询</el-button>
        <el-button
          v-waves
          style="margin-left:10px"
          type="primary"
          @click.stop="handleDownload"
          :loading="listLoading"
          icon="el-icon-search"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
    <el-table
      :data="tableList"
      v-loading="listLoading"
      highlight-current-row
      border
      fit
      stripe
      style="width: 100%;"
      id="GeneralAuditMgt"
    >
      <el-table-column
        v-for="(item ,index) in tableExcel"
        :key="index"
        :align="item.align"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width:null"
        :min-width="item['min-width'] ? item['min-width']:null"
        :fixed="item.fixed?item.fixed:null"
      >
        <template slot-scope="scope" style="display: flex;justify-content: space-between">
          <div>
            <span v-if="$tableConfig.filterPriceField[item.prop]">{{scope.row[item.prop]|price}}</span>
            <span
              v-else-if="item.prop === 'isContinuous'"
            >{{ scope.row.isContinuous|isContinuousFilter }}</span>
            <span v-else-if="item.prop === '审核'" class="span" @click="audit(scope.row.orderId)">审核</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :limit.sync="form.pageSize"
      :page.sync="form.pageNum"
      :total="total"
      @pagination="getAuditList"
    />
    </div>
      </template>
    </Card-Container>
    <GeneralAuditDetail
      ref="generalAuditDetail"
      :update-audit-dialog-visible.sync="updateAuditDialogVisible"
      @reloadList="getAuditList"
    />
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import { getHeadInfo as getSelectInfo } from "@/api/order/HeadInfoApi"; //市场手段
import { export_table_to_excel } from "@/export/indexXlsx";
import waves from "@/components/directive/waves"; // Waves directive
import GeneralAuditDetail from "@/views/order/GeneralAudit/GeneralAuditDetail"; // 审核弹窗
import { getAuditList ,exportOfficeAudit} from "@/api/order/GenetalAudit.js";
import { tableExcel } from "./GeneralAuditMgtTable";
import { xlsxForTable } from "@/components/table/tableBaseClass/exportXlsx";
import {
  findMarketType
} from '@/api/common/common.js';
export default {
  name: "GeneralAuditMgt", //总办审核列表页
  filters: {
    isContinuousFilter (val) {
      if (val === 1) {
        return "是";
      }
      if (val === 0) {
        return "否";
      }
      return "";
    }
  },
  directives: { waves },
  components: { GeneralAuditDetail },
  data () {
    return {
      selectTimer:'',
      marketTypes:[],
      tableExcel: tableExcel,
      updateAuditDialogVisible: false, // 订单审核的弹出框
      headInfo: {}, //下拉框信息（包含高考年份）
      selectInfo: {}, //下拉框信息（包含市场手段、收入类别等）
      form: {
        // 学员信息
        uId: null, // 学员id
        name: null, // 学员名字
        orderNo: null, // 订单号
        status: "", //订单状态
        grade: null, // 高开年份
        sourceId: null, // 收入类别id
        marketId: null, // 市场手段id
        startTime: null, //付款日期
        endTime: null, //付款日期
        pageNum: 1,
        pageSize: 20,
        orderStatusList: null
      },
      rules: {
        studentId: [
          { pattern: /^\d+$/, message: "必须是数字", trigger: "blur" }
        ]
      },
      orderStatusCom: null, //审核状态
      total: 0,
      listLoading: false, //loading
      tableList: []
    };
  },
  created () {
    this.getHeadInfo(); // 查询高考年份
    this.getSelectInfo(); //查询收入类别、市场手段
    findMarketType('').then((res) => {
        this.marketTypes = res.data
    })
  },
  mounted () {
    this.getAuditList(); //查询列表
  },
  methods: {
    sourceIdChange(v){
      findMarketType(v).then((res) => {
        this.marketTypes = res.data
      })
    },
    //导出成excel表格
    handleDownload () {
      var obj =  JSON.parse(JSON.stringify(this.form))
      delete obj.pageNum;
      delete obj.pageSize;
      exportOfficeAudit(obj).then((res) =>{
      export_table_to_excel(new xlsxForTable(tableExcel, res.data).getOutAndranges(), "总办审查");

      })
    },
    //获取省市、高考年份
    getHeadInfo () {
      getHeadInfo().then(res => {
        if (res.status === 200) {
          this.headInfo = res.data;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 获取市场手段、收入类别
    getSelectInfo () {
      getSelectInfo().then(res => {
        if (res.status === 200) {
          this.selectInfo = res.data;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 获取列表
    getAuditList () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.listLoading = true;
          //未审核
          if (this.orderStatusCom === 0) {
            this.form.orderStatusList = [201, 202, 203, 204, 299];
            this.form.hasIssue = 0; //否
          }
          //待确认
          if (this.orderStatusCom === 1) {
            this.form.orderStatusList = [201, 202, 203, 204, 299];
            this.form.hasIssue = 1; //是
          }
          //已审核
          if (this.orderStatusCom === 2) {
            this.form.orderStatusList = [501, 502, 503, 504, 599];
            this.form.hasIssue = 0; //否
          }
          if (this.orderStatusCom === null) {
            this.form.orderStatusList = null;
            this.form.hasIssue = null; //否
          }
          this.form.startTime = this.selectTimer ? this.selectTimer[0] : null;
          this.form.endTime = this.selectTimer ? this.selectTimer[1] : null;
          if (this.form.uId === "") {
            this.form.uId = null;
          }
          for(let k in this.form){
            if(this.form[k] === ""){
              this.form[k] = null
            }
          }
          getAuditList(this.form).then(res => {
            if (res.status === 200) {
              // this.tableList = res.data.list
              this.total = res.data.total;
              this.tableList = res.data.list;
              this.listLoading = false;
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
              this.listLoading = false;
            }
          });
        }
      });
    },
    // 审核操作
    audit (orderId) {
      this.updateAuditDialogVisible = true;
      // 获取编辑弹窗省市、年级等列表
      this.$refs.generalAuditDetail.getHeadInfo();
      this.$refs.generalAuditDetail.resetForm(); // 重置编辑弹窗form表单
      // 获取当前审核信息
      this.$refs.generalAuditDetail.getSingleAudit(orderId);
    },
    //点击clraeable时，相关数据变为null
    clear (val) {
      switch (val) {
        case "学员ID":
          this.form.studentId = null;
          break;
        case "学员姓名":
          this.form.name = null;
          break;
        case "高考年份":
          this.form.grade = null;
          break;
        case "订单号":
          this.form.orderNo = null;
          break;
        case "付费日期1":
          this.form.startTime = null;
          break;
        case "付费日期2":
          this.form.endTime = null;
          break;
        case "收入类别":
          this.form.sourceId = null;
          break;
        case "审核状态":
          this.orderStatusCom = null;
          break;
        case "市场手段":
          this.form.marketId = null;
          break;
      }
    }
  }
};
</script>
<style scoped>
.width120 {
  width: 120px;
}
.span {
  color: #409eff;
  cursor: pointer;
}
</style>
