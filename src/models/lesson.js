import { createLesson, getSelfLessons, setAssessment } from '@/services/lesson';
import { message } from 'antd';

export default {
  namespace: 'lesson',

  state: {
    lessonList: [],
    selfLessonList: [],
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
