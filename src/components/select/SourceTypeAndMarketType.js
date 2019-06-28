/* eslint-disable no-empty */
import {
  findSourceType,
  findMarketType
} from '@/api/common/common.js'
import { isInclude } from '@/utils/ArrayUtils.js'
import { getHeadInfo } from '@/api/components/HeadInfoApi' // headInfo
import {
  getUserList
} from '@/api/common/common.js'
import changeIsContinuousLink from '@/components/select/changeIsContinuousLink'
export default {
  methods: {
    // 校验Form的Value是否合法
    checkFromValue(CheckOfList, setOfFormKey, CheckOfKey, CheckOfvalue) {
      if (isInclude(CheckOfList, CheckOfKey, CheckOfvalue)) {

      } else {
        this.$set(this.form, setOfFormKey, '')
      }
    },
    // 获取收入类别List
    getFindSourceType() {
      return findSourceType(this.form.provinceId)
        .then(res => {
          res.data.orderSourceTypes = changeIsContinuousLink.methods.changeIsContinuousLink(res.data.orderSourceTypes, this.form.isContinuous, this.form.provinceId)
          this.$set(this.selectInfo, 'sourceTypes', res.data.orderSourceTypes) // 收入类别
          if (res.data.orderSourceTypes.length === 1) {
            this.$set(this.form, 'sourceType', res.data.orderSourceTypes[0].id)
          }
          // 报名场合
          this.$set(
            this.selectInfo,
            'registerTypes',
            res.data.orderRegisterTypes
          )
          this.checkFromValue(
            res.data.orderRegisterTypes,
            'registerType',
            'id',
            this.form.registerType
          )
          this.checkFromValue(
            res.data.orderSourceTypes,
            'sourceType',
            'id',
            this.form.sourceType
          )
          this.getFindMarketType()
        })
        .catch(() => {
          this.checkFromValue([], 'registerType', 'id', this.form.sourceType)
          this.checkFromValue([], 'sourceType', 'id', this.form.sourceType)
        })
    },
    // 获取省市
    getHeadInfo() {
      return getHeadInfo().then(res => {
        if (res.status === 200) {
          this.headInfo = res.data
          this.checkFromValue(
            this.headInfo.depts,
            'divideUserDeptId',
            'deptId',
            this.form.divideUserDeptId
          )
          this.checkFromValue(
            this.headInfo.roles,
            'divideUserRoleId',
            'roleId',
            this.form.divideUserRoleId
          )
          this.checkFromValue(
            this.headInfo.depts,
            'salesUserDeptId',
            'deptId',
            this.form.salesUserDeptId
          )
          this.checkFromValue(
            this.headInfo.roles,
            'salesUserRoleId',
            'roleId',
            this.form.salesUserRoleId
          )
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    // 获取市场手段List
    getFindMarketType() {
      return findMarketType(this.form.sourceType)
        .then(res => {
          this.$set(this.selectInfo, 'marketTypes', res.data) // 市场手段
          if (res.data.length === 1) {
            this.$set(this.form, 'marketType', res.data[0].id)
          }
          this.checkFromValue(
            res.data,
            'marketType',
            'id',
            this.form.marketType
          )
          this.checkSlect()
        })
        .catch(() => {
          this.checkFromValue([], 'marketType', 'id', this.form.marketType)
        })
    },
    // 获取人员列表
    getUserListSales(Dep, role, key) {
      getUserList(Dep, role).then(res => {
        this.$set(this.selectInfo, key, res.data) // 获取人员列表
        this.checkFromValue(
          res.data,
          'salesUser',
          'userId',
          this.form.salesUser
        )
      })
    },
    checkSlect() {
      this.$nextTick(() => {
        this.$refs['form'] && this.$refs['form'].validate(valid => {
          return false
        })
      }
      )
    },
    // 获取人员列表
    getUserListDiv(Dep, role, key) {
      getUserList(Dep, role).then(res => {
        this.$set(this.selectInfo, key, res.data) // 获取人员列表
        this.checkFromValue(
          res.data,
          'divideUser',
          'userId',
          this.form.divideUser
        )
      })
    }

  }
}
