<template>
  <div>
    <ul
      v-if="scope.row.attendanceTypeId === 3 || scope.row.attendanceTypeId === 4 || scope.row.attendanceTypeId ===5"
      class="sign-status"
    >{{scope.row.attendanceTypeName}}</ul>
    <ul v-else class="sign-status">
      <li
        :class="[1==scope.row.attendanceTypeId?'focus':'']"
        @click="attendanceType('attendExplain', scope.row.studentId,scope.row.classId, scope.row.id,1,1==scope.row.attendanceTypeId?'focus':'',scope.row,'attendanceType')"
      >出勤</li>
      <li
        :class="[2==scope.row.attendanceTypeId?'focus':'']"
        @click="attendanceType('attendExplain', scope.row.studentId,scope.row.classId, scope.row.id,2,2==scope.row.attendanceTypeId?'focus':'',scope.row,'attendanceType')"
      >请假</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "attendanceTypeForButton",
  props: ["scope"],
  data () {
    return {

    }
  },
  methods: {
    attendanceType(a,b,c,d,e,f,j,H){
      if(new Date(j.date).getMonth() < new Date().getMonth()){
           this.$message({
            message: '上个月的考勤不可更改',
            type: "warning"
          });
          return;
      }
      this.$emit(a,b,c,d,e,f,j,H);
    }
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
.el-col {
  padding: 6px 0;
}
.sign-status {
  display: flex;
  justify-content: space-around;
  cursor: pointer;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    color: #fff;
    border: 1px solid #797979;
    border-radius: 3px;
    background: #999999;
    padding: 0 8px;
  }
  li.focus {
    background: #009933;
  }
}
.el-row {
  margin-bottom: 0;
}
</style>