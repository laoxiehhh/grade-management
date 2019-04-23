var express = require('express');
var router = express.Router();
const models = require('../models');

const createAssessment = Proportion => {
  return models.Assessment.create({ Proportion });
};

const findAssessmentCategoryById = AssessmentCategoryId => {
  return models.AssessmentCategory.findByPk(AssessmentCategoryId);
};

const findLessonById = LessonId => {
  return models.Lesson.findByPk(LessonId);
};

const createAssessmentFunc = (AssessmentCategoryId, Proportion, LessonId) => {
  return Promise.all([
    createAssessment(Proportion),
    findAssessmentCategoryById(AssessmentCategoryId),
    findLessonById(LessonId)
  ]).then(result => {
    const [assessment, assessmentCategory, lesson] = result;
    assessment.setAssessmentCategory(assessmentCategory);
    assessment.setLesson(lesson);
    return assessment.save().then(assessment => {
      return assessment;
    });
  });
};
// 设置课程各考核方式所占的百分比
// {
//   LessonId,
//   AssessmentMap: {
//     AssessmentCategoryId: proportion
//   }
// }
router.post('/', (req, res) => {
  const { LessonId, AssessmentMap = {} } = req.body;
  const totalProportion = Object.keys(AssessmentMap).reduce((pre, cur) => {
    return pre + AssessmentMap[cur];
  }, 0);
  if (totalProportion !== 100) {
    return res.json({
      code: 1,
      msg: '各考核方式所占百分比的总和应该为100',
      data: {}
    });
  }
  const arr = [];
  Object.keys(AssessmentMap).forEach((item, index) => {
    arr.push(createAssessmentFunc(item, AssessmentMap[item], LessonId));
  });
  Promise.all(arr).then(result => {
    res.json({
      code: 0,
      msg: '',
      data: result
    });
  });
});

module.exports = router;
