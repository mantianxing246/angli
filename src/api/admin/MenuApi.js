/**
 * @author wufan
 * @date 2018/12/28
 * 提供组织,用户,角色等相关接口
 */
import request from '@/utils/request'

export default {
  getList() {
    return request({
      url: 'role/role',
      method: 'GET'
    })
  },
  getPageList(currentPage, pageSize) {
    return request({
      url: 'menu/findMenus?pn=' + currentPage + '&ps=' + pageSize,
      method: 'GET'
    })
  },
  save(formAdd) {
    return request({
      url: 'menu/menus',
      method: 'POST',
      data: formAdd
    })
  },
  findById(id) {
    return request({
      url: `menu/findMenuById/${id}`,
      method: 'GET',
      heads: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  },
  update(formEdit) {
    return request({
      url: 'menu/updateMenu',
      method: 'put',
      data: formEdit
    })
    // return request.put('http://47.100.175.219:8080/menus', formEdit)
  },
  delete(id) {
    return request({
      url: 'menu/deleteMenu/',
      method: 'delete',
      data: { 'menuId': id }
    })
  }

}
