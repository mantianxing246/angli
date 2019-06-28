/*
@author lfz
@date 2019/2/18 
*/
<template>
  <div>
    <el-select v-model="currentProvinceId" placeholder="省份" clearable style="width: 75px">
      <el-option
        v-for="item in headInfo.provinces"
        :key="item.provinceId"
        :label="item.provinceName"
        :value="item.provinceId"
      />
    </el-select> 
    <el-select v-model="currentVersions" placeholder="版本" clearable style="width: 75px">
      <el-option v-for="item in headInfo.versions" :key="item" :label="item" :value="item"/>
    </el-select>
    <el-select v-model="currentGradeId" placeholder="年级" clearable style="width: 75px">
      <el-option
        v-for="item in headInfo.grades"
        :key="item.gradeId"
        :label="item.gradeName"
        :value="item.gradeId"
      />
    </el-select>
   
    <el-select v-model="currentSubjectId" placeholder="学科" clearable style="width: 75px">
      <el-option
        v-for="item in headInfo.subjects"
        :key="item.subjectId"
        :label="item.subjectName"
        :value="item.subjectId"
      />
    </el-select>
    <el-select v-model="currentCourseType" placeholder="课程类型" clearable style="width: 95px">
      <el-option v-for="item in headInfo.courseTypes" :key="item" :value="item" :label="item"></el-option>
    </el-select>
    <el-select v-model="currentCoursePeriodId" placeholder="阶段" clearable style="width: 75px">
      <el-option
        v-for="item in headInfo.coursePeriods"
        :key="item.coursePeriodId"
        :label="item.coursePeriodName"
        :value="item.coursePeriodId"
      />
    </el-select>
    <el-select v-model="currentCampusId" placeholder="校区" clearable style="width: 100px">
      <el-option
        v-for="item in headInfo.campuses"
        :key="item.campusId"
        :label="item.campusName"
        :value="item.campusId"
      />
    </el-select>
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi"
import courseType from '@/CourseType/CourseType.js'

export default {
  name: "OfflnSearchHead",
  props: {
    provinceId: {
      type: Number,
      default: 2
    },
    versions: {
      type: Number,
      default: null
    },
    gradeId: {
      type: Number,
      default: null
    },
    coursePeriodId: {
      type: Number,
      default: null
    },
    courseType: {
      type: String,
      default: ""
    },
    subjectId: {
      type: Number,
      default: null
    },
    campusId: {
      type: Number,
      default: null
    }

  },
  data () {
    return {
      headInfo: {
        provinces: [],
        versions: [],
        grades: [],
        subjects: [],
        courseTypes: [],
        coursePeriods: [],
        campuses: []
      }
    }
  },
  computed: {
    currentProvinceId: {
      get () {
        return this.provinceId
      },
      set (val) {
        this.$emit("update:provinceId", val === "" ? null : val)
      }
    },
    currentVersions: {
      get () {
        return this.versions
      },
      set (val) {
        this.$emit("update:versions", val === "" ? null : val)
      }
    },
    currentGradeId: {
      get () {
        return this.gradeId
      },
      set (val) {
        this.$emit("update:gradeId", val === "" ? null : val)
      }
    },
    currentCoursePeriodId: {
      get () {
        return this.coursePeriodId
      },
      set (val) {
        this.$emit("update:coursePeriodId", val === "" ? null : val)
      }
    },
    currentCourseType: {
      get () {
        return this.courseType
      },
      set (val) {
        this.$emit("update:courseType", val)
      }
    },
    currentSubjectId: {
      get () {
        return this.subjectId
      },
      set (val) {
        this.$emit("update:subjectId", val === "" ? null : val)
      }
    },
    currentCampusId: {
      get () {
        return this.campusId
      },
      set (val) {
        this.$emit("update:campusId", val === "" ? null : val)
      }
    }
  },
  created () {
    this.getHeadInfo()
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then(res => {
        if (res.status === 200) {
          this.headInfo = res.data
          this.headInfo.versions = courseType.versions
          this.headInfo.courseTypes = courseType.offlineCourseType
          this.currentProvinceId = 2  //默认设置为上海
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          })
        }
      })
    }
  }
}
</script>
