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
            include: [models.Class, models.Profession],
          }).then(student => {
            if (!student) {
              res.status(401).json({ error: 'No such user' });
            } else {
              req.currentUser = student;
              req.tokenDecoded = decoded;
              next();
            }
          });
        } else if (Type === 2) {
          models.Teacher.findOne({
            where: { Username },
            include: [models.Profession],
          }).then(teacher => {
            if (!teacher) {
              res.status(401).json({ error: 'No such user' });
            } else {
              req.currentUser = teacher;
              req.tokenDecoded = decoded;
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
              req.tokenDecoded = decoded;
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
