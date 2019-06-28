<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-position="right">
      <card-container :paddingValue='10'>
      <template slot="body">
      <el-form-item label="优惠名称" :label-width="labelWidth" prop="discountProgramName">
        <el-input clearable class="iptWidth" v-model="form.discountProgramName"/>
      </el-form-item>
      <el-form-item label="课程属性" :label-width="labelWidth" prop="discountPropertyList">
        <el-checkbox-group v-model="form.discountPropertyList">
          <el-checkbox :value="1" :label="1">班教</el-checkbox>
          <el-checkbox :value="2" :label="2">录播、直播</el-checkbox>
          <el-checkbox :value="4" :label="4">在线个性化</el-checkbox>
          <!-- <el-checkbox :value="5" :label="5">咨询类</el-checkbox> -->
          <el-checkbox :value="5" :label="5">非学科</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="有效期" :label-width="labelWidth" prop="beginDate">
        <el-date-picker type="date" placeholder="开始日期" class="iptWidth" v-model="form.beginDate"/>
        <span>-</span>
        <el-date-picker type="date" placeholder="结束日期" class="iptWidth" v-model="form.endDate"/>
      </el-form-item>
      <el-form-item label="满" :label-width="labelWidth" prop="courseAmount">
          <AmountInput money="￥" placeholder="" class="iptWidth" :amount.sync="form.courseAmount"></AmountInput>
      </el-form-item>
      <el-form-item label="赠送课程" :label-width="labelWidth">
        <el-button type="primary" @click="addOfflinCourse">赠送班教课程</el-button>
        <el-button type="primary" @click="addRecCourse">赠送录播课程</el-button>
        <el-button type="primary" @click="addLiveCourse">赠送直播课程</el-button>
      </el-form-item>
      </template>
    </card-container>
      <card-container :paddingValue='10'>
      <template slot="body">
        <el-form-item label="已选赠送课程">
        </el-form-item>
        <el-form-item label="">
          <el-table style="width: 100%" border tip stripe highlight-current-row :data="choiceCourse">
          <el-table-column label="课程属性" prop="coursePropertyName" width="150" align="center"/>
          <el-table-column label="版本" prop="proYear" width="150" align="center"/>
          <el-table-column label="年级" prop="gradeName" width="150" align="center"/>
          <el-table-column label="课程名称" prop="courseName" align="center"/>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="removeCourse(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-form-item>
        <el-form-item label="备注" :label-width="labelWidth">
        <el-input type="textarea" :rows="5" style="width:400px;" v-model="form.remark"></el-input>
      </el-form-item>
      <el-steps :active="step" finish-status="success" style="margin-top:20px">
      <el-step title="选择优惠类型"></el-step>
      <el-step title="设置优惠内容"></el-step>
    </el-steps>
    <el-row type="flex" justify="center" style="margin-top:20px">
      <el-button style="width:68px;height:29px" @click="goBack">取消</el-button>
      <el-button type="primary" @click="goPrevious">上一步</el-button>
      <el-button
        style="width:68px;height:29px"
        type="primary"
        :loading="loading"
        @click="confirm(form)"
      >确认</el-button>
    </el-row>
     </template>
    </card-container>
    </el-form>
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
import { insertFullIncrease } from '@/api/ActivityDiscount/DiscountMgt'
import SelectOfflineCourse from "./SelectOfflineCourse";
import SelectRecCourse from "./SelectRecCourse";
import SelectLiveCourse from "./SelectLiveCourse";
import { validatorFactory } from "@/utils/async-validator";
export default {
  name: "ProgrammeStep2",
  data () {
    return {
      labelWidth:'80px',
      step: 2,
      dialog: {
        selectOfflineDialog: false,
        selectRecDialog: false,
        selectLiveDialog: false,
      },
      loading: false,
      form: {
        discountProgramName: '',  //优惠方案名称
        discountPropertyList: [],  //优惠方案类型
        beginDate: '',            //有效开始日期
        endDate: '',              //有效结束日期
        discountProgramType: '满赠',  //使用条件传参
        courseAmount: '',   //满
        remark: '',    //备注
        courseInfoList: []  //已选课程
      },
      rules: {
        discountProgramName: [{ required: true, message: '请填写优惠名称', trigger: 'blur' }],
        discountPropertyList: [{ required: true, message: '请选择优惠方案类型', trigger: 'change' }],
        beginDate: [{ required: true, message: '请选择有效开始日期', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择有效结束日期', trigger: 'blur' }],
        courseAmount: [{ required: true, message: '请填写满减金额', trigger: 'blur' }, validatorFactory("请输入正确的数字")],
      },
      choiceCourse: [],
    }
  },
  components: {
    SelectOfflineCourse,   //班教
    SelectRecCourse,    //录播
    SelectLiveCourse,    //直播
    insertFullIncrease,
  },
  methods: {
    //添加班教
    addOfflinCourse () {
      this.dialog.selectOfflineDialog = true;
    },
    //添加录播
    addRecCourse () {
      this.dialog.selectRecDialog = true;
    },
    //添加直播
    addLiveCourse () {
      this.dialog.selectLiveDialog = true;
    },
    //选中的课程
    offlineChoiceCourse (val) {
      var course = JSON.parse(JSON.stringify(this.choiceCourse));
      for (let i = 0;i < val.length;i++) {
        for (var j = 0;j < course.length;j++) {
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
    removeCourse (index) {
      this.choiceCourse.splice(index, 1);
    },
    //确认
    confirm (form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.endDate) {
            this.$message({
              message: "请选择有效结束日期",
              type: "warning"
            })
            return
          }
          if (this.$format(this.form.endDate) < this.$format(this.form.beginDate)) {
            this.$message({
              message: '有效结束日期一定要大于有效开始日期哦',
              type: 'warning'
            })
            return
          }
          this.form.beginDate = this.$format(this.form.beginDate)
          this.form.endDate = this.$format(this.form.endDate)
          let propertyIds = JSON.parse(JSON.stringify(this.form.discountPropertyList))
          if (propertyIds.includes(2) && !propertyIds.includes(3)) {
            propertyIds.push(3)
          }
          this.loading = true
          this.form.courseInfoList = this.choiceCourse;
          let form = {
            discountProgramName: this.form.discountProgramName,  //优惠方案名称
            propertyIds: propertyIds,  //优惠方案类型
            beginDate: this.form.beginDate, // 有效开始日期
            endDate: this.form.endDate, //有效结束日期
            discountProgramType: this.form.discountProgramType, //使用条件传参
            courseAmount: this.form.courseAmount, //满
            remark: this.form.remark, //备注
            courseInfoList: this.choiceCourse //已选课程
          };
          console.log(form)
          insertFullIncrease(form).then((res) => {
            this.loading = false;
            if (res.status == 200) {
              this.$message({
                message: "新增满赠优惠成功",
                type: "success"
              })
              this.goBack();
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              })
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      })
    },
    //返回
    goBack () {
      this.$router.push("/ActivityDiscountMgt/ActivityDiscountMgt")
    },
    //上一步
    goPrevious () {
      this.$router.push("/ActivityDiscountMgt/ProgrammeStep1")
    }
  }
}
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
