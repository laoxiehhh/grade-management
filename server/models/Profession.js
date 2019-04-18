module.exports = (sequelize, DataTypes) => {
  const Profession = sequelize.define('Profession', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    } // 专业名称
  });

  return Profession;
};
