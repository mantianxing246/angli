<!--
 * @author wufan
 * @date 2019/1/8
-->
<template>
  <div>
    <el-form-item style="margin-right:0;">
    <el-select v-model="currentProvinceId" placeholder="省市" clearable style="width: 80px">
      <el-option
        v-for="item in headInfo.provinces"
        :key="item.provinceId"
        :label="item.provinceName"
        :value="item.provinceId"
      />
    </el-select>
    <el-select v-model="currentVersion" placeholder="版本" clearable style="width: 80px">
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
    <el-select v-model="currentCourseType" placeholder="课程类型" clearable style="width: 100px">
      <el-option v-for="item in headInfo.courseTypes" :key="item" :label="item" :value="item"/>
    </el-select>
    <el-select v-model="currentCourseFunctionId" placeholder="课程作用" clearable style="width: 100px">
      <el-option
        v-for="item in headInfo.courseFunctions"
        :key="item.courseFunctionId"
        :label="item.courseFunctionName"
        :value="item.courseFunctionId"
      />
    </el-select>
     <el-input v-model="currentCourseName" placeholder="课程名称" clearable :style="{width:$selectConfig.classNameWidth+'px'}"/>
    <el-checkbox v-model="currentIsPublish">是否发布</el-checkbox>
    </el-form-item>
  </div>
</template>
<script>
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import courseType from '@/CourseType/CourseType.js'

export default {
  name: 'RecSearchHead',
  props: {
    provinceId: {
      type: Number,
      default: null
    },
    courseFunctionId: {
      type: Number,
      default: null
    },
    version: {
      type: Number,
      default: null
    },
    gradeId: {
      type: Number,
      default: null
    },
    year: {
      type: Number,
      default: null
    },
    courseType: {
      type: String,
      default: ''
    },
    courseName: {
      type: String,
      default: ''
    },
    subjectId: {
      type: Number,
      default: null
    },
    isPublish: {
      type: Number,
      default: 1
    },
  },
  data () {
    return {
      versions:[],
      headInfo: {
        provinces: [],
        courseFunctions: [],
        versions: [],
        grades: [],
        subjects: [],
        courseTypes: [],
      }
    }
  },
  computed: {
    currentProvinceId: {
      get () {
        return this.provinceId
      },
      set (val) {
        this.$emit('update:provinceId', val === "" ? null : val)
      }
    },
    currentCourseFunctionId: {
      get () {
        return this.courseFunctionId
      },
      set (val) {
        this.$emit('update:courseFunctionId', val === "" ? null : val)
      }
    },
    currentVersion: {
      get () {
        return this.version
      },
      set (val) {
        this.$emit('update:version', val === "" ? null : val)
      }
    },
    currentGradeId: {
      get () {
        return this.gradeId
      },
      set (val) {
        this.$emit('update:gradeId', val === "" ? null : val)
      }
    },
    currentYear: {
      get () {
        return this.year
      },
      set (val) {
        this.$emit("update:year", val === "" ? null : val)
      }
    },
    currentCourseType: {
      get () {
        return this.courseType
      },
      set (val) {
        this.$emit('update:courseType', val)
      }
    },
    currentSubjectId: {
      get () {
        return this.subjectId
      },
      set (val) {
        this.$emit('update:subjectId', val === "" ? null : val)
      }
    },
    currentCourseName: {
      get () {
        return this.courseName
      },
      set (val) {
        this.$emit('update:courseName', val)
      }
    },
    currentIsPublish: {
      get () {
        if (this.isPublish === 1) {
          return true
        }
        if (this.isPublish === 0) {
          return false
        }
      },
      set (val) {
        val = val ? 1 : 0
        this.$emit('update:isPublish', val)
      }
    }
  },
  mounted () {
    this.getHeadInfo()
    this.versions = courseType.versions;
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then(response => {
        if (response.status === 200) {
          this.headInfo = response.data
          this.headInfo.courseTypes = courseType.recCourseType
          this.currentProvinceId = 2  //默认设置为上海
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
