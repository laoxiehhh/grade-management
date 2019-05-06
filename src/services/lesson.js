import { myRequest } from '@/utils/request';

export async function createLesson(payload) {
  return myRequest.post('/api/lesson', { data: { ...payload } });
}

export async function getSelfLessons(payload) {
  const { teacherId } = payload;
  return myRequest(`/api/lesson/${teacherId}`);
}

export async function setAssessment(payload) {
  return myRequest.post('/api/assessment', { data: { ...payload } });
}
