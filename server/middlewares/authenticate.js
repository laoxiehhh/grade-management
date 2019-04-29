const jwt = require('jsonwebtoken');
const config = require('../config/config');
const models = require('../models');

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      const { Username, Type } = decoded;
      if (err) {
        res.status(401).json({ error: 'Failed to authenticate' });
      } else {
        if (Type === 1) {
          models.Student.findOne({
            where: { Username },
          }).then(student => {
            if (!student) {
              res.status(401).json({ error: 'No such user' });
            } else {
              req.currentUser = student;
              next();
            }
          });
        } else if (Type === 2) {
          models.Teacher.findOne({
            where: { Username },
          }).then(teacher => {
            if (!teacher) {
              res.status(401).json({ error: 'No such user' });
            } else {
              req.currentUser = teacher;
              next();
            }
          });
        } else {
          models.Admin.findOne({
            where: { Username },
          }).then(admin => {
            if (!admin) {
              res.status(401).json({ error: 'No such user' });
            } else {
              req.currentUser = admin;
              next();
            }
          });
        }
      }
    });
  } else {
    res.status(403).json({
      error: 'No token provided',
    });
  }
};

module.exports = authenticate;
