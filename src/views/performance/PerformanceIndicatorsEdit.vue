<!--
 * @author jiakun
 * @date 2019/4/5
-->
<template>
  <div class="app-container offln-course-edit">
    <DialogContainer
      title="编辑业绩指标"
      :visible.sync="courseDialog"
      width="40%"
      style="min-width:1000px"
      :diglogClass="['']"
    >
      <template slot="body">
        <el-form class="display" ref="form" :model="form" label-position="left">
          <el-form-item label="部门:" class="inline">
            <div>{{form.deptName}}</div>
          </el-form-item>
          <el-form-item label="年份:" class="inline">
            <div>{{form.year}}</div>
          </el-form-item>
        </el-form>
        <el-table
          :data="list"
          border
          :summary-method="getSummaries"
          show-summary
          style="width: 100%;"
        >
          <el-table-column prop="month" label="月份" align="center"></el-table-column>
          <el-table-column label="班教指标(元)" align="center" prop="offlineIndex">
            <template slot-scope="scope">
              <el-input
                :maxlength="10"
                v-model="scope.row.offlineIndex"
                style="width:80%"
                clearable
                :disabled="selectable(scope.row)"
                @change="changeAmount(scope.row.offlineIndex)"
              />
            </template>
          </el-table-column>
          <el-table-column label="网课指标(元)" align="center" prop="onlineIndex">
            <template slot-scope="scope">
              <el-input
                :maxlength="10"
                v-model="scope.row.onlineIndex"
                style="width:80%"
                clearable
                :disabled="selectable(scope.row)"
                @change="changeAmount(scope.row.onlineIndex)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="totalIndex" label="合计(元)" align="center"></el-table-column>
        </el-table>
        <el-row>
          <el-col style="text-align:center;margin:20px 0;">
            <el-button @click="courseDialog = false">取 消</el-button>
            <el-button :loading="sunLoading" type="primary" @click="editCourse(list)">确 定</el-button>
          </el-col>
        </el-row>
      </template>
    </DialogContainer>
  </div>
</template>
<script>
import waves from "@/components/directive/waves";
import {
  getSingleCourse,
  updateCourseConsumption
} from "@/api/performance/PerformanceIndicators";
import { fips } from "crypto";
export default {
  name: "PerformanceIndicatorsEdit",
  directives: { waves },
  props: ["updateCourseDialogVisible", "showMessage"],
  // props: {
  //   updateCourseDialogVisible: {
  //     type: Boolean,
  //     default: false
  //   },
  // },
  data() {
    return {
      sunLoading: false,
      form: {
        year: "", //年份
        deptName: "" //部门
      },
      shProductAchievementDTOList: [],
      list: []
    };
  },
  computed: {
    courseDialog: {
      get: function() {
        return this.updateCourseDialogVisible;
      },
      set: function(val) {
        this.$emit("update:updateCourseDialogVisible", val);
      }
    }
  },
  methods: {
    changeAmount(val) {
      if (val != Number(val)) {
        this.$tipsMessage("请输入数字", "warning");
        return;
      }
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    getSingleCourse(deptId, msg) {
      getSingleCourse(deptId, msg).then(res => {
        if (!res.data) {
          this.$message({
            message: "数据获取失败",
            type: "warning"
          });
          return;
        }
        this.list = res.data;
        this.form.year = this.list[0].year;
        this.form.deptName = this.list[0].deptName;
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].totalIndex =
            res.data[i].offlineIndex + res.data[i].onlineIndex;
        }
      });
    },
    getSummaries(param) {
      for (var i = 0; i < this.list.length; i++) {
        this.list[i].totalIndex =
          Number(this.list[i].offlineIndex) + Number(this.list[i].onlineIndex);
      }
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " ";
        }
      });
      return sums;
    },
    selectable(row) {
      let months = [];
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (row.year > year) {
        return false;
      } else if (row.year == year) {
        if (row.month < month) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    editCourse(list) {
      let num = 0;
      let flag = true; // 默认都有值
      let allflag = true; // 默认都没值
      for (let i = 0; i < list.length; i++) {
        if (
          list[i].onlineIndex === "" ||
          list[i].onlineIndex === null ||
          list[i].onlineIndex == 0 
        ) {
          num++;
        }
        if( 
          list[i].offlineIndex === "" ||
          list[i].offlineIndex === null ||
          list[i].offlineIndex == 0){
             num++;
        }
      }
      console.log(num,list.length*2)
      if(num === list.length*2){
         this.$message({
            message: "请至少设置一个月份的业绩指标",
            type: "warning"
          }); 
      }else if(num > 0 && num < list.length*2){
         this.$confirm("部分月业绩指标未设置，是否放弃设置？", "消息")
          .then(() => {
            this.editCourse1(list);
          })
          .catch(() => {}); 
      }else if(num === 0){
         this.editCourse1(list);
      }else{

      }
      //   if( list[i].onlineIndex != "" ||
      //     list[i].onlineIndex != null ||
      //     list[i].onlineIndex != 0 ||
      //     list[i].offlineIndex != "" ||
      //     list[i].offlineIndex != null ||
      //     list[i].offlineIndex !== 0){
      //        allflag = false;
      //   }
      // // }
      // if (flag === false && allflag === false) {
      //   // 1一个月或几个月为空
      //    this.$confirm("部分月业绩指标未设置，是否放弃设置？", "消息")
      //     .then(() => {
      //       this.editCourse1(list);
      //     })
      //     .catch(() => {}); 
      //      return
      // } 
    
      // if(allflag === true) {// 12个月都为空
      //    this.$message({
      //       message: "请至少设置一个月份的业绩指标",
      //       type: "warning"
      //     }); 
      //     return
      // }
     
      // if (flag === true) {  // 默认都有值
      //   this.editCourse1(list);
      // } 


    },
    editCourse1(list) {
      let shProductAchievementDTOList = [];
      shProductAchievementDTOList = this.list;
      updateCourseConsumption(
        Object.assign({}, { shProductAchievementDTOList })
      ).then(res => {
        this.sunLoading = false;
        if (res.status === 200) {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.$parent.findShAchievementList();
          this.courseDialog = false;
        } else {
          this.$message({
            message: "编辑失败",
            type: "warning"
          });
        }
      });
    }
  },
  created() {
    //  this.selectable()
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 0;
}
.width200 {
  width: 180px;
}
.display {
  display: flex;
}
.inline {
  width: 110px;
  display: inline;
}
.inline div {
  display: inline;
}
</style>
