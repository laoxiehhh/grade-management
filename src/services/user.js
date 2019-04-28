import { myRequest } from '@/utils/request';

export async function login(payload) {
  return myRequest.post('/api/user/login', { data: { ...payload } });
}

export async function logout(payload) {
  return myRequest.post('/api/user/login', { data: { ...payload } });
}
