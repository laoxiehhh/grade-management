var express = require('express');
var router = express.Router();
const models = require('../models');
const bcrypt = require('bcrypt');

const findClassById = classId => {
  return models.Class.findByPk(classId);
};

const findProfessionById = professionId => {
  return models.Profession.findByPk(professionId);
};
// 学生或老师注册
router.post('/create', (req, res) => {
  const { body } = req;
  const {
    Name,
    Username,
    Telephone,
    Password,
    Gender, // 1为男，2为女
    Type,
    classId,
    professionId
  } = body;
  const password_digest = bcrypt.hashSync(Password, 10);
  // Type 为1时表示学生注册； 为2时表示老师注册
  if (+Type === 1) {
    models.Student.findOrCreate({
      where: { Username },
      defaults: { Name, Telephone, Password: password_digest, Gender }
    }).spread((student, created) => {
      const { dataValues } = student;
      if (!created) {
        res.json({
          code: 1,
          msg: 'This student already exists',
          data: { ...dataValues }
        });
      } else {
        Promise.all([
          findClassById(+classId),
          findProfessionById(+professionId)
        ]).then(result => {
          const [c, profession] = result;
          student.setClass(c);
          student.setProfession(profession);
          student.save().then(() => {
            res.json({
              code: 0,
              msg: '',
              data: { ...dataValues }
            });
          });
        });
      }
    });
  } else {
    models.Teacher.findOrCreate({
      where: { Username },
      defaults: { Name, Telephone, Password: password_digest, Gender }
    }).spread((teacher, created) => {
      const { dataValues } = teacher;
      if (!created) {
        res.json({
          code: 1,
          msg: 'This teacher already exists',
          data: { ...dataValues }
        });
      } else {
        findProfessionById(+professionId).then(profession => {
          teacher.setProfession(profession);
          teacher.save().then(() => {
            res.json({
              code: 0,
              msg: '',
              data: { ...dataValues }
            });
          });
        });
      }
    });
  }
});

module.exports = router;
