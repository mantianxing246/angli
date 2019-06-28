/**
 * @author Lx
 */
import request from '@/utils/request'

export default {
  /*
  getList() {
    return request({
      url: 'user/user',
      method: 'GET'
    })
  },
  */
  getPageList(currentPage, pageSize) {
    return request({
      url: 'dept/getDeptList?pageNum=' + currentPage + '&pageSize=' + pageSize,
      method: 'GET'
    })
  },
  addDept(data) {
    return request({
      url: 'dept/addDept',
      method: 'POST',
      data: data
    })
  },
  updateDept(data) {
    return request({
      url: 'dept/updateDept',
      method: 'PUT',
      data: data
    })
  },
  deleteDept(id) {
    return request({
      url: 'dept/deleteDept/' + id,
      method: 'DELETE'
    })
  }
}
