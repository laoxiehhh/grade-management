module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    Name: {
      type: DataTypes.STRING, // 课程名称
      allowNull: false,
    },
    Desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Lesson.associate = models => {
    models.Lesson.belongsTo(models.Teacher);
    models.Lesson.belongsTo(models.Profession);
  };

  return Lesson;
};
