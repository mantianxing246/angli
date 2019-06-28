/**
 * @author Lx
 */
import request from '../../utils/request'

export default {
  getList() {
    return request({
      url: 'user/findAllUser',
      method: 'GET'
    })
  },
  // 修改密码
  repassWord(form) {
    return request({
      url: 'user/repassword',
      method: 'PUT',
      data: form
    })
  },
  getPageList(params) {
    return request({
      url: 'user/findAllUser',
      method: 'GET',
      params
    })
  },
  getDeptList() {
    return request({
      url: 'user/findDept',
      method: 'GET'
    })
  },
  getDept2List(id) {
    return request({
      url: `user/findDeptById/${id}`,
      method: 'GET'
    })
  },
  updateUser(formEdit) {
    return request({
      url: 'user/updateUser',
      method: 'post',
      data: formEdit
    })
  },
  save(formAdd) {
    return request({
      url: 'user/insertUser',
      method: 'POST',
      data: formAdd
    })
  },
  findById(formSearch) {
    return request({
      url: `user/queryUser?pn=' + pageNum + '&ps=' + pageSize,`,
      method: 'GET',
      data: formSearch,
      heads: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  },
  update(id) {
    // console.log(id)
    return request({
      url: `user/findUserById/${id}`,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: `user/deleteUser/${id}`,
      method: 'DELETE'
    })
  },
  dept2(id) {
    return request({
      url: `user/findDeptById/${id}`,
      method: 'GET'
    })
  },
  getAllRole() {
    return request({
      url: 'role/getAllRole',
      method: 'get'
    })
  }
}
