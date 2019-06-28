<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item style="margin-right:0;">
        <el-input
          clearable
          v-model="listQuery.discountProgramName"
          placeholder="优惠名称"
          :maxlength="50"
        ></el-input>
      </el-form-item>
      <el-select clearable placeholder="优惠类型" v-model="listQuery.discountProgramType">
        <el-option
          :value="item"
          :label="item"
          v-for="(item,index) in discountProgramType"
          :key="index"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        @click="findDiscountProgramList"
        icon="el-icon-search"
        :loading="loading"
      >搜索</el-button>
      <el-button type="primary" @click="addProgramme">新增优惠方案</el-button>
    </el-form>
    <card-container>
      <template slot="body">
        <el-table
          highlight-current-row
          border
          fit
          center
          stripe
          :data="list"
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column label="优惠名称" align="center" prop="discountProgramName"></el-table-column>
          <el-table-column label="优惠类型" align="center" prop="discountProgramType"></el-table-column>
          <el-table-column label="优惠内容" align="center" prop="condition"></el-table-column>
          <el-table-column label="开始日期" align="center" prop="beginDate" width="100"></el-table-column>
          <el-table-column label="结束日期" align="center" prop="endDate" width="100"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="light"
                content="编辑"
                placement="top"
                style="margin-right:30px"
              >
                <i
                  class="el-icon-edit"
                  size="large"
                  @click="DiscountProgramEdit(scope.row.discountProgramId,scope.row.discountProgramType)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <i class="el-icon-delete" @click="deleteDiscountProgram(scope.row)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- </template>
    </card-container>

    <card-container>
        <template slot="body">-->
        <pagination
          v-show="total>0"
          :limit.sync="listQuery.pageSize"
          :page.sync="listQuery.pageNum"
          :total="total"
          @pagination="getClassList"
        />
      </template>
    </card-container>
    <!-- 编辑 满赠-->
    <programme-step2-edit
      :ProgrammeStep2EditDialog.sync="ProgrammeStep2EditDialog"
      :findDiscountProgramList="findDiscountProgramList"
      ref="programmeStep2Edit"
    />
    <!-- 编辑 满减-->
    <programme-step3-edit
      :ProgrammeStep3EditDialog.sync="ProgrammeStep3EditDialog"
      :findDiscountProgramList="findDiscountProgramList"
      ref="programmeStep3Edit"
    />
    <!-- 编辑 折扣-->
    <programme-step4-edit
      :ProgrammeStep4EditDialog.sync="ProgrammeStep4EditDialog"
      :findDiscountProgramList="findDiscountProgramList"
      ref="programmeStep4Edit"
    />
  </div>
</template>
<script>
import ProgrammeStep2Edit from "./ProgrammeStep2Edit";
import ProgrammeStep3Edit from "./ProgrammeStep3Edit";
import ProgrammeStep4Edit from "./ProgrammeStep4Edit";
import {
  findDiscountProgramList,
  deleteDiscountProgram
} from "@/api/ActivityDiscount/DiscountMgt";

export default {
  name: "DiscountProgramme",
  data () {
    return {
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        discountProgramName: null, //优惠方案名称
        discountProgramType: null //优惠方案类型
      },
      total: 0,
      list: [],
      loading: false,
      discountProgramType: [], //优惠方案类型
      ProgrammeStep2EditDialog: false,
      ProgrammeStep3EditDialog: false,
      ProgrammeStep4EditDialog: false
    };
  },
  methods: {
    getClassList () {
      this.findDiscountProgramList();
    },
    //查询
    findDiscountProgramList () {
      this.loading = true;
      findDiscountProgramList(this.listQuery)
        .then(res => {
          this.loading = false;
          if (res.status == 200) {
            this.list = [];
            res.data.list.forEach((element, index) => {
              this.list.push(element);
              this.list[index].endDate = this.$format(
                new Date(element.endDate)
              );
              this.list[index].beginDate = this.$format(
                new Date(element.beginDate)
              );
              if (this.list[index].discountProgramType) {
                this.list[index].condition =
                  "满" + element.courseAmount + element.discountProgramType;
                if (element.discountProgramType.indexOf("满") != -1) {
                  this.list[index].condition =
                    "满" +
                    element.courseAmount +
                    element.discountProgramType.substring(1);
                }
              }
              if (this.list[index].discountProgramType == "满减") {
                this.list[index].condition += element.discountAmount;
              } else if (this.list[index].discountProgramType == "折扣") {
                this.list[index].condition += element.discountRatio;
              } else {
                this.list[index].condition += "送" + element.propertyName;
              }
              this.list[index].condition;
              // if (element.discountProgramType.indexOf('折扣') != -1) {
              //   this.list[index].condition = "满" + element.courseAmount + element.discountProgramType
              // }
            });
            this.total = res.data.total;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //删除
    deleteDiscountProgram (row) {
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDiscountProgram({
            discountProgramId: row.discountProgramId,
            discountProgramType: row.discountProgramType
          }).then(res => {
            if (res.status == 200) {
              this.$tipsMessage("删除成功", "success");
              this.findDiscountProgramList();
            } else {
              this.$tipsMessage("删除失败", "warning");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //调到新增优惠方案
    addProgramme () {
      this.$router.push("/ActivityDiscountMgt/ProgrammeStep1");
    },
    //编辑
    DiscountProgramEdit (discountProgramId, discountProgramType) {
      if (discountProgramType === "满赠") {
        this.ProgrammeStep2EditDialog = true;
        this.$refs.programmeStep2Edit.getDiscountProgram(
          discountProgramId,
          discountProgramType
        );
        this.$refs.programmeStep2Edit.resetForm();
      } else if (discountProgramType === "满减") {
        this.ProgrammeStep3EditDialog = true;
        this.$refs.programmeStep3Edit.getDiscountProgram(
          discountProgramId,
          discountProgramType
        );
        this.$refs.programmeStep3Edit.resetForm();
      } else if (discountProgramType === "折扣") {
        this.ProgrammeStep4EditDialog = true;
        this.$refs.programmeStep4Edit.getDiscountProgram(
          discountProgramId,
          discountProgramType
        );
        this.$refs.programmeStep4Edit.resetForm();
      }
    }
  },
  created () {
    this.discountProgramType = ["满减", "满赠", "折扣"];
    this.findDiscountProgramList();
  },
  components: {
    ProgrammeStep2Edit,
    ProgrammeStep3Edit,
    ProgrammeStep4Edit
  }
};
</script>
<style scoped>
i {
  cursor: pointer;
}
</style>

