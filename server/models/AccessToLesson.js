module.exports = (sequelize, DataTypes) => {
  const AccessToLesson = sequelize.define('AccessToLesson', {
    Status: {
      type: DataTypes.INTEGER, // 0未处理 1审核通过 2未通过
      allowNull: false
    }
  });

  AccessToLesson.associate = models => {
    models.AccessToLesson.belongsTo(models.Student);
    models.AccessToLesson.belongsTo(models.Lesson);
  };

  return AccessToLesson;
};
