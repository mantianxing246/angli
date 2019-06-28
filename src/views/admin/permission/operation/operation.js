import {
  getOperarion,
  saveOperarion,
  updateOperarion,
  deleteOperation,
  getOperarionById
} from '@/api/admin/OperationApi'
import { getAllRole } from '@/api/admin/RoleApi'
import { differenceSet } from '@/utils/ArrayUtils'
import { validatorFactory } from '@/utils/async-validator'
export default {
  name: 'role',
  data() {
    return {
      listLoading: false,
      checkAll: false,
      checkedRoles: [],
      editor: false,
      checkedRolesForEdit: [],
      deleteRoles: [],
      addRoles: [],
      roles: [],
      isIndeterminate: false,
      currentPage: 1,
      pageSize: 15,
      pageTotal: 0,
      searchMap: {
        pageNum: 1,
        pageSize: 5,
        operationName: '' // 操作名
      },
      tableData: [],
      dialogFormVisible: false,
      formAdd: {
        // 新增操作对象
        operationName: '',
        roleIds: []
      },
      formAddRules: {
        operationName: [
          { required: true, message: '请输入操作名', trigger: 'blue' },
          { max: 50, message: '长度不能大于50' },
          validatorFactory('请输入操作名', 'text')
        ]
      },
      formSearch: {
        // 表单对象
        user: '',
        region: ''
      },
      labelPosition: 'right', // lable对齐方式
      labelWidth: '80px', // lable宽度
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dialogAddVisible: false,
      formLabelWidth: '120px',
      formEdit: {
        // 编辑表单对象
        operationId: '',
        operationName: '',
        deleteRoles: [],
        addRoles: []
      },
      multipleSelection: []
    }
  },
  mounted() {
    getOperarion(this.searchMap).then(response => {
      if (response.status === 200) {
        this.tableData = response.data.list
        this.pageTotal = response.data.total
      } else {
        this.$message({
          message: response.message,
          type: 'warning'
        })
      }
    })
  },
  methods: {
    recordAddAndDeleteRole() {
      if (!this.editor) {
        return
      }
      this.deleteRoles = differenceSet(
        this.checkedRolesForEdit,
        this.checkedRoles
      )
      this.addRoles = differenceSet(this.checkedRoles, this.checkedRolesForEdit)
    },
    editCancel() {
      this.editor = false
      this.dialogAddVisible = false
      this.checkAll = false
      this.checkedRoles = []
      this.roles = []
      this.isIndeterminate = false
      this.dialogFormVisible = false
    },
    addCancel() {
      this.checkAll = false
      this.checkedRoles = []
      this.roles = []
      this.isIndeterminate = false
      this.dialogFormVisible = false
    },
    getAllRole() {
      getAllRole().then(response => {
        if (response.status === 200) {
          this.roles = response.data
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    },
    handleCheckAllChange(val) {
      var rolesId = []
      for (var i = 0; i < this.roles.length; i++) {
        rolesId.push(this.roles[i].roleId)
      }
      this.checkedRoles = val ? rolesId : []
      this.isIndeterminate = false
      this.recordAddAndDeleteRole()
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.roles.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roles.length
      this.recordAddAndDeleteRole()
    },
    fetchData(val) {
      // 当前页变化
      if (!isNaN(val.page)) {
        this.searchMap.pageNum = val.page
      }
      if (this.searchMap.operationName.length > 50) {
        this.$message({
          message: '操作名长度请小于50位',
          type: 'warning'
        })
        return
      }
      this.listLoading = true
      getOperarion(this.searchMap).then(response => {
        this.listLoading = false
        if (response.status === 200) {
          this.tableData = response.data.list
          this.pageTotal = response.data.total
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    searchPage() {
      getOperarion(this.searchMap).then(response => {
        this.tableData = response.data.list
        this.pageTotal = response.data.total
      })
    },
    handleAdd() {
      this.editor = false
      this.formAdd = {}
      this.dialogFormVisible = true
      this.getAllRole()
    },
    submit(formName) {
      // 新增角色
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formAdd.roleIds = this.checkedRoles
          saveOperarion(this.formAdd).then(res => {
            // 关闭弹窗
            this.dialogFormVisible = false
            this.formAdd = {}
            if (res.status === 200) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.checkedRoles = []
              this.searchPage()
            } else {
              this.checkedRoles = []
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    setCheckedRoles(roleList) {
      const checkRoles = []
      for (let i = 0; i < roleList.length; i++) {
        checkRoles.push(roleList[i].roleId)
      }
      this.checkedRoles = checkRoles
      this.checkedRolesForEdit = checkRoles
      this.handleCheckedCitiesChange(checkRoles)
    },
    handleEdit(id) {
      this.editor = true
      this.getAllRole()
      // 数据回显
      getOperarionById(id).then(res => {
        if (res.status === 200) {
          this.formEdit.operationId = res.data.operationId
          this.formEdit.operationName = res.data.operationName
          this.dialogAddVisible = true
          this.setCheckedRoles(res.data.roleList)
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    editOperarion() {
      // 修改角色
      this.formEdit.addRoles = this.addRoles
      this.formEdit.deleteRoles = this.deleteRoles
      updateOperarion(this.formEdit).then(res => {
        this.dialogAddVisible = true
        this.formEdit = {}
        if (res.status === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogAddVisible = false
          this.searchPage()
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })

      this.editCancel()
    },
    handleDelete(id) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOperation(id).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.searchPage()
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
