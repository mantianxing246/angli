export default {
  //   import changeIsContinuousLink from "@/components/select/changeIsContinuousLink";
  // export default {
  //   name: "",
  //   mixins: [changeIsContinuousLink],
  methods: {
    // 选择是否续保 省市 跟收入类别List的联动
    /**
     *
     * @param {*} list 需要过滤的原数组
     * @param {*} isContinuous  是否续报
     * @param {*} provinceId   省市
     */
    changeIsContinuousLink(list, isContinuous, provinceId) {
      if (!list) {
        return
      }
      if (isContinuous === 1 && provinceId === 2) {
        // 1、是否续报选“是”：省市选“上海”：收入类别显示：E、续费；
        return list.filter(item => {
          if (item.sourceType === 'E') {
            return true
          } else {
            return false
          }
        })
      } else if (isContinuous === 1 && provinceId === 1) {
        // 2、是否续报选“是”：省市选“全国”：收入类别显示：空；
        return list.filter(item => {
          return false
        })
      } else if (isContinuous === 0 && provinceId === 2) {
        // 3、是否续报选“否”：省市选“上海”：收入类别显示：除“E、续费”以外；
        return list.filter(item => {
          if (item.sourceType === 'E') {
            return false
          } else {
            return true
          }
        })
      } else if (isContinuous === 0 && provinceId === 1) {
        // 4、是否续报选“否”：省市选“全国”：收入类别显示：全国下的收入类别（目前为Q和G）；
        return list.filter(item => {
          if (item.sourceType === 'Q' || item.sourceType === 'G') {
            return true
          } else {
            return false
          }
        })
      } else {
        return list.filter(item => {
          return true
        })
      }
    }
  }
}
