var express = require('express');
var router = express.Router();
const models = require('../models');

// 创建专业
router.post('/', (req, res) => {
  const { body } = req;
  const { Name } = body;
  models.Profession.findOrCreate({
    where: { Name }
  }).spread((profession, created) => {
    const { dataValues } = profession;
    if (!created) {
      res.json({
        code: 1,
        msg: 'This profession already exists',
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
