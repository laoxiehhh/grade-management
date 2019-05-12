import {
  getLessonStudentScore,
  getTaskScore,
  getSelfLessonScore,
  getTeacherAllLessonScore,
} from '@/services/score';

export default {
  namespace: 'score',

  state: {
    currentLessonStudent: [], // 当前选中的课程的学生
    currentLessonTask: [], // 当前选中的学生和课程的所有任务的成绩
    studentAnalysisData: [],
    currentTeacherLessonScore: [], // 当前老师的所有课程的所有学生的成绩
    currentTeacherLessonScoreById: {}, // 当前老师有被学生选课的课程
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
    *getSelfLessonScore(_, { call, put }) {
      const response = yield call(getSelfLessonScore);
      if (!response) return;
      yield put({
        type: 'saveCurrentLessonStudent',
        payload: response,
      });
    },
    *getStudentAnalysisData(_, { put, select, take }) {
      yield put({
        type: 'lesson/getSelfLessons',
      });
      yield put({
        type: 'getSelfLessonScore',
      });
      yield take('lesson/getSelfLessons/@@end');
      yield take('getSelfLessonScore/@@end');
      const selfLessonById = yield select(state => state.lesson.selfLessonById);
      const currentLessonStudent = yield select(state => state.score.currentLessonStudent);

      const studentAnalysisData = currentLessonStudent.map(item => {
        return {
          x: selfLessonById[item.LessonId].Name,
          y: item.Score || 0,
        };
      });
      yield put({
        type: 'saveStudentAnalysisData',
        payload: studentAnalysisData,
      });
    },
    *getTeacherAllLessonScore(_, { call, put, take, select }) {
      const response = yield call(getTeacherAllLessonScore);
      if (!response) return;
      yield put({
        type: 'lesson/getSelfLessons',
      });
      yield take('lesson/getSelfLessons/@@end');
      const selfLessonById = yield select(state => state.lesson.selfLessonById);
      const currentTeacherLessonScore = response
        .filter(item => item.length > 0)
        .map(item => {
          const average =
            item.reduce((pre, cur) => {
              const score = cur.StudentLessons.Score || 0;
              return pre + score;
            }, 0) / item.length;
          return {
            x: selfLessonById[item[0].StudentLessons.LessonId].Name,
            y: average,
          };
        });
      const currentTeacherLessonScoreById = response
        .filter(item => item.length > 0)
        .reduce((pre, cur) => {
          const classIds = Array.from(new Set(cur.map(item => item.Class.Name)));
          const data = classIds.map(item => {
            const c = cur.filter(i => i.Class.Name === item);
            const average =
              c.reduce((p, current) => {
                const score = current.StudentLessons.Score || 0;
                return p + score;
              }, 0) / c.length;
            return {
              x: item,
              y: average,
            };
          });
          return {
            ...pre,
            [cur[0].StudentLessons.LessonId]: data,
          };
        }, {});
      yield put({
        type: 'saveCurrentTeacherLessonScore',
        payload: {
          currentTeacherLessonScore,
          currentTeacherLessonScoreById,
        },
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
    saveStudentAnalysisData(state, { payload }) {
      return {
        ...state,
        studentAnalysisData: payload,
      };
    },
    saveCurrentTeacherLessonScore(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
