import * as URL from '@/api/AccountingMgt/AccrualSearch/AccrualSearch' // 表格数据
import { AccrualSearchLinkDialogUrl } from '../const.js'
export default {
  data() {
    return {
      pageSizes: [10, 20, 30],
      total: 0,
      pagination: {
        pageSize: 20,
        pageNum: 1
      },
      tableData: [],
      auditDialog: false,
      visible: false,
      query: null,
      index: null
    }
  },
  methods: {
    init(query, index) {
      this.visible = true
      this.query = query
      this.index = index
      this.getTableData()
    },
    getTableData() {
      URL[AccrualSearchLinkDialogUrl[this.index]]({ ...this.query, ...this.pagination }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    }
  },
  created() { }

}
