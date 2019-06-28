<template>
  <div class="app-container">
    <el-button type="primary" class="margin-20" @click="showAddDept">新增</el-button>
    <Card-Container>
      <template>
        <div slot="body">
          <tree-table
            v-loading="listLoading"
            :data="dataList"
            border
            highlight-current-row
            fit
            stripe
          >
            <el-table-column label="部门名称" prop="deptName" align="center"/>
            <el-table-column label="添加人" prop="addBy" align="center"/>
            <el-table-column label="添加时间" prop="addTime" align="center"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="czSort">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit" size="large" @click="showUpdateDept(scope.row)"/>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i
                      class="el-icon-delete pointer"
                      size="large"
                      @click="deleteDept(scope.row.deptId)"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </tree-table>
          <pagination
            v-show="total>0"
            :page-sizes="[5, 10, 20]"
            :limit.sync="pageSize"
            :page.sync="currentPage"
            :total="total"
            @pagination="getList"
          />
        </div>
      </template>
    </Card-Container>
    <dialog-container
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="400px"
    >
      <template slot="body">
        <el-form
          ref="formAdd"
          :inline="true"
          :model="formAdd"
          :rules="formAddRules"
          style="margin-left:40px"
          class="demo-form-inline"
        >
          <el-form-item label="上级部门" prop="parentId">
            <el-cascader
              v-model="parentId"
              :options="dataList"
              :props="props"
              :show-all-levels="false"
              change-on-select
              placeholder="请选择"
              style="width:163px"
              clearable
              @change="getLastDeptId"
            />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="formAdd.deptName" placeholder="部门名称"/>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="hideAddDept">取 消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?addDept():updateDept()">确 定</el-button>
        </div>
      </template>
    </dialog-container>
  </div>
</template>

<script>
import DeptApi from "@/api/admin/DeptApi";
import treeTable from "@/components/TreeTable";
export default {
  name: "Dept",
  components: { treeTable },
  data () {
    return {
      listLoading: false,
      dataList: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      dialogFormVisible: false,
      parentId: [],
      formAdd: {
        deptId: null,
        parentId: 0,
        deptName: ""
      },
      formAddRules: {
        deptName: [{ required: true, message: "部门名称", trigger: "blur" }]
      },
      props: {
        value: `deptId`,
        label: `deptName`
      },
      dialogStatus: "",
      textMap: {
        update: "部门修改",
        create: "部门添加"
      }
    };
  },
  computed: {},
  mounted () {
    this.getList();
  },
  methods: {
    getList () {
      this.listLoading = true;
      DeptApi.getPageList(this.currentPage, this.pageSize)
        .then(response => {
          this.listLoading = false;
          if (response.status === 200) {
            this.dataList = this.emptyArray2Null(response.data.list);
            // console.log(this.dataList)
            this.total = response.data.total;
          } else {
            this.$message({
              message: response.message,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    showAddDept () {
      this.dialogFormVisible = true;
      this.dialogStatus = "create";
    },
    hideAddDept () {
      this.$nextTick(() => {
        this.$refs["formAdd"].resetFields();
      });
      this.parentId = [];
      this.formAdd.parentId = [];
      this.formAdd.deptId = null;
      this.formAdd.deptName = "";
      this.dialogFormVisible = false;
    },
    emptyArray2Null (deptArray) {
      deptArray.forEach(dept => {
        if (dept.children.length === 0) {
          dept.children = null;
        } else {
          this.emptyArray2Null(dept.children);
        }
      });
      return deptArray;
    },
    addDept () {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          if (this.formAdd.deptName.length > 20) {
            this.$message({
              message: "部门名称过长，请重新输入",
              type: "warning"
            });
            return;
          }
          const res = {
            deptId: this.formAdd.deptId,
            parentId: this.formAdd.parentId,
            deptName: this.formAdd.deptName
          };
          DeptApi.addDept(res).then(response => {
            if (response.status === 200) {
              this.$message({
                message: "部门添加成功",
                type: "success"
              });
              this.hideAddDept();
              this.getList();
            } else {
              this.$message({
                message: response.message,
                type: "warning"
              });
              this.hideAddDept();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteDept (deptId) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        DeptApi.deleteDept(deptId).then(response => {
          if (response.status === 200) {
            this.$message({
              message: "删除部门成功",
              type: "success"
            });
            this.getList();
          } else {
            this.$message({
              message: response.message,
              type: "warning"
            });
          }
        });
      });
    },
    showUpdateDept (row) {
      this.parentId = [row.parentId];
      this.formAdd.parentId = row.parentId;
      this.formAdd.deptId = row.deptId;
      this.formAdd.deptName = row.deptName;
      this.dialogFormVisible = true;
      this.dialogStatus = "update";
      console.log(row);
    },
    // 待修改
    updateDept () {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          const formAdd = {
            deptId: this.formAdd.deptId,
            parentId: this.formAdd.parentId,
            deptName: this.formAdd.deptName
          };
          DeptApi.updateDept(formAdd).then(response => {
            if (response.status === 200) {
              this.$message({
                message: "部门修改成功",
                type: "success"
              });
              this.hideAddDept();
              this.getList();
            } else {
              this.hideAddDept();
              this.$message({
                message: response.message,
                type: "warning"
              });
            }
          });
        }
      });
    },
    getLastDeptId (val) {
      this.formAdd.parentId = val[val.length - 1];
    }
  }
};
</script>

