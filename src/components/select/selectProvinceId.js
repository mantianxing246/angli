import { provinces } from '@/CourseType/OverallExplanation.js'
export default {
  data() {
    return {
      form: {
        provinceId: '' // 省市id
      },
      provinces: [],
      rules: {
        provinceId: [
          {
            required: true,
            message: '请选择省市',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.provinces = provinces
  }
}
