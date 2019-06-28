<template>
  <div class="detail">
    <el-input
      v-if="1"
      class="margin"
      v-model="amountInner"
      maxlength="10"
      @input="$emit('changeAmount')"
      :placeholder="placeholder"
      clearable
      :disabled="disabledFlag"
    >
      <template slot="prepend">
        <span>{{money}}{{minus}}</span>
      </template>
    </el-input>
    <span v-if="2"></span>
  </div>
</template>
<script>
export default {
  name: "AmountInput",
  props: {
    amount: {
      default: ""
    },
    money: {
      default: ""
    },
    minus: {
      default: ""
    },
    disabledFlag:{
      default: false
    },
    placeholder:{
      default: '请输入'
    }
  },
  computed: {
    amountInner: {
      get() {
        return this.amount;
      },
      set(val) {
        this.$emit("update:amount", val);
      }
    }
  }
};
</script>
<style scoped>
.margin /deep/ .el-input__inner{
        padding: 0 7px;
}
</style>
