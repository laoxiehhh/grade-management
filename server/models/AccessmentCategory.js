module.exports = (sequelize, DataTypes) => {
  const AssessmentCategory = sequelize.define('AssessmentCategory', {
    Name: {
      type: DataTypes.STRING, // 考核类型名称
      allowNull: false
    },
    Desc: DataTypes.STRING // 对该考核类型的描述
  });

  return AssessmentCategory;
};
