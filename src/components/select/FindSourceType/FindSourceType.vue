F<template>
  <div>
    <el-select v-model="sourceType" placeholder="收入类别" style="width:180px">
      <el-option
        v-for="item in sourceTypes"
        :value="item.id"
        :label="item.typeName"
        :key="item.id"
      />
    </el-select>
  </div>
</template>
<script>
import { findSourceType } from "@/api/common/common.js";
export default {
  name: "FindSourceType",
  data() {
    return {
      sourceTypes: [],
      sourceType: ""
    };
  },
  props: {},
  computed: {},
  methods: {
    getInfoList() {
      findSourceType(1).then(res => {});
    }
  },
  created() {
    this.getInfoList();
  }
};
</script>

<style scoped>
</style>
