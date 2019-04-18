module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define('Assessment', {
    Proportion: {
      type: DataTypes.INTEGER, // 该考核方式所占的百分比
      allowNull: false
    }
  });

  Assessment.associate = models => {
    models.Assessment.belongsTo(models.AssessmentCategory);
    models.Lesson.hasMany(models.Assessment);
  };

  return Assessment;
};
