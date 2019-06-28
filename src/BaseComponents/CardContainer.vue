<template>
<div>
  <section
    v-if="!orderNo"
    style="background-color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 0px 5px rgba(10, 16, 20, 0.24), 0 0 5px rgba(10, 16, 20, 0.12);
    border-radius: 5px;"
    :style="{padding:paddingValue+'px'}"
  >
    <el-form v-if="title">
      <el-form-item :label="title" style="margin-bottom:0;"></el-form-item>
    </el-form>
    <body>
      <slot name="body"></slot>
    </body>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </section>
  <el-tabs
    v-if="orderNo"
    type="border-card"
    style="background-color: #fff;
    margin-bottom: 10px;
    box-shadow: 0 0px 5px rgba(10, 16, 20, 0.24), 0 0 5px rgba(10, 16, 20, 0.12);
    border-radius: 5px;"
  >
    <el-tab-pane :label="'订单号'+ orderNo">
      <el-form v-if="title">
        <el-form-item :label="title" style="margin-bottom:0;"></el-form-item>
      </el-form>
      <body>
        <slot name="body"></slot>
      </body>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
export default {
  name: "CardContainer",
  props: {
    paddingValue: {
      default: 0,
      type: Number
    },
    title: {
      default: "",
      type: String
    },
    orderNo: {
      default: "",
      type: String
    }
  }
};
</script>
<style scoped>
h2 {
  margin-top: 0;
}
>>> .el-tabs--border-card > .el-tabs__content {
  padding-top: 0px;
}
</style>
