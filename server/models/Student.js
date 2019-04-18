module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
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

  Student.associate = models => {
    models.Student.belongsTo(models.Class);
    models.Student.belongsTo(models.Profession);
    models.Student.belongsToMany(models.Lesson, { through: 'StudentLesson' });
  };

  return Student;
};
