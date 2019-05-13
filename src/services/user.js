import { myRequest } from '@/utils/request';

export async function login(payload) {
  return myRequest.post('/api/user/login', { data: { ...payload } });
}

export async function register(payload) {
  return myRequest.post('/api/user/create', { data: { ...payload } });
}

export async function getUserInfo() {
  return myRequest('/api/user/getUserInfo');
}

export async function modUserInfo(payload) {
  return myRequest.post('/api/user/modUserInfo', { data: { ...payload } });
}

export async function modUserPassword(payload) {
  return myRequest.post('/api/user/modUserPassword', { data: { ...payload } });
}
