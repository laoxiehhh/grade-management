import { login, register, getUserInfo, modUserInfo, modUserPassword } from '@/services/user';
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
    userInfo: {}, // 当前用户信息
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
    *getUserInfo(_, { call, put }) {
      const response = yield call(getUserInfo);
      if (!response) return;
      yield put({
        type: 'global/getClasses',
        payload: { ProfessionId: response.ProfessionId },
      });
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
    },
    *modUserInfo({ payload }, { call, put, select }) {
      const response = yield call(modUserInfo, payload);
      if (!response) return;
      const currentUser = yield select(state => state.user.currentUser);
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...currentUser,
          Name: response.Name,
          Username: response.Username,
        },
      });
      yield call(setToken, response.newToken);
      message.success('修改成功!');
    },
    *modUserPassword({ payload }, { call, put }) {
      const response = yield call(modUserPassword, payload);
      if (!response) return;
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
      message.success('修改成功！');
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
    saveUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
      };
    },
  },
};
