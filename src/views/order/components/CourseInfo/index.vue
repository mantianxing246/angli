/*
@author lfz
@date 2019/2/27
*/
<template>
  <div>
    <card-container>
      <template slot="body">
        <el-table
          v-loading="listLoading"
          :data="list"
          highlight-current-row
          border
          fit
          stripe
          style="width: 100%;"
        >
          <el-table-column label="课程属性" align="center" prop="propertyName"/>
          <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
          <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
          <el-table-column label="课程状态" align="center" prop="statusName"/>
          <el-table-column label="开始日期" align="center" prop="startDate"/>
          <el-table-column label="结束日期" align="center" prop="endDate"/>
          <el-table-column label="剩余金额" align="center">
            <template
              slot-scope="scope"
            >{{scope.row.residualPrice?scope.row.residualPrice.toLocaleString():null}}</template>
          </el-table-column>
          <el-table-column label="转课金额" align="center" width="150">
            <template slot-scope="scope">
              <div
                style="text-align:center;line-height:36px;display:flex; align-items:center;flex-direction:column;"
              >
                <!-- <el-input
                  style="float:left;width:100px"
                  v-model="scope.row.changeAmount"
                  @change="changAmountIsNum(scope.row.changeAmount,scope.row.residualPrice)"
                  clearable
                ></el-input>元-->
                <amount-input
                  :amount.sync="scope.row.changeAmount"
                  money="￥"
                  style="width:100px;"
                  @changeAmount="changAmountIsNum(scope.row.changeAmount,scope.row.residualPrice)"
                ></amount-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </card-container>
  </div>
</template>
<script>
import { findOrderCourse } from "@/api/order/TransferCourseApi";

export default {
  name: "CourseInfo",
  props: ["orderCourseIds", "orderId"],
  data () {
    return {
      list: [],
      listLoading: false
    };
  },
  created () {
    this.findOrderCourse();
  },
  methods: {
    findOrderCourse () {
      findOrderCourse({
        orderCourseIds: this.orderCourseIds,
        orderId: this.orderId
      }).then(res => {
        if (res.status === 200) {
          this.list = res.data.courseList;
          this.$emit("update:courseInfo", this.list);
          this.$emit("addPeople", res.data);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    changAmountIsNum (val, residualPrice) {
      let money = /^[1-9]\d*$/;
      if (val != Number(val)) {
        this.$tipsMessage(
          "输入的金额不正确，请查看是否是数字并且不能为0",
          "warning"
        );
        return;
      }
      if (val - residualPrice > 0) {
        this.$tipsMessage("转课金额不能超过剩余金额", "warning");
      }
    }
  }
};
</script>
<style>
