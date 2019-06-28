<!--
 * @author wufan
 * @date 2018/12/28
-->
<template>
  <div class="app-container">
    <!-- 查询区----start -->
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidth"
      :inline="true"
      class="demo-form-inline"
    >
      <!--  <el-form-item >
        <el-input v-model="roleName" placeholder="请输入角色名"/>
      </el-form-item>-->
      <el-form-item>
        <!--<el-button round type="primary" @click=" searchPage(roleName)">查询</el-button>-->
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询区----end -->
    <!-- 表格---start -->
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            v-loading="listLoading"
            :data="tableData"
            highlight-current-row
            border
            fit
            stripe
            style="width: 100%"
          >
            <el-table-column prop="roleId" label="角色ID" align="center"/>
            <el-table-column prop="roleName" label="角色名" align="center"/>
            <el-table-column prop="detail" label="角色描述" align="center"/>
            <el-table-column label="角色权限" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="setMenu(scope.row.roleId)">设置权限</el-button>
              </template>
            </el-table-column>
            <!--<el-table-column label="所属部门" fixed="right" min-width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="setMenu(scope.row.roleId)">设置部门</el-button>
        </template>
            </el-table-column>-->
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row.roleId)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.roleId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="pageTotal>0"
            :limit.sync="pageSize"
            :page.sync="pageNum"
            :total="pageTotal"
            @pagination="fetchData1"
          />
        </div>
      </template>
    </Card-Container>
    <!-- 表格---end-->
    <!--设置权限弹框start-->
    <dialog-container title="编辑角色" :visible.sync="dialogVisible" width="30%">
      <template slot="body">
        <el-tree
          ref="tree"
          :data="data2"
          :props="defaultProps"
          show-checkbox
          default-expand-all
          node-key="menuId"
          highlight-current
          @check="checkBoxClick"
        />
      </template>
      <template slot="footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="getCheckedKeys">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </dialog-container>
    <!--设置权限弹框end-->
    <!--所属部门弹框-->

    <dialog-container title="所属部门" :visible.sync="dialogTableVisible">
      <template slot="body">
        <el-table width="150">
          <el-table-column prop="deptLevel1Name" label="一级部门" width="80"/>
          <el-table-column prop="deptLevel2Name" label="二级部门" width="80"/>
        </el-table>
      </template>
    </dialog-container>
    <!-- 编辑弹框---start -->
    <dialog-container title="编辑角色" :visible.sync="dialogAddVisible" width="400px">
      <template slot="body">
        <el-form
          :label-position="labelPosition"
          :label-width="labelWidth"
          :inline="true"
          :rules="rule"
          :model="formEdit"
          class="demo-form-inline"
        >
          <el-form-item label="角色名">
            <el-input v-model="formEdit.roleName" placeholder="角色名"/>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formEdit.detail" placeholder="角色描述"/>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible= false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </div>
      </template>
    </dialog-container>
    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <dialog-container title="新增角色" :visible.sync="dialogFormVisible" width="400px">
      <template slot="body">
        <el-form
          ref="form"
          :label-position="labelPosition"
          :label-width="labelWidth"
          :inline="true"
          :rules="rule"
          :model="formAdd"
          class="demo-form-inline"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="formAdd.roleName" placeholder="角色名"/>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formAdd.detail" placeholder="角色描述"/>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button v-waves @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </template>
    </dialog-container>

    <!-- 新增弹框---end -->
  </div>
</template>

<script>
import RoleApi from "@/api/admin/RoleApi";
import { differenceSet, getUnion } from "@/utils/ArrayUtils";
import waves from "@/components/directive/waves"; // Waves directive
import { validatorFactory } from "@/utils/async-validator";
export default {
  name: "Role",
  components: {},
  directives: {
    waves
  },
  data() {
    return {
      listLoading: false,
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0,
      searchMap: {},
      roleName: "",
      roleId: "",
      menuIdList: [],
      roleMenu: {
        roleId: "",
        addMenuIds: [],
        deleteMenuIds: []
      },
      menuIdListCopy: [], // 备份
      data2: [
        {
          menuId: "",
          menuName: "",
          menuTreeList: [
            {
              menuId: "",
              menuName: "",
              menuTreeList: [
                {
                  menuId: "",
                  menuName: ""
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "menuTreeList",
        label: "menuName"
      },
      dialogVisible: false,
      tableData: [],
      dialogFormVisible: false,
      dialogTableVisible: false,
      formAdd: {
        // 新增表单对象
        roleName: "",
        detail: "",
        dept: {}
      },
      labelPosition: "right", // lable对齐方式
      labelWidth: "100px", // lable宽度
      dialogAddVisible: false,
      formLabelWidth: "120px",
      formEdit: {
        // 编辑表单对象
        roleId: "",
        roleName: "",
        detail: ""
      },
      rule: {
        roleName: [
          validatorFactory("请输入角色名称", "text", null, true),
          validatorFactory("角色名称超出限制", "text", 20, true)
        ]
      },
      multipleSelection: []
    };
  },
  mounted() {
    this.fetchData();
    this.listLoading = true;
    RoleApi.getMenuList()
      .then(response => {
        this.listLoading = false;
        this.data2 = response.data;
        // console.log(this.data2)
      })
      .catch(() => {
        this.listLoading = false;
      });
  },
  methods: {
    checkBoxClick(node, status) {
      this.roleMenu.addMenuIds = differenceSet(
        status.checkedKeys.concat(status.halfCheckedKeys),
        this.menuIdList
      );
      if (this.menuIdListCopy[0]) {
        this.roleMenu.addMenuIds = this.roleMenu.addMenuIds.filter(e => {
          let flag = false;  // 是否有重复数据  false没有
          for (let i = 0; i < this.menuIdListCopy.length; i++) {
            if (e === this.menuIdListCopy[i]) {
              flag =  true;
            } else {
            }
          }
          return !flag
        });
      }
      this.roleMenu.deleteMenuIds = differenceSet(
        this.menuIdList,
        status.checkedKeys
      );
    },
    fetchData1(page) {
      RoleApi.getPageList(page.page, page.limit).then(response => {
        this.tableData = response.data.list;
        this.pageTotal = response.data.total;
      });
    },
    fetchData() {
      // 页码变化
      let pageSize = this.pageSize;
      // 当前页变化
      let pageNum = this.pageNum;
      RoleApi.getPageList(pageNum, pageSize).then(response => {
        this.tableData = response.data.list;
        this.pageTotal = response.data.total;
      });
    },
    handleAdd() {
      this.formAdd = {};
      this.dialogFormVisible = true;
    },
    setMenu(id) {
      this.fineMenuId(id);
      this.roleId = id;
      this.dialogVisible = true;
    },
    fineMenuId(roleId) {
      // 数据回显
      RoleApi.findMenuId(roleId).then(res => {
        this.menuIdList = res.data;
        this.menuIdListCopy = JSON.parse(JSON.stringify(res.data));
        getUnion(this.menuIdList, this.data2);
        this.setCheckedKeys(this.menuIdList);
      });
    },
    setDept() {
      this.dialogTableVisible = true;
    },

    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 新增角色
          RoleApi.save(this.formAdd).then(res => {
            // 关闭弹窗
            this.dialogFormVisible = false;
            this.formAdd = {};
            if (res.status === 200) {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.fetchData();
            } else {
              this.$message({
                message: "新增失败，稍后重试",
                type: "warning"
              });
            }
          });
        }
      });
    },
    handleEdit(roleId) {
      // 数据回显
      RoleApi.findById(roleId).then(res => {
        this.formEdit.roleId = res.data.roleId;
        this.formEdit.roleName = res.data.roleName;
        this.formEdit.detail = res.data.detail;
        this.dialogAddVisible = true;
      });
    },
    editRole() {
      // 修改角色
      if (this.formEdit.roleName == "" || this.formEdit.roleName == null) {
        this.$message({
          message: "请输入角色名称",
          type: "warning"
        });
        return;
      }
      RoleApi.update(this.formEdit).then(res => {
        this.dialogAddVisible = true;
        this.formEdit = {};
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.dialogAddVisible = false;
          this.fetchData();
        } else {
          this.$message({
            message: "修改失败，稍后重试",
            type: "warning"
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RoleApi.delete(id).then(res => {
            if (res.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.fetchData();
            } else {
              this.$message({
                message: "删除失败，稍后重试",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getCheckedKeys(roleId) {
      this.roleMenu.roleId = this.roleId;
      // this.roleMenu.menuIdList=this.$refs.tree.getCheckedKeys();
      RoleApi.setRoleMenu(this.roleMenu).then(res => {
        // 关闭弹窗
        this.dialogVisible = false;
        this.$refs.tree.setCheckedKeys([]);
        if (res.status === 200) {
          this.$message({
            message: "设置成功",
            type: "success"
          });
          this.fetchData();
        } else {
          this.$message({
            message: "设置失败，稍后重试",
            type: "warning"
          });
        }
      });
    },
    setCheckedKeys(menuIdList) {
      this.$refs.tree.setCheckedKeys(menuIdList);
    }
  }
};
</script>
