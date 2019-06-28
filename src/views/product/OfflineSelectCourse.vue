<!--
 * @author hongdengru
 * @date 2019/1/15
-->
<template>
  <dialog-container title="选择班教课程" :visible.sync="dialog" width="60%">
    <template slot="body">
      <el-form class="demo-ruleForm" label-position="left">
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.versions" placeholder="版本">
                <el-option v-for="item in headInfo.versions" :value="item" :key="item">{{ item }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.gradeId" placeholder="年级">
                <el-option
                  v-for="item in headInfo.grades"
                  :value="item.gradeId"
                  :key="item.gradeId"
                  :label="item.gradeName"
                >{{ item.gradeName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.subjectId" placeholder="学科">
                <el-option
                  v-for="item in headInfo.subjects"
                  :value="item.subjectId"
                  :key="item.subjectId"
                  :label="item.subjectName "
                >{{ item.subjectName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.courseType" placeholder="课程类型">
                <el-option
                  v-for="item in headInfo.courseType"
                  :value="item"
                  :key="item"
                  :label="item"
                >{{ item }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.coursePeriodId" placeholder="阶段">
                <el-option
                  v-for="item in headInfo.coursePeriods"
                  :value="item.coursePeriodId"
                  :key="item.coursePeriodId"
                  :label="item.coursePeriodName"
                >{{ item.coursePeriodName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.campusId" placeholder="校区">
                <el-option
                  v-for="item in headInfo.campuses"
                  :value="item.campusId"
                  :key="item.campusId"
                  :label="item.campusName"
                >{{ item.campusName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="productCourse">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="margin">课程列表:</div>
      <el-table
        highlight-current-row
        border
        fit
        stripe
        style="margin-top:20px"
        @selection-change="selectionChange"
        :data="listCourse"
        ref="selectionTable"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="课程名称" prop="courseName" align="center"/>
      </el-table>
    </template>
    <template slot="footer">
      <el-button slot="footer" ref="add" type="primary" @click="addProduct">添加到产品</el-button>
    </template>
  </dialog-container>
</template>
<script>
import { productCourse } from '@/api/product/ProductMgtApi'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import { setTimeout } from 'timers';

export default {
  name: 'SelectClass',
  data () {
    return {
      searchInfo: {
        gradeId: null,
        versions: null,
        subjectId: null,
        courseProperty: 1,
        provinceId: null,
        campusId: null,
        courseType: null
      },
      listCourse: [],
      choiceCourse: [],
      choiceCourseArr: Object.assign(this.offlineSelectCourse)
    }
  },
  methods: {
    selectionChange (val) {
      this.choiceCourse = val
    },
    addProduct () {
      if (this.choiceCourse.length == 0) {
        this.$tipsMessage("您当前未选择任何课程", "warning")
        return
      }
      this.$emit("choiceCourse", this.choiceCourse)
      this.choiceCourseArr = JSON.parse(JSON.stringify(this.choiceCourse))
      this.dialog = false
    },
    productCourse () {
      productCourse(this.searchInfo).then((res) => {
        if (res.status == 200) {
          this.listCourse = res.data
          this.$nextTick(() => {
            this.toggleRowSelection()
          })
        }
      })
    },
    toggleRowSelection () {
      for (let i = 0;i < this.choiceCourseArr.length;i++) {
        for (let j = 0;j < this.listCourse.length;j++) {
          if (this.choiceCourseArr[i].courseId == this.listCourse[j].courseId && this.choiceCourseArr[i].courseProperty == this.listCourse[j].courseProperty) {
            this.$refs.selectionTable.toggleRowSelection(this.listCourse[j], true)
          }
        }
      }
    }
  },
  computed: {
    dialog: {
      get () {
        return this.offlineSelectDialog
      },
      set (val) {
        this.$emit("update:offlineSelectDialog", val)
        this.searchInfo = {
          gradeId: null,
          year: null,
          subjectId: null,
          courseProperty: 1,
          provinceId: null,
          campusId: null,
          courseType: null
        }
        this.listCourse = []
      }
    }
  },
  props: ["offlineSelectDialog", "headInfo", "offlineSelectCourse"],
  watch: {
    offlineSelectCourse (newVla) {
      this.choiceCourseArr = Object.assign(this.offlineSelectCourse)
    }
  }
}
</script>
<style scoped>
.hide {
  display: none !important;
}
.margin {
  margin: 0;
}
.el-row {
  margin-bottom: 0px;
}
</style>
