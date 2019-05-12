import { myRequest } from '@/utils/request';

export async function getLessonStudentScore(payload) {
  const { lessonId } = payload;
  return myRequest(`/api/lesson/score/${lessonId}`);
}
