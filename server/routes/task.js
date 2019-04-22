const express = require('express');
const router = express.Router();
const models = require('../models');

// 教师创建任务
router.post('/', (req, res) => {
  const { Name, Deadline, AssessmentId } = req.body;
  models.Task.create({
    Name,
    Deadline: new Date(Deadline)
  }).then(task => {
    models.Assessment.findByPk(+AssessmentId).then(assessment => {
      task.setAssessment(assessment).then(() => {
        res.json({
          code: 0,
          msg: '',
          data: task
        });
      });
    });
  });
});

module.exports = router;
