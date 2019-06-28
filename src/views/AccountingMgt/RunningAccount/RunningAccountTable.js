import { tableConfig } from '@/GlobalStaticField/tableConfig.js' // tableConfig表格宽度配置
export const tableExcel = [
  { label: '学员姓名', align: 'center', prop: 'studentName', width: 60 },
  { label: '学员ID', align: 'center', prop: 'studentUserId', width: 80 },
  { label: '报名表号', align: 'center', prop: 'registerFormNum', width: '100' },
  { label: '订单号', align: 'center', prop: 'orderNo', width: '100' },
  {
    label: '关联订单号',
    align: 'center',
    prop: 'relationOrderNo',
    width: '100'
  },
  { label: '付款日期', align: 'center', prop: 'paymentDate', width: '80' },
  { label: '订单类型', align: 'center', prop: 'typeName', width: '' },
  { label: '金额', align: 'center', prop: 'price', width: '60' },
  { label: '报名费', align: 'center', prop: 'isEntryFee', width: '60' },
  { label: '操作类型', align: 'center', prop: 'operationTypeName', width: '' },
  { label: '销售人员', align: 'center', prop: 'salesUserName', width: '60' },
  { label: '销售业绩', align: 'center', prop: 'salesPerformance', width: '60' },
  { label: '分成人员', align: 'center', prop: 'divideUserName', width: '60' },
  {
    label: '销售业绩',
    align: 'center',
    prop: 'dividePerformance',
    width: '60'
  },
  {
    label: '操作记录',
    align: 'center',
    prop: '操作记录',
    width: ''
  }
]
