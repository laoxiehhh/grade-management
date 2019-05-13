var express = require('express');
var router = express.Router();
const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const authenticate = require('../middlewares/authenticate');

const findClassById = ClassId => {
  return models.Class.findByPk(ClassId);
};

const findProfessionById = ProfessionId => {
  return models.Profession.findByPk(ProfessionId);
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
    ClassId,
    ProfessionId,
  } = body;
  const password_digest = bcrypt.hashSync(Password, 10);
  // Type 为1时表示学生注册； 为2时表示老师注册
  if (+Type === 1) {
    models.Student.findOrCreate({
      where: { Username },
      defaults: { Name, Telephone, Password: password_digest, Gender },
    }).spread((student, created) => {
      const { dataValues } = student;
      if (!created) {
        res.json({
          code: 1,
          msg: 'This student already exists',
          data: { ...dataValues },
        });
      } else {
        Promise.all([findClassById(+ClassId), findProfessionById(+ProfessionId)]).then(result => {
          const [c, profession] = result;
          student.setClass(c);
          student.setProfession(profession);
          student.save().then(() => {
            res.json({
              code: 0,
              msg: '',
              data: { ...dataValues },
            });
          });
        });
      }
    });
  } else {
    models.Teacher.findOrCreate({
      where: { Username },
      defaults: { Name, Telephone, Password: password_digest, Gender },
    }).spread((teacher, created) => {
      const { dataValues } = teacher;
      if (!created) {
        res.json({
          code: 1,
          msg: 'This teacher already exists',
          data: { ...dataValues },
        });
      } else {
        findProfessionById(+ProfessionId).then(profession => {
          teacher.setProfession(profession);
          teacher.save().then(() => {
            res.json({
              code: 0,
              msg: '',
              data: { ...dataValues },
            });
          });
        });
      }
    });
  }
});

// 学生 老师 管理员 登录
router.post('/login', (req, res) => {
  console.log(req.headers.authorization);
  const { Username, Password, Type } = req.body;
  // 当Type===1时，表示学生登录；2时表示老师登录； 3时表示管理员登录
  if (+Type === 1) {
    models.Student.findOne({
      where: { Username },
    }).then(student => {
      if (!student) {
        res.json({
          code: 1,
          msg: 'The username does not exist',
          data: {},
        });
      } else {
        const { dataValues } = student;
        bcrypt.compare(Password, student.Password, (err, isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              {
                id: student.id,
                Name: student.Name,
                Username: student.Username,
                CurrentAuthority: 'student',
                Type: 1,
              },
              config.jwtSecret
            );
            res.json({
              code: 0,
              msg: '',
              data: {
                ...dataValues,
                token,
              },
            });
          } else {
            res.json({
              code: 1,
              msg: 'Incorrect password',
              data: {},
            });
          }
        });
      }
    });
  } else if (+Type === 2) {
    models.Teacher.findOne({
      where: { Username },
    }).then(teacher => {
      if (!teacher) {
        res.json({
          code: 1,
          msg: 'The username does not exist',
          data: {},
        });
      } else {
        const { dataValues } = teacher;
        bcrypt.compare(Password, teacher.Password, (err, isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              {
                id: teacher.id,
                Name: teacher.Name,
                Username: teacher.Username,
                CurrentAuthority: 'teacher',
                Type: 2,
              },
              config.jwtSecret
            );
            res.json({
              code: 0,
              msg: '',
              data: {
                ...dataValues,
                token,
              },
            });
          } else {
            res.json({
              code: 1,
              msg: 'Incorrect password',
              data: {},
            });
          }
        });
      }
    });
  } else {
    models.Admin.findOne({
      where: { Username },
    }).then(admin => {
      if (!admin) {
        res.json({
          code: 1,
          msg: 'The username does not exist',
          data: {},
        });
      } else {
        const { dataValues } = admin;
        bcrypt.compare(Password, admin.Password, (err, isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              {
                id: admin.id,
                Name: admin.Name,
                Username: admin.Username,
                CurrentAuthority: 'admin',
                Type: 3,
              },
              config.jwtSecret
            );
            res.json({
              code: 0,
              msg: '',
              data: {
                ...dataValues,
                token,
              },
            });
          } else {
            res.json({
              code: 1,
              msg: 'Incorrect password',
              data: {},
            });
          }
        });
      }
    });
  }
});

// 获取当前用户的信息
router.get('/getUserInfo', authenticate, (req, res) => {
  res.json({
    code: 0,
    msg: '',
    data: req.currentUser,
  });
});

// 修改当前用户的信息
router.post('/modUserInfo', authenticate, (req, res) => {
  const { Name, Username } = req.body;
  const { id, CurrentAuthority, Type } = req.tokenDecoded;
  const newToken = jwt.sign(
    {
      id,
      Name,
      Username,
      CurrentAuthority,
      Type,
    },
    config.jwtSecret
  );
  req.currentUser
    .update({
      ...req.body,
    })
    .then(user => {
      const { dataValues } = user;
      res.json({
        code: 0,
        msg: '',
        data: {
          ...dataValues,
          newToken,
        },
      });
    });
});

// 修改当前用户的密码
router.post('/modUserPassword', authenticate, (req, res) => {
  const { Password, Old_Password } = req.body;
  bcrypt.compare(Old_Password, req.currentUser.Password, (err, isMatch) => {
    if (isMatch) {
      const password_digest = bcrypt.hashSync(Password, 10);
      req.currentUser.update({ Password: password_digest }).then(user => {
        res.json({
          code: 0,
          msg: '',
          data: user,
        });
      });
    } else {
      res.json({
        code: 1,
        msg: '旧密码错误',
        data: {},
      });
    }
  });
});

module.exports = router;
