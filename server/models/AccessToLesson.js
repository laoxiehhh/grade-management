module.exports = (sequelize, DataTypes) => {
  const AssessToLesson = sequelize.define('AssessToLesson', {
    Status: {
      type: DataTypes.INTEGER, // 0未处理 1审核通过 2未通过
      allowNull: false
    }
  });

  AssessToLesson.associate = models => {
    models.AssessToLesson.belongsTo(models.Student);
    models.AssessToLesson.belongsTo(models.Lesson);
  };

  return AssessToLesson;
};
