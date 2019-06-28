<template>
  <div>
      <el-input
        v-model="currentTeacherName"
        clearable
        placeholder="教师姓名"
        class="filter-item"
        maxlength="20"
        style="width:160px"
      />
    <el-select v-model="currentTeacherTypeId" placeholder="教师类型" class="filter-item" clearable>
      <el-option
        v-for="item in headInfo.teacherTypes"
        :key="item.teacherTypeId"
        :label="item.teacherTypeName"
        :value="item.teacherTypeId"
      />
    </el-select>
    <el-select v-model="currentSubjectId" placeholder="授课科目" class="filter-item" clearable>
      <el-option
        v-for="item in headInfo.subjects"
        :key="item.subjectId"
        :label="item.subjectName"
        :value="item.subjectId"
      />
    </el-select>
    <el-select v-model="currentGradeId" placeholder="授课年级" class="filter-item" clearable>
      <el-option
        v-for="item in headInfo.grades"
        :key="item.gradeId"
        :label="item.gradeName"
        :value="item.gradeId"
      />
    </el-select>
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi";
export default {
  name: "SearchHead",
  props: {
    teacherTypeId: {
      default: null
    },
    gradeId: {
      default: null
    },
    subjectId: {
      default: null
    }
  },
  data() {
    return {
      headInfo: {
        teacherTypes: [],
        grades: [],
        subjects: []
      }
    };
  },
  computed: {
    currentGradeId: {
      get() {
        return this.gradeId;
      },
      set(val) {
        this.$emit("update:gradeId", val);
      }
    },
    currentTeacherName: {
      get() {
        return this.teacherName;
      },
      set(val) {
        this.$emit("update:teacherName", val);
      }
    },
    currentTeacherTypeId: {
      get() {
        return this.teacherTypeId;
      },
      set(val) {
        this.$emit("update:teacherTypeId", val);
      }
    },
    currentSubjectId: {
      get() {
        return this.subjectId;
      },
      set(val) {
        this.$emit("update:subjectId", val);
      }
    }
  },
  mounted() {
    this.getHeadInfo();
  },
  methods: {
    getHeadInfo() {
      getHeadInfo().then(response => {
        if (response.status === 200) {
          this.headInfo = response.data;
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
