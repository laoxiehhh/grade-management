var express = require('express');
var router = express.Router();
const models = require('../models');
const authenticate = require('../middlewares/authenticate');

// 创建班级
router.post('/', authenticate, (req, res, next) => {
  const { body } = req;
  const { Name, ProfessionId } = body;
  models.Class.findOrCreate({
    where: { Name },
  }).spread((c, created) => {
    const { dataValues } = c;
    if (!created) {
      res.json({
        code: 1,
        msg: 'This class already exists',
        data: { ...dataValues },
      });
    } else {
      models.Profession.findByPk(+ProfessionId).then(profession => {
        c.setProfession(profession);
        c.save().then(() => {
          res.json({
            code: 0,
            msg: '',
            data: { ...dataValues },
          });
        });
      });
    }
  });
});

// 获取所有的班级信息
router.get('/', (req, res) => {
  models.Class.findAll().then(classes => {
    res.json({
      code: 0,
      msg: '',
      data: classes,
    });
  });
});

// 根据专业id获取该专业下所有的班级
router.get('/:professionId', (req, res) => {
  const { professionId } = req.params;
  models.Class.findAll({
    where: { ProfessionId: +professionId },
  }).then(classes => {
    res.json({
      code: 0,
      msg: '',
      data: classes,
    });
  });
});

module.exports = router;
