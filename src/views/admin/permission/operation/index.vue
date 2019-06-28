<template>
  <div class="app-container">
    <el-form
      :label-position="labelPosition"
      :inline="true"
      :model="formSearch"
      class="demo-form-inline"
    >
      <el-form-item label="操作名">
        <el-input v-model.trim="searchMap.operationName" placeholder="请输入操作名" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="listLoading" type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <Card-Container>
      <template>
        <div slot="body">
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%"
            highlight-current-row
            fit
            v-loading="listLoading"
          >
            <el-table-column prop="operationId" label="操作Id" sortable align="center"/>
            <el-table-column prop="operationName" label="操作名" sortable align="center"/>
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row.operationId)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.operationId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="pageTotal>0"
            :page-sizes="[5, 10, 20]"
            :limit.sync="pageSize"
            :page.sync="currentPage"
            :total="pageTotal"
            @pagination="fetchData"
          />
        </div>
      </template>
    </Card-Container>
    <!-- 编辑弹框---start -->
    <dialog-container title="编辑操作" :visible.sync="dialogAddVisible">
      <template slot="body">
        <el-form :label-position="labelPosition" :model="formEdit" class="demo-form-inline">
          <el-form-item label="操作名">
            <el-input v-model="formEdit.operationName" style="width:163px" placeholder="操作名"/>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="checkedRoles" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="city in roles"
                :label="city.roleId"
                :key="city.roleId"
                class="el-checkbox1"
              >{{ city.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCancel">取 消</el-button>
          <el-button type="primary" @click="editOperarion">确 定</el-button>
        </div>
      </template>
    </dialog-container>
    <dialog-container title="新增操作" :visible.sync="dialogFormVisible" width="700px">
      <template slot="body">
        <el-form
          ref="formAdd"
          :label-position="labelPosition"
          :rules="formAddRules"
          :model="formAdd"
          class="demo-form-inline"
        >
          <el-form-item label="操作名" prop="operationName">
            <el-input v-model="formAdd.operationName" style="width:163px" placeholder="操作名"/>
          </el-form-item>
          <el-form-item label="全选">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="checkedRoles" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="city in roles"
                :label="city.roleId"
                :key="city.roleId"
                class="el-checkbox1"
              >{{ city.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancel">取 消</el-button>
          <el-button type="primary" @click="submit('formAdd')">确 定</el-button>
        </div>
      </template>
    </dialog-container>
  </div>
</template>
<script src="./operation.js">
</script>
<style scoped>
.el-checkbox1 {
  margin-left: 30px;
}
</style>

