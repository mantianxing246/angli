<template>
  <el-dialog :close-on-click-modal="false"  title="班级调整" :visible.sync="classDialog" width="50%" v-el-drag-dialog center>
    <el-table :data="list" border fit stripe style="width: 100%">
      <el-table-column label="学员姓名/ID" align="center" prop="name"></el-table-column>
      <el-table-column label="选择更换班级" align="center" prop="className">
        <template slot-scope="scope">
          <el-select v-model="classId" placeholder="请选择" @change="getClassTeachers(classId)">
            <el-option
              v-for="item in classes"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="选择更换班主任" align="center" prop="userName">
        <template slot-scope="scope">
          <el-select v-model="classTeacherId" placeholder="请选择">
            <el-option
              v-for="item in classTeachers"
              :key="item.classTeachers"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="classDialog = false">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSingleStudent, getClassTeachers, getClasses, updateClass } from '@/api/offline/StudentMgt'
export default {
  name: "OfflnClassAdjust",
  data () {
    return {
      list: [],
      classId: null,
      classTeacherId: null,
      classTeachers: [], //所有班主任
      classes: [], //所有班级
    }
  },
  props: ["classAdjustDialog"],
  computed: {
    classDialog: {
      get () {
        return this.classAdjustDialog
      },
      set (val) {
        this.$emit("update:classAdjustDialog", val)
      }
    }
  },
  methods: {
    //获取学员信息
    getSingleStudent (params) {
      this.studentId = params.studentId  //存储studentId
      getSingleStudent(params).then(res => {
        this.list = []
        if (res.status === 200) {
          this.list.push(res.data)
          this.classId = res.data.classId
          this.getClassTeachers(res.data.classId)
          this.classTeacherId = res.data.userId
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 获取所有班主任
    getClassTeachers (classId) {
      getClassTeachers(classId).then(res => {
        if (res.status === 200) {
          this.classTeachers = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    //获取所有班级
    getClasses () {
      getClasses().then(res => {
        if (res.status === 200) {
          this.classes = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    //确认操作
    confirm () {
      var data = {
        studentId: this.studentId,
        classId: this.classId,
        userId: this.classTeacherId
      }
      updateClass(data).then(res => {
        if (res.status === 200) {
          this.classDialog = false
          this.$emit('reload')
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
