import { myRequest } from '@/utils/request';

export async function createLesson(payload) {
  return myRequest.post('/api/lesson', { data: { ...payload } });
}

export async function getSelfLessons() {
  return myRequest('/api/lesson/self');
}

export async function setAssessment(payload) {
  return myRequest.post('/api/assessment', { data: { ...payload } });
}

export async function getAllLessons() {
  return myRequest('/api/lesson');
}

export async function joinLesson(payload) {
  return myRequest.post('/api/accessToLesson', { data: { ...payload } });
}

export async function getAccessToLessons(payload) {
  const { studentId } = payload;
  return myRequest(`/api/accessToLesson/${studentId}`);
}

export async function getAccessToLessonsByLessonId(payload) {
  const { lessonId } = payload;
  return myRequest(`/api/accessToLesson/lesson/${lessonId}`);
}

export async function getAllClasses() {
  return myRequest('/api/class');
}

export async function accessToLesson(payload) {
  const { accessToLessonId, Status } = payload;
  return myRequest.post(`/api/accessToLesson/${accessToLessonId}`, { data: { Status } });
}

export async function getLessonTask(payload) {
  const { lessonId } = payload;
  return myRequest(`/api/lesson/${lessonId}/task`);
}

export async function getLessonAssessments(payload) {
  const { lessonId } = payload;
  return myRequest(`/api/lesson/${lessonId}/assessment`);
}

export async function createLessonTask(payload) {
  return myRequest.post('/api/task', { data: { ...payload } });
}

export async function getTaskDetail(payload) {
  const { taskId } = payload;
  return myRequest(`/api/task/${taskId}`);
}

export async function setTaskScore(payload) {
  const { taskId, ScoreData } = payload;
  return myRequest.post(`/api/task/${taskId}/score`, { data: { ScoreData } });
}
