module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Gender: {
      type: DataTypes.INTEGER, // 1为男，2为女
      allowNull: false
    },
    Username: {
      type: DataTypes.STRING, // 登陆账号
      allowNull: false
    },
    Telephone: {
      type: DataTypes.STRING, // 电话
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING, // 密码
      allowNull: false
    }
  });

  Teacher.associate = models => {
    models.Teacher.belongsTo(models.Profession);
  };

  return Teacher;
};
