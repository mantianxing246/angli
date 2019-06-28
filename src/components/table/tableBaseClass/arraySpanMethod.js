export default {
  data() {
    return {
      tableData: [],
      spanArr: []
    }
  },
  methods: {
    tableInit(res) {
      const arr = []
      // 重新组装返回数据，为了自定义合并表格
      for (let i = 0; i < res.data.list.length; i++) {
        this.customtable(res.data.list[i], i, arr)
      }
      this.tableData = arr
      let contactDot = 0
      const spanArr = []
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        const index = i
        item.index = index
        if (index === 0) {
          spanArr.push(1)
        } else {
          if (item.orderNo === this.tableData[index - 1].orderNo) {
            spanArr[contactDot] += 1
            // alert(this.spanArr[contactDot]);
            spanArr.push(0)
          } else {
            spanArr.push(1)
            contactDot = index
          }
        }
      }
      this.spanArr = spanArr
    },
    // 自定义合并表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const arr = [0, 1, 2, 3, 4]
      if (arr.includes(columnIndex)) {
        const _rowspan = this.spanArr[rowIndex]
        const _colspan = _rowspan > 0 ? 1 : 0
        return {
          rowspan: _rowspan,
          colspan: _colspan
        }
      }
    },
    // 组装自定义表格数据
    customtable(item, index, arr) {
      for (const key in item) {
        if (item[key] instanceof Array) {
          for (const key1 in item[key]) {
            const obj1 = {}
            for (const key2 in item[key][key1]) {
              obj1[key2] = item[key][key1][key2]
            }
            if (key1 === '0') {
              obj1['rowspan'] = item[key].length - 1
            } else {
              obj1['rowspan'] = 1
            }
            const obj = {}
            for (const key in item) {
              // eslint-disable-next-line no-empty
              if (item[key] instanceof Array) {
              } else {
                obj[key] = item[key]
              }
            }
            arr.push(Object.assign(obj, obj1))
          }
        // eslint-disable-next-line no-empty
        } else {
        }
      }
    }
  }
}
