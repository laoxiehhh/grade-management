const express = require('express');
const router = express.Router();
const models = require('../models');
const authenticate = require('../middlewares/authenticate');

// 教师创建任务
router.post('/', authenticate, (req, res) => {
  const { Name, Deadline, AssessmentId, Desc } = req.body;
  models.Task.create({
    Name,
    Deadline: new Date(Deadline),
    Desc,
  }).then(task => {
    models.Assessment.findByPk(+AssessmentId).then(assessment => {
      const { LessonId } = assessment;
      models.Lesson.findByPk(+LessonId).then(lesson => {
        lesson.getStudents().then(associatedStudents => {
          task.setStudents(associatedStudents);
        });
      });
      task.setAssessment(assessment).then(() => {
        res.json({
          code: 0,
          msg: '',
          data: task,
        });
      });
    });
  });
});

// 一个任务下所有学生的成绩情况
router.get('/:taskId', authenticate, (req, res) => {
  const { taskId } = req.params;
  models.Task.findByPk(+taskId).then(task => {
    task
      .getStudents({
        attributes: ['id', 'Name', 'ClassId'],
      })
      .then(students => {
        res.json({
          code: 0,
          msg: '',
          data: students,
        });
      });
  });
});

// 给一个任务登记成绩
// ScoreData: {
//   studentId: score,
//   studentId: score
// }
router.post('/:taskId/score', authenticate, (req, res) => {
  const { taskId } = req.params;
  const { ScoreData } = req.body;
  const promissArr = [];
  models.Task.findByPk(+taskId).then(task => {
    task
      .getStudents({
        attributes: ['id', 'Name', 'ClassId'],
      })
      .then(students => {
        students.forEach(student => {
          student.StudentTasks.Score = ScoreData[student.id];
          promissArr.push(student.StudentTasks.save());
        });
        Promise.all(promissArr).then(() => {
          res.json({
            code: 0,
            msg: '',
            data: students,
          });
        });
      });
  });
});

module.exports = router;
