<template>
  <el-dialog
    :close-on-click-modal="false"
    title="学员分班"
    :visible.sync="studentPlacementDialogs"
    center
    width="910px"
    v-el-drag-dialog
  >
    <el-form inline :rules="rules" ref="form" :model="form">
      <el-form-item label="班级名称">
        <div>{{this.className}}</div>
      </el-form-item>
      <el-form-item label="班主任" prop="classTeacher">
        <el-select clearable v-model="form.classTeacher">
          <el-option
            :value="item.userId"
            v-for="item in classTeachers"
            :key="item.userId"
            :label="item.userName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-transfer
      style="text-align: left; display: inline-block"
      v-loading="loading"
      v-model="filtersStudentName"
      :filter-method="filterMethod"
      filterable
      :titles="['待分班', '已分班']"
      :button-texts="['移除', '添加']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      @change="handleChange"
      :data="data">
      <span slot-scope="{ option }">{{ option.label }} - {{ option.val.year }}- {{ option.val.grade }}</span>
    </el-transfer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="studentPlacementDialogs=false">取消</el-button>
      <el-button type="primary" @click="student2Class">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  findClassTeacher,
  findStudent,
  student2Class
} from "@/api/offline/OfflnClassMgtApi";
export default {
  name: "studentPlacement",
  props: ["studentPlacementDialog", "getClassList"],
  data () {
    return {
      transfer:{
        filterMethodQuery:""
      },
      scrollDomStart:0,
      scrollDomEnd:99,
      scrollDomPageSize:100, // 加载数据 100条
      scrollDom:null,
      filtersStudentName:[],
      data: [],
      notClassList:[],
      loading: false, // table加载
      totle: 0, //一共多少条数据
      classTeachers: [], //班主任数组
      classList: [], //学员信息
      hasClassList: [], //分班的学生
      notClassList: [], //没有分班的学生
      addStudentIds: [], //选中的学生
      AllClassList:[],// 所有的学生
      notSelectStudent: [], //没有选中的学生
      form: {
        classTeacher: "" //班主任
      },
      rules: {
        classTeacher: [
          { required: true, message: "请选择班主任", trigger: "change" }
        ]
      },
      className: null,
      classId: null
    };
  },
  mounted(){
  },
  computed: {
    studentPlacementDialogs: {
      get () {
        return this.studentPlacementDialog;
      },
      set (val) {
        this.$emit("update:studentPlacementDialog", val);
        this.form.classTeacher = "";
        this.classList = [];
      }
    }
  },
  methods: {
    filterMethod(query, item){
        this.transfer.filterMethodQuery = query;
        if(query){
          return item.label.indexOf(query) > -1;
        }else{
          if( item.key < 100 || item.show === true || this.filtersStudentName.includes(item.key)){
              return true;
          }else{
              return false;
          }
        }
    },
    handleChange(){

    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    findClassTeacher (campusName, className) {
      this.className = className
      findClassTeacher({
        campusName: campusName
      }).then(res => {
        this.classTeachers = res.data;
      });
    },
    findStudent (courseId, classId) {
      this.loading = true;
      this.classId = classId;
      this.filtersStudentName = [];
      this.data = [];
      findStudent({
        courseId: courseId,
        classId: classId
      }).then(res => {
        this.loading = false;
        if (res.status == 200) {
            this.scrollDomStart = 0;
            this.scrollDomEnd = 99;
            this.scrollDom = document.getElementsByClassName('el-transfer-panel__list')[0];
            this.scrollDom.addEventListener('scroll', () => {
              // 滚动距离
              let scrollTop = this.scrollDom.scrollTop;
              console.log("滚动距离",scrollTop);
              //变量windowHeight是可视区的高度
              let windowHeight = this.scrollDom.clientHeight || this.scrollDom.clientHeight
              // 变量scrollHeight是滚动条的总高度
              let scrollHeight = this.scrollDom.scrollHeight || this.scrollDom.scrollHeight
              if (scrollTop + windowHeight === scrollHeight && !this.transfer.filterMethodQuery) {
                this.scrollDom.scrollTop -= 200;
                //滚动到底部
                this.scrollDomStart +=this.scrollDomPageSize;
                this.scrollDomEnd +=this.scrollDomPageSize;
                for(let i = this.scrollDomStart; i< this.scrollDomEnd;i++){
                  let val = this.AllClassList[i];
                  this.data[i].show = true; 
                }
              }
            })
          this.hasClassList = res.data.hasClassList;
          this.notClassList = res.data.notClassList; 
          this.AllClassList = this.hasClassList.concat(this.notClassList);
          res.data.hasClassList.forEach((val,key) => {
            this.filtersStudentName.push(key);
          });
          this.notClassList = res.data.notClassList;
          this.AllClassList.forEach((val,key) => {
                if(key < 100){
                   this.data.push({
                  key: key,
                  label: `${ val.studentName }-${ val.userId }`,
                  val: val,
                  show:true
                });
                }else{
                  this.data.push({
                  key: key,
                  label: `${ val.studentName }-${ val.userId }`,
                  val: val,
                  show:false
                });
                }
          });
          this.totle =
            res.data.hasClassList.length + res.data.notClassList.length;
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    student2Class () {
      this.addStudentIds = [];
      for (var i = 0;i < this.filtersStudentName.length;i++) {
        this.addStudentIds.push({
          studentId: this.AllClassList[this.filtersStudentName[i]].studentId,
          orderId: this.AllClassList[this.filtersStudentName[i]].orderId
        });
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          student2Class({
            classId: this.classId,
            userId: this.form.classTeacher,
            students: this.addStudentIds
          }).then(res => {
            if (res.status == 200) {
              this.$message({
                message: "设置成功",
                type: "success"
              });
              this.getClassList()
              this.studentPlacementDialogs = false;
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.marginBottom20 {
  margin-bottom: 20px;
}
>>> .el-transfer-panel{
  height: 338px;
  width: 365px;
}
</style>
