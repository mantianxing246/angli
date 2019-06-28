<template >
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-input v-model="listQuery.name" style='width:150px;' clearable placeholder="学员姓名" maxlength="50"/>
        <el-input v-model="listQuery.userId" :style="{width:$selectConfig.studentRoleIdWidth+'px'}" clearable placeholder="学员ID" maxlength="30"/>
        <el-button :loading="loading" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" @click="dialogVisible=true">课耗导入</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
    <el-table :data="dataList" highlight-current-row border fit center stripe>
      <el-table-column label="课程名称" align="center" prop="courseName"/>
      <el-table-column label="学员姓名" align="center" prop="name"/>
      <el-table-column label="总课时" align="center" prop="totalHours"/>
      <el-table-column label="剩余课时" align="center" prop="residualHours"/>
    </el-table>
    <pagination
      v-show="total>0"
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="getList"
    />
    </div>
      </template>
    </Card-Container>
    <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="dialogVisible" title="课耗导入" width="30%">
      <el-upload
        ref="upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-error="onError"
        :auto-upload="false"
        :on-change="onChange"
        :on-success="uploadSuccess"
        :file-list="fileList"
        class="upload-demo"
        :action="action"
      >
        <el-button size="small" type="primary">浏览</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/components/Pagination";
import { findIndivStudentList } from "@/api/individual/IndivCourseMgt";
export default {
  name: "IndivAccrualMgt", // 在线个性化 课耗管理
  components: { pagination },
  data () {
    return {
      action: process.env.BASE_API + '/indiv-accural/import',
      total: 0,
      dialogVisible: false,
      fileList: [],
      file: "",
      dataList: [],
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        userId: "",
        name: "",
        propertyId: 4
      },
      loading: false
    };
  },
  created () {
    this.getList();
  },
  methods: {
    // 搜索
    getList () {
      this.loading = true;
      findIndivStudentList(this.listQuery).then(response => {
        this.loading = false;
        if (response.status === 200) {
          this.dataList = response.data.list;
          this.total = response.data.total;
        } else {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    search () {
      this.getList();
    },
    // 课耗导入
    handleRemove (file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview (file) {
      this.file = file;
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onError (err, file, fileList) {
      this.$message({
        message: "导入失败",
        type: "error"
      });
    },
    onChange (file, fileList) {
      this.fileList = fileList;
    },
    // 确认上传
    subUpload () {
      if (!this.fileList[0]) {
        this.$alert(`请选择一个文件`);
        return;
      } else {
      }
      this.$refs.upload.submit();
    },
    uploadSuccess (res) {
      if (res.status === 200) {
        this.$message({
          message: "导入成功",
          type: "success"
        });
        this.dialogVisible = false;
      } else {
        this.$message({
          message: res.message,
          type: "warning"
        });
      }
    },
    uploadError () {
      this.$refs.upload.clearFiles();
      this.$message.error("上传失败，请重新上传");
    }
  }
};
</script>
<style scoped>
.width80 {
  width: 80px;
}
.width120 {
  width: 120px;
}
</style>
