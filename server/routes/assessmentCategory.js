var express = require('express');
var router = express.Router();
const models = require('../models');

// 创建考核方式类别
router.post('/', (req, res) => {
  const { body } = req;
  const { Name, Desc } = body;
  models.AssessmentCategory.findOrCreate({
    where: { Name },
    defaults: { Desc }
  }).spread((assessmentCategory, created) => {
    const { dataValues } = assessmentCategory;
    if (!created) {
      res.json({
        code: 1,
        msg: 'This assessmentCategory already exists',
        data: { ...dataValues }
      });
    } else {
      res.json({
        code: 0,
        msg: '',
        data: { ...dataValues }
      });
    }
  });
});

module.exports = router;
