import { login } from '@/services/user';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { setToken, removeToken, removeAuthorizationToken } from '@/utils/setAuthorizationToken';
import { getPageQuery } from '@/utils/utils';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (!response) return;
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      yield call(setToken, response.token);
      yield put(routerRedux.replace('/'));
    },
    *logout(_, { call, put }) {
      yield put({
        type: 'saveCurrentUser',
        payload: {},
      });
      yield call(removeToken);
      yield call(removeAuthorizationToken);
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user.login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
