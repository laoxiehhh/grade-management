import { myRequest } from '@/utils/request';

export async function getLessonStudentScore(payload) {
  const { lessonId } = payload;
  return myRequest(`/api/lesson/score/${lessonId}`);
}

export async function getTaskScore(payload) {
  return myRequest.post('/api/task/getTaskScore', { data: { ...payload } });
}

export async function getSelfLessonScore() {
  return myRequest('/api/lesson/self/score');
}
