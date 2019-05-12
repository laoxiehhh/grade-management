import { getLessonStudentScore } from '@/services/score';

export default {
  namespace: 'score',

  state: {
    currentLessonStudent: [], // 当前选中的课程的学生
  },

  effects: {
    *getLessonStudentScore({ payload }, { call, put }) {
      const response = yield call(getLessonStudentScore, payload);
      if (!response) return;
      yield put({
        type: 'saveCurrentLessonStudent',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentLessonStudent(state, { payload }) {
      return {
        ...state,
        currentLessonStudent: payload,
      };
    },
  },
};
