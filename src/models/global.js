import { createProfession, getProfessions, createClass, getClasses } from '@/services/global';
import { message } from 'antd';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    professionList: [],
    classList: [],
  },

  effects: {
    *createProfession({ payload }, { call, put }) {
      const response = yield call(createProfession, payload);
      if (!response) return;
      yield put({
        type: 'addProfession',
        payload: response,
      });
      message.success('创建成功');
    },
    *getProfessions(_, { call, put }) {
      const response = yield call(getProfessions);
      if (!response) return;
      yield put({
        type: 'saveProfessions',
        payload: response,
      });
    },
    *createClass({ payload }, { call, put }) {
      const response = yield call(createClass, payload);
      if (!response) return;
      yield put({
        type: 'addClass',
        payload: response,
      });
      message.success('创建成功');
    },
    *getClasses(_, { call, put }) {
      const response = yield call(getClasses);
      if (!response) return;
      yield put({
        type: 'saveClasses',
        payload: response,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    addProfession(state, { payload }) {
      return {
        ...state,
        professionList: [...state.professionList, payload],
      };
    },
    saveProfessions(state, { payload }) {
      return {
        ...state,
        professionList: payload,
      };
    },
    addClass(state, { payload }) {
      return {
        ...state,
        classList: [...state.classList, payload],
      };
    },
    saveClasses(state, { payload }) {
      return {
        ...state,
        classList: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
