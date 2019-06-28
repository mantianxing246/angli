/*
@author Andy
@date 2019/1/18
*/
<template>
  <div>
    <!-- <select-course :selected-courses.sync="courses"/> -->
    <!-- <selected-course :courses.sync="courses"/> -->
    <!-- <create-order-info :create-order-info.sync="createOrderInfo" :payable="payable"/>
    <div class="marginTop20px">
      <el-button type="primary" round @click="createOrder">确认</el-button>
      <el-button type="primary" round>取消</el-button>
    </div>-->
    <card-container :paddingValue="10">
      <template slot="body">
        <div class="selectCourse">
          <h3>选择课程属性</h3>
          <el-checkbox-group v-model="courses" style="display:flex;justify-content:space-around;">
            <el-checkbox :value="1" :label="1" class="font-size-thick2">班教</el-checkbox>
            <el-checkbox :value="2" :label="2" class="font-size-thick2">录播、直播</el-checkbox>
            <el-checkbox :value="3" :label="3" class="font-size-thick2">在线个性化</el-checkbox>
            <el-checkbox :value="4" :label="4" class="font-size-thick2">非学科</el-checkbox>
            <el-checkbox :value="5" :label="5" class="font-size-thick2">其他</el-checkbox>
            <el-checkbox-group v-model="giveCourse">
              <el-checkbox :value="1" :label="1" class="font-size-thick2">赠送课程</el-checkbox>
            </el-checkbox-group>
          </el-checkbox-group>
        </div>
        <div>
          <p class="guide">常见开单问题指南：</p>
          <p class="guide">
            <span class="question">问题1：</span>赠送课程会分摊到金额吗？
          </p>
          <p class="guide">A：不会有金额分摊到赠送课程，课程金额为0，课耗为0。</p>
          <p class="guide">
            <span class="question">问题2：</span>报名费选项怎么用？
          </p>
          <p class="guide">A：勾选报名费后，直接作为权责收入，不分摊到任何课程上。例如，0元班带100元报名费，则100元权责收入，课程金额为0，课耗为0。</p>
          <p class="guide">
            <span class="question">问题3：0元班（带100元报名费）</span>怎么开？
          </p>
          <p class="guide">A：方法一：勾选课程属性（如：班教），选择课程后，实收金额填100，勾选报名费（若有报名费），若没有报名费，实收金额填0，不勾选报名费。</p>
          <p class="guide1">方法二：勾选赠送课程，选择课程后，实收金额填100，勾选报名费（若有报名费），若没有报名费，实收金额填0，不勾选报名费。</p>
          <p class="guide">
            <span class="question">问题4：赠送课程</span>怎么开？
          </p>
          <p class="guide">A：例如赠送网络小课程，买个性化送(包含)录播课等。勾选录播、直播或个性化后，同时勾选赠送课程，随后进行正常开单，实收金额填0（若无报名费）。</p>
          <p class="guide">
            <span class="question">问题5：</span>课程起止日期不能修改，有特殊需求<span class="question">要提前看课或延长看课</span>怎么办？
          </p>
          <p class="guide">A：线下确认审批后，直接只勾选赠送课程，选择需要提前或延长时间段，实收金额填0，不勾选报名费，进行开单。</p>
        </div>
        <el-steps :active="step" finish-status="success" style="margin-top:20px">
          <el-step title="选择产品"></el-step>
          <el-step title="选择课程"></el-step>
          <el-step title="付费信息"></el-step>
          <el-step title="销售信息"></el-step>
        </el-steps>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-col :span="2">
            <el-button @click="goBack">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="stepClick">下一步</el-button>
          </el-col>
        </el-row>
      </template>
    </card-container>
  </div>
</template>
<script>
import StudentInfo from "@/views/order/components/StudentInfo";
import { crateaOrder } from "@/api/order/OrderDetailApi";
import { findProductByOrder } from "@/api/order/FullOrder";
import { nextStepPath } from "../FullOrderFunction/FullOrder.js";
// 注：giveAway字段：0代表要购买的课程，1选择赠送，2优惠赠送(红头文件)
export default {
  name: "FullOrder",
  components: { StudentInfo },
  props: {
    studentId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      giveCourse: [],
      courses: [],
      step: 1, //进度条进度
      orderId: null,
      choiceCourseArr:[]
    };
  },
  methods: {
    //下一步
    stepClick() {
      if (!(this.courses.length != 0 || this.giveCourse[0])) {
        this.$message({
          message: "请选择课程属性",
          type: "warning"
        });
        return;
      }
      let courseArr = this.courseSort(JSON.parse(JSON.stringify(this.courses)));
      localStorage.setItem("courses", JSON.stringify(courseArr));
      localStorage.setItem("giveCourseCus", JSON.stringify(this.giveCourse));
      
      //这里判断一下是否要重新设置choiceCourse
      this.resetChoiceCourse();

      var year = this.$route.query.year;
      var courseChangeInfoId = this.$route.query.courseChangeInfoId;
      var oldOrderId = this.$route.query.oldOrderId;
      var page = courseArr[0];
      if (page) {
        //判断跳那个路径
        nextStepPath({
          page: page,
          year: year,
          studentId: this.studentId,
          orderId: this.orderId,
          router: this.$router,
          courseChangeInfoId: courseChangeInfoId,
          oldOrderId: oldOrderId,
          TransferFull: this.$route.query.TransferFull
        });
      } else {
        var {
          year,
          courseChangeInfoId,
          oldOrderId,
          TransferFull,
          callback
        } = this.$route.query;
        this.$router.push({
          path: "/OrderMgt/FullOrder/" + this.studentId + "/giveCourse",
          query: {
            orderId: this.orderId,
            courseChangeInfoId: courseChangeInfoId,
            oldOrderId: oldOrderId,
            year: year,
            TransferFull: TransferFull,
            callback: callback
          }
        });
      }
    },
    courseSort(courses) {
      for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
          if (courses[i] > courses[j]) {
            let temp = courses[i];
            courses[i] = courses[j];
            courses[j] = temp;
          }
        }
      }
      return courses;
    },
    //回显
    findProductByOrder() {
      let course = [];
      if (this.orderId) {
        findProductByOrder(this.orderId).then(res => {
          if (res.data.type != 3) {
            //如果是试听，则让用户自己选择
            for (let i = 0; i < res.data.orderCourseList.length; i++) {
              let orderCourseList = res.data.orderCourseList[i].courseProperty;
              let giveAway = res.data.orderCourseList[i].giveAway;
              if (orderCourseList == 2 || orderCourseList == 3) {
                if (res.data.orderCourseList[i].giveAway === 0) {
                  course.push(2);
                } else {
                  this.giveCourse = [1];
                }
              } else if (orderCourseList > 3) {
                if (giveAway == 0) {
                  course.push(res.data.orderCourseList[i].courseProperty - 1);
                } else {
                  this.giveCourse = [1];
                }
              } else {
                if (giveAway == 0) {
                  course.push(res.data.orderCourseList[i].courseProperty);
                } else {
                  this.giveCourse = [1];
                }
              }
            }
            let selectCourse = Array.from(new Set(course));
            // //判断对应的是否能够点击
            // for (let i = 1;i <= this.coursesListDisabled.length;i++) {
            //   if (selectCourse.indexOf(i) != -1) {
            //     this.coursesListDisabled[i - 1] = true
            //   }
            // }
            this.courses = selectCourse;
          }
          this.auditRemark = res.data.auditRemark;
        });
      }
    },
    //这里判断一下是否要重新设置choiceCourse
    resetChoiceCourse() {
      let choiceCourse=JSON.parse(localStorage.getItem("choiceCourse"))
      let choiceCourseArray=[]
      let selectCoursesArr=[]
      this.courses.forEach((val)=>{
        if(val==1){
          selectCoursesArr.push("班教")
        }else if(val==2){
          selectCoursesArr.push("录播/直播")
        }else if(val==3){
          selectCoursesArr.push("个性化")
        }else if(val==4){
          selectCoursesArr.push("非学科类")
        }else if(val==5){
          selectCoursesArr.push("其他类")
        }
      })
      this.giveCourse.forEach((val)=>{
        if(val==1){
          selectCoursesArr.push("赠送")
        }
      })

      for(var i=0;i<choiceCourse.length;i++){
         for(var j=0;j<selectCoursesArr.length;j++){
           let propertyName=choiceCourse[i][0].propertyName?choiceCourse[i][0].propertyName:choiceCourse[i][0].coursePropertyName
          //  console.log(selectCoursesArr[j].indexOf(propertyName),propertyName,choiceCourse[i][0].giveAway)
           if(selectCoursesArr[j].indexOf(propertyName)!=-1&&choiceCourse[i][0].giveAway===0){
             break
           }
           if(choiceCourse[i][0].giveAway!=0&&selectCoursesArr.includes("赠送")){
             break
           }
         }
         if(j<selectCoursesArr.length){
           choiceCourseArray.push(choiceCourse[i])
         }
      }

      // console.log(choiceCourseArray)
      localStorage.setItem("choiceCourse",JSON.stringify(choiceCourseArray))
     

    },
    //返回上一页
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    // localStorage.setItem("choiceCourse", JSON.stringify([]))
    this.orderId = this.$route.query.orderId;
    this.courses = JSON.parse(localStorage.getItem("courses"));
    this.giveCourse = JSON.parse(localStorage.getItem("giveCourseCus"));
    this.findProductByOrder();
  }
};
</script>
<style scoped>
.marginTop20px {
  margin: 20px 0px 0px 0px;
  color: #909399;
}
.product {
  margin: 20px 20px 20px 20px;
  color: #909399;
}

.course {
  margin: 20px 20px 20px 20px;
  color: #909399;
}

.selectCourse {
  margin: auto;
  width: 150px;
  font-weight: bold;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
.top {
  margin-top: -20px !important;
}
.guide {
  font-size: 13px;
  margin-top: -7px;
}
.guide1 {
  font-size: 13px;
  margin-left: 23px;
  margin-top: -7px;
}
.question {
  font-weight: bold;
}
.selectCourse h3 {
  margin-top: 3px;
  margin-bottom: -8px;
}
.font-size-thick2 {
  margin-top: 20px;
  font-weight: bold;
}
.selectCourse {
  margin-bottom: 10px;
}
</style>
