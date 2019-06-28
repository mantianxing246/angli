
<template>
  <countTo ref="countToRef" :startVal="startVal" :endVal="endVal" :duration="duration" :prefix="prefix" :style="selfStyle" :suffix="suffix"></countTo>
</template>
<script>
import countTo from "vue-count-to";
export default {
  components: { countTo },
  data() {
    return {
    };
  },
  props: {
    startVal: {
      required: true,
      type: Number
    },
    endVal: {
      required: true,
      type: Number
    },
    duration: {
      required: true,
      type: Number
    },
    prefix:{
       required: false,
      type: String
    },
    selfStyle:{
      required: false,
      type: Object
    },
    suffix:{
      required: false,
      type: String
    }
  },
  mounted(){
    this.$emit('countToRef', { countToRef: this.$refs.countToRef })
  }
};
</script>