<template>
  <div>
    <el-select v-model="currentVersion" placeholder="版本" clearable style="width: 75px">
      <el-option v-for="item in versions" :key="item" :label="item" :value="item"/>
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
  name: "SearchIf",
  props: {
    version: {
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
      versions:[],
      headInfo: {
        years: [],
        grades: [],
        subjects: [],
        courseTypes: [],
        coursePeriods: [],
        campuses: []
      }
    }
  },
  computed: {
    currentVersion: {
      get () {
        return this.version
      },
      set (val) {
        this.$emit("update:version", val === "" ? null : val)
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
    this.versions = courseType.versions
  },
  methods: {
    //获取查询条件下拉框内容
    getHeadInfo () {
      getHeadInfo().then(res => {
        if (res.status === 200) {
          this.headInfo = res.data
          this.headInfo.courseTypes = courseType.offlineCourseType
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
