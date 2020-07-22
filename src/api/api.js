import request from '@/utils/request'
export const FourApi= {
  // 接口1
  login(data) {
    return request('/api/user/login', data)
  },
  // 接口2
  logout(data) {
    return request('user/logout', data)
  }
}