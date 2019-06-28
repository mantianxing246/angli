import * as validatorAll from './vaildators/index'
/**
 * 表单验证
 * 返回validator
 * 使用方法
 * import { validatorFactory } from "@/utils/async-validator";
 * <el-form ref="form" :model="form" :rules="rules" ...../>
 * rules: {
 *      "key" : [{validatorFactory(alertmsg,type,varchar) }
 *       ...
 * @param {*} alertMsg  提示信息
 * @param {*} type validator类型
 * @param {*} varchar 字符限制
 * @param {*} required 是否必填
 */
export function validatorFactory(alertMsg, type, varchar, required) {
  if (type) {
    return new validatorAll[type]().init(alertMsg, varchar, required)
  }
  return {
    validator: function(rule, value, callback) {
      if (/^[1-9]*[1-9][0-9]*$/.test(Number(value)) === false) {
        // 正则匹配正整数
        callback(new Error(alertMsg))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
}
// 验证审核信息
export function checkAuditRemark(auditRemark, that) {
  if (auditRemark.length === 0 || !auditRemark.replace(/\s+/g, '')) {
    that.$alert('请填写订单退回的审核信息！', {
      confirmButtonText: '确定'
    })
    return false
  }
  if (auditRemark.length >= 100) {
    that.$message({
      message: '审核信息的字超过100个汉字',
      type: 'warning'
    })
    return false
  }
  return true
}
