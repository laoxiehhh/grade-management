var express = require('express');
var router = express.Router();
const models = require('../models');

const findTeacherById = teacherId => {
  return models.Teacher.findByPk(teacherId);
};

const findProfessionById = professionId => {
  return models.Profession.findByPk(professionId);
};

// 教师创建课程
router.post('/', (req, res, next) => {
  const { body } = req;
  const { Name, ProfessionId, TeacherId } = body;
  models.Lesson.findOrCreate({
    where: { Name, TeacherId }
  }).spread((lesson, created) => {
    if (!created) {
      res.json({
        code: 1,
        msg: 'This lesson of this teacher already exists',
        data: lesson
      });
    } else {
      Promise.all([
        findTeacherById(+TeacherId),
        findProfessionById(+ProfessionId)
      ]).then(result => {
        const [teacher, profession] = result;
        lesson.setTeacher(teacher);
        lesson.setProfession(profession);
        lesson.save().then(lesson => {
          res.json({
            code: 0,
            msg: '',
            data: lesson
          });
        });
      });
    }
  });
});

// 获取所有的课程列表
router.get('/', (req, res) => {
  models.Lesson.findAll().then(lessons => {
    res.json({
      code: 0,
      msg: '',
      data: lessons
    });
  });
});

// 获取某个课程考核方式信息
router.get('/:lessonId/assessment', (req, res) => {
  const { lessonId } = req.params;
  models.Assessment.findAll({
    where: { LessonId: +lessonId }
  }).then(assessments => {
    res.json({
      code: 0,
      msg: '',
      data: assessments
    });
  });
});

const getTaskByAssessment = assessment => {
  return assessment.getTasks().then(tasks => {
    return tasks;
  });
};

// 获取某个课程所有任务的信息
router.get('/:lessonId/task', (req, res) => {
  const { lessonId } = req.params;
  let taskList = [];
  const promiseArr = [];
  models.Assessment.findAll({
    where: { LessonId: +lessonId }
  }).then(assessments => {
    assessments.forEach(assessment => {
      promiseArr.push(getTaskByAssessment(assessment));
    });
    Promise.all(promiseArr).then(result => {
      result.forEach(item => {
        taskList = taskList.concat(item);
      });
      res.json({
        code: 0,
        msg: '',
        data: taskList
      });
    });
  });
});

module.exports = router;
