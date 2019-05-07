import {
  createLesson,
  getSelfLessons,
  setAssessment,
  getAllLessons,
  joinLesson,
  getAccessToLessons,
} from '@/services/lesson';
import { message } from 'antd';

export default {
  namespace: 'lesson',

  state: {
    lessonList: [],
    selfLessonList: [],
    accessToLessonList: [],
  },

  effects: {
    *createLesson({ payload }, { call, put }) {
      const { TeacherId, Name, Desc, ProfessionId, ...rest } = payload;
      const response1 = yield call(createLesson, {
        TeacherId,
        Name,
        Desc,
        ProfessionId,
      });
      if (!response1) return;
      const { id } = response1;
      const AssessmentMap = Object.keys(rest).reduce((pre, cur) => {
        if (rest[cur] !== 0) {
          return { ...pre, [cur]: rest[cur] };
        }
        return pre;
      }, {});
      const response2 = yield call(setAssessment, {
        LessonId: id,
        AssessmentMap,
      });
      if (!response2) return;
      yield put({
        type: 'addLesson',
        payload: response1,
      });
      message.success('创建成功!');
    },
    *getSelfLessons(_, { call, put }) {
      const response = yield call(getSelfLessons);
      if (!response) return;
      yield put({
        type: 'saveSelfLessons',
        payload: response,
      });
    },
    *getAllLessons(_, { call, put }) {
      const response = yield call(getAllLessons);
      if (!response) return;
      yield put({
        type: 'saveLessonList',
        payload: response,
      });
    },
    *joinLesson({ payload }, { call, put }) {
      const response = yield call(joinLesson, payload);
      if (!response) return;
      yield put({
        type: 'addAccessToLesson',
        payload: response,
      });
    },
    *getAccessToLessons({ payload }, { call, put }) {
      const response = yield call(getAccessToLessons, payload);
      if (!response) return;
      yield put({
        type: 'saveAccessToLessons',
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
    saveLessonList(state, { payload }) {
      return {
        ...state,
        lessonList: payload,
      };
    },
    saveAccessToLessons(state, { payload }) {
      return {
        ...state,
        accessToLessonList: payload,
      };
    },
    addAccessToLesson(state, { payload }) {
      return {
        ...state,
        accessToLessonList: [...state.accessToLessonList, payload],
      };
    },
  },
};
