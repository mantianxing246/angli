<template>
  <el-dialog :close-on-click-modal="false"  :visible.sync="returnDialog" title="订单退回" width="35%" class="rec-live-course" center v-el-drag-dialog>
    <el-input v-model="reason"/>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmAdd('form')">确 定</el-button>
      <el-button @click="returnDialog = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getQueryList, addSingleCourse } from '@/api/record/RecCourseMgtApi'
export default{
  props: {
    returnDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      reason: ''  //退回原因
    }
  },
  computed: {
    // 弹窗显示与否
    returnDialog: {
      get: function() {
        return this.returnDialogVisible
      },
      set: function(val) {
        this.$emit('update:returnDialogVisible', val)
      }
    }
  },
  mounted() {
    //console.log(this.returnDialogVisible)
  },
  methods: {
    // 确认新增课程
    confirmAdd(form) {
      console.log(this.form)
       addSingleCourse(newForm).then(res => {
        // console.log(res)
        if (res.status == 200) {
          this.$message({
            message: '新增成功！',
            type: 'success'
          })
          this.returnDialog = false
          this.$emit('reloadList')
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      }).catch(error => {
        // console.log(error)
      })
    }
  }

}
</script>
<style lang="scss">
</style>
