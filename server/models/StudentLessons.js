module.exports = (sequelize, DataTypes) => {
  const StudentLessons = sequelize.define('StudentLessons', {
    Score: {
      type: DataTypes.INTEGER, // 该课程当前的平时成绩
    },
  });

  StudentLessons.associate = models => {
    models.Student.belongsToMany(models.Lesson, { through: 'StudentLessons' });
    models.Lesson.belongsToMany(models.Student, { through: 'StudentLessons' });
  };

  return StudentLessons;
};
