import { login } from '@/services/user';
import { routerRedux } from 'dva/router';
import { setToken } from '@/utils/setAuthorizationToken';

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
