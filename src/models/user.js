import { login, register } from '@/services/user';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { setToken, removeToken, removeAuthorizationToken } from '@/utils/setAuthorizationToken';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { Type } = payload;
      const response = yield call(login, payload);
      if (!response) return;
      let currentAuthority = '';
      if (Type === 1) {
        currentAuthority = 'student';
      } else if (Type === 2) {
        currentAuthority = 'teacher';
      } else if (Type === 3) {
        currentAuthority = 'admin';
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority,
        },
      });
      reloadAuthorized();
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
      reloadAuthorized();
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
    *register({ payload }, { call }) {
      const response = yield call(register, payload);
      if (!response) return;
      message.success('注册成功!');
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
      };
    },
  },
};
