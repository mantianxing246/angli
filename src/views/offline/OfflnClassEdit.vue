<template>
  <div class="app-container offln-class-edit">
    <el-dialog :close-on-click-modal="false"  v-el-drag-dialog :visible.sync="classDialog" title="编辑班级信息" center width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="80px" >
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" maxlength="50" :style="{width:$selectConfig.classNameWidth+'px'}" clearable/>
        </el-form-item>
        <el-form-item label="招生人数" prop="maxNum" >
          <el-input v-model="form.maxNum" maxlength="4" :style="{width:$selectConfig.classNameWidth+'px'}" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="classDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/components/directive/waves' // Waves directive'
import { getSingleClass, updateClass } from '@/api/offline/OfflnClassMgtApi'
import { validatorFactory } from "@/utils/async-validator";
export default {
  name: 'OfflnClassEdit',
  directives: { waves },
  props: {
    updateClassDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        className: '', // 班级名称
        maxNum: null // 招生人数
      },
      rules: {
        className: [validatorFactory("请输入班级名称", "text", 50, true)],
        maxNum: [
          { required: true, message: '请输入招生人数', trigger: 'blur' },
          { validator: function(rule,value,callback){
            if(/^[1-9]*[1-9][0-9]*$/.test(Number(value)) == false){
              // 正则匹配正整数
              callback(new Error("请输入正确的数字"))
            }else{
              callback()
            }
          }, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    classDialog: {
      get: function() {
        return this.updateClassDialogVisible
      },
      set: function(val) {
        this.$emit('update:updateClassDialogVisible', val)
      }
    }
  },
  methods: {
    // 重置form表单
    resetForm() {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    // 获取单个班级信息
    getSingleClass(classId) {
      this.classId = classId
      getSingleClass(classId).then(res => {
        if (res.status == 200) {
          this.form.className = res.data.className
          this.form.maxNum = res.data.maxNum
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 确认编辑
    confirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.maxNum = Number(this.form.maxNum)
          this.form.classId = this.classId
          updateClass(this.form).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '修改成功!',
                type: 'success'
              })
              this.classDialog = false
              this.$emit('reloadList')
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .offln-class-edit{
    .el-form{
      width: 400px;
      margin: auto;
    }
  }
</style>
