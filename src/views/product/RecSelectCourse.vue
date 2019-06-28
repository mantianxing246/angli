<!--
 * @author hongdengru
 * @date 2019/1/15
-->
<template>
  <dialog-container title="选择录播课程" :visible.sync="dialog" width="60%">
    <template slot="body">
      <el-form class="demo-ruleForm" inline label-position="left">
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.provinceId" placeholder="省市">
                <el-option
                  v-for="item in headInfo.provinces"
                  :value="item.provinceId"
                  :key="item.provinceId"
                  :label="item.provinceName"
                >{{ item.provinceName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-select clearable v-model="searchInfo.version" placeholder="版本">
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
                  :label="item.subjectName"
                >{{ item.subjectName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item v-model="searchInfo.courseType">
              <el-select clearable v-model="searchInfo.courseType" placeholder="课程类型">
                <el-option v-for="item in headInfo.courseType" :value="item" :key="item">{{ item }}</el-option>
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
        :data="listCourse"
        @selection-change="selectionChange"
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

export default {
  name: 'SelectClass',
  data () {
    return {
      searchInfo: {
        gradeId: null,
        version: null,
        subjectId: null,
        courseProperty: 2,
        provinceId: null,
        courseType: null,
      },
      listCourse: [],
      choiceCourse: [],
      choiceCourseArr: Object.assign(this.recSelectCourse)
    }
  },
  methods: {
    productCourse () {
      productCourse(this.searchInfo).then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          this.listCourse = res.data
          this.$nextTick(() => {
            this.toggleRowSelection()
          })
        }
      })
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
    selectionChange (val) {
      this.choiceCourse = val
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
        return this.recSelectDialog
      },
      set (val) {
        this.$emit("update:recSelectDialog", val)
        this.searchInfo = {
          gradeId: null,
          version: null,
          subjectId: null,
          courseProperty: 2,
          provinceId: null,
          courseType: null,
        }
        this.listCourse = []
      }
    }
  },
  props: ["recSelectDialog", "headInfo", 'recSelectCourse'],
  watch: {
    recSelectCourse (newVla) {
      this.choiceCourseArr = Object.assign(this.recSelectCourse)
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
