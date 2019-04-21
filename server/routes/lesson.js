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

module.exports = router;
