/*
@author lfz
@date 2019/2/26 
*/
<template>
<div>
<div style="overflow: hidden;" v-if="!isGive">
    <el-table
      :data="recordList"
       v-if="recordList.length>0"
      :span-method="objectSpanMethod"
      border
      tip
      stripe
      highlight-current-row
    >
      <el-table-column label="课程属性" align="center" width="100" prop="coursePropertyName"></el-table-column>
      <el-table-column label="省市" align="center" width="105" prop="provinceName"></el-table-column>
      <el-table-column label="版本" align="center" width="216" prop="version"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType" width="235"></el-table-column>
      <el-table-column label="学科" align="center" prop="subjectName"></el-table-column>
    </el-table>
    <el-table
      :data="liveList"
      v-if="liveList.length>0"
      :span-method="liveObjectSpanMethod"
      border
      tip
      stripe
      highlight-current-row
    >
      <el-table-column label="课程属性" width="100" align="center" prop="coursePropertyName"></el-table-column>
      <el-table-column label="省市" width="105" align="center" prop="provinceName"></el-table-column>
      <el-table-column label="阶段" align="center" width="108" prop="coursePeriodName"></el-table-column>
      <el-table-column label="版本" align="center" width="108" prop="version"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType" width="235"></el-table-column>
      <el-table-column label="学科" align="center" prop="subjectName"></el-table-column>
    </el-table>
  </div>
<div style="overflow: hidden;" v-if="isGive">
    <el-table
      :data="giveRecordList"
       v-if="recordList.length>0"
      border
      tip
      stripe
      highlight-current-row
    >
      <el-table-column label="课程属性" align="center" width="100" prop="coursePropertyName"></el-table-column>
      <el-table-column label="省市" align="center" width="105" prop="provinceName"></el-table-column>
      <el-table-column label="版本" align="center" width="216" prop="version"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType" width="235"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName"></el-table-column>
    </el-table>
    <el-table
      :data="giveLiveList"
      v-if="liveList.length>0"
      border
      tip
      stripe
      highlight-current-row
    >
      <el-table-column label="课程属性" width="100" align="center" prop="coursePropertyName"></el-table-column>
      <el-table-column label="省市" width="105" align="center" prop="provinceName"></el-table-column>
      <el-table-column label="阶段" align="center" width="108" prop="coursePeriodName"></el-table-column>
      <el-table-column label="版本" align="center" width="108" prop="version"></el-table-column>
      <el-table-column label="课程类型" align="center" prop="courseType" width="235"></el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName"></el-table-column>
    </el-table>
  </div>
</div>
  
 
</template>
<script>
class objectSpanMethodClass {
  constructor(list, spanArr) {
    this.list = list;
    this.spanArr = spanArr;
  }
  getSpanArr() {
    let contactDot = [];
    const spanArr = [];
    this.spanArr.forEach((element, i) => {
      spanArr.push([]);
      contactDot.push(0);
    });
    for (let i = 0; i < this.list.length; i++) {
      const item = this.list[i];
      const index = i;
      item.index = index;
      this.spanArr.forEach((element, i) => {
        if (index === 0) {
          spanArr[i].push(1);
        } else {
          if (item[element.key] === this.list[index - 1][element.key]) {
            spanArr[i][contactDot[i]] += 1;
            // alert(this.spanArr[contactDot]);
            spanArr[i].push(0);
          } else {
            spanArr[i].push(1);
            contactDot[i] = index;
          }
        }
      });
    }
    return spanArr;
  }
}
export default {
  name: "LiveRecord",
  props: ["recListCourse","isGive"],
  data() {
    return {
      liveList: [],
      recordList: [],
      giveLiveList:[],
      giveRecordList:[],
      recordSpanArr: [], // 每一列过滤规则
      liveSpanArr: []
    };
  },
  created() {
    this.liveList = this.recListCourse.filter(v => {
      return v.courseProperty !== 2;
    });
    this.giveLiveList = JSON.parse(JSON.stringify(this.recListCourse.filter(v => {
      return v.courseProperty !== 2;
    })));
    this.giveRecordList = JSON.parse(JSON.stringify(this.recListCourse.filter(v => {
      return v.courseProperty !== 3;
    })));
    let liveList = [];
    let liveObj = {};
    this.liveList.forEach((element, index) => {
      let key =
        element.coursePropertyName +
        element.provinceName +
        element.coursePeriodName +
        element.classType +
        element.version +
        element.gradeName +
        element.courseType;
      if (liveObj[key]) {
        liveList[liveObj[key]].subjectName =
          element.subjectName + "," + liveList[liveObj[key]].subjectName;
      } else {
        liveList.push(element);
        liveObj[key] = String(liveList.length - 1);
      }
    });
    this.liveList = liveList;
    this.recordList = this.recListCourse.filter(v => {
      return v.courseProperty !== 3;
    });
    let recordList = [];
    let recordObj = {};
    this.recordList.forEach((element, index) => {
      let key =
        element.coursePropertyName +
        element.provinceName +
        element.version +
        element.gradeName +
        element.courseType;
      if (recordObj[key]) {
        recordList[recordObj[key]].subjectName =
          element.subjectName + "," + recordList[recordObj[key]].subjectName;
      } else {
        recordList.push(element);
        recordObj[key] = String(recordList.length - 1);
      }
    });
    this.recordList = recordList;
    this.recordSpanArr = new objectSpanMethodClass(this.recordList, [
      { key: "coursePropertyName" },
      { key: "provinceName" }
    ]).getSpanArr();
    this.liveSpanArr = new objectSpanMethodClass(this.liveList, [
      { key: "coursePropertyName" },
      { key: "provinceName" },
      { key: "coursePeriodName" },
      // { key: "classType" }
    ]).getSpanArr();
  },
  methods: {
    init(message) {},
    // 自定义合并表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const arr = [0, 1];
      if (arr.includes(columnIndex)) {
        const _rowspan = this.recordSpanArr[columnIndex][rowIndex];
        const _colspan = _rowspan > 0 ? 1 : 0;
        return {
          rowspan: _rowspan,
          colspan: _colspan
        };
      }
    },
    // 自定义合并表格
    liveObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const arr = [0,1,2];
      if (arr.includes(columnIndex)) {
        const _rowspan = this.liveSpanArr[columnIndex][rowIndex];
        const _colspan = _rowspan > 0 ? 1 : 0;
        return {
          rowspan: _rowspan,
          colspan: _colspan
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.margin-top20 {
  margin-top: 20px;
}
</style>
