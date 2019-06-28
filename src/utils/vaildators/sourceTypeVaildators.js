
/**
 * import { sourceTypeVaildators } from "@/utils/vaildators/sourceTypeVaildators";
 */
export class sourceTypeVaildators {
  constructor() {
    this.validator = {
      required: this.required,
      message: '请选择收入类别',
      trigger: 'blur'
    }
  }
  init(form) {
    if (form.length !== 0) {
      this.validator.required = true
    } else {
      this.validator.required = false
    }
    return this.validator
  }
}
