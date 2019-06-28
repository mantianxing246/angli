<template>
  <div class="app-container">
    <!-- 查询区----start -->
    <el-form
      :label-position="labelPosition"
      :inline="true"
      :model="formSearch"
      class="demo-form-inline"
    >
      <el-form-item>
        <div class="block">
          <el-input
            v-model="formSearch.userName"
            placeholder="用户名"
            clearable
            @change="changeUserName"
            :maxlength="50"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formSearch.deptLevel1Id"
          placeholder="所属部门"
          @change="formSearchGetDept2"
          clearable
        >
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.deptLevel1Name"
            :value="item.deptLevel1Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-select v-model="formSearch.deptLevel2Id" placeholder="所属部门" clearable>
          <el-option
            v-for="(item,index) in searchOptions1"
            :key="index"
            :label="item.deptLevel2Name"
            :value="item.deptLevel2Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="findAllUser" :loading="loading" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="dialogFormVisible = true;">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询区----end -->
    <!-- 表格---start -->
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            center
            v-loading="loading"
            highlight-current-row
            fit
          >
            <!--<el-table-column type="selection" width="55">
            </el-table-column>-->
            <el-table-column prop="userId" label="用户ID" align="center" width="70"/>
            <el-table-column prop="loginId" label="登录ID" align="center" width="80"/>
            <el-table-column prop="userName" label="用户名" align="center" min-width="150"/>
            <el-table-column prop="sex" label="性别" align="center" width="60"/>
            <el-table-column prop="email" label="电子邮箱" align="center" min-width="200"/>
            <el-table-column prop="deptLevel1Name" label="一级部门" align="center" width="150"/>
            <el-table-column prop="deptLevel2Name" label="二级部门" align="center" width="150"/>
            <el-table-column label="操作" fixed="right" width="280" align="center">
              <template slot-scope="scope" align="center">
                <div class="czSort">
                  <el-button @click="handleEdit(scope.row.userId)">编辑</el-button>
                  <el-button type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
                  <el-button @click="submitForm('form',scope.row.userId)">修改密码</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="pageTotal>0"
            :limit.sync="formSearch.pageSize"
            :page.sync="formSearch.pageNum"
            :total="pageTotal"
            @pagination="getClassList"
          />
        </div>
      </template>
    </Card-Container>
    <!-- 修改密码----end -->
    <dialog-container title="修改密码" :visible.sync="dialogAddVisibleee" width="400px">
      <template slot="body">
        <el-form
          ref="form"
          :label-position="labelPosition"
          :rules="rules"
          :label-width="labelWidth"
          :inline="true"
          :model="form"
          class="demo-form-inline"
        >
          <!-- <el-form-item label>
          <el-input v-show="false" v-model="form.userId" placeholder/>
          </el-form-item>-->
          <!-- <el-form-item label>
          <el-input v-show="false" v-model="form.userName" placeholder="用户名"/>
          </el-form-item>-->
          <el-form-item label="密码" prop="passWord">
            <el-input v-model="form.passWord" placeholder="密码" type="password"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisibleee = false">取 消</el-button>
          <el-button type="primary" @click="editUserPassWord">确 定</el-button>
        </div>
      </template>
    </dialog-container>

    <!-- 表格---end-->
    <!-- 编辑弹框---start -->
    <dialog-container title="编辑用户" :visible.sync="dialogAddVisible" width="400px">
      <template slot="body">
        <el-form
          :label-position="labelPosition"
          :label-width="labelWidth"
          :inline="true"
          :model="formEdit"
          :rules="rules"
          ref="formEdit"
          class="demo-form-inline"
          style="margin-left:30px"
        >
          <el-form-item label="登录ID" prop="loginId">
            <el-input v-model="formEdit.loginId" placeholder="登录ID" clearable/>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formEdit.userName" placeholder="用户名" clearable/>
          </el-form-item>
          <el-form-item label="电子邮件" prop="email">
            <el-input v-model="formEdit.email" placeholder="电子邮件" clearable/>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="formEdit.mobilePhone" placeholder="手机" clearable/>
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-select v-model="formEdit.sex" placeholder="请选择" style="width:163px" clearable>
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="formEdit.roleId" placeholder="角色" style="width:163px" clearable>
              <el-option
                :value="item.roleId"
                :label="item.roleName"
                v-for="(item,index) in role"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级部门名称" prop="deptLevel1Id">
            <el-select
              v-model="formEdit.deptLevel1Id"
              placeholder="请选择"
              @change="deptChanged(formEdit.deptLevel1Id,'editOptions')"
              style="width:163px"
              clearable
            >
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.deptLevel1Name"
                :value="item.deptLevel1Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级部门名称">
            <el-select
              v-model="formEdit.deptLevel2Id"
              placeholder="请选择"
              style="width:163px"
              clearable
            >
              <el-option
                v-for="(item,index) in editOptions"
                :key="index"
                :label="item.deptLevel2Name"
                :value="item.deptLevel2Id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
      </template>
    </dialog-container>
    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <dialog-container title="新增用户" :visible.sync="dialogFormVisible" width="450px">
      <template slot="body">
        <el-form
          :label-position="labelPosition"
          :label-width="labelWidth"
          :inline="true"
          :model="formAdd"
          :rules="rules"
          ref="formAdd"
          class="demo-form-inline"
          style="margin-left:30px"
        >
          <el-form-item label="登录ID" prop="loginId">
            <el-input v-model="formAdd.loginId" placeholder="登录ID" clearable/>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formAdd.userName" placeholder="用户名" clearable/>
          </el-form-item>
          <el-form-item label="电子邮件" prop="email">
            <el-input v-model="formAdd.email" placeholder="电子邮件" clearable/>
          </el-form-item>
          <el-form-item label="手机" prop="mobilePhone">
            <el-input v-model="formAdd.mobilePhone" placeholder="手机" clearable/>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formAdd.sex" placeholder="请选择" style="width:163px" clearable>
              <el-option label="男" value="男"/>
              <el-option label="女" value="女"/>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="formAdd.roleId" style="width:163px" clearable>
              <el-option
                :value="item.roleId"
                :label="item.roleName"
                v-for="(item,index) in role"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级部门名称" prop="deptLevel1Id">
            <el-select
              v-model="formAdd.deptLevel1Id"
              placeholder="请选择"
              @change="deptChanged(formAdd.deptLevel1Id,'formAdd')"
              style="width:163px"
              clearable
            >
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.deptLevel1Name"
                :value="item.deptLevel1Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二级部门名称">
            <el-select
              v-model="formAdd.deptLevel2Id"
              placeholder="请选择"
              style="width:163px"
              clearable
            >
              <el-option
                v-for="(item,index) in addOptions"
                :key="index"
                :label="item.deptLevel2Name"
                :value="item.deptLevel2Id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </template>
    </dialog-container>

    <!-- 新增弹框---end -->
  </div>
</template>

<script>
import UserApi from "@/api/admin/UserApi"
export default {
  name: "User",
  data () {
    return {
      searchMap: [],
      pageTotal: 0,
      form: {
        passWord: ""
      },
      loading: false,
      dialogAddVisibleee: false,
      tableData: [
        {
          loginId: "",
          userId: "",
          userName: "",
          sex: "",
          email: "",
          passWord: "",
          deptLevel1Name: "",
          deptLevel2Name: ""
        }
      ],
      dialogAddVisibleShow: false,
      dialogFormVisibleShow: false,
      dialogFormVisibleL: false,
      formAdd: {
        // 新增表单对象
        loginId: "",
        userId: "",
        userName: "",
        passWord: "",
        mobilePhone: "",
        sex: "",
        email: "",
        deptLevel1Name: "",
        deptLevel2Name: "",
        description: "",
        deptLevel1Id: "",
        deptLevel2Id: "",
        id: null//角色
      },
      formSearch: {
        // 表单对象
        userName: null,
        deptLevel1Id: null,
        deptLevel2Id: null,
        pageNum: 1,
        pageSize: 20
      },
      labelPosition: "right",
      labelWidth: "120px",
      // dialogAddVisible: false,
      formLabelWidth: "120px",
      formEdit: {
        loginId: "",
        userId: "",
        userName: "",
        passWord: "",
        mobilePhone: "",
        sex: "",
        email: "",
        deptLevel1Name: "",
        deptLevel2Name: "",
        description: "",
        deptLevel1Id: "",
        deptLevel2Id: "",
        roleId: null
        // deptLevel2Id: null
      },
      rules: {

        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        email: [{ required: true, message: "请输入电子邮箱", trigger: "blur" },
        {          validator: (rule, value, callback) => {
            if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
              callback(new Error("邮箱格式不对"))
            } else {
              callback()
            }
          }, trigger: "blur"        }
        ],
        loginId: [{ required: "true", message: "请输入登录ID", trigger: "blur" },
        {          validator: (rule, value, callback) => {
            if (!/^[0-9a-zA-Z]+$/.test(value)) {
              callback(new Error("请输入正确的登录ID"))
            } else {
              callback()
            }
          }, trigger: "blur"        }],
        mobilePhone: [{ required: "true", message: "请输入手机号码", trigger: "blur" },
        {          validator: (rule, value, callback) => {
            if (!/^1[345678][0-9]{9}$/.test(value)) {
              callback(new Error("手机号码不正确"))
            } else {
              callback()
            }
          }, trigger: "blur"        }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        deptLevel1Id: [{ required: true, message: "请选择部门", trigger: "change" }]
      },
      multipleSelection: [],
      searchOptions1: [],//查询的二级部门
      addOptions: [],//新增的二级部门可能的信息
      editOptions: [],//编辑的二级部门可能的信息
      // 一级部门
      options: [
        {
          deptLevel1Id: "",
          deptLevel1Name: ""
        }
      ],
      role: []
    };
  },
  computed: {
    dialogAddVisible: {
      get () {
        return this.dialogAddVisibleShow
      },
      set (val) {
        this.dialogAddVisibleShow = val
        if (!val) {
          this.$refs.formEdit.resetFields()
        }
      }
    },
    dialogFormVisible: {
      get () {
        return this.dialogFormVisibleShow
      },
      set (val) {
        this.dialogFormVisibleShow = val
        if (!val) {
          this.$refs.formAdd.resetFields()
        }
      }
    }
  },
  mounted () {
    this.getPageList()
    this.getAllRole()
    this.getDept1List()
  },
  methods: {
    // 得到页面初始化内容
    getPageList (num) {
      if (num) {
        this.loading = true
      }
      UserApi.getPageList(this.formSearch).then(response => {
        this.loading = false
        this.tableData = response.data.list;
        this.pageTotal = response.data.total;
      }).catch(() => {
        this.loading = false
      });
    },
    //查询按钮
    findAllUser () {
      this.getPageList(1)
    },
    getAllRole () {
      UserApi.getAllRole().then((res) => {
        this.role = res.data
      })
    },
    submitForm (formName, uid) {
      this.dialogAddVisibleee = true;
      this.form.userId = uid;
    },
    // 修改密码
    editUserPassWord () {
      UserApi.repassWord(this.form).then(res => {
        // 关闭弹窗
        this.dialogAddVisibleee = false;
        this.form = {};
        if (res.status === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getPageList();
        } else {
          this.$message({
            message: "修改失败，稍后重试",
            type: "warning"
          });
        }
      });
    },
    // 新增一级部门有没有选中，选中就列出二级部门选项
    deptChanged (value, type) {
      if (type == "formAdd") {
        if (value) {
          this.dept2List(value, "addUserMgt");
        }
        this.formAdd.deptLevel2Id = null
        this.addOptions = []
      }
      if (type == 'editOptions') {
        if (value) {
          this.dept2List(value, "editOptions");
        }
        this.editOptions = []
        this.formEdit.deptLevel2Id = null
      }
    },
    // 通过一级部门筛选出二级部门
    dept2List (val, messageInfo) {
      UserApi.dept2(val).then(response => {
        if (messageInfo == 'formSearch') {
          this.searchOptions1 = response.data;
        }
        if (messageInfo == 'addUserMgt') {
          this.addOptions = response.data;
        }
        if (messageInfo == 'editOptions') {
          this.editOptions = response.data
        }
      });
    },
    getClassList () {
      this.getPageList()
    },
    editUser () {
      this.$refs.formEdit.validate((pass) => {
        if (pass) {
          UserApi.updateUser(this.formEdit).then(res => {
            // 关闭弹窗
            this.dialogAddVisible = false;
            this.formEdit = {};
            if (res.status === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.getPageList();
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        }
      })
    },
    submit () {
      // 新增
      this.$refs.formAdd.validate((pass) => {
        if (pass) {
          UserApi.save(this.formAdd).then(res => {
            // 关闭弹窗
            this.dialogFormVisible = false;
            // this.formAdd = {};
            if (res.status === 200) {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.getPageList();
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        }
      })
    },
    // 数据回显
    handleEdit (id) {
      this.dialogAddVisible = true;
      UserApi.update(id).then(res => {
        this.formEdit = res.data;
        if (res.data.deptLevel2Id != 0) {
          this.formEdit.deptLevel2Id = res.data.deptLevel2Id
        } else {
          this.formEdit.deptLevel2Id = null
        }
        if (res.data.deptLevel1Id) {
          this.dept2List(res.data.deptLevel1Id, "editOptions");
        }
      });
    },
    getQueryUser () {
      userApi
        .findById(this.formSearch.pageSize, this.formSearch.pageNum, this.formSearch)
        .then(response => {
          this.tableData = response.data.list;
        });
    },
    // 数据回显
    getDept1List () {
      UserApi.getDeptList().then(response => {
        this.options = response.data;
      });
    },
    getDept2 () {
      UserApi.getDept2List().then(response => {
        this.options2 = response.data;
      });
    },
    handleDelete (id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          UserApi.delete(id).then(res => {
            if (res.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getPageList();
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
    //查询得到二级部门的信息
    formSearchGetDept2 (value) {
      this.formSearch.deptLevel2Id = null
      this.searchOptions1 = []
      if (value) {
        this.dept2List(value, "formSearch")
      }
    },
    changeUserName (val) {
      if (val.length > 50) {
        this.$tipsMessage("用户名字不能超过50个汉字", "warning")
        this.formSearch.userName = null
      }
    }
  },
  components: {
  }
};
</script>

