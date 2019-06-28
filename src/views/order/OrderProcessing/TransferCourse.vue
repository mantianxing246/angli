/*
@author lfz
@date 2019/2/26
*/
<template>
  <div class="app-container">
    <!-- <div>申请转课</div> -->
    <card-container class="el-row-Container" :orderNo="this.$route.query.orderNo">
      <template slot="body">
        <course-info
          :order-course-ids="orderCourseIds"
          :course-info.sync="courseInfo"
          :order-id="this.$route.query.orderId"
          class="space"
          @addPeople="addPeople"
        />
      </template>
    </card-container>
    <card-container :paddingValue="10" class="el-row-Container">
      <template slot="body">
        <el-form
          ref="transferCourse"
          :rules="rules"
          inline
          :model="courseChangeInfo"
          label-width="110px"
        >
          <!-- <el-row :gutter="20" type="flex">
          <el-col :span="5">-->
          <el-form-item label="操作人员">
            <!-- <el-input v-model="courseChangeInfo.oprationName" disabled/> -->
            {{ courseChangeInfo.oprationName }}
          </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="5"> -->
          <el-form-item label="销售人员" prop="oprationId">
            <!-- <el-input v-model="courseChangeInfo.oprationName" disabled/> -->
            {{ courseChangeInfo.salesUserName }}
          </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="5"> -->
          <el-form-item label="分成人员" prop="oprationId">
            <!-- <el-input v-model="courseChangeInfo.oprationName" disabled/> -->
            {{ courseChangeInfo.divideUserName }}
          </el-form-item>
          <!-- </el-col>
          </el-row>
          <el-row :gutter="20">
          <el-col :span="6">-->
          <br>
          <el-form-item label="转课申请单号" prop="changeNo">
            <el-input
              v-model="courseChangeInfo.changeNo"
              :maxlength="50"
              clearable
              class="width120"
            />
          </el-form-item>
          <!-- </el-col>
          <el-col :span="6">-->
          <el-form-item label="转课日期" prop="operateTime">
            <el-date-picker
              v-model="courseChangeInfo.operateTime"
              type="date"
              value-format="yyyy-MM-dd"
              style="width: inherit"
            />
          </el-form-item>
          <!-- </el-col>
          </el-row>
          <el-row :gutter="20">
          <el-col :span="12">-->
          <br>
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="courseChangeInfo.remark" :maxlength="150" type="textarea"/>
          </el-form-item>
          <!--  </el-col> -->
          <!-- </el-row>  -->
        </el-form>
        <!-- <div slot="footer" class="footer">
    <el-button @click="$router.go(-1)">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
        </div>-->
        <!-- <el-row :gutter="20" type="flex" justify="center"> -->
        <!-- <el-col :span="3"> -->
        <div slot="footer" class="footer">
          <el-button @click="$router.go(-1)">取消</el-button>
          <!-- </el-col>
          <el-col :span="3">-->
          <el-button type="primary" @click="changeCourse">转课开单</el-button>
        </div>
        <!-- </el-col>
        </el-row>-->
      </template>
    </card-container>
  </div>
</template>

<script>
import CourseInfo from "@/views/order/components/CourseInfo";
import { changeCourse } from "@/api/order/TransferCourseApi";
import clearNumber from "@/components/FullOrder/ClearLocalAndVuex";
export default {
  name: "TransferCourse",
  components: { CourseInfo },
  mixins: [clearNumber],
  data() {
    return {
      courses: [],
      courseInfo: [],
      courseChangeInfo: {
        remark: "",
        operateBy: JSON.parse(localStorage.getItem("states")).user.userId,
        oprationName: JSON.parse(localStorage.getItem("states")).user.name,
        operateTime: "",
        changeNo: "",
        orderId: this.$route.query.orderId,
        salesUserLoginId: null, // 分成人员
        divideUserLoginId: null // 销售人员
      },
      rules: {
        operateTime: [
          { required: true, message: "必须选择日期", trigger: "blur" }
        ],
        changeNo: [
          { required: true, message: "必须填写转课申请单号", trigger: "blur" }
        ]
      },
      orderCourseIds: this.$store.state.fullStorage.TransferCourse
    };
  },
  methods: {
    changeCourse() {
      this.$refs.transferCourse.validate(pass => {
        if (this.changeAmountIsNum() && pass) {
          const changeOrderCourses = [];
          for (let i = 0; i < this.courseInfo.length; i++) {
            changeOrderCourses.push({
              orderCourseId: this.courseInfo[i].orderCourseId,
              // residuePrice: this.courseInfo[i].residualPrice,
              changeAmount: parseFloat(this.courseInfo[i].changeAmount)
            });
          }
          changeCourse({
            orderId: this.$route.query.orderId,
            changeOrderCourses: changeOrderCourses,
            courseChangeInfo: this.courseChangeInfo
          }).then(res => {
            if (res.status == 200) {
              this.$tipsMessage("转课申请成功", "success");
              this.$router.push({
                path:
                  "/OrderMgt/FullOrder/" +
                  res.data.studentId +
                  "/fullOrderStepSelectClass",
                query: {
                  year: res.data.year,
                  courseChangeInfoId: res.data.courseChangeInfoId,
                  TransferFull: 1
                }
              });
              
              this.clearNumber(); //用于清空local数据和vuex中的数据
            } else {
              this.$tipsMessage("转课申请失败", "warning");
            }
          });
        }
      });
    },
    addPeople(val) {
      this.courseChangeInfo.salesUserName = val.salesUserName
        ? val.salesUserName
        : "无";
      this.courseChangeInfo.divideUserName = val.divideUserName
        ? val.divideUserName
        : "无";
    },
    // 查看输入的金额是否正确
    changeAmountIsNum() {
      for (let i = 0; i < this.courseInfo.length; i++) {
        if (
          this.courseInfo[i].changeAmount !=
          Number(this.courseInfo[i].changeAmount)
        ) {
          this.$tipsMessage(
            "输入的金额不正确，查看是否是数字并且不能为0",
            "warning"
          );
          return false;
        }
        if (
          this.courseInfo[i].changeAmount > this.courseInfo[i].residualPrice
        ) {
          this.$tipsMessage("转课金额不能超过剩余金额", "warning");
          return false;
        }
      }
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.space {
  margin-bottom: 20px;
  margin-top: 20px;
}
.footer {
  margin-left: 40%;
}
</style>
