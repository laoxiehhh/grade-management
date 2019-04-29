import request from '@/utils/request';

const setAuthorizationToken = token => {
  if (token) {
    request.interceptors.request.use((url, options) => ({
      url,
      options: { ...options, headers: { Authorization: `bear ${token}` } },
    }));
  }
};

const removeAuthorizationToken = () => {
  request.interceptors.request.use((url, options) => ({
    url,
    options: { ...options, headers: {} },
  }));
};

const getToken = () => localStorage.getItem('jwtToken');

const removeToken = () => localStorage.removeItem('jwtToken');

const setToken = token => localStorage.setItem('jwtToken', token);

export { setAuthorizationToken, getToken, removeToken, setToken, removeAuthorizationToken };
