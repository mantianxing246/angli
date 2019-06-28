
export class text {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }
  init(alertMsg, varchar = null, required = true) {
    this.alertMsg = alertMsg
    this.varchar = varchar
    this.required = required
    this.validator = {
      required: this.required,
      validator: (rule, value = '', callback) => {
        if (value.trim() === '' && this.required) {
          callback(new Error(this.alertMsg))
        } if (this.varchar && value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > this.varchar) {
          callback(new Error(this.alertMsg))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
    return this.validator
  }
}
