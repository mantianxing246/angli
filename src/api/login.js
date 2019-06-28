import request from '@/utils/request'

export function login(userName, passWord) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      loginId: userName,
      passWord: passWord
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
