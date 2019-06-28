import { getHeadInfo } from '@/api/components/HeadInfoApi' // getHeadInfo
export default {
  data() {
    return {
      headInfo: { }
    }
  },
  created() {
    this.getHeadInfo()
  },
  methods: {
    getHeadInfo() {
      getHeadInfo().then(res => {
        if (res.status === 200) {
          this.headInfo = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
        }
      })
    }
  }

}
