<!--
 * @author lfz
 * @date 2019/1/17
-->
<template>
  <div>
    <el-form-item style="margin-right:0;">
      <el-select v-model="currentProvinceId" placeholder="省市" clearable style="width: 75px">
        <el-option
          v-for="item in headInfo.provinces"
          :key="item.provinceId"
          :label="item.provinceName"
          :value="item.provinceId"
        />
      </el-select>
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
      <el-select v-model="currentCourseType" placeholder="课程类型" clearable style="width: 100px">
        <el-option v-for="item in headInfo.courseTypes" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="currentCoursePeriodId" placeholder="阶段" clearable style="width: 75px">
        <el-option
          v-for="item in headInfo.coursePeriods"
          :key="item.coursePeriodId"
          :label="item.coursePeriodName"
          :value="item.coursePeriodId"
        />
      </el-select>
      <el-select v-model="currentClassType" placeholder="班型" clearable style="width: 75px">
        <el-option v-for="item in headInfo.classTypes" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-input v-model="currentCourseName" placeholder="课程名称" clearable :style="{width:$selectConfig.classNameWidth+'px'}"/>
      <el-checkbox v-model="currentIsPublish">是否发布</el-checkbox>
    </el-form-item>
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import courseType from "@/CourseType/CourseType.js";
import classType from "@/CourseType/ClassType.js";

export default {
  name: "LiveSearchHead",
  props: {
    provinceId: {
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
    subjectId: {
      type: Number,
      default: null
    },
    courseType: {
      type: String,
      default: ""
    },
    classType: {
      type: String,
      default: ""
    },
    version: {
      type: Number,
      default: null
    },
    coursePeriodId: {
      type: Number,
      default: null
    },
    courseName: {
      type: String,
      default: ""
    },
    isPublish: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      versions:[],
      headInfo: {
        provinces: [],
        versions: [],
        grades: [],
        subjects: [],
        courseTypes: []
      }
    };
  },
  computed: {
    currentProvinceId: {
      get() {
        return this.provinceId;
      },
      set(val) {
        this.$emit("update:provinceId", val === "" ? null : val);
      }
    },
    currentGradeId: {
      get() {
        return this.gradeId;
      },
      set(val) {
        this.$emit("update:gradeId", val === "" ? null : val);
      }
    },
    currentYear: {
      get() {
        return this.year;
      },
      set(val) {
        this.$emit("update:year", val === "" ? null : val);
      }
    },
    currentSubjectId: {
      get() {
        return this.subjectId;
      },
      set(val) {
        this.$emit("update:subjectId", val === "" ? null : val);
      }
    },
    currentCourseType: {
      get() {
        return this.courseType;
      },
      set(val) {
        this.$emit("update:courseType", val);
      }
    },
    currentClassType: {
      get() {
        return this.classType;
      },
      set(val) {
        this.$emit("update:classType", val);
      }
    },
    currentVersion: {
      get() {
        return this.version;
      },
      set(val) {
        this.$emit("update:version", val === "" ? null : val);
      }
    },
    currentCoursePeriodId: {
      get() {
        return this.coursePeriodId;
      },
      set(val) {
        this.$emit("update:coursePeriodId", val);
      }
    },
    currentCourseName: {
      get() {
        return this.courseName;
      },
      set(val) {
        this.$emit("update:courseName", val);
      }
    },
    currentIsPublish: {
      get() {
        if (this.isPublish === 1) {
          return true;
        }
        if (this.isPublish === 0) {
          return false;
        }
      },
      set(val) {
        val = val ? 1 : 0;
        this.$emit("update:isPublish", val);
      }
    }
  },
  mounted() {
    this.getHeadInfo();
    this.versions = courseType.versions;
  },
  methods: {
    getHeadInfo() {
      getHeadInfo().then(response => {
        if (response.status === 200) {
          this.headInfo = response.data;
          this.headInfo.courseTypes = courseType.liveCourseType;
          this.headInfo.classTypes = classType.resClassType;
          this.currentProvinceId = 2; //默认设置为上海
        } else {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.row {
  margin-bottom: 10px;
}
</style>
