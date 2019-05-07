const express = require('express');
const router = express.Router();
const models = require('../models');
const authenticate = require('../middlewares/authenticate');

const findLessonById = LessonId => {
  return models.Lesson.findByPk(LessonId);
};

const findStudentById = StudentId => {
  return models.Student.findByPk(StudentId);
};

// 学生申请加入课程
router.post('/', authenticate, (req, res) => {
  const { LessonId, StudentId } = req.body;
  models.AccessToLesson.create({ Status: 0 }).then(accessToLesson => {
    Promise.all([findLessonById(+LessonId), findStudentById(+StudentId)]).then(result => {
      const [lesson, student] = result;
      accessToLesson.setLesson(lesson);
      accessToLesson.setStudent(student);
      accessToLesson.save().then(() => {
        res.json({
          code: 0,
          msg: '',
          data: accessToLesson,
        });
      });
    });
  });
});

// 学生当前的申请列表
router.get('/:studentId', authenticate, (req, res) => {
  const { studentId } = req.params;
  models.AccessToLesson.findAll({
    where: { StudentId: +studentId },
  }).then(accessToLesson => {
    res.json({
      code: 0,
      msg: '',
      data: accessToLesson,
    });
  });
});

// 老师处理学生加入课程的申请
router.post('/:accessToLessonId', authenticate, (req, res) => {
  const { accessToLessonId } = req.params;
  const { Status } = req.body; // 1为通过 2为 未通过
  models.AccessToLesson.findByPk(+accessToLessonId).then(accessToLesson => {
    if (+Status === 1) {
      const { LessonId, StudentId } = accessToLesson;
      Promise.all([findLessonById(+LessonId), findStudentById(+StudentId)]).then(result => {
        const [lesson, student] = result;
        student.addLesson(lesson);
      });
    }
    accessToLesson.Status = +Status;
    accessToLesson.save().then(accessToLesson => {
      res.json({
        code: 0,
        msg: '',
        data: accessToLesson,
      });
    });
  });
});

module.exports = router;
