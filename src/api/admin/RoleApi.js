/**
 * @author wufan
 * @date 2018/12/28
 * 提供组织,用户,角色等相关接口
 */
import request from '../../utils/request'

export default {
  getMenuList() {
    return request({
      url: 'menu/findMenuTreeList',
      method: 'GET'
    })
  },
  setRoleMenu(roleMenu) {
    return request({
      url: 'roleMenus/updateRoleMenu',
      method: 'put',
      data: roleMenu
    })
  },
  findMenuId(id) {
    return request({
      url: `roleMenus/getMenuIdById/${id}`,
      method: 'GET'
    })
  },
  getList() {
    return request({
      url: 'role/role',
      method: 'GET'
    })
  },
  getPageList(currentPage, pageSize) {
    return request({
      url: 'role/findAllRole?pn=' + currentPage + '&ps=' + pageSize,
      method: 'GET'
    })
  },
  save(formAdd) {
    return request({
      url: 'role/insertRole',
      method: 'post',
      data: formAdd
    })
  },
  findById(id) {
    return request({
      url: `role/findRoleById/${id}`,
      method: 'GET',
      heads: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  },
  update(formEdit) {
    // return request({
    //   url:"http://localhost:8080/role/role",
    //   method:'put',
    //   data:formEdit
    // })
    return request.put('role/updateRole', formEdit)
  },
  delete(id) {
    return request({
      url: `role/deleteRole/${id}`,
      method: 'delete'
    })
  }
}
export function getAllRole() {
  return request({
    url: 'role/getAllRole',
    method: 'GET'
  })
}
export function getAllRoleTeacherMgt(id) {
  return request({
    url: 'role/findRoleList/' + id,
    method: 'GET'
  })
}
// ---根据角色查询用户
export function findUserByRoleId(id) {
  return request({
    url: `teacher-mgt/findAssociatedAccount/${id}`,
    method: 'get',
    headers: { 'Content-type': 'application/json;charset=utf-8' }
  })
}
//根据角色id查询用户（上面接口调用错误，换这个接口20190307）
export function findRoleById(id) {
  return request({
    url: `userRoles/findRoleById?roleId=${id}`,
    method: 'get',
    headers: { 'Content-type': 'application/json;charset=utf-8' }
  })
}
