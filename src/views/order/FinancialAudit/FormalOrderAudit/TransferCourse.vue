/*
@author lfz
@date 2019/2/26
*/
<template>
  <div>
    <Card-Container :paddingValue="10" title="申请转课">
      <template slot="body">
    <el-table
      :data="courseChangeInfo.courseList"
      highlight-current-row
      border
      fit
      stripe
      style="width: 100%;margin-bottom:10px;"
    >
      <el-table-column label="课程属性" align="center" prop="propertyName"/>
      <el-table-column label="课程名称" align="center" prop="courseName" min-width="310"/>
      <el-table-column label="课程类型" align="center" prop="courseType" width="150"/>
      <el-table-column label="课程状态" align="center" prop="statusName"/>
      <el-table-column label="开始日期" align="center" prop="startDate"/>
      <el-table-column label="结束日期" align="center" prop="endDate"/>
      <el-table-column label="剩余金额" align="center">
        <template slot-scope="scope">{{scope.row.residualPrice | price}}</template>
      </el-table-column>
      <el-table-column label="转课金额" align="center" width="100">
        <template slot-scope="scope" style="display: flex;justify-content: space-between;text-align:center;">
          <div>
             {{scope.row.changeAmount}}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="transferCourse" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="转课申请单号" prop="changeNo">
            <el-input disabled v-model="courseChangeInfo.changeNo" :maxlength="50" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="转课日期" prop="date">
            <el-date-picker
            disabled
              v-model="courseChangeInfo.operateTime"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" type="flex">
        <el-col :span="6">
          <el-form-item label="操作人员">
            <!-- <el-input v-model="courseChangeInfo.oprationName" disabled/> -->
            {{courseChangeInfo.operationUserLoginId}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售人员" prop="oprationId">
            <!-- <el-input v-model="courseChangeInfo.oprationName" disabled/> -->
            {{courseChangeInfo.salesUserLoginId}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分成人员" prop="oprationId">
            <!-- <el-input v-model="courseChangeInfo.oprationName" disabled/> -->
            {{courseChangeInfo.divideUserLoginId}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              disabled
              v-model="courseChangeInfo.remark"
              :maxlength="150"
              type="textarea"
              style="width:300px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </template>
    </Card-Container>
  </div>
</template>
<script>
export default {
  name: 'TransferCourseForAudit',
  data () {
    return {
      courseChangeInfo: {
       "changeNo": "",
        "changeStatus": "",
        "courseList": [
        ],
        "id": "",
        "newOrderId":"",
        "operateBy": "",
        "operateTime":"",
        "orderId": "",
        "remark": "",
      },
    }
  },
  methods: {
    init(message){
      this.courseChangeInfo = message;
    }
  }
}
</script>
<style lang="scss" scoped>
.space {
  margin-bottom: 20px;
  margin-top: 20px;
}
.el-input-group{
    margin-left: 15px;
}
</style>
