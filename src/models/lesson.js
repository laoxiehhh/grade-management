import { createLesson, getSelfLessons } from '@/services/lesson';
import { message } from 'antd';

export default {
  namespace: 'lesson',

  state: {
    lessonList: [],
    selfLessonList: [],
  },

  effects: {
    *createLesson({ payload }, { call, put }) {
      const response = yield call(createLesson, payload);
      if (!response) return;
      yield put({
        type: 'addLesson',
        payload: response,
      });
      message.success('创建成功!');
    },
    *getSelfLessons({ payload }, { call, put }) {
      const response = yield call(getSelfLessons, payload);
      if (!response) return;
      yield put({
        type: 'saveSelfLessons',
        payload: response,
      });
    },
  },

  reducers: {
    addLesson(state, { payload }) {
      return {
        ...state,
        lessonList: [...state.lessonList, payload],
      };
    },
    saveSelfLessons(state, { payload }) {
      return {
        ...state,
        selfLessonList: payload,
      };
    },
  },
};
