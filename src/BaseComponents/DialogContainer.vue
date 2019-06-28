<template>
  <el-dialog
    :close-on-click-modal="false"
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :title="title"
    :width="width"
    :class="diglogClass"
    center
    ref="dialog"
  >
    <slot name="body"></slot>
    <slot name="footer" slot="footer"></slot>
  </el-dialog>
</template>
<script>
import { create } from 'domain';
export default {
  name: "DialogContainer",
  data () {
    return {
      dialogClass: ''
    }
  },
  props: {
    title: {
      default: '',
      type: String
    },
    width: {
      default: '',
      type: String
    },
    visible: {
      default: true,
      type: Boolean
    },
    diglogClass: {
      default () {
        return []
      },
      type: Array
    }
  },
  create () {
    this.dialogClass = this.$refs['dialog'];
    this.dialogVisible = this.visible;
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
}
</script>
<style scoped>
h2 {
  margin-top: 0;
}
</style>
