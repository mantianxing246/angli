<template>
  <div>
    <el-select v-model="model" :placeholder="placeholder" style="width:180px">
      <el-option v-for="item in selectInfo" :value="item.id" :label="item.typeName" :key="item.id"/>
    </el-select>
  </div>
</template>
<script>
import { getUserList } from "@/api/common/common.js";
export default {
  name: "getUserList",
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    selectInfo: []
  },
  computed: {},
  methods: {}
};
</script>

<style scoped>
</style>
