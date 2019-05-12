import { getLessonStudentScore, getTaskScore } from '@/services/score';

export default {
  namespace: 'score',

  state: {
    currentLessonStudent: [], // 当前选中的课程的学生
    currentLessonTask: [], // 当前选中的学生和课程的所有任务的成绩
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
    *getTaskScore({ payload }, { call, put }) {
      const response = yield call(getTaskScore, payload);
      if (!response) return;
      yield put({
        type: 'saveCurrentLessonTask',
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
    saveCurrentLessonTask(state, { payload }) {
      return {
        ...state,
        currentLessonTask: payload,
      };
    },
  },
};
