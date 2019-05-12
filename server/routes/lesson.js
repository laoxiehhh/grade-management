var express = require('express');
var router = express.Router();
const models = require('../models');
const authenticate = require('../middlewares/authenticate');

const findTeacherById = teacherId => {
  return models.Teacher.findByPk(teacherId);
};

const findProfessionById = professionId => {
  return models.Profession.findByPk(professionId);
};

// 教师创建课程
router.post('/', authenticate, (req, res) => {
  const { body } = req;
  const { Name, ProfessionId, TeacherId, Desc } = body;
  models.Lesson.findOrCreate({
    where: { Name, TeacherId },
    defaults: { Desc },
  }).spread((lesson, created) => {
    if (!created) {
      res.json({
        code: 1,
        msg: 'This lesson of this teacher already exists',
        data: lesson,
      });
    } else {
      Promise.all([findTeacherById(+TeacherId), findProfessionById(+ProfessionId)]).then(result => {
        const [teacher, profession] = result;
        lesson.setTeacher(teacher);
        lesson.setProfession(profession);
        lesson.save().then(lesson => {
          res.json({
            code: 0,
            msg: '',
            data: lesson,
          });
        });
      });
    }
  });
});

// 获取所有的课程列表
router.get('/', authenticate, (req, res) => {
  models.Lesson.findAll({
    include: [models.Teacher, models.Profession, models.Assessment],
  }).then(lessons => {
    res.json({
      code: 0,
      msg: '',
      data: lessons,
    });
  });
});

// 获取某个角色的所有已加入课程
router.get('/self', authenticate, (req, res) => {
  req.currentUser.getLessons().then(lessons => {
    res.json({
      code: 0,
      msg: '',
      data: lessons,
    });
  });
});

// 获取某个课程考核方式信息
router.get('/:lessonId/assessment', (req, res) => {
  const { lessonId } = req.params;
  models.Assessment.findAll({
    where: { LessonId: +lessonId },
  }).then(assessments => {
    res.json({
      code: 0,
      msg: '',
      data: assessments,
    });
  });
});

const getTaskByAssessment = assessment => {
  return assessment
    .getTasks({
      include: [models.Assessment],
    })
    .then(tasks => {
      return tasks;
    });
};

// 获取某个课程所有任务的信息
router.get('/:lessonId/task', (req, res) => {
  const { lessonId } = req.params;
  let taskList = [];
  const promiseArr = [];
  models.Assessment.findAll({
    where: { LessonId: +lessonId },
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
        data: taskList,
      });
    });
  });
});

// 获取某个课程所有学生的成绩
router.get('/score/:lessonId', authenticate, (req, res) => {
  const { lessonId } = req.params;
  models.Lesson.findByPk(+lessonId).then(lesson => {
    lesson
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

// 获取当前学生的所有课程的成绩
router.get('/self/score', authenticate, (req, res) => {
  models.StudentLessons.findAll({
    where: { StudentId: +req.currentUser.id },
  }).then(scores => {
    res.json({
      code: 0,
      msg: '',
      data: scores,
    });
  });
});

// 获取当前老师的所有课程的所有学生的成绩
router.get('/self/alllessonscore', authenticate, async (req, res) => {
  const lessons = await req.currentUser.getLessons();
  const promise = lessons.map(lesson =>
    lesson.getStudents({
      attributes: ['id', 'Name', 'ClassId'],
      include: [models.Class],
    })
  );
  const score = await Promise.all(promise);
  res.json({
    code: 0,
    msg: '',
    data: score,
  });
});

module.exports = router;
