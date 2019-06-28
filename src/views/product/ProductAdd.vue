<!--
 * @author hongdengru
 * @date 2019/1/15
-->
<template>
  <div>
    <dialog-container title="新建产品组合" :visible.sync="dialogShow" width="70%">
      <template slot="body">
        <el-form ref="proForm" inline :rules="rules" :model="productQuery">
          <el-form-item label="版本" prop="version">
            <el-select v-model="productQuery.version" clearable>
              <el-option v-for="item in headInfo.versions" :value="item" :key="item">{{ item }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-checkbox-group v-model="productQuery.grade">
              <el-checkbox
                v-for="(item,index) in headInfo.grades"
                :key="index"
                :value="item.gradeId"
                :label="item.gradeId"
                name="grade"
              >{{item.gradeName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="productQuery.productName" clearable :maxlength="50"/>
          </el-form-item>
          <el-form-item label="是否发布">
            <el-checkbox v-model="productQuery.isPublish" :true-label="1" :false-label="0"></el-checkbox>
          </el-form-item>
          <div style="height:1px;background:#ccc"/>
        </el-form>

        <div style="margin:10px 0; display: flex;
    flex-wrap: wrap;">
          <el-button v-show="this" ref="btn1" type="primary" @click="addOfflinCourse">添加班教课程</el-button>
          <el-button v-show="this" ref="btn2" type="primary" @click="addRecCourse">添加录播课程</el-button>
          <el-button v-show="this" ref="btn3" type="primary" @click="addLiveCourse">添加直播课程</el-button>
          <el-button v-show="this" ref="btn4" type="primary" @click="addIndividualCourse">添加在线个性化课程</el-button>
          <el-button v-show="this" ref="btn5" type="primary" @click="addOther">添加其他类课程</el-button>
          <el-button v-show="this" ref="btn5" type="primary" @click="addNonSubject">添加非学科类课程</el-button>
        </div>
        <div style="height:1px;background:#ccc"/>

        <div>
          <p class="font-color">产品组合课程列表</p>
          <el-table
            style="width: 100%"
            border
            tip
            stripe
            highlight-current-row
            :data="choiceCourse"
          >
            <el-table-column label="课程属性" prop="coursePropertyName" width="80" align="center"/>
            <!-- <el-table-column label="中高考年份" prop="year" width="100" align="center"/> -->
            <el-table-column label="版本" prop="version" width="80" align="center"/>
            <el-table-column label="年级" prop="gradeName" width="80" align="center"/>
            <el-table-column label="课程名称" prop="courseName" align="center" min-width="310"/>
            <el-table-column label="课程价格" prop="totalPrice" align="center"/>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="removeCourse(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="footer">
        <div slot="footer" style="margin-top:20px">
          <el-button @click="dialogShow=false">取消</el-button>
          <el-button type="primary" @click="insertProduct" :loading="loading">确认</el-button>
        </div>
      </template>
    </dialog-container>
    <!-- 班教 -->
    <offline-select-course
      :offlineSelectDialog.sync="dialog.offlineSelectDialog"
      @choiceCourse="offlineChoiceCourse"
      :offlineSelectCourse="choiceCourse"
      :headInfo="headInfo"
    ></offline-select-course>

    <!-- 录播 -->
    <rec-select-course
      :recSelectDialog.sync="dialog.recSelectDialog"
      @choiceCourse="offlineChoiceCourse"
      :recSelectCourse="choiceCourse"
      :headInfo="headInfo"
    ></rec-select-course>

    <!-- 直播 -->
    <live-select-course
      :liveSelectDialog.sync="dialog.liveSelectDialog"
      @choiceCourse="offlineChoiceCourse"
      :liveSelectCourse="choiceCourse"
      :headInfo="headInfo"
    ></live-select-course>

    <!-- 个性化 -->
    <individual-select-course
      :individualSelectDialog.sync="dialog.individualSelectDialog"
      @choiceCourse="offlineChoiceCourse"
      :individualSelectCourse="choiceCourse"
      :headInfo="headInfo"
    ></individual-select-course>

    <!-- 非学科类 -->
    <nonsubject-select-course
      :nonsubjectSelectDialog.sync="dialog.nonsubjectSelectDialog"
      @choiceCourse="offlineChoiceCourse"
      :nonsubjectSelectCourse="choiceCourse"
      :headInfo="headInfo"
    ></nonsubject-select-course>

    <!-- 其他类课程 -->
    <other-select-course
      :otherSelectDialog.sync="dialog.otherSelectDialog"
      @choiceCourse="offlineChoiceCourse"
      :otherSelectCourse="choiceCourse"
      :headInfo="headInfo"
    ></other-select-course>
  </div>
</template>
<script>
import { insertProduct } from "@/api/product/ProductMgtApi";
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import OfflineSelectCourse from "./OfflineSelectCourse";
import RecSelectCourse from "./RecSelectCourse";
import LiveSelectCourse from "./LiveSelectCourse";
import IndividualSelectCourse from "./IndividualSelectCourse";
import OtherSelectCourse from "./OtherSelectCourse";
import NonsubjectSelectCourse from "./NonsubjectSelectCourse";
import courseType from '@/CourseType/CourseType.js'
import classType from '@/CourseType/ClassType.js'

export default {
  name: "ProductAdd",
  props: ["productAddDialog", "findAllProduct"],
  components: {
    OfflineSelectCourse,
    RecSelectCourse,
    LiveSelectCourse,
    IndividualSelectCourse,
    OtherSelectCourse,
    NonsubjectSelectCourse
  },
  data: function () {
    return {
      headInfo: {},
      loading: false,
      dialog: {
        offlineSelectDialog: false,
        recSelectDialog: false,
        liveSelectDialog: false,
        individualSelectDialog: false,
        otherSelectDialog: false,
        nonsubjectSelectDialog: false
      },
      rules: {
        productName: [
          { required: true, message: "请填写产品名称", trigger: "blur" }
        ],
        grade: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个年级",
            trigger: "change"
          }
        ],
        year: [],
        version: [{ required: true, message: "请填写版本号", trigger: "blur" }]
      },
      productQuery: {
        productName: null,
        isPublish: 1,
        year: null,
        version: null,
        grade: []
      },
      choiceCourse: []
    };
  },
  methods: {
    //班教
    addOfflinCourse () {
      // if (this.isYearOrVersion(1)) {
      this.dialog.offlineSelectDialog = true;
      this.headInfo.courseType = courseType.offlineCourseType
      // }
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
    //录播
    addRecCourse () {
      // if (this.isYearOrVersion(2)) {
      this.dialog.recSelectDialog = true;
      this.headInfo.courseType = courseType.recCourseType
      // }
    },
    //直播
    addLiveCourse () {
      // if (this.isYearOrVersion(3)) {
      this.dialog.liveSelectDialog = true;
      this.headInfo.courseType = courseType.liveCourseType
      this.headInfo.classType = classType.resClassType
      // }
    },
    //在线个性化
    addIndividualCourse () {
      // if (this.isYearOrVersion(4)) {
      this.dialog.individualSelectDialog = true;
      this.headInfo.courseType = courseType.individualCourseType
      // }
    },
    //其他
    addOther () {
      // if (this.isYearOrVersion(5)) {
      this.dialog.otherSelectDialog = true;
      this.headInfo.courseType = courseType.otherCourseType
      // }
    },
    // 非学科类
    addNonSubject () {
      this.dialog.nonsubjectSelectDialog = true
      this.headInfo.courseType = courseType.nonSubjectCourseType
    },
    removeCourse (index) {
      this.choiceCourse.splice(index, 1);
    },
    insertProduct () {
      if (this.choiceCourse.length == 0) {
        this.$tipsMessage("产品的课程不能为空", "warning");
        return;
      }
      this.$refs.proForm.validate(pass => {
        if (pass) {
          this.loading = true
          let productCourses = [],
            gradeList = [], totalPrice = 0;
          this.choiceCourse.forEach((element, index) => {
            productCourses.push({
              courseId: element.courseId,
              courseName: element.courseName,
              courseProperty: element.courseProperty,
              year: element.year,
              version: element.version,
              grade: 1
            });
            totalPrice += element.totalPrice
          });
          this.productQuery.grade.forEach((val, index) => {
            gradeList.push({
              gradeId: val
            });
          });
          insertProduct({
            productName: this.productQuery.productName,
            year: this.productQuery.year,
            version: this.productQuery.version,
            gradeList: gradeList,
            productCourses: productCourses,
            isPublish: this.productQuery.isPublish,
            totalPrice: totalPrice
          }).then(res => {
            this.loading = false
            if (res.status == 200) {
              this.dialogShow = false;
              this.$tipsMessage("插入成功", "success");
              this.choiceCourse = [];
              this.findAllProduct();
            }
            if (res.status == 500) {
              // this.dialogShow = true;
              this.$tipsMessage(res.message, "warning")
            }
          });
        }
      });
    },
    getHeadInfo () {
      getHeadInfo().then(res => {
        if (res.status == 200) {
          this.headInfo = res.data;
          this.headInfo.versions = courseType.versions
        }
      });
    }
  },
  computed: {
    dialogShow: {
      set (val) {
        this.$emit("update:productAddDialog", val);
        this.$refs.proForm.resetFields();
        this.choiceCourse = [];
      },
      get () {
        return this.productAddDialog;
      }
    }
  },
  created () {
    this.getHeadInfo();
  }
};
</script>