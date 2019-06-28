
<template>
  <div>
    <el-dialog :close-on-click-modal="false" 
      v-el-drag-dialog
      v-loading="true"
      :visible.sync="dialogShow"
      title="编辑满赠优惠"
      width="70%"
      center
      highlight-current-row
      border
      fit
      stripe
    >
      <el-form ref="programmeStep2Form" :model="programmeStep2Form" label-position="right" :rules="rules">
        <el-form-item label="优惠名称" :label-width="labelWidth" prop="discountProgramName">
          <el-input clearable class="iptWidth" v-model="programmeStep2Form.discountProgramName"/>
        </el-form-item>
        <el-form-item label="课程属性" :label-width="labelWidth" prop="discountPropertyList">
          <el-checkbox-group v-model="programmeStep2Form.discountPropertyList">
            <el-checkbox :value="1" :label="1">班教</el-checkbox>
            <el-checkbox :value="2" :label="2">录播、直播</el-checkbox>
            <el-checkbox :value="4" :label="4">在线个性化</el-checkbox>
            <!-- <el-checkbox :value="5" :label="5">咨询类</el-checkbox> -->
            <el-checkbox :value="5" :label="5">非学科</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="有效期" :label-width="labelWidth" prop="beginDate">
          <el-date-picker
            type="date"
            placeholder="开始日期"
            class="iptWidth"
            v-model="programmeStep2Form.beginDate"
          />
          <span>-</span>
          <el-date-picker
            type="date"
            placeholder="结束日期"
            class="iptWidth"
            v-model="programmeStep2Form.endDate"
          />
        </el-form-item>
        <el-form-item label="满" :label-width="labelWidth" prop="courseAmount">
          <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="programmeStep2Form.courseAmount"></AmountInput>
        </el-form-item>
        <el-form-item label="赠送课程" :label-width="labelWidth">
          <el-button type="primary" @click="addOfflinCourse">赠送班教课程</el-button>
          <el-button type="primary" @click="addRecCourse">赠送录播课程</el-button>
          <el-button type="primary" @click="addLiveCourse">赠送直播课程</el-button>
        </el-form-item>
        <el-form-item label="已选赠送课程"></el-form-item>
        <el-form-item>
          <el-table
            style="width: 100%"
            border
            tip
            stripe
            fit
            highlight-current-row
            :data="choiceCourse"
          >
            <el-table-column label="课程属性" prop="coursePropertyName" width="80" align="center"/>
            <el-table-column label="版本" prop="version" width="80" align="center"/>
            <!-- <el-table-column label="年级" prop="gradeName" width="150" align="center"/> -->
            <el-table-column label="课程名称" prop="courseName" width="310" align="center"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="removeCourse(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注" :label-width="labelWidth">
          <el-input
            type="textarea"
            :rows="5"
            style="width:400px;"
            v-model="programmeStep2Form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top:20px">
        <el-button @click="dialogShow=false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="updateProgramme(programmeStep2Form)">确认</el-button>
      </div>
    </el-dialog>
    <!-- 添加班教 -->
    <select-offline-course
      :selectOfflineDialog.sync="dialog.selectOfflineDialog"
      @choiceCourse="offlineChoiceCourse"
    ></select-offline-course>
    <!-- 添加录播 -->
    <select-rec-course
      :selectRecDialog.sync="dialog.selectRecDialog"
      @choiceCourse="offlineChoiceCourse"
    ></select-rec-course>
    <!-- 添加直播 -->
    <select-live-course
      :selectLiveDialog.sync="dialog.selectLiveDialog"
      @choiceCourse="offlineChoiceCourse"
    ></select-live-course>
  </div>
</template>
<script>
import SelectOfflineCourse from "./SelectOfflineCourse";
import SelectRecCourse from "./SelectRecCourse";
import SelectLiveCourse from "./SelectLiveCourse";
import {
  findDiscountProgram,
  updateDiscountProgram
} from "@/api/ActivityDiscount/DiscountMgt";
export default {
  name: "ProgrammeStep2Edit",
  props: ["ProgrammeStep2EditDialog", "findDiscountProgramList"],
  components: {},
  data: function() {
    return {
      labelWidth:'80px',
      loading: false,
      dialog: {
        selectOfflineDialog: false,
        selectRecDialog: false,
        selectLiveDialog: false
      },
      programmeStep2Form: {
        discountProgramId: "",
        discountProgramName: "", //优惠方案名称
        discountPropertyList: [], //优惠方案类型
        beginDate: "", //有效开始日期
        endDate: "", //有效结束日期
        discountProgramType: "满赠", //使用条件传参
        courseAmount: "", //满
        remark: "", //备注
        courseInfoList: [] //已选课程
      },
      rules: {
        discountProgramName: [
          { required: true, message: "请填写优惠名称", trigger: "blur" }
        ],
        discountPropertyList: [
          { required: true, message: "请选择优惠方案类型", trigger: "change" }
        ],
        beginDate: [
          { required: true, message: "请选择有效开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择有效结束日期", trigger: "blur" }
        ],
        courseAmount: [
          { required: true, message: "请填写满减金额", trigger: "blur" }
        ]
      },
      choiceCourse: [],
      hasLive: false
    };
  },
  components: {
    SelectOfflineCourse, //班教
    SelectRecCourse, //录播
    SelectLiveCourse, //直播
    findDiscountProgram,
    updateDiscountProgram
  },
  methods: {
    resetForm() {
      this.$nextTick(() => {
        this.$refs["programmeStep2Form"].resetFields();
      });
    },
    //获取回显信息
    getDiscountProgram(discountProgramId, discountProgramType) {
      this.programmeStep2Form.discountProgramId = discountProgramId;
      findDiscountProgram({
        discountProgramId: discountProgramId,
        discountProgramType: discountProgramType
      }).then(res => {
        if (res.status == 200) {
          this.programmeStep2Form.discountProgramName =
            res.data.discountProgramName;
          this.programmeStep2Form.beginDate = res.data.beginDate;
          this.programmeStep2Form.endDate = res.data.endDate;
          this.programmeStep2Form.discountProgramType =
            res.data.discountProgramType;
          this.programmeStep2Form.courseAmount = res.data.courseAmount;
          this.programmeStep2Form.remark = res.data.remark;
          this.choiceCourse = res.data.courseInfoList;
          for (var i = 0; i < res.data.discountPropertyList.length; i++) {
            if (res.data.discountPropertyList[i].propertyId !== 3) {
              this.programmeStep2Form.discountPropertyList.push(
                res.data.discountPropertyList[i].propertyId
              );
            }
            // this.programmeStep2Form.discountPropertyList.push(
            //   res.data.discountPropertyList[i].propertyId
            // );
          }
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    //添加班教
    addOfflinCourse() {
      this.dialog.selectOfflineDialog = true;
    },
    //添加录播
    addRecCourse() {
      this.dialog.selectRecDialog = true;
    },
    //添加直播
    addLiveCourse() {
      this.dialog.selectLiveDialog = true;
    },
    //选中的课程
    offlineChoiceCourse(val) {
      var course = JSON.parse(JSON.stringify(this.choiceCourse));
      for (let i = 0; i < val.length; i++) {
        for (var j = 0; j < course.length; j++) {
          if (
            course[j].propertyId == val[i].propertyId &&
            course[j].courseId == val[i].courseId
          ) {
            this.$tipsMessage("你选择的课程重复,请重新选择", "warning");
            break;
          } else {
            continue;
          }
        }
        if (j >= course.length) {
          this.choiceCourse.push(val[i]);
        }
      }
    },
    //删除已选择优惠课程
    removeCourse(index) {
      this.choiceCourse.splice(index, 1);
    },
    //确认
    updateProgramme(programmeStep2Form) {
      this.$refs.programmeStep2Form.validate(valid => {
        if (valid) {
          if (!programmeStep2Form.endDate) {
            this.$message({
              message: "请选择有效结束日期",
              type: "warning"
            });
            return;
          }
          if (
            this.$format(programmeStep2Form.endDate) <
            this.$format(programmeStep2Form.beginDate)
          ) {
            this.$message({
              message: "有效结束日期一定要大于有效开始日期哦",
              type: "warning"
            });
            return;
          }
          programmeStep2Form.beginDate = this.$format(
            programmeStep2Form.beginDate
          );
          programmeStep2Form.endDate = this.$format(programmeStep2Form.endDate);
          let propertyIds = JSON.parse(
            JSON.stringify(this.programmeStep2Form.discountPropertyList)
          );
          if (propertyIds.includes(2)) {
            propertyIds.push(3);
          }
          this.loading = true;
          let form = {
            discountProgramName: this.programmeStep2Form.discountProgramName, //优惠方案名称
            propertyIds: propertyIds, //优惠方案类型
            beginDate: this.programmeStep2Form.beginDate, // 有效开始日期
            endDate: this.programmeStep2Form.endDate, //有效结束日期
            discountProgramType: this.programmeStep2Form.discountProgramType, //使用条件传参
            courseAmount: this.programmeStep2Form.courseAmount, //满
            remark: this.programmeStep2Form.remark, //备注
            courseInfoList: this.choiceCourse, //已选课程
            discountProgramId: this.programmeStep2Form.discountProgramId
          };
          updateDiscountProgram(form)
            .then(res => {
              this.loading = false;
              if (res.status == 200) {
                this.$message({
                  message: "编辑满赠优惠成功",
                  type: "success"
                });
                this.dialogShow = false;
                this.findDiscountProgramList();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        }
      });
    }
  },
  computed: {
    dialogShow: {
      set(val) {
        this.$emit("update:ProgrammeStep2EditDialog", val);
      },
      get() {
        return this.ProgrammeStep2EditDialog;
      }
    }
  },
  created() {}
};
</script>
<style scoped>
.iptWidth {
  width: 200px;
}
.span {
  padding-left: 10px;
  font-size: 14px;
  color: #606266;
}
</style>

