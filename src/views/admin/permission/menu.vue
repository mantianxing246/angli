<!--
 * @author wufan
 * @date 2018/12/28
-->
<template>
  <div class="app-container">
    <!-- 查询区----end -->
    <!-- 表格---start -->
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            :data="tableData"
            highlight-current-row
            style="width: 100%;"
            border
            fit
            stripe
            v-loading="loading"
          >
            <!--<el-table-column type="selection" width="55">
            </el-table-column>-->
            <el-table-column prop="menuName" label="菜单" align="center"/>
            <el-table-column prop="parentName" label="所属父类" align="center"/>
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row.menuId)">编辑</el-button>
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
    <!-- 编辑弹框---start -->
    <dialog-container title="编辑菜单" :visible.sync="dialogAddVisible" width="400px">
      <template slot="body">
        <el-form
          :label-position="labelPosition"
          :label-width="labelWidth"
          :inline="true"
          :model="formEdit"
          :rules="formEditRules"
          class="demo-form-inline"
        >
          <el-form-item label="菜单名" prop="menuName">
            <el-input v-model="formEdit.menuName" placeholder="菜单名"/>
          </el-form-item>
          <!--<el-form-item label="所属父类">
          <el-input v-model="formEdit.parentName" placeholder="所属父类"/>
          </el-form-item>-->
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible= false">取 消</el-button>
          <el-button type="primary" @click="editMenu">确 定</el-button>
        </div>
      </template>
    </dialog-container>
    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <!--<el-dialog :close-on-click-modal="false"  title="新增菜单" :visible.sync="dialogFormVisible" width="400px">
      <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" :model="formAdd" class="demo-form-inline">
        <el-form-item label="菜单名">
          <el-input v-model="formAdd.roleName" placeholder="菜单名名"></el-input>
        </el-form-item>
        <el-form-item label="所属类别">
          <div class="block">
            <el-cascader
              :options="options"
              change-on-select
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>-->
    <!-- 新增弹框---end -->
  </div>
</template>

<script>
import MenuApi from "@/api/admin/MenuApi";
import { validatorFactory } from "@/utils/async-validator";
export default {
  name: "Menus",
  components: {},
  data () {
    return {
      pageNum: 1,
      pageSize: 20,
      pageTotal: 0,
      searchMap: {},
      tableData: [
        {
          menuId: "",
          menuName: "",
          parentName: "",
          parentId: ""
        }
      ],
      dialogFormVisible: false,
      formAdd: {
        // 新增表单对象
        menuId: "",
        menuName: "",
        parentName: "",
        parentId: ""
      },
      labelPosition: "right", // lable对齐方式
      labelWidth: "100px", // lable宽度
      dialogAddVisible: false,
      formLabelWidth: "120px",
      formEdit: {
        menuId: "",
        menuName: "",
        parentName: "",
        parentId: ""
      },
      formEditRules: {
        menuName: [
          validatorFactory("菜单名", "text", null, true),
          validatorFactory("菜单名超出限制", "text", 20, true)
        ]
      },
      multipleSelection: [],
      loading: false
    };
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    fetchData1 (page) {
      this.loading = true
      MenuApi.getPageList(page.page, page.limit, this.searchMap).then(
        response => {
          this.loading = false
          this.tableData = response.data.list;
          this.pageTotal = response.data.total;
        }
      ).catch(() => {
        this.loading = false
      });
    },
    fetchData (pageSize, pageNum) {
      // 页码变化
      pageSize = this.pageSize;
      // 当前页变化
      pageNum = this.pageNum;
      this.loading = true
      MenuApi.getPageList(pageNum, pageSize, this.searchMap).then(response => {
        this.loading = false
        this.tableData = response.data.list;
        this.pageTotal = response.data.total;
      }).catch(() => {
        this.loading = false
      });
    },
    handleAdd () {
      this.formAdd = {};
      this.dialogFormVisible = true;
    },
    submit () {
      if (this.formEdit.menuName.length > 20) {
        this.$message({
          message: "长度大于20",
          type: "warning"
        });
        return;
      }
      // 新增角色
      MenuApi.save(this.formAdd).then(res => {
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
    },
    handleEdit (id) {
      // 数据回显
      MenuApi.findById(id).then(res => {
        this.formEdit.menuId = res.data.menuId;
        this.formEdit.paerntId = res.data.paerntId;
        this.formEdit.parentName = res.data.parentName;
        this.formEdit.menuName = res.data.menuName;
        this.dialogAddVisible = true;
      });
    },
    editMenu () {
      if (this.formEdit.menuName.length > 20) {
        this.$message({
          message: "长度大于20",
          type: "warning"
        });
        return;
      }
      // 修改角色
      MenuApi.update(this.formEdit).then(res => {
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
    handleDelete (id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          MenuApi.delete(id).then(res => {
            if (res.data.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.fetchData();
            } else if (res.data.status === 500) {
              this.$message({
                message: res.data.failMessage,
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
    }
  },
  handleChange (value) {
    console.log(value);
  }
};
</script>

