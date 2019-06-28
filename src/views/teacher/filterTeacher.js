
export default {
  methods: {
    getAllRoleFilter(list) {
      if (!list) {
        return
      }
      return list.filter(item => {
        return true
      })
    }
  }
}
