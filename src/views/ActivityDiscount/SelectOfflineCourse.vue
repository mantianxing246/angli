
<template>
  <el-dialog
    :close-on-click-modal="false"
    v-el-drag-dialog
    :visible.sync="dialog"
    title="选择班教课程"
    border
    width="70%"
    center
  >
    <el-form class="demo-ruleForm" label-position="left">
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-select clearable v-model="searchInfo.version" placeholder="版本">
              <el-option v-for="item in versions" :value="item" :key="item">{{ item }}</el-option>
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
            <el-select clearable v-model="searchInfo.provinceId" placeholder="校区">
              <el-option
                v-for="item in headInfo.provinces"
                :value="item.provinceId"
                :key="item.provinceId"
                :label="item.provinceName"
              >{{ item.provinceName }}</el-option>
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
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="课程名称" prop="courseName" align="center"/>
    </el-table>
    <el-button slot="footer" ref="add" type="primary" @click="addProduct">添加到优惠方案</el-button>
  </el-dialog>
</template>
<script>
import { productCourse } from '@/api/product/ProductMgtApi'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import courseType from '@/CourseType/CourseType'
export default {
  name: 'SelectClass',
  data () {
    return {
      versions:[],
      headInfo: {},
      searchInfo: {
        gradeId: null,
        version: null,
        subjectId: null,
        courseProperty: 1,
        provinceId: null,
        campusId: null,
        courseType: null
      },
      listCourse: [],
      choiceCourse: []
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
      this.dialog = false
    },
    productCourse () {
      productCourse(this.searchInfo).then((res) => {
        if (res.status == 200) {
          this.listCourse = res.data
        }
      })
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        if (res.status == 200) {
          this.headInfo = res.data
          this.headInfo.courseType = courseType.offlineCourseType
        }
      })
    }
  },
  created () {
    this.getHeadInfo()
    this.versions = courseType.versions
  },
  computed: {
    dialog: {
      get () {
        return this.selectOfflineDialog
      },
      set (val) {
        this.$emit("update:selectOfflineDialog", val)
        this.searchInfo = {
          gradeId: null,
          version: null,
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
  props: ["selectOfflineDialog"]
}
</script>
<style>
.hide {
  display: none !important;
}
.margin {
  margin: 0;
}
</style>
