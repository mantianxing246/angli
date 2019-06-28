<template>
  <div class="entry-form">
    <el-radio-group v-model="grade" class="margin-bottom" style="margin-left:20px">
      <el-radio :label="1" :value="1" @change="clear(1)">初中</el-radio>
      <el-radio :label="2" :value="2" @change="clear(2)">高中</el-radio>
    </el-radio-group>

    <div style="margin-left:20px" v-show="grade==1">
      <div class="margin-bottom">
        <div class="margin-bottom10">报名网课系统课课程项目</div>
        <el-row type="flex">
          <el-col :span="2">初二</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll1"
              @change="selectAllChange(selectAll.selectAll1,1)"
              :indeterminate="isIndeterminate.isIndeterminate1"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="systemSecond"
              @change="selectAllChangeClick(systemSecond,1)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">初三</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll2"
              @change="selectAllChange(selectAll.selectAll2,2)"
              :indeterminate="isIndeterminate.isIndeterminate2"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="systemThress"
              @change="selectAllChangeClick(systemThress,2)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>

      <div class="margin-bottom">
        <div class="margin-bottom10">报名网课自招课课程项目</div>
        <el-row type="flex">
          <el-col :span="2">初二</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll3"
              @change="selectAllChange(selectAll.selectAll3,3)"
              :indeterminate="isIndeterminate.isIndeterminate3"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="confessSecound"
              @change="selectAllChangeClick(confessSecound,3)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">初三</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll4"
              @change="selectAllChange(selectAll.selectAll4,4)"
              :indeterminate="isIndeterminate.isIndeterminate4"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="confessThree"
              @change="selectAllChangeClick(confessThree,4)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>
    </div>

    <div style="margin-left:20px" v-show="grade==2">
      <div class="margin-bottom">
        <div class="margin-bottom10">报名网课课程项目</div>
        <el-row type="flex">
          <el-col :span="2">衔接</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll5"
              @change="selectAllChange(selectAll.selectAll5,5)"
              :indeterminate="isIndeterminate.isIndeterminate5"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="systemSecondHigh"
              @change="selectAllChangeClick(systemSecondHigh,5)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">高一</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll6"
              @change="selectAllChange(selectAll.selectAll6,6)"
              :indeterminate="isIndeterminate.isIndeterminate6"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="systemThressHigh"
              @change="selectAllChangeClick(systemThressHigh,6)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">高二</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll7"
              @change="selectAllChange(selectAll.selectAll7,7)"
              :indeterminate="isIndeterminate.isIndeterminate7"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="confessSecoundHigh"
              @change="selectAllChangeClick(confessSecoundHigh,7)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">高三</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll8"
              @change="selectAllChange(selectAll.selectAll8,8)"
              :indeterminate="isIndeterminate.isIndeterminate8"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="confessThreeHigh"
              @change="selectAllChangeClick(confessThreeHigh,8)"
            >
              <el-checkbox :label="1">语文</el-checkbox>
              <el-checkbox :label="2">数学</el-checkbox>
              <el-checkbox :label="3">英语</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>

      <div class="margin-bottom">
        <div class="margin-bottom10">等级考课程科目:</div>
        <el-row type="flex">
          <el-col :span="2">录+直</el-col>
          <el-col :span="2">
            <el-checkbox
              v-model="selectAll.selectAll9"
              @change="selectAllChange(selectAll.selectAll9,9)"
              :indeterminate="isIndeterminate.isIndeterminate9"
            >全选</el-checkbox>
          </el-col>
          <el-col>
            <el-checkbox-group
              v-model="gradeSecoundHigh"
              @change="selectAllChangeClick(gradeSecoundHigh,9)"
            >
              <el-checkbox :label="4">物理</el-checkbox>
              <el-checkbox :label="5">化学</el-checkbox>
              <el-checkbox :label="6">政治</el-checkbox>
              <el-checkbox :label="7">历史</el-checkbox>
              <el-checkbox :label="8">地理</el-checkbox>
              <el-checkbox :label="9">生物</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row type="flex" justify="center">
      <el-col :span="2">
        <el-button
          type="primary"
          class="but"
          @click="findCourseByNetEntryForm"
          icon="el-icon-shopping-cart-full"
        >加入课程列表</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { findCourseByNetEntryForm } from "@/api/order/FullOrder";
import courseType from "@/CourseType/CourseType.js";

export default {
  name: "EntryForm",
  data() {
    return {
      grade: 1, //选中年级
      middleGrade: null, //初中学生年级
      highGrade: null, //高中学生年级
      systemSecond: [], //初中报名网课系统课课程项目初二
      systemThress: [], //初中报名网课系统课课程项目初三
      confessSecound: [], //初中报名网课自招课课程项目初二
      confessThree: [], //初中报名网课自招课课程项目初三
      systemSecondHigh: [], //衔接
      confessSecoundHigh: [], //高中报名网课课程项目高二
      confessThreeHigh: [], //高中报名网课课程项目高三
      gradeSecoundHigh: [], //高中等级考课程科目
      systemThressHigh: [], //高中报名网课课程项目高一
      courseType: [],
      selectAll: {
        //判断全选是否被选中
        selectAll1: null,
        selectAll2: null,
        selectAll3: null,
        selectAll4: null,
        selectAll5: null,
        selectAll6: null,
        selectAll7: null,
        selectAll8: null,
        selectAll9: null
      },
      isIndeterminate: {
        isIndeterminate1: false,
        isIndeterminate2: false,
        isIndeterminate3: false,
        isIndeterminate4: false,
        isIndeterminate5: false,
        isIndeterminate6: false,
        isIndeterminate7: false,
        isIndeterminate8: false,
        isIndeterminate9: false
      }
    };
  },
  methods: {
    //确认，按照报名表选课
    findCourseByNetEntryForm() {
      let netCourseList = this.getNetCourseList();
      if (netCourseList.length == 0) {
        this.$tipsMessage("必须选择一门课程", "warning");
        return;
      }
      findCourseByNetEntryForm({
        year: this.$route.query.year,
        netCourseList
      }).then(res => {
        if (res.status == 200) {
          let course = [];
          res.data.forEach(val => {
            val.price = val.price.toLocaleString();
            val.giveAway = 0;
            course.push(val);
          });
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage("没有课程满足您所选择的条件", "warning");
          }
          this.$emit("selectCourse", course);
        }
      });

      this.$store.dispatch("RESSELECTLISTARR", {
        systemSecond: this.systemSecond,
        systemThress: this.systemThress,
        confessSecound: this.confessSecound,
        confessThree: this.confessThree,
        systemSecondHigh: this.systemSecondHigh,
        confessSecoundHigh: this.confessSecoundHigh,
        confessThreeHigh: this.confessThreeHigh,
        gradeSecoundHigh: this.gradeSecoundHigh,
        systemThressHigh: this.systemThressHigh
      });
    },
    //得到按课程表选课的netCourseList传给后台的参数
    getNetCourseList() {
      let netCourseList = [];
      //高考名师（高三）
      this.confessThreeHigh.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[0],
          subjectId: val
        });
      });
      //高二名师（高二）
      this.confessSecoundHigh.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[1],
          subjectId: val
        });
      });
      //高一名师（高一）
      this.systemThressHigh.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[2],
          subjectId: val
        });
      });
      //初升高名师（衔接)
      this.systemSecondHigh.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[3],
          subjectId: val
        });
      });
      //学业水平等级考（等级考课程）
      this.gradeSecoundHigh.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[4],
          subjectId: val
        });
      });
      //中考名师（初三系统）
      this.systemThress.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[7],
          subjectId: val
        });
      });
      //示范性高中提前录取（初三自招）
      this.confessThree.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[8],
          subjectId: val
        });
      });
      //初二名师（初二系统）
      this.systemSecond.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[9],
          subjectId: val
        });
      });
      //初二自招预备（初二自招）
      this.confessSecound.forEach((val, index) => {
        netCourseList.push({
          courseType: this.courseType[10],
          subjectId: val
        });
      });
      return netCourseList;
    },
    //当选择发生改变清除
    clear(val) {
      if (val == 2) {
        this.middleGrade = null;
        this.systemSecond = [];
        this.systemThress = [];
        this.confessSecound = [];
        this.confessThree = [];
      }
      if (val == 1) {
        this.highGrade = null;
        this.systemThressHigh = [];
        this.confessSecoundHigh = [];
        this.confessThreeHigh = [];
        this.gradeSecoundHigh = [];
        this.systemSecondHigh = [];
      }
      this.selectAll = {
        //判断全选是否被选中
        selectAll1: false,
        selectAll2: false,
        selectAll3: false,
        selectAll4: false,
        selectAll5: false,
        selectAll6: false,
        selectAll7: false,
        selectAll8: false,
        selectAll9: false
      };
      this.isIndeterminate = {
        isIndeterminate1: false,
        isIndeterminate2: false,
        isIndeterminate3: false,
        isIndeterminate4: false,
        isIndeterminate5: false,
        isIndeterminate6: false,
        isIndeterminate7: false,
        isIndeterminate8: false,
        isIndeterminate9: false
      };
    },
    selectAllChange(val, type) {
      switch (type) {
        case 1:
          if (val) {
            this.systemSecond = [1, 2, 3, 4, 5];
          } else {
            this.systemSecond = [];
          }
          this.selectAllChangeClick(this.systemSecond, 1);
          break;
        case 2:
          if (val) {
            this.systemThress = [1, 2, 3, 4, 5];
          } else {
            this.systemThress = [];
          }
          this.selectAllChangeClick(this.systemThress, 2);
          break;
        case 3:
          if (val) {
            this.confessSecound = [1, 2, 3, 4, 5];
          } else {
            this.confessSecound = [];
          }
          this.selectAllChangeClick(this.confessSecound, 3);
          break;
        case 4:
          if (val) {
            this.confessThree = [1, 2, 3, 4, 5];
          } else {
            this.confessThree = [];
          }
          this.selectAllChangeClick(this.confessThree, 4);
          break;
        case 5:
          if (val) {
            this.systemSecondHigh = [1, 2, 3, 4, 5];
          } else {
            this.systemSecondHigh = [];
          }
          this.selectAllChangeClick(this.systemSecondHigh, 5);
          break;
        case 6:
          if (val) {
            this.systemThressHigh = [1, 2, 3, 4, 5];
          } else {
            this.systemThressHigh = [];
          }
          this.selectAllChangeClick(this.systemThressHigh, 6);
          break;
        case 7:
          if (val) {
            this.confessSecoundHigh = [1, 2, 3];
          } else {
            this.confessSecoundHigh = [];
          }
          this.selectAllChangeClick(this.confessSecoundHigh, 7);
          break;
        case 8:
          if (val) {
            this.confessThreeHigh = [1, 2, 3];
          } else {
            this.confessThreeHigh = [];
          }
          this.selectAllChangeClick(this.confessThreeHigh, 8);
          break;
        case 9:
          if (val) {
            this.gradeSecoundHigh = [4, 5, 6, 7, 8, 9];
          } else {
            this.gradeSecoundHigh = [];
          }
          this.selectAllChangeClick(this.gradeSecoundHigh, 9);
          break;
      }
    },
    selectAllChangeClick(val, type) {
      switch (type) {
        case 1:
          val.length > 0 && val.length < 5
            ? (this.isIndeterminate.isIndeterminate1 = true)
            : (this.isIndeterminate.isIndeterminate1 = false);
          val.length == 0 ? (this.selectAll.selectAll1 = false) : null;
          val.length == 5
            ? (this.selectAll.selectAll1 = true)
            : (this.selectAll.selectAll1 = false);
          break;
        case 2:
          val.length > 0 && val.length < 5
            ? (this.isIndeterminate.isIndeterminate2 = true)
            : (this.isIndeterminate.isIndeterminate2 = false);
          val.length == 0 ? (this.selectAll.selectAll2 = false) : null;
          val.length == 5
            ? (this.selectAll.selectAll2 = true)
            : (this.selectAll.selectAll2 = false);
          break;
        case 3:
          val.length > 0 && val.length < 5
            ? (this.isIndeterminate.isIndeterminate3 = true)
            : (this.isIndeterminate.isIndeterminate3 = false);
          val.length == 0 ? (this.selectAll.selectAll3 = false) : null;
          val.length == 5
            ? (this.selectAll.selectAll3 = true)
            : (this.selectAll.selectAll3 = false);
          break;
        case 4:
          val.length > 0 && val.length < 5
            ? (this.isIndeterminate.isIndeterminate4 = true)
            : (this.isIndeterminate.isIndeterminate4 = false);
          val.length == 0 ? (this.selectAll.selectAll4 = false) : null;
          val.length == 5
            ? (this.selectAll.selectAll4 = true)
            : (this.selectAll.selectAll4 = false);
          break;
        case 5:
          val.length > 0 && val.length < 5
            ? (this.isIndeterminate.isIndeterminate5 = true)
            : (this.isIndeterminate.isIndeterminate5 = false);
          val.length == 0 ? (this.selectAll.selectAll5 = false) : null;
          val.length == 5
            ? (this.selectAll.selectAll5 = true)
            : (this.selectAll.selectAll5 = false);
          break;
        case 6:
          val.length > 0 && val.length < 5
            ? (this.isIndeterminate.isIndeterminate6 = true)
            : (this.isIndeterminate.isIndeterminate6 = false);
          val.length == 0 ? (this.selectAll.selectAll6 = false) : null;
          val.length == 5
            ? (this.selectAll.selectAll6 = true)
            : (this.selectAll.selectAll6 = false);
          break;
        case 7:
          val.length > 0 && val.length < 3
            ? (this.isIndeterminate.isIndeterminate7 = true)
            : (this.isIndeterminate.isIndeterminate7 = false);
          val.length == 0 ? (this.selectAll.selectAll7 = false) : null;
          val.length == 3
            ? (this.selectAll.selectAll7 = true)
            : (this.selectAll.selectAll7 = false);
          break;
        case 8:
          val.length > 0 && val.length < 3
            ? (this.isIndeterminate.isIndeterminate8 = true)
            : (this.isIndeterminate.isIndeterminate8 = false);
          val.length == 0 ? (this.selectAll.selectAll8 = false) : null;
          val.length == 3
            ? (this.selectAll.selectAll8 = true)
            : (this.selectAll.selectAll8 = false);
          break;
        case 9:
          val.length > 0 && val.length < 6
            ? (this.isIndeterminate.isIndeterminate9 = true)
            : (this.isIndeterminate.isIndeterminate9 = false);
          val.length == 0 ? (this.selectAll.selectAll9 = false) : null;
          val.length == 6
            ? (this.selectAll.selectAll9 = true)
            : (this.selectAll.selectAll9 = false);
          break;
      }
    },
    getResSelectList() {
      this.systemSecond = this.$store.getters.resSelectListArr.systemSecond;
      this.systemThress = this.$store.getters.resSelectListArr.systemThress;
      this.confessSecound = this.$store.getters.resSelectListArr.confessSecound;
      this.confessThree = this.$store.getters.resSelectListArr.confessThree;
      this.systemSecondHigh = this.$store.getters.resSelectListArr.systemSecondHigh;
      this.confessSecoundHigh = this.$store.getters.resSelectListArr.confessSecoundHigh;
      this.confessThreeHigh = this.$store.getters.resSelectListArr.confessThreeHigh;
      this.gradeSecoundHigh = this.$store.getters.resSelectListArr.gradeSecoundHigh;
      this.systemThressHigh = this.$store.getters.resSelectListArr.systemThressHigh;
      if (
        this.systemSecondHigh.length > 0 ||
        this.confessSecoundHigh.length > 0 ||
        this.confessThreeHigh.length > 0 ||
        this.gradeSecoundHigh.length > 0 ||
        this.systemThressHigh.length > 0
      ) {
        this.grade = 2;
      } else {
        this.grade = 1;
      }
      this.selectAllChangeClick(this.systemSecond, 1);
      this.selectAllChangeClick(this.systemThress, 2);
      this.selectAllChangeClick(this.confessSecound, 3);
      this.selectAllChangeClick(this.confessThree, 4);
      this.selectAllChangeClick(this.systemSecondHigh, 5);
      this.selectAllChangeClick(this.systemThressHigh, 6);
      this.selectAllChangeClick(this.confessSecoundHigh, 7);
      this.selectAllChangeClick(this.confessThreeHigh, 8);
      this.selectAllChangeClick(this.gradeSecoundHigh, 9);
      this.$emit("resSelectList", this.$store.getters.resSelectListArr);
    }
  },
  created() {
    this.courseType = courseType.resCourseType;
    this.getResSelectList();
  }
};
</script>
<style scoped>
.entry-form {
  font-size: 14px;
}
.margin-bottom {
  margin-bottom: 5px;
}
.margin-bottom10 {
  margin-bottom: 10px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox {
  margin-right: 25px;
}
.el-row {
  margin-bottom: 1px;
}
.but {
  margin-top: 5px;
}
</style>
