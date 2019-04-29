var express = require('express');
var router = express.Router();
const models = require('../models');
const authenticate = require('../middlewares/authenticate');

// 创建专业
router.post('/', authenticate, (req, res) => {
  const { body } = req;
  const { Name, Desc } = body;
  models.Profession.findOrCreate({
    where: { Name },
    defaults: { Desc },
  }).spread((profession, created) => {
    if (!created) {
      res.json({
        code: 1,
        msg: 'This profession already exists',
        data: profession,
      });
    } else {
      res.json({
        code: 0,
        msg: '',
        data: profession,
      });
    }
  });
});

// 获取所有的专业
router.get('/', authenticate, (req, res) => {
  models.Profession.findAll().then(professions => {
    res.json({
      code: 0,
      msg: '',
      data: professions,
    });
  });
});

module.exports = router;
