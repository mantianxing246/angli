<!--
 * @author hongdengru
 * @date 2019/1/14
-->
<template>
  <div class="app-container">
    <div>
      <el-form class="demo-ruleForm" inline>
        <el-form-item>
          <el-input placeholder="产品名称" v-model="listQuery.productName" clearable :maxlength="50"/>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="产品属性" class="width120" v-model="listQuery.propertyId" clearable>
            <el-option
              v-for="item in headInfo.properties"
              :value="item.propertyId"
              :key="item.propertyId"
              :label="item.propertyName"
            >{{ item.propertyName }}</el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select placeholder="产品高考年份" clearable class="width120" v-model="listQuery.year">
            <el-option v-for="item in headInfo.years" :value="item" :key="item">{{ item }}</el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-select placeholder="版本" clearable class="width100" v-model="listQuery.version">
            <el-option v-for="item in headInfo.versions" :value="item" :key="item">{{ item }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="listQuery.isPublish" :true-label="1" :false-label="0">是否发布</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="findAllProduct"
            :loading="loading"
          >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="productAdd">新增产品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <card-container>
      <template slot="body">
        <el-table
          highlight-current-row
          style="width: 100%;"
          border
          fit
          stripe
          :data="list"
          v-loading="loading"
        >
          <el-table-column label="产品名称" align="center" prop="productName" min-width="310"/>
          <el-table-column label="产品属性" align="center" min-width="70">
            <template slot-scope="scope">
              <div v-html="scope.row.propertyName"></div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="产品高考年份" align="center" prop="year" width="100"/> -->
          <el-table-column label="产品版本" align="center" prop="version" min-width="80"/>
          <el-table-column label="产品年级" align="center" width="70">
            <template slot-scope="scope">
              <p v-html="scope.row.gradeName"></p>
            </template>
          </el-table-column>
          <el-table-column label="课程名称" align="center" min-width="310">
            <template slot-scope="scope">
              <div v-html="scope.row.courseName"/>
            </template>
          </el-table-column>
          <el-table-column label="产品价格" align="center" prop="totalprice" min-width="100"/>
          <el-table-column label="操作" align="center" prop="year" min-width="100">
            <template slot-scope="scope" style="display: flex;justify-content: space-between">
              <div class="czSort">
                <el-tooltip class="item" effect="light" content="编辑" placement="top">
                  <i class="el-icon-edit" size="large" @click="productEdit(scope.row)"/>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top">
                  <i class="el-icon-delete" size="large" @click="deleteProduct(scope.row)"/>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- </template>
        </card-container>-->

        <!-- 分页 -->
        <!-- <card-container>
        <template slot="body">-->
        <pagination
          v-show="total>0"
          :total="total"
          :limit.sync="listQuery.pageSize"
          :page.sync="listQuery.pageNum"
          @pagination="getClassList"
        />
      </template>
    </card-container>
    <!-- 新增产品 -->
    <product-add :productAddDialog.sync="productAddDialog" :findAllProduct="findAllProduct"/>
    <!-- 编辑 -->
    <product-edit
      :productEditDialog.sync="productEditDialog"
      :findAllProduct="findAllProduct"
      ref="productEdit"
    />
  </div>
</template>
<script>
import {
  findAllProduct,
  deleteProduct
} from '@/api/product/ProductMgtApi'

import ProductAdd from './ProductAdd'
import ProductEdit from './ProductEdit'
import { getHeadInfo } from '@/api/components/HeadInfoApi'
import courseType from '@/CourseType/CourseType.js'

export default {
  name: 'ProductMgt',
  components: { ProductAdd, ProductEdit },
  data () {
    return {
      productAddDialog: false,
      productEditDialog: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        isPublish: 1,
        propertyId: null,
        version: null,
        year: null,
        grade: null,
        productName: null
      },
      total: 0,
      properties: [],//产品属性
      headInfo: {},
      list: [],
      loading: false//是否能够再次查询
    }
  },
  created () {
    this.getHeadInfo()
    this.findAllProduct()
  },
  methods: {
    productAdd () {
      this.productAddDialog = true
    },
    productEdit (row) {
      this.productEditDialog = true
      this.$refs.productEdit.findProductById(row.productId)
    },
    findAllProduct () {
      // if (this.listQuery.year && this.listQuery.version) {
      //   this.$tipsMessage("年级和版本号不能全选", "warning")
      //   return
      // }
      this.loading = true
      this.list = []
      findAllProduct(this.listQuery).then((res) => {
        this.loading = false
        if (res.status == 200) {
          res.data.list.forEach((element, index) => {
            this.list.push(element)
            if (element.totalprice) {
              this.list[index].totalprice = element.totalprice.toLocaleString()
            }
          });

          this.total = res.data.total
        } else {
          this.$tipsMessage("查询失败", "warning")
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getClassList () {
      this.findAllProduct()
    },
    deleteProduct (row) {
      this.$confirm('确定要删除此产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.productId).then((res) => {
          if (res.status == 200) {
            this.$tipsMessage("删除成功", "success")
            this.findAllProduct()
          } else {
            this.$tipsMessage("删除失败", "warning")
          }
        })
      }).catch(() => { })
    },
    getHeadInfo () {
      getHeadInfo().then((res) => {
        if (res.status == 200) {
          this.headInfo = res.data
          this.headInfo.versions = courseType.versions
        }
      })
    }
  }
}
</script>
<style scoped>
.width120 {
  width: 120px;
}
.width100 {
  width: 100px;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
</style>
