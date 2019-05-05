import { myRequest } from '@/utils/request';

export async function createProfession(payload) {
  return myRequest.post('/api/profession', { data: { ...payload } });
}

export async function getProfessions() {
  return myRequest('/api/profession');
}

export async function createClass(payload) {
  return myRequest.post('/api/class', { data: { ...payload } });
}

export async function getClasses(payload) {
  const { ProfessionId } = payload;
  return myRequest(`/api/class/${ProfessionId}`);
}

export async function createAssessmentCategory(payload) {
  return myRequest.post('/api/assessmentCategory', { data: { ...payload } });
}

export async function getAssessmentCategories() {
  return myRequest('/api/assessmentCategory');
}
