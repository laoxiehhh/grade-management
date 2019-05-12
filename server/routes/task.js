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
router.post('/:taskId/score', authenticate, async (req, res) => {
  const { taskId } = req.params;
  const { ScoreData, lessonId } = req.body;
  const promissArr1 = [];
  models.Task.findByPk(+taskId).then(task => {
    task
      .getStudents({
        attributes: ['id', 'Name', 'ClassId'],
      })
      .then(students => {
        students.forEach(student => {
          student.StudentTasks.Score = ScoreData[student.id];
          promissArr1.push(student.StudentTasks.save());
        });
        Promise.all(promissArr1).then(() => {
          res.json({
            code: 0,
            msg: '',
            data: students,
          });
        });
      });
  });

  const lesson = await models.Lesson.findByPk(+lessonId);
  const assessments = await lesson.getAssessments();
  let map = {};
  let promises1 = assessments.map(assessment => assessment.getTasks());
  let taskList = await Promise.all(promises1);
  assessments.forEach((assessment, index) => {
    map[index] = {
      proportion: assessment.Proportion,
      tasks: taskList[index],
      count: taskList[index].length,
    };
  });
  const currentTask = await models.Task.findByPk(+taskId);
  const students = await currentTask.getStudents();
  for (let student of students) {
    let scoreMap = {};
    for (let index in map) {
      const { tasks, count } = map[index];
      scoreMap[index] = [];
      if (count > 0) {
        let promise2 = tasks.map(task =>
          task.getStudents({
            where: { id: student.id },
          })
        );
        let studentTasks = await Promise.all(promise2);
        studentTasks.forEach(item => {
          item.forEach(i => {
            scoreMap[index].push(i.StudentTasks.Score || 0);
          });
        });
      }
    }
    let lessonScore = 0;
    for (let index in scoreMap) {
      if (scoreMap[index].length > 0) {
        const total = scoreMap[index].reduce((pre, cur) => pre + cur, 0);
        const average = Math.round(total / scoreMap[index].length);
        lessonScore += Math.round((average * map[index].proportion) / 100);
      }
    }
    lessonScore = lessonScore > 100 ? 100 : lessonScore;
    const studentLesson = await models.StudentLessons.findOne({
      where: {
        StudentId: +student.id,
        LessonId: +lessonId,
      },
    });
    studentLesson.Score = lessonScore;
    await studentLesson.save();
  }
});

// 获取某个课程下，某个学生所有的任务成绩
router.post('/getTaskScore', authenticate, async (req, res) => {
  const { studentId, lessonId } = req.body;
  const assessments = await models.Assessment.findAll({
    where: { LessonId: +lessonId },
  });

  const assessmentIds = assessments.map(item => item.id);

  const student = await models.Student.findOne({
    where: { id: +studentId },
  });

  const tasks = await student.getTasks({
    include: [models.Assessment],
  });
  const taskList = tasks.filter(item => assessmentIds.includes(item.AssessmentId));
  res.json({
    code: 0,
    msg: '',
    data: taskList,
  });
});

module.exports = router;
